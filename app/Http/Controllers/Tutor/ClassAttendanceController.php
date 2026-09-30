<?php

namespace App\Http\Controllers\Tutor;

use App\Http\Controllers\Controller;
use App\Models\Classroom;
use App\Models\LearningSession;
use App\Models\Module;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class ClassAttendanceController extends Controller
{
    /**
     * Mendapatkan data murid dan modul untuk modal presensi kelas
     */
    public function getFormData(Request $request, Classroom $classroom): JsonResponse
    {
        /** @var User $tutor */
        $tutor = Auth::user();

        // Ambil murid yang terdaftar di kelas ini
        $studentsQuery = $classroom->students()
            ->whereIn('status', ['aktif', 'pending'])
            ->orderBy('name');

        // Jika tutor bukan superadmin, pastikan tutor ini mengajar di kelas ini atau murid-murid di dalamnya
        if ($tutor->role !== 'superadmin') {
            $studentsQuery->taughtBy($tutor);
        }

        $students = $studentsQuery->get(['id', 'name', 'email', 'avatar', 'status']);

        // Ambil semua modul yang tersedia (bisa diurutkan berdasarkan parent / urutan)
        $modules = Module::orderBy('order_index')
            ->orderBy('name')
            ->get(['id', 'name', 'description', 'tools', 'module_type', 'parent_id', 'order_index']);

        return response()->json([
            'classroom' => [
                'id' => $classroom->id,
                'name' => $classroom->name,
                'tutor_id' => $classroom->tutor_id,
            ],
            'students' => $students->map(fn($s) => [
                'id' => $s->id,
                'name' => $s->name,
                'email' => $s->email,
                'avatar' => $s->avatar_url,
                'default_status' => 'hadir',
            ]),
            'modules' => $modules,
        ]);
    }

    /**
     * Menyimpan absensi per pertemuan untuk seluruh murid dalam kelas
     */
    public function store(Request $request, Classroom $classroom): RedirectResponse
    {
        /** @var User $tutor */
        $tutor = Auth::user();

        $validated = $request->validate([
            'date' => ['required', 'date'],
            'date_string' => ['nullable', 'string', 'max:255'],
            'module_id' => ['nullable', 'exists:modules,id'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'tools' => ['nullable', 'array'],
            'tools.*' => ['string', 'max:255'],
            'attendances' => ['required', 'array', 'min:1'],
            'attendances.*.student_id' => ['required', 'exists:users,id'],
            'attendances.*.status' => ['required', Rule::in(['hadir', 'absen'])],
            'attendances.*.note' => ['nullable', 'string', 'max:500'],
        ]);

        $dateCarbon = Carbon::parse($validated['date'])->locale('id');
        $dateString = !empty($validated['date_string'])
            ? $validated['date_string']
            : $dateCarbon->translatedFormat('l, d F Y');

        $moduleId = $validated['module_id'] ?? null;
        $tools = $validated['tools'] ?? null;

        // Jika modul dipilih dan tools tidak disediakan, gunakan tools dari modul tersebut
        if ($moduleId && empty($tools)) {
            $selectedMod = Module::find($moduleId);
            if ($selectedMod && !empty($selectedMod->tools)) {
                $tools = $selectedMod->tools;
            }
        }

        DB::transaction(function () use ($validated, $classroom, $tutor, $dateString, $moduleId, $tools) {
            foreach ($validated['attendances'] as $item) {
                $studentId = $item['student_id'];
                $status = $item['status']; // 'hadir' atau 'absen' (tidak hadir)
                $note = !empty($item['note']) ? trim($item['note']) : null;

                // Tentukan tutor penanggung jawab sesi:
                // Prioritas: tutor yang login (jika role tutor), atau tutor wali kelas, atau student tutor
                $student = User::find($studentId);
                $assignedTutorId = $tutor->role === 'tutor'
                    ? $tutor->id
                    : ($student?->tutor_id ?? $classroom->tutor_id ?? $tutor->id);

                /** @var LearningSession $session */
                $session = LearningSession::create([
                    'user_id' => $studentId,
                    'tutor_id' => $assignedTutorId,
                    'classroom_id' => $classroom->id,
                    'title' => $validated['title'],
                    'date' => $validated['date'],
                    'date_string' => $dateString,
                    'status' => $status,
                    'description' => $validated['description'] ?? null,
                    'admin_note_for_tutor' => $note,
                    'tools' => $tools,
                ]);

                if ($moduleId) {
                    $session->modules()->sync([$moduleId]);
                }
            }
        });

        $totalMurid = count($validated['attendances']);
        $hadirCount = collect($validated['attendances'])->where('status', 'hadir')->count();
        $tidakHadirCount = $totalMurid - $hadirCount;

        return back()->with(
            'success',
            "Presensi pertemuan '{$validated['title']}' berhasil disimpan untuk {$totalMurid} murid ({$hadirCount} Hadir, {$tidakHadirCount} Tidak Hadir)."
        );
    }
}
