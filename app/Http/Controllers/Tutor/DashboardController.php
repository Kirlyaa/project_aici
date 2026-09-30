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

        // Filter murid: Hanya murid yang diajar oleh tutor ini saja yang muncul.
        // Superadmin dapat melihat semua murid.
        $students = User::where('role', 'user')
            ->whereIn('status', ['aktif', 'pending'])
            ->taughtBy($tutor)
            ->with(['classroom:id,name,tutor_id', 'tutor:id,name'])
            ->when($classFilter, function ($q) use ($classFilter) {
                if ($classFilter === 'Tanpa Kelas') {
                    $q->whereNull('class')->whereNull('classroom_id');
                } else {
                    $q->where(function ($sub) use ($classFilter) {
                        $sub->where('class', $classFilter)
                            ->orWhereHas('classroom', fn($c) => $c->where('name', $classFilter));
                    });
                }
            })
            ->withCount(['learningSessions', 'gradeEntries'])
            ->orderBy('name')
            ->get();

        // R4: daftar kelas untuk tampilan dua level (kelas -> murid) yang diajar tutor ini
        $classes = User::where('role', 'user')
            ->whereIn('status', ['aktif', 'pending'])
            ->taughtBy($tutor)
            ->leftJoin('classrooms', 'users.classroom_id', '=', 'classrooms.id')
            ->selectRaw('COALESCE(classrooms.name, users.class, ?) as class_name, classrooms.id as classroom_id, COUNT(users.id) as total', ['Tanpa Kelas'])
            ->groupBy('class_name', 'classrooms.id')
            ->orderBy('class_name')
            ->get()
            ->map(fn($r) => [
                'name' => $r->class_name,
                'classroom_id' => $r->classroom_id,
                'total' => (int) $r->total,
            ]);

        // Pertemuan per kelas beserta modul yang dipelajari pada tiap pertemuan
        $classSessions = LearningSession::with(['modules:id,name,module_type', 'classroom:id,name'])
            ->where(function ($q) use ($tutor) {
                if ($tutor->role !== 'superadmin') {
                    $q->where('tutor_id', $tutor->id)
                      ->orWhereHas('student', fn($s) => $s->taughtBy($tutor));
                }
            })
            ->orderBy('date', 'desc')
            ->get();

        $groupedMeetings = [];
        foreach ($classSessions as $session) {
            $cName = $session->classroom?->name ?? 'Tanpa Kelas';
            $cId = $session->classroom_id;
            $d = $session->date?->toDateString() ?? 'nodate';
            $key = $cName . '_' . $d . '_' . $session->title;

            if (!isset($groupedMeetings[$key])) {
                $groupedMeetings[$key] = [
                    'classroom_id' => $cId,
                    'class_name' => $cName,
                    'date' => $d,
                    'date_string' => $session->date_string,
                    'title' => $session->title,
                    'modules' => $session->modules->map(fn($m) => [
                        'id' => $m->id,
                        'name' => $m->name,
                        'module_type' => $m->module_type,
                    ])->values(),
                    'students_count' => 0,
                ];
            }
            $groupedMeetings[$key]['students_count']++;
        }
        $classMeetings = array_values($groupedMeetings);

        // Seluruh modul untuk dropdown cepat pada lembar absensi
        $modules = \App\Models\Module::orderBy('order_index')
            ->orderBy('name')
            ->get(['id', 'name', 'description', 'tools', 'module_type', 'parent_id', 'order_index']);

        $stats = [
            'total_students' => $students->count(),
            'total_sessions' => LearningSession::query()
                ->when($tutor->role !== 'superadmin', fn($q) => $q->where('tutor_id', $tutor->id))
                ->count(),
            'average_grade' => round((float) (GradeEntry::query()
                ->when($tutor->role !== 'superadmin', fn($q) => $q->where('tutor_id', $tutor->id))
                ->avg('average') ?? 0), 2),
            'pending_count' => $students->where('status', 'pending')->count(),
        ];

        $studentData = $students->map(function (User $s) {
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
                'class' => $s->classroom?->name ?? ($s->class ?? 'Tanpa Kelas'),
                'classroom_id' => $s->classroom_id,
                'level' => $s->tutor?->name ?? 'Belum ada tutor',
                // Progress dalam persen (skala 0-5 dikonversi ke 0-100)
                'progress' => min(100, round(($avg / GradeEntry::MAX_SCORE) * 100, 1)),
                'averageGrade' => round($avg, 2),
                'status' => $s->status ?? 'aktif',
                'totalSessions' => (int) $byStatus->sum(),
                'hadir' => (int) ($byStatus['hadir'] ?? 0),
                'absen' => (int) ($byStatus['absen'] ?? 0),
                'libur' => (int) ($byStatus['libur'] ?? 0),
                'akanDatang' => (int) ($byStatus['akan-datang'] ?? 0),
            ];
        });

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
            'classMeetings' => $classMeetings,
            'modules' => $modules,
            'selectedStudentId' => $request->integer('student') ?: null,
        ]);
    }
}
