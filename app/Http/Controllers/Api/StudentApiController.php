<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\GradeEntry;
use App\Models\LearningSession;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class StudentApiController extends Controller
{
    /**
     * Get all grades for a student
     */
    public function getGrades(int $studentId): JsonResponse
    {
        $user = Auth::user();
        abort_if(!$user->managesStudent($studentId), 403);

        $grades = GradeEntry::where('student_id', $studentId)
            ->with(['module', 'learningSession'])
            ->orderBy('meeting_date', 'desc')
            ->get()
            ->map(function (GradeEntry $g) {
                return [
                    'id' => $g->id,
                    'meeting_number' => $g->meeting_number,
                    'module_name' => $g->module?->name ?? 'General',
                    'module_type' => $g->module_type,
                    'meeting_date' => $g->meeting_date?->toDateString(),
                    'fokus' => (float) $g->fokus,
                    'robot_building' => $g->robot_building ? (float) $g->robot_building : null,
                    'tools_management' => (float) $g->tools_management,
                    'interaksi' => (float) $g->interaksi,
                    'coding' => (float) $g->coding,
                    'average' => (float) $g->average,
                    'notes' => $g->notes,
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $grades,
            'total' => $grades->count(),
        ]);
    }

    /**
     * Get sessions for a student
     */
    public function getSessions(int $studentId): JsonResponse
    {
        $user = Auth::user();
        abort_if(!$user->managesStudent($studentId), 403);

        $sessions = LearningSession::where('user_id', $studentId)
            ->with('modules')
            ->orderBy('date', 'desc')
            ->get()
            ->map(function (LearningSession $s) {
                return [
                    'id' => $s->id,
                    'title' => $s->title,
                    'date_string' => $s->date_string,
                    'date' => $s->date?->toDateString(),
                    'status' => $s->status,
                    'description' => $s->description,
                    'tools' => $s->tools,
                    'module_ids' => $s->modules->pluck('id'),
                    'modules' => $s->modules->map(fn($m) => ['id' => $m->id, 'name' => $m->name]),
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $sessions,
            'total' => $sessions->count(),
        ]);
    }

    /**
     * Get student summary/stats
     */
    public function getSummary(int $studentId): JsonResponse
    {
        $user = Auth::user();
        abort_if(!$user->managesStudent($studentId), 403);

        $student = User::findOrFail($studentId);
        $grades = GradeEntry::where('student_id', $studentId)->get();
        $sessions = LearningSession::where('user_id', $studentId)->get();

        $stats = [
            'id' => $student->id,
            'name' => $student->name,
            'email' => $student->email,
            'school' => $student->school?->name ?? null,
            'tutor' => $student->tutor?->name ?? null,
            'status' => $student->status,
            'total_grades' => $grades->count(),
            'total_sessions' => $sessions->count(),
            'avg_grade' => round((float) $grades->avg('average') ?? 0, 2),
            'highest_grade' => round((float) $grades->max('average') ?? 0, 2),
            'lowest_grade' => round((float) $grades->min('average') ?? 0, 2),
            'sessions_attended' => $sessions->where('status', 'hadir')->count(),
            'sessions_absent' => $sessions->where('status', 'absen')->count(),
            'sessions_rescheduled' => $sessions->where('status', 'reschedule')->count(),
        ];

        return response()->json([
            'success' => true,
            'data' => $stats,
        ]);
    }
}
