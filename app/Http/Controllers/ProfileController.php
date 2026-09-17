<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use App\Models\GradeEntry;
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
            // Clamp ke 0-100 agar tidak melebihi 100% jika data seeder lama masih 0-10
            $overallPercentage = $overallAvg > 0 ? min(100, round(($overallAvg / GradeEntry::MAX_SCORE) * 100, 1)) : 0;

            $completedSessions = $user->learningSessions()->where('status', 'hadir')->count();
            $totalSessions = $user->learningSessions()->count();

            // R9: Riwayat sesi dikirim ke Profil
            $sessions = $user->learningSessions()
                ->orderByDesc('date')
                ->get(['title', 'date', 'status'])
                ->map(fn($s) => [
                    'title' => $s->title,
                    'date' => $s->date?->format('d M Y'),
                    'status' => $s->status,
                ]);

            $latestComment = \App\Models\StudentComment::where('student_id', $user->id)->latest()->first();

            // Ambil nomor pertemuan murid untuk generate opsi filter per 4 pertemuan & all
            $allMeetingNumbers = \App\Models\GradeEntry::where('student_id', $user->id)
                ->whereNotNull('meeting_number')
                ->pluck('meeting_number')
                ->unique()
                ->sort()
                ->values();

            $maxMeeting = $allMeetingNumbers->max() ?? 0;
            $pdfRanges = [];

            if ($maxMeeting > 0) {
                for ($start = 1; $start <= $maxMeeting; $start += 4) {
                    $end = min($start + 3, $maxMeeting);
                    $hasData = $allMeetingNumbers->contains(fn($m) => $m >= $start && $m <= $end);
                    if ($hasData) {
                        $pdfRanges[] = [
                            'key' => "{$start}-{$end}",
                            'label' => "Pertemuan {$start} - {$end}",
                            'start' => $start,
                            'end' => $end,
                        ];
                    }
                }

                $pdfRanges[] = [
                    'key' => 'all',
                    'label' => "Semua Pertemuan (1 - {$maxMeeting})",
                    'start' => 1,
                    'end' => $maxMeeting,
                ];
            }

            return Inertia::render('User/Profil', [
                'mustVerifyEmail' => $user instanceof MustVerifyEmail,
                'status' => session('status'),
                'pdfRanges' => $pdfRanges,
                'studentStats' => [
                    'name' => $user->name,
                    'email' => $user->email,
                    'class' => $user->class,
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
                        'system' => $latestComment?->system_comment,
                        'notes'  => $latestComment?->notes,
                    ],
                    'sessions' => $sessions,
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
    public function pdf(Request $request, ?\App\Models\User $student = null): Response
    {
        $currentUser = $request->user();

        if ($student && $student->exists) {
            abort_if(!$currentUser->managesStudent($student->id), 403);
            $user = $student;
        } else {
            $user = $currentUser;
        }

        // Ambil semua nomor pertemuan murid untuk generate opsi range (per 4 pertemuan)
        $allMeetingNumbers = \App\Models\GradeEntry::where('student_id', $user->id)
            ->whereNotNull('meeting_number')
            ->pluck('meeting_number')
            ->unique()
            ->sort()
            ->values();

        $maxMeeting = $allMeetingNumbers->max() ?? 0;
        $ranges = [];

        if ($maxMeeting > 0) {
            // Generate range blok per 4 pertemuan: 1-4, 5-8, 9-12, dst.
            for ($start = 1; $start <= $maxMeeting; $start += 4) {
                $end = min($start + 3, $maxMeeting);
                $hasData = $allMeetingNumbers->contains(fn($m) => $m >= $start && $m <= $end);
                if ($hasData) {
                    $ranges[] = [
                        'key' => "{$start}-{$end}",
                        'label' => "Pertemuan {$start} - {$end}",
                        'start' => $start,
                        'end' => $end,
                    ];
                }
            }

            // Opsi Keseluruhan (1 - terakhir)
            $ranges[] = [
                'key' => 'all',
                'label' => "Semua Pertemuan (1 - {$maxMeeting})",
                'start' => 1,
                'end' => $maxMeeting,
            ];
        }

        // Filter berdasarkan parameter range jika ada
        $selectedRangeKey = $request->query('range', 'all');
        $query = \App\Models\GradeEntry::where('student_id', $user->id);
        $activeRangeLabel = 'Semua Pertemuan';

        if ($selectedRangeKey !== 'all' && preg_match('/^(\d+)-(\d+)$/', $selectedRangeKey, $matches)) {
            $from = (int) $matches[1];
            $to = (int) $matches[2];
            $query->whereBetween('meeting_number', [$from, $to]);
            $activeRangeLabel = "Pertemuan {$from} - {$to}";
        } elseif ($maxMeeting > 0) {
            $activeRangeLabel = "Semua Pertemuan (1 - {$maxMeeting})";
        }

        $gradeEntries = $query->orderBy('meeting_number', 'asc')->get();

        $scores = [
            'interaction'  => round((float) ($gradeEntries->avg('interaksi') ?? 0), 2),
            'focus'        => round((float) ($gradeEntries->avg('fokus') ?? 0), 2),
            'robotBuilding'=> round((float) ($gradeEntries->filter(fn($g) => $g->robot_building !== null)->avg('robot_building') ?? 0), 2),
            'tools'        => round((float) ($gradeEntries->avg('tools_management') ?? 0), 2),
            'coding'       => round((float) ($gradeEntries->avg('coding') ?? 0), 2),
        ];

        $overallAvg = round((float) ($gradeEntries->avg('average') ?? 0), 2);
        $overallPct = $overallAvg > 0 ? min(100, round(($overallAvg / GradeEntry::MAX_SCORE) * 100, 1)) : 0;

        // R9: hitung kehadiran dari sessions (tanpa kirim list sesi ke PDF)
        $sessions = $user->learningSessions()->get(['status']);
        $hadir = $sessions->where('status', 'hadir')->count();
        $absen = $sessions->where('status', 'absen')->count();
        $reschedule = $sessions->where('status', 'reschedule')->count();
        $attendancePct = $sessions->count() > 0 ? round(($hadir / $sessions->count()) * 100, 1) : 0;

        $latestComment = \App\Models\StudentComment::where('student_id', $user->id)->latest()->first();

        return Inertia::render('User/ProfilPDF', [
            'studentStats' => [
                'name' => $user->name,
                'class' => $user->class,
                'level' => null,
                'totalSessions' => $sessions->count(),
                'attendance' => ['hadir' => $hadir, 'absen' => $absen, 'reschedule' => $reschedule, 'percentage' => $attendancePct],
                'scores' => $scores,
                'averagePercentage' => $overallPct,
                'comment' => [
                    'system' => $latestComment?->system_comment,
                    'notes'  => $latestComment?->notes,
                ],
            ],
            'filterInfo' => [
                'selectedRange' => $selectedRangeKey,
                'activeLabel' => $activeRangeLabel,
                'meetingCount' => $gradeEntries->count(),
                'availableRanges' => $ranges,
            ],
        ]);
    }
}
