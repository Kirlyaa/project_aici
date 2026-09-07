<?php

namespace App\Http\Controllers;

use App\Models\GradeEntry;
use App\Models\LearningSession;
use App\Models\School;
use App\Models\StudentComment;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ExportController extends Controller
{
    /**
     * Export students to CSV
     */
    public function students(Request $request): StreamedResponse
    {
        abort_if(Auth::user()->role !== 'superadmin', 403);

        $query = User::where('role', 'user');

        if ($request->input('school_id')) {
            $query->where('school_id', $request->input('school_id'));
        }

        if ($request->input('status')) {
            $query->where('status', $request->input('status'));
        }

        $headers = [
            "Content-type" => "text/csv; charset=UTF-8",
            "Content-Disposition" => "attachment; filename=students-" . date('Y-m-d') . ".csv",
            "Pragma" => "no-cache",
            "Cache-Control" => "must-revalidate, post-check=0, pre-check=0",
            "Expires" => "0",
        ];

        $callback = function () use ($query) {
            $file = fopen('php://output', 'w');
            fprintf($file, chr(0xEF) . chr(0xBB) . chr(0xBF)); // UTF-8 BOM

            // Header row
            fputcsv($file, [
                'ID',
                'Nama',
                'Email',
                'Sekolah',
                'Tutor',
                'Status',
                'Rata-rata Nilai',
                'Total Sesi',
                'Terdaftar',
            ]);

            // Stream rows in chunks to keep memory flat on large datasets
            $query->with(['school', 'tutor'])->chunk(500, function ($students) use ($file) {
                foreach ($students as $student) {
                    $avgGrade = $student->gradeEntries()->avg('average') ?? 0;
                    fputcsv($file, [
                        $student->id,
                        $student->name,
                        $student->email,
                        $student->school?->name ?? '-',
                        $student->tutor?->name ?? '-',
                        $student->status ?? 'aktif',
                        round($avgGrade, 2),
                        $student->learningSessions()->count(),
                        $student->created_at?->toDateString(),
                    ]);
                }
            });

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    /**
     * Export tutors to CSV
     */
    public function tutors(Request $request): StreamedResponse
    {
        abort_if(Auth::user()->role !== 'superadmin', 403);

        $query = User::where('role', 'tutor');

        if ($request->input('status')) {
            $query->where('status', $request->input('status'));
        }

        $tutors = $query->withCount(['students', 'learningSessions'])->get();

        $headers = [
            "Content-type" => "text/csv; charset=UTF-8",
            "Content-Disposition" => "attachment; filename=tutors-" . date('Y-m-d') . ".csv",
            "Pragma" => "no-cache",
            "Cache-Control" => "must-revalidate, post-check=0, pre-check=0",
            "Expires" => "0",
        ];

        $callback = function () use ($tutors) {
            $file = fopen('php://output', 'w');
            fprintf($file, chr(0xEF) . chr(0xBB) . chr(0xBF));

            fputcsv($file, [
                'ID',
                'Nama',
                'Email',
                'Status',
                'Total Siswa',
                'Total Sesi',
                'Terdaftar',
            ]);

            foreach ($tutors as $tutor) {
                fputcsv($file, [
                    $tutor->id,
                    $tutor->name,
                    $tutor->email,
                    $tutor->status ?? 'aktif',
                    $tutor->students_count,
                    $tutor->learning_sessions_count,
                    $tutor->created_at?->toDateString(),
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    /**
     * Export schools to CSV
     */
    public function schools(): StreamedResponse
    {
        abort_if(Auth::user()->role !== 'superadmin', 403);

        $schools = School::withCount(['students', 'tutors'])->get();

        $headers = [
            "Content-type" => "text/csv; charset=UTF-8",
            "Content-Disposition" => "attachment; filename=schools-" . date('Y-m-d') . ".csv",
            "Pragma" => "no-cache",
            "Cache-Control" => "must-revalidate, post-check=0, pre-check=0",
            "Expires" => "0",
        ];

        $callback = function () use ($schools) {
            $file = fopen('php://output', 'w');
            fprintf($file, chr(0xEF) . chr(0xBB) . chr(0xBF));

            fputcsv($file, [
                'ID',
                'Nama Sekolah',
                'Kota',
                'Provinsi',
                'Email',
                'Telepon',
                'PIC Nama',
                'PIC Telepon',
                'Status',
                'Total Siswa',
                'Total Tutor',
                'Terdaftar',
            ]);

            foreach ($schools as $school) {
                fputcsv($file, [
                    $school->id,
                    $school->name,
                    $school->city ?? '-',
                    $school->province ?? '-',
                    $school->email ?? '-',
                    $school->phone ?? '-',
                    $school->contact_person ?? '-',
                    $school->contact_phone ?? '-',
                    $school->status,
                    $school->students_count,
                    $school->tutors_count,
                    $school->created_at?->toDateString(),
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    /**
     * Export student grades to CSV
     */
    public function grades(int $studentId): StreamedResponse
    {
        $user = Auth::user();
        abort_if(!$user->managesStudent($studentId), 403);

        $student = User::findOrFail($studentId);
        $grades = GradeEntry::where('student_id', $studentId)
            ->with(['module', 'learningSession'])
            ->orderBy('meeting_date', 'desc')
            ->get();

        $headers = [
            "Content-type" => "text/csv; charset=UTF-8",
            "Content-Disposition" => "attachment; filename=grades-{$student->name}-" . date('Y-m-d') . ".csv",
            "Pragma" => "no-cache",
            "Cache-Control" => "must-revalidate, post-check=0, pre-check=0",
            "Expires" => "0",
        ];

        $callback = function () use ($student, $grades) {
            $file = fopen('php://output', 'w');
            fprintf($file, chr(0xEF) . chr(0xBB) . chr(0xBF));

            fputcsv($file, ["Laporan Nilai Siswa: {$student->name}"]);
            fputcsv($file, ["Email: {$student->email}"]);
            fputcsv($file, ["Tanggal Export: " . date('Y-m-d H:i:s')]);
            fputcsv($file, []);

            fputcsv($file, [
                'Pertemuan',
                'Modul',
                'Tanggal',
                'Fokus',
                'Robot Building',
                'Tools Management',
                'Interaksi',
                'Koding',
                'Rata-rata',
                'Catatan',
            ]);

            foreach ($grades as $grade) {
                fputcsv($file, [
                    $grade->meeting_number,
                    $grade->module?->name ?? 'General',
                    $grade->meeting_date?->toDateString() ?? '-',
                    $grade->fokus,
                    $grade->robot_building ?? '-',
                    $grade->tools_management,
                    $grade->interaksi,
                    $grade->coding,
                    $grade->average,
                    $grade->notes ?? '-',
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    /**
     * Export student comments to CSV
     */
    public function comments(int $studentId): StreamedResponse
    {
        $user = Auth::user();
        abort_if(!$user->managesStudent($studentId), 403);

        $student = User::findOrFail($studentId);
        $comments = StudentComment::where('student_id', $studentId)
            ->orderByDesc('semester')
            ->get();

        $headers = [
            "Content-type" => "text/csv; charset=UTF-8",
            "Content-Disposition" => "attachment; filename=comments-{$student->name}-" . date('Y-m-d') . ".csv",
            "Pragma" => "no-cache",
            "Cache-Control" => "must-revalidate, post-check=0, pre-check=0",
            "Expires" => "0",
        ];

        $callback = function () use ($student, $comments) {
            $file = fopen('php://output', 'w');
            fprintf($file, chr(0xEF) . chr(0xBB) . chr(0xBF));

            fputcsv($file, ["Komentar Siswa: {$student->name}"]);
            fputcsv($file, ["Email: {$student->email}"]);
            fputcsv($file, ["Tanggal Export: " . date('Y-m-d H:i:s')]);
            fputcsv($file, []);

            fputcsv($file, [
                'Semester',
                'Tahun Akademik',
                'Rata-rata Nilai',
                'Komentar Sistem',
                'Komentar Tutor',
                'Modul',
                'Generated Otomatis',
                'Dibuat',
            ]);

            foreach ($comments as $comment) {
                fputcsv($file, [
                    $comment->semester,
                    $comment->academic_year ?? '-',
                    $comment->average_grade ?? '-',
                    $comment->system_comment ?? '-',
                    $comment->tutor_comment ?? '-',
                    is_array($comment->module_names) ? implode(', ', $comment->module_names) : '-',
                    $comment->is_system_generated ? 'Ya' : 'Tidak',
                    $comment->created_at?->toDateString(),
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
