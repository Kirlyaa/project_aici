<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Models\GradeEntry;
use App\Models\LearningSession;
use App\Models\School;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController
{
    public function __invoke(): Response
    {
        // User Statistics
        $totalUsers = User::count();
        $totalStudents = User::where('role', 'user')->count();
        $totalTutors = User::where('role', 'tutor')->count();
        $totalSchools = School::count();

        // Status breakdown
        $activeStudents = User::where('role', 'user')->where('status', 'aktif')->count();
        $pendingStudents = User::where('role', 'user')->where('status', 'pending')->count();
        $activeTutors = User::where('role', 'tutor')->where('status', 'aktif')->count();

        // Grade Statistics
        $avgGrade = round((float) GradeEntry::avg('average') ?? 0, 2);
        $totalGradeEntries = GradeEntry::count();
        $totalSessions = LearningSession::count();

        // Session Statistics by Status
        $sessionsByStatus = LearningSession::groupBy('status')
            ->selectRaw('status, COUNT(*) as count')
            ->pluck('count', 'status')
            ->toArray();

        // Top Schools by Students
        $topSchools = School::withCount('students')
            ->orderByDesc('students_count')
            ->limit(5)
            ->get()
            ->map(function (School $s) {
                return [
                    'name' => $s->name,
                    'students_count' => $s->students_count,
                    'tutors_count' => $s->tutors_count,
                ];
            });

        // Recent Students
        $recentStudents = User::where('role', 'user')
            ->with(['school', 'tutor'])
            ->latest('created_at')
            ->limit(5)
            ->get()
            ->map(function (User $u) {
                $avgGrade = $u->gradeEntries()->avg('average') ?? 0;
                return [
                    'id' => $u->id,
                    'name' => $u->name,
                    'email' => $u->email,
                    'school' => $u->school?->name ?? '-',
                    'tutor' => $u->tutor?->name ?? '-',
                    'avgGrade' => round($avgGrade, 2),
                    'status' => $u->status ?? 'aktif',
                ];
            });

        // Recent Tutors
        $recentTutors = User::where('role', 'tutor')
            ->latest('created_at')
            ->limit(5)
            ->get()
            ->map(function (User $u) {
                return [
                    'id' => $u->id,
                    'name' => $u->name,
                    'email' => $u->email,
                    'status' => $u->status ?? 'aktif',
                ];
            });

        // Recent Modules
        $recentModules = \App\Models\Module::latest('created_at')
            ->limit(5)
            ->get()
            ->map(function (\App\Models\Module $m) {
                return [
                    'id' => $m->id,
                    'name' => $m->name,
                    'type' => $m->module_type,
                    'typeLabel' => $m->getTypeLabel(),
                    'image' => $m->image,
                ];
            });

        $totalModules = \App\Models\Module::count();

        // Grade Distribution (Histogram Data)
        $gradeRanges = [
            '0-1' => 0,
            '1-2' => 0,
            '2-3' => 0,
            '3-4' => 0,
            '4-5' => 0,
        ];

        GradeEntry::selectRaw('CAST(average AS DECIMAL(3,1)) as grade')
            ->pluck('average')
            ->each(function ($grade) use (&$gradeRanges) {
                if ($grade < 1) {
                    $gradeRanges['0-1']++;
                } elseif ($grade < 2) {
                    $gradeRanges['1-2']++;
                } elseif ($grade < 3) {
                    $gradeRanges['2-3']++;
                } elseif ($grade < 4) {
                    $gradeRanges['3-4']++;
                } else {
                    $gradeRanges['4-5']++;
                }
            });

        // Module Type Distribution
        $moduleTypeStats = GradeEntry::selectRaw('module_type, COUNT(*) as count, AVG(average) as avg_grade')
            ->groupBy('module_type')
            ->get()
            ->map(function ($stat) {
                return [
                    'type' => $stat->module_type === 'robot' ? 'Robot Building' : ($stat->module_type === 'coding' ? 'Coding' : 'General'),
                    'count' => $stat->count,
                    'avg_grade' => round($stat->avg_grade, 2),
                ];
            });

        // Monthly Registration Trend (last 12 months)
        $registrationTrend = User::where('role', 'user')
            ->selectRaw("DATE_FORMAT(created_at, '%Y-%m') as month, COUNT(*) as count")
            ->whereRaw("created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)")
            ->groupByRaw("DATE_FORMAT(created_at, '%Y-%m')")
            ->orderBy('month')
            ->get()
            ->map(function ($item) {
                return [
                    'month' => $item->month,
                    'count' => $item->count,
                ];
            });

        // School Status Distribution
        $schoolStatus = School::selectRaw('status, COUNT(*) as count')
            ->groupBy('status')
            ->get()
            ->pluck('count', 'status')
            ->toArray();

        return Inertia::render('SuperAdmin/Dashboard', [
            'stats' => [
                'totalUsers' => $totalUsers,
                'totalStudents' => $totalStudents,
                'totalTutors' => $totalTutors,
                'totalSchools' => $totalSchools,
                'activeStudents' => $activeStudents,
                'pendingStudents' => $pendingStudents,
                'activeTutors' => $activeTutors,
                'avgGrade' => $avgGrade,
                'totalGradeEntries' => $totalGradeEntries,
                'totalSessions' => $totalSessions,
                'totalModules' => $totalModules,
            ],
            'charts' => [
                'sessionsByStatus' => $sessionsByStatus,
                'gradeDistribution' => $gradeRanges,
                'moduleTypeStats' => $moduleTypeStats,
                'registrationTrend' => $registrationTrend,
                'schoolStatus' => $schoolStatus,
            ],
            'topSchools' => $topSchools,
            'recentStudents' => $recentStudents,
            'recentTutors' => $recentTutors,
            'recentModules' => $recentModules,
        ]);
    }
}
