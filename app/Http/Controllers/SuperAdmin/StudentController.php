<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Http\Requests\SuperAdmin\StoreUserRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class StudentController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->input('search', '');
        $status = $request->input('filter_status', 'Semua');

        $students = User::where('role', 'user')
            ->when($search, function ($q, $s) {
                $q->where(function ($inner) use ($s) {
                    $inner->where('name', 'like', "%{$s}%")
                        ->orWhere('email', 'like', "%{$s}%");
                });
            })
            ->when($status !== 'Semua', fn($q) => $q->where('status', $status))
            ->with(['tutor:id,name'])
            ->withCount(['learningSessions', 'gradeEntries'])
            ->orderByDesc('created_at')
            ->paginate(15)
            ->through(function (User $u) {
                return [
                    'id' => $u->id,
                    'name' => $u->name,
                    'email' => $u->email,
                    'role' => 'Murid',
                    'status' => $u->status ?? 'aktif',
                    'createdAt' => $u->created_at?->toDateString(),
                    'tutorName' => $u->tutor?->name,
                    'tutorId' => $u->tutor_id,
                    'sessionsCount' => $u->learning_sessions_count,
                    'gradesCount' => $u->grade_entries_count,
                ];
            })
            ->withQueryString();

        $tutors = User::where('role', 'tutor')
            ->where('status', 'aktif')
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('SuperAdmin/StudentManagement', [
            'students' => $students,
            'search' => $search,
            'filterStatus' => $status,
            'tutors' => $tutors,
        ]);
    }

    public function store(StoreUserRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'user',
            'status' => $validated['status'] ?? 'aktif',
            'tutor_id' => $validated['tutor_id'] ?? null,
        ]);
        return back()->with('success', 'Murid berhasil ditambahkan.');
    }

    public function update(StoreUserRequest $request, User $student): RedirectResponse
    {
        $validated = $request->validated();
        $student->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'role' => 'user',
            'status' => $validated['status'] ?? $student->status,
            'tutor_id' => $validated['tutor_id'] ?? null,
        ]);
        if (! empty($validated['password'])) {
            $student->update(['password' => Hash::make($validated['password'])]);
        }
        return back()->with('success', 'Murid berhasil diperbarui.');
    }

    public function destroy(User $student): RedirectResponse
    {
        $student->delete();
        return back()->with('success', 'Murid berhasil dihapus.');
    }

    public function toggleStatus(User $student): RedirectResponse
    {
        $next = ($student->status ?? 'aktif') === 'aktif' ? 'nonaktif' : 'aktif';
        $student->update(['status' => $next]);
        return back()->with('success', "Status murid diubah menjadi {$next}.");
    }
}
