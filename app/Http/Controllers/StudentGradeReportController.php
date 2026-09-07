<?php

namespace App\Http\Controllers;

use App\Models\GradeEntry;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class StudentGradeReportController extends Controller
{
    /**
     * Show student's grade report
     */
    public function show(): Response
    {
        $student = Auth::user();

        // Get all grade entries for this student
        $gradeEntries = GradeEntry::where('student_id', $student->id)
            ->with(['module', 'learningSession'])
            ->orderBy('meeting_date', 'desc')
            ->orderBy('meeting_number', 'desc')
            ->get()
            ->map(function (GradeEntry $g) {
                return [
                    'id' => $g->id,
                    'meetingNumber' => $g->meeting_number,
                    'moduleName' => $g->module?->name ?? 'General',
                    'moduleType' => (int) $g->module_type,
                    'grades' => [
                        'fokus' => (float) $g->fokus,
                        'robot-building' => $g->robot_building !== null ? (float) $g->robot_building : null,
                        'tools-management' => (float) $g->tools_management,
                        'interaksi' => (float) $g->interaksi,
                        'koding' => (float) $g->coding,
                    ],
                    'average' => (float) $g->average,
                    'date' => $g->meeting_date?->toDateString(),
                    'notes' => $g->notes,
                ];
            });

        // Calculate overall statistics
        $stats = [
            'total_meetings' => $gradeEntries->count(),
            'overall_average' => round((float) $gradeEntries->avg('average') ?? 0, 2),
            'type5_average' => round((float) $gradeEntries->where('moduleType', 5)->avg('average') ?? 0, 2),
            'type4_average' => round((float) $gradeEntries->where('moduleType', 4)->avg('average') ?? 0, 2),
            'highest_score' => round((float) $gradeEntries->max('average') ?? 0, 2),
            'lowest_score' => round((float) $gradeEntries->min('average') ?? 0, 2),
        ];

        // Grouping by module for module-wise analysis
        $byModule = $gradeEntries->groupBy('moduleName')->map(function ($entries) {
            return [
                'name' => $entries[0]['moduleName'],
                'count' => $entries->count(),
                'average' => round($entries->avg('average'), 2),
                'highest' => round($entries->max('average'), 2),
                'lowest' => round($entries->min('average'), 2),
            ];
        })->values();

        return Inertia::render('User/GradeReport', [
            'gradeEntries' => $gradeEntries,
            'stats' => $stats,
            'byModule' => $byModule,
            'student' => [
                'id' => $student->id,
                'name' => $student->name,
                'email' => $student->email,
            ],
        ]);
    }
}
