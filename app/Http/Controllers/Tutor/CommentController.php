<?php

namespace App\Http\Controllers\Tutor;

use App\Http\Controllers\Controller;
use App\Http\Requests\Tutor\StoreStudentCommentRequest;
use App\Models\CommentTemplate;
use App\Models\GradeEntry;
use App\Models\StudentComment;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class CommentController extends Controller
{
    public function index(int $studentId): Response
    {
        $tutor = Auth::user();
        abort_if(!$tutor->managesStudent($studentId), 403);

        $student = User::findOrFail($studentId);

        $comments = StudentComment::where('student_id', $studentId)
            ->orderByDesc('semester')
            ->orderByDesc('created_at')
            ->get()
            ->map(function (StudentComment $c) {
                return [
                    'id' => $c->id,
                    'semester' => $c->semester,
                    'academic_year' => $c->academic_year,
                    'systemComment' => $c->system_comment,
                    'tutorComment' => $c->tutor_comment,
                    'averageGrade' => $c->average_grade !== null ? (float) $c->average_grade : null,
                    'moduleNames' => $c->module_names,
                    'isSystemGenerated' => (bool) $c->is_system_generated,
                    'lastUpdated' => $c->updated_at?->toDateTimeString(),
                ];
            });

        $templates = CommentTemplate::where('is_active', true)
            ->orderBy('grade_range')
            ->orderBy('category')
            ->get(['id', 'grade_range', 'category', 'template']);

        return Inertia::render('Tutor/CommentsManager', [
            'studentId' => (int) $studentId,
            'student' => ['id' => $student->id, 'name' => $student->name, 'email' => $student->email],
            'comments' => $comments,
            'templates' => $templates,
        ]);
    }

    public function store(StoreStudentCommentRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        abort_if(!$request->user()->managesStudent($validated['student_id']), 403);

        $comment = StudentComment::updateOrCreate(
            [
                'student_id' => $validated['student_id'],
                'semester' => $validated['semester'],
            ],
            [
                'tutor_id' => $request->user()->role === 'tutor' ? $request->user()->id : null,
                'academic_year' => $validated['academic_year'] ?? null,
                'tutor_comment' => $validated['tutor_comment'] ?? null,
                'system_comment' => $validated['system_comment'] ?? null,
            ]
        );

        return back()->with('success', 'Komentar berhasil disimpan.');
    }

    public function generate(int $studentId, string $semester): RedirectResponse
    {
        $tutor = request()->user();
        abort_if(!$tutor->managesStudent($studentId), 403);

        DB::transaction(function () use ($studentId, $semester, $tutor) {
            // Parse semester format (e.g., "2026-01" for first semester/month)
            // Assuming semester is in format "YYYY-MM" or "YYYY-Q1/Q2/Q3/Q4"
            // For monthly basis: get all entries from that month
            $entries = GradeEntry::where('student_id', $studentId)
                ->whereYear('meeting_date', substr($semester, 0, 4))
                ->whereMonth('meeting_date', substr($semester, 5, 2))
                ->get();

            $average = $entries->isNotEmpty() ? round((float) $entries->avg('average'), 2) : 0;
            $moduleNames = $entries->pluck('module.name')->unique()->filter()->values()->toArray();

            $template = CommentTemplate::getTemplateForAverage($average);
            $systemComment = $template
                ? CommentTemplate::substitute($template, [
                    'modules' => $moduleNames,
                    'average' => (string) $average,
                    'student' => User::find($studentId)?->name ?? 'Siswa',
                ])
                : null;

            StudentComment::updateOrCreate(
                [
                    'student_id' => $studentId,
                    'semester' => $semester,
                ],
                [
                    'tutor_id' => $tutor->role === 'tutor' ? $tutor->id : null,
                    'system_comment' => $systemComment,
                    'average_grade' => $average,
                    'module_names' => $moduleNames,
                    'is_system_generated' => true,
                ]
            );
        });

        return back()->with('success', 'Komentar semester berhasil digenerate otomatis.');
    }

    public function destroy(StudentComment $studentComment): RedirectResponse
    {
        abort_if(!request()->user()->managesStudent($studentComment->student_id), 403);
        $studentComment->delete();
        return back()->with('success', 'Komentar berhasil dihapus.');
    }

    // ============ Comment Templates CRUD ============

    public function storeTemplate(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'grade_range' => ['required', Rule::in(['<4', '4-4.99', '5'])],
            'category' => ['required', 'string', 'max:50'],
            'template' => ['required', 'string'],
        ]);

        $validated['created_by'] = $request->user()->id;
        CommentTemplate::create($validated);

        return back()->with('success', 'Template komentar berhasil ditambahkan.');
    }

    public function updateTemplate(Request $request, CommentTemplate $template): RedirectResponse
    {
        $validated = $request->validate([
            'grade_range' => ['required', Rule::in(['<4', '4-4.99', '5'])],
            'category' => ['required', 'string', 'max:50'],
            'template' => ['required', 'string'],
        ]);

        $template->update($validated);

        return back()->with('success', 'Template komentar berhasil diperbarui.');
    }

    public function destroyTemplate(CommentTemplate $template): RedirectResponse
    {
        $template->delete();
        return back()->with('success', 'Template komentar berhasil dihapus.');
    }
}
