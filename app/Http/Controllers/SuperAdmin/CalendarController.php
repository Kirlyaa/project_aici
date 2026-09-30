<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Tutor\StoreLearningSessionRequest;
use App\Models\LearningSession;
use App\Models\Module;
use App\Models\User;
use App\Services\CalendarBulkImportService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class CalendarController extends Controller
{
    /**
     * Kalender Pembelajaran Siswa (SuperAdmin)
     */
    public function index(?int $studentId = null): Response|RedirectResponse
    {
        $students = User::where('role', 'user')
            ->whereIn('status', ['aktif', 'pending'])
            ->with('classroom:id,name')
            ->orderBy('name')
            ->get(['id', 'name', 'email', 'class', 'classroom_id']);

        $tutors = User::where('role', 'tutor')
            ->whereIn('status', ['aktif', 'pending'])
            ->orderBy('name')
            ->get(['id', 'name', 'email']);

        if (!$studentId) {
            $firstStudent = $students->first();
            if ($firstStudent) {
                return redirect()->route('superadmin.calendar', ['studentId' => $firstStudent->id]);
            }
        }

        $student = $studentId ? User::with('classroom')->find($studentId) : null;

        if (!$student) {
            return Inertia::render('SuperAdmin/CalendarManager', [
                'mode' => 'student',
                'studentId' => 0,
                'student' => null,
                'sessions' => [],
                'modules' => Module::orderBy('name')->get(['id', 'name', 'module_type', 'image']),
                'students' => $students,
                'tutors' => $tutors,
            ]);
        }

        $sessions = LearningSession::where('user_id', $student->id)
            ->with(['modules', 'classroom', 'tutor:id,name,email'])
            ->orderBy('date')
            ->get()
            ->map(function (LearningSession $s) {
                return [
                    'id' => $s->id,
                    'title' => $s->title,
                    'date_string' => $s->date_string,
                    'date' => $s->date?->toDateString(),
                    'status' => $s->status,
                    'description' => $s->description,
                    'admin_note_for_tutor' => $s->admin_note_for_tutor,
                    'tools' => $s->tools,
                    'module_ids' => $s->modules->pluck('id'),
                    'classroom_id' => $s->classroom_id,
                    'classroom_name' => $s->classroom?->name,
                    'tutor_id' => $s->tutor_id,
                    'tutor_name' => $s->tutor?->name,
                    'student_id' => $s->user_id,
                    'student_name' => $s->student?->name,
                ];
            });

        $modules = Module::orderBy('name')->get(['id', 'name', 'module_type', 'image']);

        return Inertia::render('SuperAdmin/CalendarManager', [
            'mode' => 'student',
            'studentId' => (int) $student->id,
            'student' => [
                'id' => $student->id,
                'name' => $student->name,
                'email' => $student->email,
                'class' => $student->classroom?->name ?? ($student->class ?? 'Tanpa Kelas'),
                'classroom_id' => $student->classroom_id,
            ],
            'sessions' => $sessions,
            'modules' => $modules,
            'students' => $students,
            'tutors' => $tutors,
        ]);
    }

    /**
     * Kalender Mengajar Tutor (SuperAdmin)
     * Mengelola jadwal sesi pengajaran per tutor oleh SuperAdmin.
     */
    public function tutorCalendar(?int $tutorId = null): Response|RedirectResponse
    {
        $tutors = User::where('role', 'tutor')
            ->whereIn('status', ['aktif', 'pending'])
            ->orderBy('name')
            ->get(['id', 'name', 'email']);

        $students = User::where('role', 'user')
            ->whereIn('status', ['aktif', 'pending'])
            ->with('classroom:id,name')
            ->orderBy('name')
            ->get(['id', 'name', 'email', 'class', 'classroom_id']);

        if (!$tutorId) {
            $firstTutor = $tutors->first();
            if ($firstTutor) {
                return redirect()->route('superadmin.calendar.tutors', ['tutorId' => $firstTutor->id]);
            }
        }

        $tutor = $tutorId ? User::find($tutorId) : null;

        if (!$tutor) {
            return Inertia::render('SuperAdmin/TutorCalendarManager', [
                'tutorId' => 0,
                'tutor' => null,
                'sessions' => [],
                'modules' => Module::orderBy('name')->get(['id', 'name', 'module_type', 'image']),
                'tutors' => $tutors,
                'students' => $students,
            ]);
        }

        // Ambil semua sesi di mana tutor_id = $tutor->id atau murid di kelas yang diampu oleh tutor ini
        $sessions = LearningSession::where(function ($q) use ($tutor) {
                $q->where('tutor_id', $tutor->id)
                    ->orWhereHas('classroom', fn($c) => $c->where('tutor_id', $tutor->id))
                    ->orWhereHas('student', fn($s) => $s->where('tutor_id', $tutor->id));
            })
            ->with(['modules', 'classroom', 'student:id,name,email,classroom_id'])
            ->orderBy('date')
            ->get()
            ->map(function (LearningSession $s) {
                return [
                    'id' => $s->id,
                    'title' => $s->title,
                    'date_string' => $s->date_string,
                    'date' => $s->date?->toDateString(),
                    'status' => $s->status,
                    'description' => $s->description,
                    'admin_note_for_tutor' => $s->admin_note_for_tutor,
                    'tools' => $s->tools,
                    'module_ids' => $s->modules->pluck('id'),
                    'classroom_id' => $s->classroom_id,
                    'classroom_name' => $s->classroom?->name,
                    'tutor_id' => $s->tutor_id,
                    'student_id' => $s->user_id,
                    'student_name' => $s->student?->name ?? 'Murid Tidak Ditemukan',
                    'student_email' => $s->student?->email,
                ];
            });

        $modules = Module::orderBy('name')->get(['id', 'name', 'module_type', 'image']);

        return Inertia::render('SuperAdmin/TutorCalendarManager', [
            'tutorId' => (int) $tutor->id,
            'tutor' => [
                'id' => $tutor->id,
                'name' => $tutor->name,
                'email' => $tutor->email,
            ],
            'sessions' => $sessions,
            'modules' => $modules,
            'tutors' => $tutors,
            'students' => $students,
        ]);
    }

    public function store(StoreLearningSessionRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $student = User::find($validated['student_id']);
        $classroomId = $validated['classroom_id'] ?? $student?->classroom_id;
        $tutorId = $validated['tutor_id'] ?? $student?->tutor_id;

        DB::transaction(function () use ($validated, $classroomId, $tutorId) {
            /** @var LearningSession $session */
            $session = LearningSession::create([
                'user_id' => $validated['student_id'],
                'tutor_id' => $tutorId,
                'classroom_id' => $classroomId,
                'title' => $validated['title'],
                'date_string' => $validated['date_string'],
                'date' => $validated['date'],
                'status' => $validated['status'],
                'description' => $validated['description'] ?? null,
                'admin_note_for_tutor' => $validated['admin_note_for_tutor'] ?? null,
                'tools' => $validated['tools'] ?? null,
            ]);

            if (! empty($validated['module_ids'])) {
                $session->modules()->sync($validated['module_ids']);
            }
        });

        return back()->with('success', 'Sesi pembelajaran berhasil ditambahkan.');
    }

    public function update(StoreLearningSessionRequest $request, LearningSession $session): RedirectResponse
    {
        $validated = $request->validated();

        $student = User::find($validated['student_id']);
        $classroomId = $validated['classroom_id'] ?? ($student?->classroom_id ?? $session->classroom_id);
        $tutorId = array_key_exists('tutor_id', $validated) ? $validated['tutor_id'] : $session->tutor_id;

        DB::transaction(function () use ($session, $validated, $classroomId, $tutorId) {
            $session->update([
                'user_id' => $validated['student_id'],
                'tutor_id' => $tutorId,
                'classroom_id' => $classroomId,
                'title' => $validated['title'],
                'date_string' => $validated['date_string'],
                'date' => $validated['date'],
                'status' => $validated['status'],
                'description' => $validated['description'] ?? null,
                'admin_note_for_tutor' => $validated['admin_note_for_tutor'] ?? null,
                'tools' => $validated['tools'] ?? null,
            ]);

            $modules = $validated['module_ids'] ?? [];
            $session->modules()->sync($modules);
        });

        return back()->with('success', 'Sesi pembelajaran berhasil diperbarui.');
    }

    public function destroy(LearningSession $session): RedirectResponse
    {
        $session->modules()->detach();
        $session->delete();

        return back()->with('success', 'Sesi pembelajaran berhasil dihapus.');
    }

    /**
     * Hapus semua jadwal sesi kalender untuk murid tertentu (atau semua murid jika diminta).
     */
    public function clearAll(Request $request, int $studentId): RedirectResponse
    {
        $deleteAll = $request->boolean('all_students', false);

        $count = DB::transaction(function () use ($studentId, $deleteAll) {
            $query = LearningSession::query();
            if (! $deleteAll) {
                $query->where('user_id', $studentId);
            }

            $sessions = $query->get();
            $deletedCount = $sessions->count();

            foreach ($sessions as $session) {
                $session->modules()->detach();
                $session->delete();
            }

            return $deletedCount;
        });

        $msg = $deleteAll
            ? "Seluruh jadwal sesi kalender ({$count} jadwal) dari semua murid berhasil dihapus."
            : "Seluruh jadwal sesi kalender ({$count} jadwal) untuk murid ini berhasil dihapus.";

        return back()->with('success', $msg);
    }

    /**
     * Download template file CSV untuk import jadwal.
     */
    public function downloadTemplate(CalendarBulkImportService $importService): StreamedResponse
    {
        return $importService->downloadTemplate();
    }

    /**
     * Import jadwal kalender via CSV (Mendukung format masal multi-tanggal dan kolom fleksibel).
     */
    public function importCsv(Request $request, CalendarBulkImportService $importService): RedirectResponse
    {
        $request->validate([
            'csv_file' => ['required', 'file', 'max:10240', 'mimes:csv,txt'],
            'tutor_id' => ['nullable', 'integer', 'exists:users,id'],
        ], [
            'csv_file.required' => 'Silakan pilih file CSV terlebih dahulu.',
            'csv_file.mimes' => 'Format file harus berupa file .csv.',
            'csv_file.max' => 'Ukuran file tidak boleh melebihi 10MB.',
        ]);

        $defaultTutorId = $request->filled('tutor_id') ? (int) $request->input('tutor_id') : null;
        $result = $importService->import($request->file('csv_file'), $defaultTutorId);

        if (! $result['success']) {
            return back()->with('csv_errors', $result['errors'])->with('error', 'Gagal mengimpor jadwal. Silakan periksa file CSV Anda.');
        }

        $imported = $result['imported_count'];
        $warnings = $result['warnings'] ?? [];

        $message = "Sukses mengimpor {$imported} jadwal sesi secara massal.";
        if (! empty($warnings)) {
            $message .= " (Terdapat " . count($warnings) . " catatan/peringatan).";
            return back()->with('success', $message)->with('csv_warnings', $warnings);
        }

        return back()->with('success', $message);
    }
}
