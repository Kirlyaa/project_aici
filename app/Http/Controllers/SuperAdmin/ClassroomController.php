<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Classroom;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ClassroomController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->input('search', '');

        $classrooms = Classroom::withCount('students')
            ->with(['students' => function ($q) {
                $q->select('id', 'name', 'email', 'avatar', 'classroom_id', 'status')
                    ->orderBy('name');
            }])
            ->when($search, fn($q) => $q->where('name', 'like', "%{$search}%"))
            ->orderBy('name')
            ->get()
            ->map(fn(Classroom $c) => [
                'id' => $c->id,
                'name' => $c->name,
                'photo' => $c->photo_url,
                'description' => $c->description,
                'studentsCount' => $c->students_count,
                'students' => $c->students->map(fn($s) => [
                    'id' => $s->id,
                    'name' => $s->name,
                    'email' => $s->email,
                    'avatar' => $s->avatar_url,
                    'status' => $s->status,
                ]),
            ]);

        // Murid yang tidak punya kelas (unassigned)
        $unassignedStudents = User::where('role', 'user')
            ->whereNull('classroom_id')
            ->orderBy('name')
            ->get(['id', 'name', 'email', 'avatar', 'status'])
            ->map(fn($s) => [
                'id' => $s->id,
                'name' => $s->name,
                'email' => $s->email,
                'avatar' => $s->avatar_url,
                'status' => $s->status,
            ]);

        return Inertia::render('SuperAdmin/ClassroomManagement', [
            'classrooms' => $classrooms,
            'unassignedStudents' => $unassignedStudents,
            'search' => $search,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'photo' => 'nullable|image|max:2048',
        ]);

        $photoPath = null;
        if ($request->hasFile('photo')) {
            $photoPath = $request->file('photo')->store('classrooms', 'public');
        }

        Classroom::create([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'photo' => $photoPath,
        ]);

        return back()->with('success', 'Kelas berhasil dibuat.');
    }

    public function update(Request $request, Classroom $classroom): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'photo' => 'nullable|image|max:2048',
        ]);

        $data = [
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
        ];

        if ($request->hasFile('photo')) {
            if ($classroom->photo && !str_starts_with($classroom->photo, 'http') && Storage::disk('public')->exists($classroom->photo)) {
                Storage::disk('public')->delete($classroom->photo);
            }
            $data['photo'] = $request->file('photo')->store('classrooms', 'public');
        }

        $classroom->update($data);

        // Sinkronkan nama class di tabel users jika diperlukan
        User::where('classroom_id', $classroom->id)->update(['class' => $classroom->name]);

        return back()->with('success', 'Informasi kelas berhasil diperbarui.');
    }

    public function destroy(Classroom $classroom): RedirectResponse
    {
        // Unassign all students before deleting classroom
        User::where('classroom_id', $classroom->id)->update([
            'classroom_id' => null,
            'class' => null,
        ]);

        if ($classroom->photo && !str_starts_with($classroom->photo, 'http') && Storage::disk('public')->exists($classroom->photo)) {
            Storage::disk('public')->delete($classroom->photo);
        }

        $classroom->delete();

        return back()->with('success', 'Kelas berhasil dihapus. Murid yang ada di dalamnya sekarang tidak memiliki kelas.');
    }

    /**
     * Masukkan murid ke kelas (Assign)
     */
    public function assignStudent(Request $request, Classroom $classroom): RedirectResponse
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:users,id',
        ]);

        $student = User::where('id', $validated['student_id'])->where('role', 'user')->firstOrFail();
        $student->update([
            'classroom_id' => $classroom->id,
            'class' => $classroom->name,
        ]);

        return back()->with('success', "Murid {$student->name} berhasil dimasukkan ke kelas {$classroom->name}.");
    }

    /**
     * Pindahkan murid dari satu kelas ke kelas lain
     */
    public function transferStudent(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:users,id',
            'target_classroom_id' => 'required|exists:classrooms,id',
        ]);

        $targetClass = Classroom::findOrFail($validated['target_classroom_id']);
        $student = User::where('id', $validated['student_id'])->where('role', 'user')->firstOrFail();

        $student->update([
            'classroom_id' => $targetClass->id,
            'class' => $targetClass->name,
        ]);

        return back()->with('success', "Murid {$student->name} berhasil dipindahkan ke kelas {$targetClass->name}.");
    }

    /**
     * Keluarkan murid dari kelas (Unassign)
     */
    public function removeStudent(Request $request, User $student): RedirectResponse
    {
        abort_if($student->role !== 'user', 400);

        $student->update([
            'classroom_id' => null,
            'class' => null,
        ]);

        return back()->with('success', "Murid {$student->name} berhasil dikeluarkan dari kelas.");
    }
}
