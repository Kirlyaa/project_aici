<?php

namespace App\Http\Controllers\Tutor;

use App\Http\Controllers\Controller;
use App\Http\Requests\Tutor\StoreGradeEntryRequest;
use App\Models\GradeEntry;
use App\Models\Module;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class GradeController extends Controller
{
    public function index(int $studentId): Response
    {
        $tutor = Auth::user();
        abort_if(!$tutor->managesStudent($studentId), 403);

        $student = User::findOrFail($studentId);

        $gradeEntries = GradeEntry::where('student_id', $studentId)
            ->with(['module'])
            ->orderBy('meeting_date', 'desc')
            ->orderBy('meeting_number', 'desc')
            ->get()
            ->map(function (GradeEntry $g) {
                return [
                    'id' => $g->id,
                    'meetingNumber' => $g->meeting_number,
                    'moduleName' => $g->module?->name ?? 'Umum',
                    'moduleType' => (int) $g->module_type,
                    'moduleId' => $g->module_id,
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

        $modules = Module::orderBy('name')->get(['id', 'name', 'module_type']);

        $averages = (object) [
            'overall' => round((float) $gradeEntries->avg('average') ?? 0, 2),
            'robot' => round((float) $gradeEntries->where('moduleType', 5)->avg('average') ?? 0, 2),
            'coding' => round((float) $gradeEntries->where('moduleType', 4)->avg('average') ?? 0, 2),
            'count' => $gradeEntries->count(),
        ];

        return Inertia::render('Tutor/GradesManager', [
            'studentId' => (int) $studentId,
            'student' => ['id' => $student->id, 'name' => $student->name, 'email' => $student->email],
            'gradeEntries' => $gradeEntries,
            'modules' => $modules,
            'averages' => $averages,
        ]);
    }

    public function store(StoreGradeEntryRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        abort_if(!$request->user()->managesStudent($validated['student_id']), 403);

        GradeEntry::create([
            'student_id' => $validated['student_id'],
            'tutor_id' => $request->user()->role === 'tutor' ? $request->user()->id : null,
            'module_id' => $validated['module_id'] ?? null,
            'learning_session_id' => $validated['learning_session_id'] ?? null,
            'meeting_number' => $validated['meeting_number'],
            'module_type' => $validated['module_type'],
            'meeting_date' => $validated['meeting_date'] ?? null,
            'fokus' => $validated['fokus'],
            'robot_building' => $validated['module_type'] === 'robot' ? ($validated['robot_building'] ?? 0) : null,
            'tools_management' => $validated['tools_management'],
            'interaksi' => $validated['interaksi'],
            'coding' => $validated['coding'],
            'notes' => $validated['notes'] ?? null,
        ]);

        return back()->with('success', 'Nilai berhasil disimpan.');
    }

    public function update(StoreGradeEntryRequest $request, GradeEntry $gradeEntry): RedirectResponse
    {
        abort_if(!$request->user()->managesStudent($gradeEntry->student_id), 403);
        $validated = $request->validated();

        $gradeEntry->update([
            'module_id' => $validated['module_id'] ?? null,
            'learning_session_id' => $validated['learning_session_id'] ?? null,
            'meeting_number' => $validated['meeting_number'],
            'module_type' => $validated['module_type'],
            'meeting_date' => $validated['meeting_date'] ?? null,
            'fokus' => $validated['fokus'],
            'robot_building' => $validated['module_type'] === 'robot' ? ($validated['robot_building'] ?? 0) : null,
            'tools_management' => $validated['tools_management'],
            'interaksi' => $validated['interaksi'],
            'coding' => $validated['coding'],
            'notes' => $validated['notes'] ?? null,
        ]);

        return back()->with('success', 'Nilai berhasil diperbarui.');
    }

    public function destroy(Request $request, GradeEntry $gradeEntry): RedirectResponse
    {
        abort_if(!$request->user()->managesStudent($gradeEntry->student_id), 403);
        $gradeEntry->delete();
        return back()->with('success', 'Nilai berhasil dihapus.');
    }
}
