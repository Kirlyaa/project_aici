<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Classroom;
use App\Models\GradeEntry;
use App\Models\ReportPeriod;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ClassroomReportController extends Controller
{
    public function index(Request $request, Classroom $classroom): Response
    {
        abort_if($request->user()->role !== 'superadmin', 403);

        $students = $classroom->students()
            ->where('role', 'user')
            ->orderBy('name')
            ->get(['id', 'name', 'email', 'avatar', 'status']);

        $maxMeetingByStudent = GradeEntry::whereIn('student_id', $students->pluck('id'))
            ->whereNotNull('meeting_number')
            ->selectRaw('student_id, MAX(meeting_number) as max_meeting')
            ->groupBy('student_id')
            ->pluck('max_meeting', 'student_id');

        $overallAvgByStudent = GradeEntry::whereIn('student_id', $students->pluck('id'))
            ->selectRaw('student_id, AVG(average) as avg_score')
            ->groupBy('student_id')
            ->pluck('avg_score', 'student_id');

        $sessionCountByStudent = \App\Models\LearningSession::whereIn('user_id', $students->pluck('id'))
            ->whereNull('deleted_at')
            ->selectRaw('user_id, COUNT(*) as cnt')
            ->groupBy('user_id')
            ->pluck('cnt', 'user_id');

        $hadirByStudent = \App\Models\LearningSession::whereIn('user_id', $students->pluck('id'))
            ->whereNull('deleted_at')
            ->where('status', 'hadir')
            ->selectRaw('user_id, COUNT(*) as cnt')
            ->groupBy('user_id')
            ->pluck('cnt', 'user_id');

        $studentRows = $students->map(fn(User $s) => [
            'id' => $s->id,
            'name' => $s->name,
            'email' => $s->email,
            'avatar' => $s->avatar_url,
            'status' => $s->status,
            'maxMeeting' => (int) ($maxMeetingByStudent[$s->id] ?? 0),
            'overallAvg' => round((float) ($overallAvgByStudent[$s->id] ?? 0), 2),
            'totalSessions' => (int) ($sessionCountByStudent[$s->id] ?? 0),
            'attendanceHadir' => (int) ($hadirByStudent[$s->id] ?? 0),
        ])->values();

        $globalMaxMeeting = (int) ($studentRows->max('maxMeeting') ?? 0);

        $customPeriods = ReportPeriod::where('is_active', true)
            ->orderBy('order_index')
            ->orderBy('start_meeting')
            ->get();

        $ranges = [];
        if ($customPeriods->isNotEmpty()) {
            foreach ($customPeriods as $period) {
                $ranges[] = [
                    'key' => "{$period->start_meeting}-{$period->end_meeting}",
                    'label' => $period->display_name,
                    'start' => $period->start_meeting,
                    'end' => $period->end_meeting,
                ];
            }
        } elseif ($globalMaxMeeting > 0) {
            for ($start = 1; $start <= $globalMaxMeeting; $start += 4) {
                $end = min($start + 3, $globalMaxMeeting);
                $ranges[] = [
                    'key' => "{$start}-{$end}",
                    'label' => "Pertemuan {$start} - {$end}",
                    'start' => $start,
                    'end' => $end,
                ];
            }
        }

        if ($globalMaxMeeting > 0) {
            $ranges[] = [
                'key' => 'all',
                'label' => "Semua Pertemuan (1 - {$globalMaxMeeting})",
                'start' => 1,
                'end' => $globalMaxMeeting,
            ];
        }

        return Inertia::render('SuperAdmin/ClassroomReports', [
            'classroom' => [
                'id' => $classroom->id,
                'name' => $classroom->name,
                'photo' => $classroom->photo_url,
                'description' => $classroom->description,
                'tutor' => $classroom->tutor ? ['id' => $classroom->tutor->id, 'name' => $classroom->tutor->name] : null,
            ],
            'students' => $studentRows,
            'ranges' => $ranges,
            'globalMaxMeeting' => $globalMaxMeeting,
        ]);
    }
}
