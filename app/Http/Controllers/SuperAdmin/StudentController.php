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

class StudentController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->input('search', '');
        $status = $request->input('filter_status', 'Semua');

        $students = User::where('role', 'user')
            ->when($search, function ($q, $s) {
                $q->where(function ($inner) use ($s) {
                    $inner->where('name', 'like', "%{$s}%")
                        ->orWhere('email', 'like', "%{$s}%");
                });
            })
            ->when($status !== 'Semua', fn($q) => $q->where('status', $status))
            ->with(['tutor:id,name'])
            ->withCount(['learningSessions', 'gradeEntries'])
            ->orderByDesc('created_at')
            ->paginate(15)
            ->through(function (User $u) {
                return [
                    'id' => $u->id,
                    'name' => $u->name,
                    'email' => $u->email,
                    'role' => 'Murid',
                    'status' => $u->status ?? 'aktif',
                    'createdAt' => $u->created_at?->toDateString(),
                    'tutorName' => $u->tutor?->name,
                    'tutorId' => $u->tutor_id,
                    'class' => $u->class,
                    'sessionsCount' => $u->learning_sessions_count,
                    'gradesCount' => $u->grade_entries_count,
                ];
            })
            ->withQueryString();

        $tutors = User::where('role', 'tutor')
            ->where('status', 'aktif')
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('SuperAdmin/StudentManagement', [
            'students' => $students,
            'search' => $search,
            'filterStatus' => $status,
            'tutors' => $tutors,
        ]);
    }

    public function store(StoreUserRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'user',
            'status' => $validated['status'] ?? 'aktif',
            'tutor_id' => $validated['tutor_id'] ?? null,
            'class' => $validated['class'] ?? null,
        ]);
        return back()->with('success', 'Murid berhasil ditambahkan.');
    }

    public function update(StoreUserRequest $request, User $student): RedirectResponse
    {
        $validated = $request->validated();
        $student->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'role' => 'user',
            'status' => $validated['status'] ?? $student->status,
            'tutor_id' => $validated['tutor_id'] ?? null,
            'class' => $validated['class'] ?? $student->class,
        ]);
        if (! empty($validated['password'])) {
            $student->update(['password' => Hash::make($validated['password'])]);
        }
        return back()->with('success', 'Murid berhasil diperbarui.');
    }

    public function destroy(User $student): RedirectResponse
    {
        $student->delete();
        return back()->with('success', 'Murid berhasil dihapus.');
    }

    public function toggleStatus(User $student): RedirectResponse
    {
        $next = ($student->status ?? 'aktif') === 'aktif' ? 'nonaktif' : 'aktif';
        $student->update(['status' => $next]);
        return back()->with('success', "Status murid diubah menjadi {$next}.");
    }

    /**
     * Show comprehensive student account detail for Super Admin.
     */
    public function show($student): Response
    {
        $resolvedStudent = $student instanceof User && $student->exists 
            ? $student 
            : User::findOrFail(is_object($student) ? $student->id : $student);

        abort_if($resolvedStudent->role !== 'user', 404);

        $gradeEntries = \App\Models\GradeEntry::where('student_id', $resolvedStudent->id)
            ->with('module')
            ->orderBy('meeting_number', 'asc')
            ->get();

        $interactionAvg = round((float) ($gradeEntries->avg('interaksi') ?? 0), 2);
        $focusAvg       = round((float) ($gradeEntries->avg('fokus') ?? 0), 2);
        $robotAvg       = round((float) ($gradeEntries->filter(fn($g) => $g->robot_building !== null)->avg('robot_building') ?? 0), 2);
        $toolsAvg       = round((float) ($gradeEntries->avg('tools_management') ?? 0), 2);
        $codingAvg      = round((float) ($gradeEntries->avg('coding') ?? 0), 2);

        $overallAvg = round((float) ($gradeEntries->avg('average') ?? 0), 2);
        $overallPercentage = $overallAvg > 0 ? min(100, round(($overallAvg / \App\Models\GradeEntry::MAX_SCORE) * 100, 1)) : 0;

        $sessions = $resolvedStudent->learningSessions()
            ->with('modules')
            ->orderByDesc('date')
            ->get();

        $hadir = $sessions->where('status', 'hadir')->count();
        $absen = $sessions->where('status', 'absen')->count();
        $reschedule = $sessions->where('status', 'reschedule')->count();
        $attendancePct = $sessions->count() > 0 ? round(($hadir / $sessions->count()) * 100, 1) : 0;

        $latestComment = \App\Models\StudentComment::where('student_id', $resolvedStudent->id)->latest()->first();

        return Inertia::render('SuperAdmin/StudentDetail', [
            'student' => [
                'id' => $resolvedStudent->id,
                'name' => $resolvedStudent->name,
                'email' => $resolvedStudent->email,
                'status' => $resolvedStudent->status ?? 'aktif',
                'class' => $resolvedStudent->class,
                'classroomName' => $resolvedStudent->classroom?->name,
                'tutorName' => $resolvedStudent->tutor?->name,
                'createdAt' => $resolvedStudent->created_at?->format('d M Y'),
            ],
            'stats' => [
                'totalSessions' => $sessions->count(),
                'completedSessions' => $hadir,
                'attendance' => [
                    'hadir' => $hadir,
                    'absen' => $absen,
                    'reschedule' => $reschedule,
                    'percentage' => $attendancePct,
                ],
                'overallAvg' => $overallAvg,
                'averagePercentage' => $overallPercentage,
                'highestScore' => round((float) ($gradeEntries->max('average') ?? 0), 2),
                'lowestScore' => round((float) ($gradeEntries->min('average') ?? 0), 2),
                'scores' => [
                    'interaction' => $interactionAvg,
                    'focus' => $focusAvg,
                    'robotBuilding' => $robotAvg,
                    'tools' => $toolsAvg,
                    'coding' => $codingAvg,
                ],
            ],
            'recentSessions' => $sessions->map(fn($s) => [
                'id' => $s->id,
                'title' => $s->title,
                'date' => $s->date?->format('d M Y') ?? $s->date_string,
                'status' => $s->status,
                'module' => $s->modules->pluck('name')->join(', '),
            ])->values()->all(),
            'recentGrades' => $gradeEntries->map(fn($g) => [
                'id' => $g->id,
                'meetingNumber' => $g->meeting_number,
                'moduleName' => $g->module?->name ?? 'Umum',
                'moduleType' => $g->module_type,
                'average' => (float) $g->average,
                'date' => $g->meeting_date?->format('d M Y'),
                'grades' => [
                    'fokus' => (float) $g->fokus,
                    'robotBuilding' => $g->robot_building !== null ? (float) $g->robot_building : null,
                    'tools' => (float) $g->tools_management,
                    'interaction' => (float) $g->interaksi,
                    'coding' => (float) $g->coding,
                ],
            ])->values()->all(),
            'latestComment' => $latestComment ? [
                'system' => $latestComment->system_comment,
                'notes' => $latestComment->notes,
                'semester' => $latestComment->semester,
                'updatedAt' => $latestComment->updated_at?->format('d M Y H:i'),
            ] : null,
        ]);
    }
}
