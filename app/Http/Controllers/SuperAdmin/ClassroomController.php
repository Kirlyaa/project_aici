<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Classroom;
use App\Models\LearningSession;
use App\Models\Module;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ClassroomController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->input('search', '');

        $classrooms = Classroom::withCount('students')
            ->with([
                'tutor:id,name,email,avatar',
                'students' => function ($q) {
                    $q->select('id', 'name', 'email', 'avatar', 'classroom_id', 'status', 'tutor_id')
                        ->with('tutor:id,name')
                        ->orderBy('name');
                },
            ])
            ->when($search, fn($q) => $q->where('name', 'like', "%{$search}%"))
            ->orderBy('name')
            ->get()
            ->map(fn(Classroom $c) => [
                'id' => $c->id,
                'name' => $c->name,
                'photo' => $c->photo_url,
                'description' => $c->description,
                'tutor_id' => $c->tutor_id,
                'tutor' => $c->tutor ? [
                    'id' => $c->tutor->id,
                    'name' => $c->tutor->name,
                    'email' => $c->tutor->email,
                    'avatar' => $c->tutor->avatar_url,
                ] : null,
                'studentsCount' => $c->students_count,
                'students' => $c->students->map(fn($s) => [
                    'id' => $s->id,
                    'name' => $s->name,
                    'email' => $s->email,
                    'avatar' => $s->avatar_url,
                    'status' => $s->status,
                    'tutorName' => $s->tutor?->name,
                ]),
            ]);

        // Murid yang tidak punya kelas (unassigned)
        $unassignedStudents = User::where('role', 'user')
            ->whereNull('classroom_id')
            ->with('tutor:id,name')
            ->orderBy('name')
            ->get(['id', 'name', 'email', 'avatar', 'status', 'tutor_id'])
            ->map(fn($s) => [
                'id' => $s->id,
                'name' => $s->name,
                'email' => $s->email,
                'avatar' => $s->avatar_url,
                'status' => $s->status,
                'tutorName' => $s->tutor?->name,
            ]);

        $tutors = User::where('role', 'tutor')
            ->where('status', 'aktif')
            ->orderBy('name')
            ->get(['id', 'name', 'email', 'avatar'])
            ->map(fn($t) => [
                'id' => $t->id,
                'name' => $t->name,
                'email' => $t->email,
                'avatar' => $t->avatar_url,
            ]);

        $modules = Module::orderBy('name')->get(['id', 'name', 'module_type']);

        return Inertia::render('SuperAdmin/ClassroomManagement', [
            'classrooms' => $classrooms,
            'unassignedStudents' => $unassignedStudents,
            'tutors' => $tutors,
            'modules' => $modules,
            'search' => $search,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'tutor_id' => 'nullable|exists:users,id',
            'description' => 'nullable|string|max:1000',
            'photo' => 'nullable|image|max:2048',
        ]);

        $photoPath = null;
        if ($request->hasFile('photo')) {
            $photoPath = $request->file('photo')->store('classrooms', 'public');
        }

        Classroom::create([
            'name' => $validated['name'],
            'tutor_id' => $validated['tutor_id'] ?? null,
            'description' => $validated['description'] ?? null,
            'photo' => $photoPath,
        ]);

        return back()->with('success', 'Kelas berhasil dibuat.');
    }

    public function update(Request $request, Classroom $classroom): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'tutor_id' => 'nullable|exists:users,id',
            'description' => 'nullable|string|max:1000',
            'photo' => 'nullable|image|max:2048',
        ]);

        $data = [
            'name' => $validated['name'],
            'tutor_id' => $validated['tutor_id'] ?? null,
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
     * Masukkan murid ke kelas (Assign Single atau Bulk)
     */
    public function assignStudent(Request $request, Classroom $classroom): RedirectResponse
    {
        $validated = $request->validate([
            'student_id' => 'nullable|exists:users,id',
            'student_ids' => 'nullable|array',
            'student_ids.*' => 'exists:users,id',
            'auto_assign_tutor' => 'nullable|boolean',
        ]);

        $studentIds = collect();
        if (!empty($validated['student_ids'])) {
            $studentIds = collect($validated['student_ids']);
        } elseif (!empty($validated['student_id'])) {
            $studentIds = collect([$validated['student_id']]);
        }

        if ($studentIds->isEmpty()) {
            return back()->with('error', 'Silakan pilih setidaknya satu murid.');
        }

        $students = User::whereIn('id', $studentIds)->where('role', 'user')->get();

        DB::transaction(function () use ($students, $classroom, $request) {
            foreach ($students as $student) {
                $updateData = [
                    'classroom_id' => $classroom->id,
                    'class' => $classroom->name,
                ];

                // Jika kelas memiliki tutor dan murid belum punya tutor atau auto_assign dicentang
                if ($classroom->tutor_id && ($request->boolean('auto_assign_tutor') || empty($student->tutor_id))) {
                    $updateData['tutor_id'] = $classroom->tutor_id;
                }

                $student->update($updateData);
            }
        });

        $count = $students->count();
        return back()->with('success', "{$count} murid berhasil dimasukkan ke kelas {$classroom->name}.");
    }

    /**
     * Pindahkan murid dari satu kelas ke kelas lain
     */
    public function transferStudent(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:users,id',
            'target_classroom_id' => 'required|exists:classrooms,id',
            'auto_assign_tutor' => 'nullable|boolean',
        ]);

        $targetClass = Classroom::findOrFail($validated['target_classroom_id']);
        $student = User::where('id', $validated['student_id'])->where('role', 'user')->firstOrFail();

        $updateData = [
            'classroom_id' => $targetClass->id,
            'class' => $targetClass->name,
        ];

        if ($targetClass->tutor_id && $request->boolean('auto_assign_tutor')) {
            $updateData['tutor_id'] = $targetClass->tutor_id;
        }

        $student->update($updateData);

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

    /**
     * Jadwalkan sesi pembelajaran sekaligus untuk semua murid di kelas ini.
     */
    public function scheduleBatchSessions(Request $request, Classroom $classroom): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'date' => ['required', 'date'],
            'date_string' => ['nullable', 'string', 'max:255'],
            'status' => ['required', Rule::in(['hadir', 'absen', 'reschedule', 'libur', 'akan-datang'])],
            'description' => ['nullable', 'string'],
            'admin_note_for_tutor' => ['nullable', 'string'],
            'tools' => ['nullable', 'array'],
            'tools.*' => ['string', 'max:255'],
            'module_ids' => ['nullable', 'array'],
            'module_ids.*' => ['integer', 'exists:modules,id'],
            'override_tutor_id' => ['nullable', 'exists:users,id'],
        ]);

        $students = $classroom->students()->get();

        if ($students->isEmpty()) {
            return back()->with('error', "Kelas {$classroom->name} belum memiliki murid. Masukkan murid terlebih dahulu sebelum menjadwalkan sesi.");
        }

        $dateCarbon = Carbon::parse($validated['date'])->locale('id');
        $dateString = !empty($validated['date_string'])
            ? $validated['date_string']
            : $dateCarbon->translatedFormat('l, d F Y');

        $moduleIds = $validated['module_ids'] ?? [];

        DB::transaction(function () use ($students, $classroom, $validated, $dateString, $moduleIds) {
            foreach ($students as $student) {
                // Tentukan tutor yang menangani sesi murid ini:
                // 1. override_tutor_id jika dipilih di form
                // 2. tutor_id spesifik milik student jika ada
                // 3. tutor_id wali kelas
                $assignedTutorId = $validated['override_tutor_id']
                    ?? $student->tutor_id
                    ?? $classroom->tutor_id;

                $session = LearningSession::create([
                    'user_id' => $student->id,
                    'classroom_id' => $classroom->id,
                    'tutor_id' => $assignedTutorId,
                    'title' => $validated['title'],
                    'date' => $validated['date'],
                    'date_string' => $dateString,
                    'status' => $validated['status'],
                    'description' => $validated['description'] ?? null,
                    'admin_note_for_tutor' => $validated['admin_note_for_tutor'] ?? null,
                    'tools' => $validated['tools'] ?? null,
                ]);

                if (!empty($moduleIds)) {
                    $session->modules()->sync($moduleIds);
                }
            }
        });

        $count = $students->count();
        return back()->with('success', "Berhasil membuat jadwal sesi '{$validated['title']}' sekaligus untuk {$count} murid di kelas {$classroom->name}.");
    }
}
