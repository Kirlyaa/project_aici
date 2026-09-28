<?php

namespace App\Http\Controllers\Tutor;

use App\Http\Controllers\Controller;
use App\Http\Requests\Tutor\StoreLearningSessionRequest;
use App\Models\Classroom;
use App\Models\LearningSession;
use App\Models\Module;
use App\Models\User;
use App\Services\StudentLock;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class SessionController extends Controller
{
    public function index(Request $request): Response
    {
        $tutor = Auth::user();
        $isSuperAdmin = $tutor->role === 'superadmin';

        $search = $request->input('search', '');
        $filterStatus = $request->input('filter_status', '');
        $filterClassroom = $request->input('filter_classroom', '');

        $query = LearningSession::with(['modules', 'student', 'classroom'])
            ->when(!$isSuperAdmin, fn($q) => $q->where('tutor_id', $tutor->id))
            ->when($search, fn($q) => $q->where('title', 'like', "%{$search}%"))
            ->when($filterStatus, fn($q) => $q->where('status', $filterStatus))
            ->when($filterClassroom, function ($q) use ($filterClassroom) {
                if ($filterClassroom === 'none') {
                    $q->whereNull('classroom_id');
                } else {
                    $q->where('classroom_id', $filterClassroom);
                }
            })
            ->orderByDesc('date');

        $sessions = $query->paginate(15)->through(fn(LearningSession $s) => [
            'id'            => $s->id,
            'title'         => $s->title,
            'date'          => $s->date?->toDateString(),
            'dateString'    => $s->date_string,
            'status'        => $s->status,
            'description'   => $s->description,
            'tools'         => $s->tools ?? [],
            'studentId'     => $s->user_id,
            'studentName'   => $s->student?->name ?? '-',
            'classroomId'   => $s->classroom_id,
            'classroomName' => $s->classroom?->name ?? ($s->student?->class ?? '-'),
            'modules'       => $s->modules->map(fn($m) => ['id' => $m->id, 'name' => $m->name])->toArray(),
        ])->withQueryString();

        // Semua tutor boleh melihat murid dalam form session
        $students = User::where('role', 'user')
            ->whereIn('status', ['aktif', 'pending'])
            ->orderBy('name')
            ->get(['id', 'name', 'classroom_id', 'class']);

        $modules = Module::orderBy('name')->get(['id', 'name']);
        $classrooms = Classroom::orderBy('name')->get(['id', 'name']);

        return Inertia::render('Tutor/Sessions/Index', [
            'sessions'        => $sessions,
            'search'          => $search,
            'filterStatus'    => $filterStatus,
            'filterClassroom' => $filterClassroom,
            'students'        => $students,
            'modules'         => $modules,
            'classrooms'      => $classrooms,
        ]);
    }

    public function store(StoreLearningSessionRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $student = User::findOrFail($validated['student_id']);
        abort_if(!Auth::user()->managesStudent($student), 403);
        StudentLock::assertWritable((int) $validated['student_id'], Auth::user());

        $moduleIds = $validated['module_ids'] ?? [];
        unset($validated['module_ids']);

        // Auto-assign classroom_id from student's classroom if not explicitly supplied
        if (empty($validated['classroom_id'])) {
            $validated['classroom_id'] = $student->classroom_id;
        }

        $validated['tutor_id'] = Auth::id();

        $session = LearningSession::create($validated);
        $session->modules()->sync($moduleIds);

        return back()->with('success', 'Sesi berhasil ditambahkan.');
    }

    public function update(StoreLearningSessionRequest $request, LearningSession $session): RedirectResponse
    {
        $tutor = Auth::user();
        // Semua tutor boleh mengubah sesi muridnya; eksklusivitas dijaga StudentLock.
        abort_if(!$tutor->managesStudent($session->user_id), 403);
        StudentLock::assertWritable((int) $session->user_id, $tutor);

        $validated = $request->validated();

        $moduleIds = $validated['module_ids'] ?? [];
        unset($validated['module_ids']);

        // If classroom_id is not given, maintain or fall back to student's classroom_id
        if (empty($validated['classroom_id'])) {
            $student = User::find($validated['student_id']);
            $validated['classroom_id'] = $student?->classroom_id ?? $session->classroom_id;
        }

        $session->update($validated);
        $session->modules()->sync($moduleIds);

        return back()->with('success', 'Sesi berhasil diperbarui.');
    }

    public function destroy(LearningSession $session): RedirectResponse
    {
        $tutor = Auth::user();
        abort_if(!$tutor->managesStudent($session->user_id), 403);
        StudentLock::assertWritable((int) $session->user_id, $tutor);

        $session->delete();

        return back()->with('success', 'Sesi berhasil dihapus.');
    }
}
