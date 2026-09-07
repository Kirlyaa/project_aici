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

class TutorController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->input('search', '');
        $status = $request->input('filter_status', 'Semua');

        $tutors = User::where('role', 'tutor')
            ->when($search, function ($q, $s) {
                $q->where(function ($inner) use ($s) {
                    $inner->where('name', 'like', "%{$s}%")
                        ->orWhere('email', 'like', "%{$s}%");
                });
            })
            ->when($status !== 'Semua', fn($q) => $q->where('status', $status))
            ->withCount(['students', 'learningSessions'])
            ->orderByDesc('created_at')
            ->paginate(15)
            ->through(function (User $u) {
                return [
                    'id' => $u->id,
                    'name' => $u->name,
                    'email' => $u->email,
                    'peran' => 'Tutor',
                    'status' => $u->status ?? 'aktif',
                    'terdaftar' => $u->created_at?->toDateString(),
                    'students_count' => $u->students_count,
                    'sessions_count' => $u->learning_sessions_count,
                ];
            })
            ->withQueryString();

        return Inertia::render('SuperAdmin/TutorManagement', [
            'users' => $tutors,
            'search' => $search,
            'filterStatus' => $status,
        ]);
    }

    public function store(StoreUserRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'tutor',
            'status' => $validated['status'] ?? 'aktif',
        ]);
        return back()->with('success', 'Tutor berhasil ditambahkan.');
    }

    public function update(StoreUserRequest $request, User $tutor): RedirectResponse
    {
        $validated = $request->validated();
        $tutor->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'role' => 'tutor',
            'status' => $validated['status'] ?? $tutor->status,
        ]);
        if (! empty($validated['password'])) {
            $tutor->update(['password' => Hash::make($validated['password'])]);
        }
        return back()->with('success', 'Tutor berhasil diperbarui.');
    }

    public function destroy(User $tutor): RedirectResponse
    {
        $tutor->students()->update(['tutor_id' => null]);
        $tutor->delete();
        return back()->with('success', 'Tutor berhasil dihapus.');
    }

    public function toggleStatus(User $tutor): RedirectResponse
    {
        $next = ($tutor->status ?? 'aktif') === 'aktif' ? 'nonaktif' : 'aktif';
        $tutor->update(['status' => $next]);
        return back()->with('success', "Status tutor diubah menjadi {$next}.");
    }
}
