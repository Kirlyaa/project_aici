<?php

namespace App\Http\Controllers\Tutor;

use App\Http\Controllers\Controller;
use App\Models\GradeEntry;
use App\Models\LearningSession;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        /** @var User $tutor */
        $tutor = Auth::user();

        // Semua tutor boleh melihat & mengakses semua murid.
        // Exclusivity (tidak boleh edit bersamaan) dijaga oleh StudentLock.
        $students = User::where('role', 'user')
            ->whereIn('status', ['aktif', 'pending'])
            ->withCount(['learningSessions', 'gradeEntries'])
            ->orderBy('name')
            ->paginate(20);

        $stats = [
            'total_students' => $students->total(),
            'total_sessions' => LearningSession::query()
                ->when($tutor->role !== 'superadmin', fn($q) => $q->where('tutor_id', $tutor->id))
                ->count(),
            'average_grade' => round((float) (GradeEntry::query()
                ->when($tutor->role !== 'superadmin', fn($q) => $q->where('tutor_id', $tutor->id))
                ->avg('average') ?? 0), 2),
            'pending_count' => $students->where('status', 'pending')->count(),
        ];

        $studentData = $students->through(function (User $s) {
            $avg = (float) ($s->gradeEntries()->avg('average') ?? 0);

            // Ringkasan kehadiran asli dari tabel learning_sessions (bukan hardcoded)
            $byStatus = $s->learningSessions()
                ->selectRaw('status, COUNT(*) as aggregate')
                ->groupBy('status')
                ->pluck('aggregate', 'status');

            return [
                'id' => $s->id,
                'name' => $s->name,
                'email' => $s->email,
                'level' => $s->tutor?->name ?? 'Belum ada tutor',
                // Progress dalam persen (skala 0-5 dikonversi ke 0-100)
                'progress' => min(100, round(($avg / 5) * 100, 1)),
                'averageGrade' => round($avg, 2),
                'status' => $s->status ?? 'aktif',
                'totalSessions' => (int) $byStatus->sum(),
                'hadir' => (int) ($byStatus['hadir'] ?? 0),
                'absen' => (int) ($byStatus['absen'] ?? 0),
                'reschedule' => (int) ($byStatus['reschedule'] ?? 0),
                'libur' => (int) ($byStatus['libur'] ?? 0),
                'akanDatang' => (int) ($byStatus['akan-datang'] ?? 0),
            ];
        })->withQueryString();

        return Inertia::render('Tutor/Dashboard', [
            'students' => $studentData,
            'stats' => $stats,
            'isSuperAdmin' => $tutor->role === 'superadmin',
            'currentTutor' => [
                'id' => $tutor->id,
                'name' => $tutor->name,
                'email' => $tutor->email,
            ],
        ]);
    }
}
