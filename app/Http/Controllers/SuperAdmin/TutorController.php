<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Http\Requests\SuperAdmin\StoreUserRequest;
use App\Models\Classroom;
use App\Models\LearningSession;
use App\Models\User;
use App\Services\TutorBulkImportService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class TutorController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->input('search', '');
        $status = $request->input('filter_status', 'Semua');

        $paginator = User::where('role', 'tutor')
            ->when($search, function ($q, $s) {
                $q->where(function ($inner) use ($s) {
                    $inner->where('name', 'like', "%{$s}%")
                        ->orWhere('email', 'like', "%{$s}%");
                });
            })
            ->when($status !== 'Semua', fn($q) => $q->where('status', $status))
            ->withCount('students')
            ->orderByDesc('created_at')
            ->paginate(15)
            ->withQueryString();

        $tutorIds = collect($paginator->items())->pluck('id')->all();

        // 1. Ambil managed classrooms beserta jumlah muridnya
        $managedClassrooms = Classroom::whereIn('tutor_id', $tutorIds)
            ->withCount('students')
            ->get(['id', 'name', 'tutor_id'])
            ->groupBy('tutor_id');

        // 2. Ambil distinct (classroom_id, date) per tutor untuk sesi pertemuan kelas
        $classMeetings = DB::table('learning_sessions')
            ->whereIn('tutor_id', $tutorIds)
            ->whereNull('deleted_at')
            ->whereNotNull('classroom_id')
            ->select('tutor_id', 'classroom_id', 'date')
            ->distinct()
            ->get()
            ->groupBy('tutor_id');

        // 3. Ambil distinct date untuk sesi perorangan tanpa kelas (jika ada)
        $individualMeetings = DB::table('learning_sessions')
            ->whereIn('tutor_id', $tutorIds)
            ->whereNull('deleted_at')
            ->whereNull('classroom_id')
            ->select('tutor_id', 'date')
            ->distinct()
            ->get()
            ->groupBy('tutor_id');

        $tutors = $paginator->through(function (User $u) use ($managedClassrooms, $classMeetings, $individualMeetings) {
            $tutorClassMeetings = $classMeetings->get($u->id, collect());
            $classes = $managedClassrooms->get($u->id, collect())->map(function ($c) use ($tutorClassMeetings) {
                return [
                    'id' => $c->id,
                    'name' => $c->name,
                    'students_count' => $c->students_count,
                    'meetings_count' => $tutorClassMeetings->where('classroom_id', $c->id)->count(),
                ];
            })->values()->all();

            $classCount = count($classes);
            $totalClassMeetings = $tutorClassMeetings->count();
            $indMeetingCount = ($individualMeetings->get($u->id) ?? collect())->count();
            $totalPertemuan = $totalClassMeetings + $indMeetingCount;

            return [
                'id' => $u->id,
                'name' => $u->name,
                'email' => $u->email,
                'peran' => 'Tutor',
                'status' => $u->status ?? 'aktif',
                'terdaftar' => $u->created_at?->toDateString(),
                'students_count' => $u->students_count,
                'classrooms_count' => $classCount,
                'classrooms' => $classes,
                'sessions_count' => $totalPertemuan,
            ];
        });

        // Ambil daftar seluruh kelas terdaftar untuk penugasan kelas diampu tutor
        $allClassrooms = Classroom::withCount('students')
            ->with(['tutor:id,name'])
            ->orderBy('name')
            ->get(['id', 'name', 'tutor_id'])
            ->map(fn($c) => [
                'id' => $c->id,
                'name' => $c->name,
                'tutor_id' => $c->tutor_id,
                'tutor_name' => $c->tutor?->name,
                'students_count' => $c->students_count,
            ]);

        return Inertia::render('SuperAdmin/TutorManagement', [
            'users' => $tutors,
            'classrooms' => $allClassrooms,
            'search' => $search,
            'filterStatus' => $status,
        ]);
    }

    public function store(StoreUserRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        return DB::transaction(function () use ($validated) {
            $tutor = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'role' => 'tutor',
                'status' => $validated['status'] ?? 'aktif',
            ]);

            $classroomIds = collect($validated['classroom_ids'] ?? [])
                ->filter()
                ->map(fn($id) => (int) $id)
                ->values()
                ->all();

            if (! empty($classroomIds)) {
                Classroom::whereIn('id', $classroomIds)->update(['tutor_id' => $tutor->id]);

                // Sinkronkan murid di kelas-kelas terpilih ke tutor baru
                $studentIds = User::whereIn('classroom_id', $classroomIds)
                    ->orWhereHas('classrooms', fn($q) => $q->whereIn('classrooms.id', $classroomIds))
                    ->pluck('id')
                    ->unique();

                if ($studentIds->isNotEmpty()) {
                    User::whereIn('id', $studentIds)
                        ->where('role', 'user')
                        ->update(['tutor_id' => $tutor->id]);

                    LearningSession::where(function ($q) use ($classroomIds, $studentIds) {
                        $q->whereIn('classroom_id', $classroomIds)
                          ->orWhereIn('user_id', $studentIds);
                    })->update(['tutor_id' => $tutor->id]);
                }
            }

            return back()->with('success', 'Tutor berhasil ditambahkan.');
        });
    }

    public function update(StoreUserRequest $request, User $tutor): RedirectResponse
    {
        $validated = $request->validated();

        return DB::transaction(function () use ($validated, $tutor) {
            $updateData = [
                'name' => $validated['name'],
                'email' => $validated['email'],
                'role' => 'tutor',
                'status' => $validated['status'] ?? $tutor->status,
            ];

            if (! empty($validated['password'])) {
                $updateData['password'] = Hash::make($validated['password']);
            }

            $tutor->update($updateData);

            if (array_key_exists('classroom_ids', $validated)) {
                $newClassroomIds = collect($validated['classroom_ids'])
                    ->filter()
                    ->map(fn($id) => (int) $id)
                    ->values()
                    ->all();

                $oldClassroomIds = Classroom::where('tutor_id', $tutor->id)->pluck('id')->all();

                $removedIds = array_values(array_diff($oldClassroomIds, $newClassroomIds));
                $addedIds = array_values(array_diff($newClassroomIds, $oldClassroomIds));

                // 1. Lepas kelas yang tidak lagi diampu oleh tutor ini
                if (! empty($removedIds)) {
                    Classroom::whereIn('id', $removedIds)
                        ->where('tutor_id', $tutor->id)
                        ->update(['tutor_id' => null]);

                    // Lepas tutor_id murid di kelas yang dilepas (hanya murid yang tutornya masih tutor ini)
                    User::whereIn('classroom_id', $removedIds)
                        ->where('tutor_id', $tutor->id)
                        ->where('role', 'user')
                        ->update(['tutor_id' => null]);

                    // Lepas tutor_id pada sesi di kelas yang dilepas
                    LearningSession::whereIn('classroom_id', $removedIds)
                        ->where('tutor_id', $tutor->id)
                        ->update(['tutor_id' => null]);
                }

                // 2. Hubungkan kelas-kelas baru yang diampu ke tutor ini
                if (! empty($newClassroomIds)) {
                    Classroom::whereIn('id', $newClassroomIds)->update(['tutor_id' => $tutor->id]);

                    // Sinkronkan seluruh murid di kelas yang diampu
                    $studentIds = User::whereIn('classroom_id', $newClassroomIds)
                        ->orWhereHas('classrooms', fn($q) => $q->whereIn('classrooms.id', $newClassroomIds))
                        ->pluck('id')
                        ->unique();

                    if ($studentIds->isNotEmpty()) {
                        User::whereIn('id', $studentIds)
                            ->where('role', 'user')
                            ->update(['tutor_id' => $tutor->id]);

                        LearningSession::where(function ($q) use ($newClassroomIds, $studentIds) {
                            $q->whereIn('classroom_id', $newClassroomIds)
                              ->orWhereIn('user_id', $studentIds);
                        })->update(['tutor_id' => $tutor->id]);
                    }
                }
            }

            return back()->with('success', 'Tutor berhasil diperbarui.');
        });
    }

    public function destroy(User $tutor): RedirectResponse
    {
        $tutor->students()->update(['tutor_id' => null]);
        $tutor->tutoredSessions()->update(['tutor_id' => null]);
        $tutor->delete();
        return back()->with('success', 'Tutor berhasil dihapus.');
    }

    public function toggleStatus(User $tutor): RedirectResponse
    {
        $next = ($tutor->status ?? 'aktif') === 'aktif' ? 'nonaktif' : 'aktif';
        $tutor->update(['status' => $next]);
        return back()->with('success', "Status tutor diubah menjadi {$next}.");
    }

    /**
     * Detail akun tutor: murid yang diampu, sesi pembelajaran, serta opsi assign/unassign murid.
     */
    public function show($tutor): Response
    {
        $resolvedTutor = $tutor instanceof User && $tutor->exists 
            ? $tutor 
            : User::findOrFail(is_object($tutor) ? $tutor->id : $tutor);

        abort_if($resolvedTutor->role !== 'tutor', 404);

        // Murid yang diampu oleh tutor ini
        $assignedStudents = User::where('role', 'user')
            ->where('tutor_id', $resolvedTutor->id)
            ->with(['classroom:id,name'])
            ->withCount(['tutoredSessions as sessions_count' => fn($q) => $q->where('tutor_id', $resolvedTutor->id)])
            ->orderBy('name')
            ->get()
            ->map(fn(User $s) => [
                'id' => $s->id,
                'name' => $s->name,
                'email' => $s->email,
                'avatar' => $s->avatar_url,
                'status' => $s->status ?? 'aktif',
                'class' => $s->classroom?->name ?? $s->class ?? 'Tanpa Kelas',
                'sessions_count' => $s->sessions_count,
            ]);

        // Daftar murid yang belum memiliki tutor atau dibina tutor lain (untuk dropdown assign murid)
        $availableStudents = User::where('role', 'user')
            ->where(function ($q) use ($resolvedTutor) {
                $q->whereNull('tutor_id')
                    ->orWhere('tutor_id', '!=', $resolvedTutor->id);
            })
            ->with(['classroom:id,name', 'tutor:id,name'])
            ->orderBy('name')
            ->get()
            ->map(fn(User $s) => [
                'id' => $s->id,
                'name' => $s->name,
                'email' => $s->email,
                'current_tutor' => $s->tutor?->name,
                'class' => $s->classroom?->name ?? $s->class ?? 'Tanpa Kelas',
            ]);

        // Sesi pembelajaran yang ditutori oleh tutor ini
        $sessions = \App\Models\LearningSession::where('tutor_id', $resolvedTutor->id)
            ->with(['student:id,name,email,class,classroom_id', 'modules:id,name'])
            ->orderByDesc('date')
            ->get();

        // Hitung total sesi pertemuan per kelas & tanggal (bukan perkalian murid)
        $classMeetingCount = DB::table('learning_sessions')
            ->where('tutor_id', $resolvedTutor->id)
            ->whereNull('deleted_at')
            ->whereNotNull('classroom_id')
            ->select('classroom_id', 'date')
            ->distinct()
            ->count();

        $indMeetingCount = DB::table('learning_sessions')
            ->where('tutor_id', $resolvedTutor->id)
            ->whereNull('deleted_at')
            ->whereNull('classroom_id')
            ->select('date')
            ->distinct()
            ->count();

        $totalPertemuan = $classMeetingCount + $indMeetingCount;

        $stats = [
            'total_students' => $assignedStudents->count(),
            'total_sessions' => $totalPertemuan,
            'total_student_sessions' => $sessions->count(),
            'hadir_count' => $sessions->where('status', 'hadir')->count(),
            'absen_count' => $sessions->where('status', 'absen')->count(),
            'akan_datang_count' => $sessions->where('status', 'akan-datang')->count(),
        ];

        return Inertia::render('SuperAdmin/TutorDetail', [
            'tutor' => [
                'id' => $resolvedTutor->id,
                'name' => $resolvedTutor->name,
                'email' => $resolvedTutor->email,
                'status' => $resolvedTutor->status ?? 'aktif',
                'avatar' => $resolvedTutor->avatar_url,
                'terdaftar' => $resolvedTutor->created_at?->format('d M Y'),
            ],
            'stats' => $stats,
            'assignedStudents' => $assignedStudents,
            'availableStudents' => $availableStudents,
            'recentSessions' => $sessions->take(30)->map(fn($s) => [
                'id' => $s->id,
                'title' => $s->title,
                'date' => $s->date?->format('d M Y') ?? $s->date_string,
                'date_raw' => $s->date?->toDateString(),
                'status' => $s->status,
                'student_id' => $s->student?->id,
                'student_name' => $s->student?->name ?? 'Murid Dihapus',
                'class' => $s->student?->classroom?->name ?? $s->student?->class ?? '-',
                'modules' => $s->modules->pluck('name')->join(', '),
            ])->values()->all(),
        ]);
    }

    /**
     * Menugaskan murid ke tutor ini
     */
    public function assignStudent(Request $request, User $tutor): RedirectResponse
    {
        abort_if($tutor->role !== 'tutor', 400);

        $validated = $request->validate([
            'student_id' => 'required|exists:users,id',
        ]);

        $student = User::where('id', $validated['student_id'])->where('role', 'user')->firstOrFail();
        $student->update(['tutor_id' => $tutor->id]);

        // Sinkronkan seluruh sesi murid ini ke tutor yang baru
        $student->learningSessions()->update(['tutor_id' => $tutor->id]);

        return back()->with('success', "Murid {$student->name} berhasil ditugaskan ke Tutor {$tutor->name}.");
    }

    /**
     * Melepas murid dari tutor (unassign)
     */
    public function removeStudent(Request $request, User $tutor, User $student): RedirectResponse
    {
        abort_if($tutor->role !== 'tutor' || $student->role !== 'user', 400);

        if ($student->tutor_id === $tutor->id) {
            $student->update(['tutor_id' => null]);
            $student->learningSessions()->where('tutor_id', $tutor->id)->update(['tutor_id' => null]);
        }

        return back()->with('success', "Murid {$student->name} berhasil dilepas dari Tutor {$tutor->name}.");
    }

    /**
     * Download template CSV untuk bulk import tutor.
     */
    public function downloadTemplate(TutorBulkImportService $importService): StreamedResponse
    {
        return $importService->downloadTemplate();
    }

    /**
     * Import data tutor secara massal dari file CSV.
     */
    public function importExcel(Request $request, TutorBulkImportService $importService): RedirectResponse
    {
        $request->validate([
            'file' => [
                'required',
                'file',
                'max:10240',
                'mimes:csv,txt',
            ],
        ], [
            'file.required' => 'Silakan pilih file CSV terlebih dahulu.',
            'file.mimes' => 'Format file harus berupa file .csv.',
            'file.max' => 'Ukuran file tidak boleh melebihi 10MB.',
        ]);

        $result = $importService->import($request->file('file'));

        if (! $result['success']) {
            return back()
                ->with('error', 'Gagal mengimpor data tutor.')
                ->with('import_errors', $result['errors']);
        }

        return back()->with('success', "Berhasil mengimpor {$result['imported_count']} data tutor baru.");
    }
}

