<?php

namespace App\Http\Controllers\Tutor;

use App\Http\Controllers\Controller;
use App\Models\GradeEntry;
use App\Models\LearningSession;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        /** @var User $tutor */
        $tutor = Auth::user();

        // R4: filter murid per kelas ("Tanpa Kelas" => class IS NULL)
        $classFilter = $request->input('class');

        // Semua tutor boleh melihat & mengakses semua murid.
        // Exclusivity (tidak boleh edit bersamaan) dijaga oleh StudentLock.
        $students = User::where('role', 'user')
            ->whereIn('status', ['aktif', 'pending'])
            ->when($classFilter, function ($q) use ($classFilter) {
                if ($classFilter === 'Tanpa Kelas') {
                    $q->whereNull('class');
                } else {
                    $q->where('class', $classFilter);
                }
            })
            ->withCount(['learningSessions', 'gradeEntries'])
            ->orderBy('name')
            ->paginate(20)
            ->withQueryString();

        // R4: daftar kelas untuk tampilan dua level (kelas -> murid)
        $classes = User::where('role', 'user')
            ->whereIn('status', ['aktif', 'pending'])
            ->selectRaw('COALESCE(class, ?) as class_name, COUNT(*) as total', ['Tanpa Kelas'])
            ->groupBy('class_name')
            ->orderBy('class_name')
            ->get()
            ->map(fn($r) => ['name' => $r->class_name, 'total' => (int) $r->total]);

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
                'class' => $s->class ?? 'Tanpa Kelas',
                'level' => $s->tutor?->name ?? 'Belum ada tutor',
                // Progress dalam persen (skala 0-5 dikonversi ke 0-100)
                'progress' => min(100, round(($avg / GradeEntry::MAX_SCORE) * 100, 1)),
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
            'classes' => $classes,
        ]);
    }
}
