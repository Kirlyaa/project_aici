<?php

namespace App\Http\Controllers\Tutor;

use App\Http\Controllers\Controller;
use App\Http\Requests\Tutor\StoreGradeEntryRequest;
use App\Models\GradeEntry;
use App\Models\Module;
use App\Models\User;
use App\Services\StudentLock;
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
            ->with(['module.parent', 'book'])
            ->orderBy('meeting_date', 'desc')
            ->orderBy('meeting_number', 'desc')
            ->get()
            ->map(function (GradeEntry $g) {
                $module = $g->module;
                $book = $g->book ?? ($module?->parent_id ? $module->parent : null);

                $isSubModule = $module && $module->parent_id !== null;
                $subModuleName = $isSubModule ? $module->name : null;
                $bookName = $book?->name ?? (!$isSubModule ? $module?->name : null);

                return [
                    'id' => $g->id,
                    'meetingNumber' => $g->meeting_number,
                    'moduleName' => $module?->name ?? 'Umum',
                    'bookName' => $bookName,
                    'subModuleName' => $subModuleName,
                    'moduleType' => $g->module_type,
                    'moduleId' => $g->module_id,
                    'bookId' => $g->book_id ?? ($module?->parent_id ?? $g->module_id),
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

        $modules = Module::whereNull('parent_id')
            ->with(['subModules' => function ($query) {
                $query->orderBy('order_index')->orderBy('name');
            }])
            ->orderBy('order_index')
            ->orderBy('name')
            ->get(['id', 'name', 'module_type'])
            ->map(function (Module $m) {
                return [
                    'id' => $m->id,
                    'name' => $m->name,
                    'module_type' => $m->module_type,
                    'sub_modules' => $m->subModules->map(function (Module $sm) {
                        return [
                            'id' => $sm->id,
                            'name' => $sm->name,
                            'order_index' => $sm->order_index,
                            'module_type' => $sm->module_type,
                        ];
                    })->values()->all(),
                ];
            })
            ->values()
            ->all();

        $averages = (object) [
            'overall' => round((float) $gradeEntries->avg('average') ?? 0, 2),
            'robot' => round((float) $gradeEntries->where('moduleType', 'robot')->avg('average') ?? 0, 2),
            'coding' => round((float) $gradeEntries->where('moduleType', 'coding')->avg('average') ?? 0, 2),
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
        StudentLock::assertWritable((int) $validated['student_id'], $request->user());

        $subModuleId = !empty($validated['sub_module_id']) ? (int) $validated['sub_module_id'] : null;
        $finalModuleId = $subModuleId ?: ($validated['module_id'] ?? null);
        $finalBookId = !empty($validated['book_id']) ? (int) $validated['book_id'] : Module::resolveBookId($finalModuleId);

        GradeEntry::create([
            'student_id' => $validated['student_id'],
            'tutor_id' => $request->user()->role === 'tutor' ? $request->user()->id : null,
            'module_id' => $finalModuleId,
            'book_id' => $finalBookId,
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
        StudentLock::assertWritable((int) $gradeEntry->student_id, $request->user());
        $validated = $request->validated();

        $subModuleId = !empty($validated['sub_module_id']) ? (int) $validated['sub_module_id'] : null;
        $finalModuleId = $subModuleId ?: ($validated['module_id'] ?? $gradeEntry->module_id);
        $finalBookId = !empty($validated['book_id']) ? (int) $validated['book_id'] : (Module::resolveBookId($finalModuleId) ?? $gradeEntry->book_id);

        $gradeEntry->update([
            'module_id' => $finalModuleId,
            'book_id' => $finalBookId,
            'learning_session_id' => $validated['learning_session_id'] ?? $gradeEntry->learning_session_id,
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
        StudentLock::assertWritable((int) $gradeEntry->student_id, $request->user());
        $gradeEntry->delete();
        return back()->with('success', 'Nilai berhasil dihapus.');
    }
}
