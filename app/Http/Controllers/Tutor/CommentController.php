<?php

namespace App\Http\Controllers\Tutor;

use App\Http\Controllers\Controller;
use App\Http\Requests\Tutor\StoreStudentCommentRequest;
use App\Models\CommentTemplate;
use App\Models\GradeEntry;
use App\Models\StudentComment;
use App\Models\User;
use App\Services\StudentLock;
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
                    'strengths' => $c->strengths,
                    'notes' => $c->notes,
                    'adminNote' => $c->admin_note,
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
        StudentLock::assertWritable((int) $validated['student_id'], $request->user());

        $existing = StudentComment::firstOrNew([
            'student_id' => $validated['student_id'],
            'semester' => $validated['semester'],
        ]);

        $comment = StudentComment::updateOrCreate(
            [
                'student_id' => $validated['student_id'],
                'semester' => $validated['semester'],
            ],
            [
                'tutor_id' => $request->user()->role === 'tutor' ? $request->user()->id : null,
                'academic_year' => $validated['academic_year'] ?? $existing->academic_year,
                // R2: komentar personal disederhanakan jadi satu field "Catatan".
                // tutor_comment & strengths dinull-kan; kolom DB dibiarkan untuk data lama.
                'tutor_comment' => null,
                'strengths' => null,
                'notes' => $validated['notes'] ?? null,
                'admin_note' => $validated['admin_note'] ?? $existing->admin_note,
                // Jangan timpa system_comment lama kecuali dikirim eksplisit
                'system_comment' => $validated['system_comment'] ?? $existing->system_comment,
                'average_grade' => $existing->average_grade,
                'module_names' => $existing->module_names,
                'is_system_generated' => (bool) $existing->is_system_generated,
            ]
        );

        // Auto-generate komentar sistem dari template jika belum ada
        if (empty($comment->system_comment)) {
            $systemComment = $this->buildSystemComment($validated['student_id'], $validated['semester']);
            if ($systemComment !== null) {
                $comment->update([
                    'system_comment' => $systemComment['text'],
                    'average_grade' => $systemComment['average'],
                    'module_names' => $systemComment['modules'],
                    'is_system_generated' => true,
                ]);
            }
        }

        return back()->with('success', 'Komentar berhasil disimpan.');
    }

    /**
     * Susun komentar sistem dari CommentTemplate berdasarkan rata-rata nilai bulan itu.
     *
     * @return array{text: string, average: float, modules: array}|null
     */
    private function buildSystemComment(int $studentId, string $semester): ?array
    {
        $entries = GradeEntry::where('student_id', $studentId)
            ->whereYear('meeting_date', substr($semester, 0, 4))
            ->whereMonth('meeting_date', substr($semester, 5, 2))
            ->get();

        $average = $entries->isNotEmpty() ? round((float) $entries->avg('average'), 2) : 0;
        $moduleNames = $entries->pluck('module.name')->unique()->filter()->values()->toArray();

        $template = CommentTemplate::getTemplateForAverage($average);
        if ($template === null) {
            return null;
        }

        $text = CommentTemplate::substitute($template, [
            'modules' => $moduleNames,
            'average' => (string) $average,
            'student' => User::find($studentId)?->name ?? 'Siswa',
        ]);

        return ['text' => $text, 'average' => $average, 'modules' => $moduleNames];
    }

    public function generate(int $studentId, string $semester): RedirectResponse
    {
        $tutor = request()->user();
        abort_if(!$tutor->managesStudent($studentId), 403);
        StudentLock::assertWritable($studentId, $tutor);

        // Validate semester format (YYYY-MM)
        if (!preg_match('/^\d{4}-\d{2}$/', $semester)) {
            return back()->with('error', 'Format semester tidak valid. Gunakan format YYYY-MM.');
        }

        DB::transaction(function () use ($studentId, $semester, $tutor) {
            // Parse semester format (e.g., "2026-01" for first semester/month)
            $year = substr($semester, 0, 4);
            $month = substr($semester, 5, 2);
            $entries = GradeEntry::where('student_id', $studentId)
                ->whereYear('meeting_date', $year)
                ->whereMonth('meeting_date', $month)
                ->get();

            $average = $entries->isNotEmpty() ? round((float) $entries->avg('average'), 2) : 0;
            $moduleNames = $entries->pluck('module.name')->unique()->filter()->values()->toArray();

            $template = CommentTemplate::getTemplateForAverage($average);
            if (! $template) {
                // Flash warning/error jika tidak ada template yang cocok sama sekali
                session()->flash('error', 'Tidak ada template komentar aktif yang cocok untuk nilai rata-rata ' . $average . '. Silakan buat template baru terlebih dahulu.');
            }

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
        StudentLock::assertWritable((int) $studentComment->student_id, request()->user());
        $studentComment->delete();
        return back()->with('success', 'Komentar berhasil dihapus.');
    }

    // ============ Comment Templates CRUD ============

    public function storeTemplate(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'grade_range' => ['required', Rule::in(['<4', '4-4.99', '5'])],
            'template' => ['required', 'string'],
        ]);

        // R2: template hanya kategori 'umum'
        $validated['category'] = 'umum';
        $validated['created_by'] = $request->user()->id;
        CommentTemplate::create($validated);

        return back()->with('success', 'Template komentar berhasil ditambahkan.');
    }

    public function updateTemplate(Request $request, CommentTemplate $template): RedirectResponse
    {
        $validated = $request->validate([
            'grade_range' => ['required', Rule::in(['<4', '4-4.99', '5'])],
            'template' => ['required', 'string'],
        ]);

        // R2: template hanya kategori 'umum'
        $validated['category'] = 'umum';
        $template->update($validated);

        return back()->with('success', 'Template komentar berhasil diperbarui.');
    }

    public function destroyTemplate(CommentTemplate $template): RedirectResponse
    {
        $template->delete();
        return back()->with('success', 'Template komentar berhasil dihapus.');
    }
}
