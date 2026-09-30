<?php

namespace App\Http\Controllers\Tutor;

use App\Http\Controllers\Controller;
use App\Http\Requests\Tutor\StoreLearningSessionRequest;
use App\Models\LearningSession;
use App\Models\Module;
use App\Models\User;
use App\Services\StudentLock;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class CalendarController extends Controller
{
    /**
     * Kalender Mengajar Tutor (Jadwal Pengajaran Tutor sendiri)
     * Menampilkan semua jadwal mengajar tutor yang sedang login.
     */
    public function teachingSchedule(Request $request): Response
    {
        /** @var User $tutor */
        $tutor = Auth::user();

        // Ambil murid yang diajar tutor ini
        $students = User::where('role', 'user')
            ->whereIn('status', ['aktif', 'pending'])
            ->taughtBy($tutor)
            ->with('classroom:id,name')
            ->orderBy('name')
            ->get(['id', 'name', 'email', 'class', 'classroom_id', 'tutor_id']);

        // Sesi pembelajaran yang diampu tutor ini
        $sessionsQuery = LearningSession::query()
            ->with(['modules', 'classroom', 'student:id,name,email,avatar,classroom_id'])
            ->orderBy('date');

        if ($tutor->role !== 'superadmin') {
            $sessionsQuery->where(function ($q) use ($tutor) {
                $q->where('tutor_id', $tutor->id)
                    ->orWhereHas('classroom', fn($c) => $c->where('tutor_id', $tutor->id))
                    ->orWhereHas('student', fn($s) => $s->where('tutor_id', $tutor->id));
            });
        }

        $sessions = $sessionsQuery->get()->map(function (LearningSession $s) {
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
                'student_id' => $s->user_id,
                'student_name' => $s->student?->name ?? 'Murid Tidak Ditemukan',
                'student_email' => $s->student?->email,
            ];
        });

        $modules = Module::orderBy('name')->get(['id', 'name', 'module_type', 'image']);

        return Inertia::render('Tutor/TeachingCalendarManager', [
            'tutor' => [
                'id' => $tutor->id,
                'name' => $tutor->name,
                'email' => $tutor->email,
            ],
            'sessions' => $sessions,
            'students' => $students->map(fn($s) => [
                'id' => $s->id,
                'name' => $s->name,
                'class' => $s->classroom?->name ?? ($s->class ?? 'Tanpa Kelas'),
                'classroom_id' => $s->classroom_id,
            ]),
            'modules' => $modules,
        ]);
    }

    public function index(?int $studentId = null): Response|RedirectResponse
    {
        /** @var User $tutor */
        $tutor = Auth::user();

        // Ambil daftar murid yang diajar untuk dropdown select murid
        $students = User::where('role', 'user')
            ->whereIn('status', ['aktif', 'pending'])
            ->taughtBy($tutor)
            ->with('classroom:id,name')
            ->orderBy('name')
            ->get(['id', 'name', 'email', 'class', 'classroom_id', 'tutor_id']);

        if (!$studentId) {
            $firstStudent = $students->first();
            if ($firstStudent) {
                return redirect()->route('tutor.calendar', ['studentId' => $firstStudent->id]);
            }
        }

        $student = $studentId
            ? User::with(['classroom', 'tutor'])->findOrFail($studentId)
            : $students->first();

        if (!$student) {
            return Inertia::render('Tutor/CalendarManager', [
                'studentId' => 0,
                'student' => [
                    'id' => 0,
                    'name' => 'Tidak Ada Murid',
                    'email' => '',
                    'class' => 'Tanpa Kelas',
                    'classroom_id' => null,
                    'tutor' => 'Belum ada tutor',
                ],
                'students' => [],
                'sessions' => [],
                'modules' => [],
                'readOnly' => true,
            ]);
        }

        abort_if(!$tutor->managesStudent($student->id), 403);

        // Ambil seluruh sesi belajar murid
        $sessions = LearningSession::where('user_id', $student->id)
            ->when($tutor->role !== 'superadmin', function ($q) use ($tutor) {
                $q->where(function ($sub) use ($tutor) {
                    $sub->where('tutor_id', $tutor->id)
                        ->orWhereNull('tutor_id');
                });
            })
            ->with(['modules', 'classroom'])
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
                ];
            });

        $modules = Module::orderBy('name')->get(['id', 'name', 'module_type', 'image']);

        return Inertia::render('Tutor/CalendarManager', [
            'studentId' => (int) $student->id,
            'student' => [
                'id' => $student->id,
                'name' => $student->name,
                'email' => $student->email,
                'class' => $student->classroom?->name ?? ($student->class ?? 'Tanpa Kelas'),
                'classroom_id' => $student->classroom_id,
                'tutor' => $student->tutor?->name ?? 'Belum ada tutor',
            ],
            'students' => $students->map(fn($s) => [
                'id' => $s->id,
                'name' => $s->name,
                'class' => $s->classroom?->name ?? ($s->class ?? 'Tanpa Kelas'),
            ]),
            'sessions' => $sessions,
            'modules' => $modules,
            'readOnly' => false,
        ]);
    }

    /**
     * Update status absensi sesi pembelajaran oleh tutor secara real-time.
     * Catatan: Tutor HANYA berwenang mengubah status absensi kehadiran (hadir, absen, libur, akan-datang).
     * Penjadwalan, edit judul, modul, atau penambahan jadwal hanya dapat dilakukan oleh SuperAdmin.
     */
    public function update(Request $request, LearningSession $session): RedirectResponse
    {
        /** @var User $tutor */
        $tutor = Auth::user();
        abort_if(!$tutor->managesStudent($session->user_id), 403);
        StudentLock::assertWritable((int) $session->user_id, $tutor);

        $validated = $request->validate([
            'status' => ['required', 'in:hadir,absen,libur,akan-datang'],
        ]);

        DB::transaction(function () use ($session, $validated, $tutor) {
            $dataToUpdate = [
                'status' => $validated['status'],
            ];

            // Jika sesi belum memiliki tutor_id, kaitkan dengan tutor yang mengabsen
            if (empty($session->tutor_id) && $tutor->role === 'tutor') {
                $dataToUpdate['tutor_id'] = $tutor->id;
            }

            $session->update($dataToUpdate);
        });

        return back()->with('success', "Status absensi sesi berhasil diperbarui ke '{$validated['status']}'.");
    }

    /**
     * Tambah sesi pembelajaran baru.
     * Hanya SuperAdmin yang berwenang menambah jadwal/sesi.
     */
    public function store(StoreLearningSessionRequest $request): RedirectResponse
    {
        /** @var User $user */
        $user = Auth::user();
        
        // Hanya SuperAdmin yang berwenang menambah sesi kalender jadwal
        abort_if($user->role !== 'superadmin', 403, 'Hanya SuperAdmin yang berwenang menambah atau menjadwalkan sesi kalender.');

        $validated = $request->validated();
        $student = User::find($validated['student_id']);
        $classroomId = $validated['classroom_id'] ?? $student?->classroom_id;

        DB::transaction(function () use ($validated, $classroomId, $user) {
            $session = LearningSession::create([
                'user_id' => $validated['student_id'],
                'tutor_id' => $validated['tutor_id'] ?? null,
                'classroom_id' => $classroomId,
                'title' => $validated['title'],
                'date_string' => $validated['date_string'],
                'date' => $validated['date'],
                'status' => $validated['status'],
                'description' => $validated['description'] ?? null,
                'admin_note_for_tutor' => $validated['admin_note_for_tutor'] ?? null,
                'tools' => $validated['tools'] ?? null,
            ]);

            if (!empty($validated['module_ids'])) {
                $session->modules()->sync($validated['module_ids']);
            }
        });

        return back()->with('success', 'Sesi kalender berhasil dibuat.');
    }
}

