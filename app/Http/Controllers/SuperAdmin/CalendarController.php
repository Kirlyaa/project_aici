<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Tutor\StoreLearningSessionRequest;
use App\Models\LearningSession;
use App\Models\Module;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class CalendarController extends Controller
{
    public function index(int $studentId): Response
    {
        $student = User::findOrFail($studentId);
        $sessions = LearningSession::where('user_id', $studentId)
            ->with('modules')
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
                    'tools' => $s->tools,
                    'module_ids' => $s->modules->pluck('id'),
                ];
            });

        $modules = Module::orderBy('name')->get(['id', 'name', 'module_type', 'image']);
        $students = User::where('role', 'user')
            ->whereIn('status', ['aktif', 'pending'])
            ->orderBy('name')
            ->get(['id', 'name', 'email', 'class']);

        return Inertia::render('SuperAdmin/CalendarManager', [
            'studentId' => (int) $studentId,
            'student' => ['id' => $student->id, 'name' => $student->name, 'email' => $student->email],
            'sessions' => $sessions,
            'modules' => $modules,
            'students' => $students,
        ]);
    }

    public function store(StoreLearningSessionRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        DB::transaction(function () use ($validated, $request) {
            /** @var LearningSession $session */
            $session = LearningSession::create([
                'user_id' => $validated['student_id'],
                'tutor_id' => null, // superadmin tidak punya tutor_id
                'title' => $validated['title'],
                'date_string' => $validated['date_string'],
                'date' => $validated['date'],
                'status' => $validated['status'],
                'description' => $validated['description'] ?? null,
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

        DB::transaction(function () use ($session, $validated) {
            $session->update([
                'user_id' => $validated['student_id'],
                'title' => $validated['title'],
                'date_string' => $validated['date_string'],
                'date' => $validated['date'],
                'status' => $validated['status'],
                'description' => $validated['description'] ?? null,
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
     * R10: Import jadwal via CSV.
     * Format: tanggal,status,judul,modul,email_murid
     */
    public function importCsv(Request $request): RedirectResponse
    {
        $request->validate([
            'csv_file' => ['required', 'file', 'mimes:csv,txt', 'max:2048'],
        ]);

        $file = $request->file('csv_file');
        $handle = fopen($file->getRealPath(), 'r');

        $errors = [];
        $imported = 0;
        $row = 0;

        // Skip header row
        fgetcsv($handle);

        DB::transaction(function () use ($handle, &$errors, &$imported, &$row) {
            while (($data = fgetcsv($handle)) !== false) {
                $row++;
                if (count($data) < 5) {
                    $errors[] = "Baris {$row}: Format tidak valid (kurang kolom).";
                    continue;
                }

                [$tanggal, $status, $judul, $modulNama, $emailMurid] = array_map('trim', $data);

                // Validasi tanggal
                if (! preg_match('/^\d{4}-\d{2}-\d{2}$/', $tanggal)) {
                    $errors[] = "Baris {$row}: Format tanggal tidak valid ({$tanggal}). Gunakan YYYY-MM-DD.";
                    continue;
                }

                // Validasi status
                $validStatuses = ['hadir', 'absen', 'reschedule', 'libur', 'akan-datang'];
                if (! in_array($status, $validStatuses, true)) {
                    $errors[] = "Baris {$row}: Status tidak valid ({$status}).";
                    continue;
                }

                // Cari murid
                $student = User::where('email', $emailMurid)->where('role', 'user')->first();
                if (! $student) {
                    $errors[] = "Baris {$row}: Murid dengan email {$emailMurid} tidak ditemukan.";
                    continue;
                }

                // Buat sesi
                $session = LearningSession::create([
                    'user_id' => $student->id,
                    'tutor_id' => null,
                    'title' => $judul ?: 'Sesi ' . $tanggal,
                    'date_string' => $tanggal,
                    'date' => $tanggal,
                    'status' => $status,
                ]);

                // Attach modul jika ada
                if ($modulNama) {
                    $modul = Module::where('name', $modulNama)->first();
                    if ($modul) {
                        $session->modules()->sync([$modul->id]);
                    } else {
                        $errors[] = "Baris {$row}: Modul '{$modulNama}' tidak ditemukan, sesi tetap dibuat tanpa modul.";
                    }
                }

                $imported++;
            }
        });

        fclose($handle);

        $message = "{$imported} sesi berhasil diimport.";
        if (! empty($errors)) {
            $message .= ' ' . count($errors) . ' baris gagal.';
            return back()->with('success', $message)->with('csv_errors', $errors);
        }

        return back()->with('success', $message);
    }
}
