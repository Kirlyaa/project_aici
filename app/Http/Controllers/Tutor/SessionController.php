<?php

namespace App\Http\Controllers\Tutor;

use App\Http\Controllers\Controller;
use App\Http\Requests\Tutor\StoreLearningSessionRequest;
use App\Models\LearningSession;
use App\Models\Module;
use App\Models\User;
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

        $query = LearningSession::with(['modules', 'student'])
            ->when(!$isSuperAdmin, fn($q) => $q->where('tutor_id', $tutor->id))
            ->when($search, fn($q) => $q->where('title', 'like', "%{$search}%"))
            ->when($filterStatus, fn($q) => $q->where('status', $filterStatus))
            ->orderByDesc('date');

        $sessions = $query->paginate(15)->through(fn(LearningSession $s) => [
            'id'          => $s->id,
            'title'       => $s->title,
            'date'        => $s->date?->toDateString(),
            'dateString'  => $s->date_string,
            'status'      => $s->status,
            'description' => $s->description,
            'tools'       => $s->tools ?? [],
            'studentId'   => $s->user_id,
            'studentName' => $s->student?->name ?? '-',
            'modules'     => $s->modules->map(fn($m) => ['id' => $m->id, 'name' => $m->name])->toArray(),
        ])->withQueryString();

        // Students managed by this tutor (for the form)
        $students = User::where('role', 'user')
            ->when(!$isSuperAdmin, fn($q) => $q->where('tutor_id', $tutor->id))
            ->orderBy('name')
            ->get(['id', 'name']);

        $modules = Module::orderBy('name')->get(['id', 'name']);

        return Inertia::render('Tutor/Sessions/Index', [
            'sessions'   => $sessions,
            'search'     => $search,
            'filterStatus' => $filterStatus,
            'students'   => $students,
            'modules'    => $modules,
        ]);
    }

    public function store(StoreLearningSessionRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $student = User::findOrFail($validated['student_id']);
        abort_if(!Auth::user()->managesStudent($student), 403);

        $moduleIds = $validated['module_ids'] ?? [];
        unset($validated['module_ids']);

        $validated['tutor_id'] = Auth::id();

        $session = LearningSession::create($validated);
        $session->modules()->sync($moduleIds);

        return back()->with('success', 'Sesi berhasil ditambahkan.');
    }

    public function update(StoreLearningSessionRequest $request, LearningSession $session): RedirectResponse
    {
        $tutor = Auth::user();
        abort_if($tutor->role !== 'superadmin' && $session->tutor_id !== $tutor->id, 403);

        $validated = $request->validated();

        $moduleIds = $validated['module_ids'] ?? [];
        unset($validated['module_ids']);

        $session->update($validated);
        $session->modules()->sync($moduleIds);

        return back()->with('success', 'Sesi berhasil diperbarui.');
    }

    public function destroy(LearningSession $session): RedirectResponse
    {
        $tutor = Auth::user();
        abort_if($tutor->role !== 'superadmin' && $session->tutor_id !== $tutor->id, 403);

        $session->delete();

        return back()->with('success', 'Sesi berhasil dihapus.');
    }
}
