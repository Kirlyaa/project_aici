<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        if ($request->user()?->role === 'user') {
            $user = $request->user();
            
            $gradeEntries = \App\Models\GradeEntry::where('student_id', $user->id)->get();
            
            $interactionAvg = round((float) ($gradeEntries->avg('interaksi') ?? 0), 1);
            $focusAvg       = round((float) ($gradeEntries->avg('fokus') ?? 0), 1);
            $robotAvg       = round((float) ($gradeEntries->filter(fn($g) => $g->robot_building !== null)->avg('robot_building') ?? 0), 1);
            $toolsAvg       = round((float) ($gradeEntries->avg('tools_management') ?? 0), 1);
            $codingAvg      = round((float) ($gradeEntries->avg('coding') ?? 0), 1);

            $overallAvg = round((float) ($gradeEntries->avg('average') ?? 0), 2);
            $overallPercentage = $overallAvg > 0 ? round(($overallAvg / 5.0) * 100, 1) : 0;

            $completedSessions = $user->learningSessions()->where('status', 'hadir')->count();
            $totalSessions = $user->learningSessions()->count();

            $latestComment = \App\Models\StudentComment::where('student_id', $user->id)->latest()->first();

            // ponytail: class/level tidak punya sumber di DB saat ini; tampil kosong sampai ada tabel kelas/level
            return Inertia::render('User/Profil', [
                'mustVerifyEmail' => $user instanceof MustVerifyEmail,
                'status' => session('status'),
                'studentStats' => [
                    'name' => $user->name,
                    'email' => $user->email,
                    'class' => null,
                    'level' => null,
                    'completedSessions' => $completedSessions,
                    'totalSessions' => $totalSessions,
                    'averagePercentage' => $overallPercentage,
                    'overallAvg' => $overallAvg,
                    'scores' => [
                        'interaction' => $interactionAvg,
                        'focus' => $focusAvg,
                        'robotBuilding' => $robotAvg,
                        'tools' => $toolsAvg,
                        'coding' => $codingAvg,
                    ],
                    'comment' => [
                        'general' => $latestComment?->system_comment,
                        'strengths' => $latestComment?->tutor_comment,
                        'notes' => null,
                    ]
                ]
            ]);
        }

        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $user = $request->user();

        // Handle avatar upload
        if ($request->hasFile('avatar')) {
            $avatar = $request->file('avatar');
            
            // Additional runtime validation
            if (!$avatar->isValid() || !in_array($avatar->getMimeType(), ['image/jpeg', 'image/png', 'image/gif'])) {
                return Redirect::route('profile.edit')->with('error', 'File gambar tidak valid.');
            }
            
            // Delete old avatar if exists
            if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
                Storage::disk('public')->delete($user->avatar);
            }

            // Store new avatar
            $path = $avatar->store('avatars', 'public');
            $validated['avatar'] = $path;
        }

        $user->fill($validated);

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();

        return Redirect::route('profile.edit')->with('success', 'Profil berhasil diperbarui.');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }

    /**
     * Data profil untuk halaman cetak PDF.
     */
    public function pdf(Request $request): Response
    {
        $user = $request->user();

        $gradeEntries = \App\Models\GradeEntry::where('student_id', $user->id)->get();
        $pct = fn(float $avg) => round(($avg / 5.0) * 100, 1);

        $scores = [
            'interaction' => $pct((float) ($gradeEntries->avg('interaksi') ?? 0)),
            'focus' => $pct((float) ($gradeEntries->avg('fokus') ?? 0)),
            'robotBuilding' => $pct((float) ($gradeEntries->filter(fn($g) => $g->robot_building !== null)->avg('robot_building') ?? 0)),
            'tools' => $pct((float) ($gradeEntries->avg('tools_management') ?? 0)),
            'coding' => $pct((float) ($gradeEntries->avg('coding') ?? 0)),
        ];

        $sessions = $user->learningSessions()->orderBy('date')->get(['title', 'date', 'status']);
        $hadir = $sessions->where('status', 'hadir')->count();
        $absen = $sessions->where('status', 'absen')->count();
        $reschedule = $sessions->where('status', 'reschedule')->count();
        $attendancePct = $sessions->count() > 0 ? round(($hadir / $sessions->count()) * 100, 1) : 0;

        $latestComment = \App\Models\StudentComment::where('student_id', $user->id)->latest()->first();

        return Inertia::render('User/ProfilPDF', [
            'studentStats' => [
                'name' => $user->name,
                'class' => null,
                'level' => null,
                'totalSessions' => $sessions->count(),
                'attendance' => ['hadir' => $hadir, 'absen' => $absen, 'reschedule' => $reschedule, 'percentage' => $attendancePct],
                'scores' => $scores,
                'averagePercentage' => $pct((float) ($gradeEntries->avg('average') ?? 0)),
                'sessions' => $sessions->map(fn($s) => [
                    'title' => $s->title,
                    'date' => $s->date?->format('d M Y'),
                    'status' => $s->status,
                ]),
                'comment' => [
                    'general' => $latestComment?->system_comment,
                    'notes' => $latestComment?->tutor_comment,
                ],
            ],
        ]);
    }
}
