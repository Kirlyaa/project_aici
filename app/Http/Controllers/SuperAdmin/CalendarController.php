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
                    'admin_note_for_tutor' => $s->admin_note_for_tutor,
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

        DB::transaction(function () use ($session, $validated) {
            $session->update([
                'user_id' => $validated['student_id'],
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
    public function downloadTemplate()
    {
        $headers = [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="template_bulk_jadwal_kalender.csv"',
        ];

        $callback = function () {
            $file = fopen('php://output', 'w');
            // Header kolom
            fputcsv($file, ['tanggal', 'status', 'judul', 'modul', 'email_murid']);

            // Baris contoh lengkap berbagai status
            fputcsv($file, ['2026-10-05', 'hadir', 'Pengenalan Robotik Dasar', 'Modul 1 – Pengenalan Robotika', 'student@aici.id']);
            fputcsv($file, ['2026-10-12', 'hadir', 'Sensor & Motor Driver', 'Modul 2 – Sensor & Aktuator', 'student@aici.id']);
            fputcsv($file, ['2026-10-19', 'libur', 'Libur Nasional', '', 'student@aici.id']);
            fputcsv($file, ['2026-10-26', 'reschedule', 'Pemrograman Pergerakan Robot', 'Modul 3 – Kontrol Motor', 'student@aici.id']);
            fputcsv($file, ['2026-11-02', 'akan-datang', 'Navigasi Line Follower', 'Modul 4 – Algoritma Garis', 'student@aici.id']);
            fputcsv($file, ['2026-11-09', 'akan-datang', 'Proyek Akhir & Presentasi', 'Modul 5 – Final Project Robotika', 'student@aici.id']);

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    /**
     * R10: Import jadwal via CSV (Mendukung pemisah koma / titik koma dan header fleksibel).
     * Format: tanggal,status,judul,modul,email_murid
     */
    public function importCsv(Request $request): RedirectResponse
    {
        $request->validate([
            'csv_file' => ['required', 'file', 'max:5120'], // mimes dihandle manual agar mendukung berbagai sistem OS/Excel
        ]);

        $file = $request->file('csv_file');
        $filePath = $file->getRealPath();

        // Deteksi delimiter (koma ',' atau titik koma ';')
        $firstLine = fgets(fopen($filePath, 'r'));
        $delimiter = strpos($firstLine, ';') !== false && strpos($firstLine, ',') === false ? ';' : ',';

        $handle = fopen($filePath, 'r');
        $errors = [];
        $imported = 0;
        $row = 0;

        // Skip baris header
        fgetcsv($handle, 0, $delimiter);

        DB::transaction(function () use ($handle, $delimiter, &$errors, &$imported, &$row) {
            while (($data = fgetcsv($handle, 0, $delimiter)) !== false) {
                $row++;

                // Abaikan baris kosong
                if (empty($data) || (count($data) === 1 && trim($data[0]) === '')) {
                    continue;
                }

                if (count($data) < 5) {
                    $errors[] = "Baris {$row}: Format tidak lengkap (wajib 5 kolom: tanggal, status, judul, modul, email_murid).";
                    continue;
                }

                [$tanggal, $status, $judul, $modulNama, $emailMurid] = array_map(fn($v) => trim((string)$v), array_slice($data, 0, 5));

                // Normalisasi & validasi tanggal (support format YYYY-MM-DD atau DD/MM/YYYY)
                $dateCarbon = null;
                try {
                    if (preg_match('/^\d{4}-\d{2}-\d{2}$/', $tanggal)) {
                        $dateCarbon = \Carbon\Carbon::createFromFormat('Y-m-d', $tanggal);
                    } elseif (preg_match('/^\d{2}\/\d{2}\/\d{4}$/', $tanggal)) {
                        $dateCarbon = \Carbon\Carbon::createFromFormat('d/m/Y', $tanggal);
                    } elseif (preg_match('/^\d{2}-\d{2}-\d{4}$/', $tanggal)) {
                        $dateCarbon = \Carbon\Carbon::createFromFormat('d-m-Y', $tanggal);
                    }
                } catch (\Exception $e) {
                    $dateCarbon = null;
                }

                if (! $dateCarbon) {
                    $errors[] = "Baris {$row}: Format tanggal '{$tanggal}' tidak valid. Gunakan format YYYY-MM-DD (contoh: 2026-10-05).";
                    continue;
                }

                $isoDate = $dateCarbon->toDateString();

                // Normalisasi & validasi status
                $statusNormalized = strtolower(str_replace(' ', '-', $status));
                $validStatuses = ['hadir', 'absen', 'reschedule', 'libur', 'akan-datang'];
                if (! in_array($statusNormalized, $validStatuses, true)) {
                    $errors[] = "Baris {$row}: Status '{$status}' tidak valid. Pilihan: " . implode(', ', $validStatuses);
                    continue;
                }

                // Validasi murid
                $student = User::where('email', $emailMurid)->where('role', 'user')->first();
                if (! $student) {
                    $errors[] = "Baris {$row}: Murid dengan email '{$emailMurid}' tidak ditemukan.";
                    continue;
                }

                // Format date string yang ramah dibaca (contoh: Sabtu, 24 Oktober 2026)
                $humanDateString = $dateCarbon->translatedFormat('l, d F Y');

                // Buat sesi pembelajaran (otomatis kaitkan ke tutor murid jika ada)
                $session = LearningSession::create([
                    'user_id' => $student->id,
                    'tutor_id' => $student->tutor_id,
                    'title' => $judul ?: ('Sesi ' . $isoDate),
                    'date_string' => $humanDateString,
                    'date' => $isoDate,
                    'status' => $statusNormalized,
                ]);

                // Hubungkan modul jika terisi di CSV
                if (! empty($modulNama)) {
                    // 1. Cari exact match atau kemiripan kata kunci
                    $modul = Module::where('name', $modulNama)
                        ->orWhere('name', 'like', "%{$modulNama}%")
                        ->first();

                    // 2. Jika tidak ditemukan, otomatis buat modul baru persis seperti seeder
                    if (! $modul) {
                        $isCoding = preg_match('/coding|program|ai|algoritma|scratch|python/i', $modulNama);
                        $modul = Module::create([
                            'name' => $modulNama,
                            'module_type' => $isCoding ? 'coding' : 'robot',
                            'format' => 'PDF',
                            'size' => '4.2 MB',
                        ]);
                    }

                    $session->modules()->sync([$modul->id]);
                }

                $imported++;
            }
        });

        fclose($handle);

        $message = "Sukses mengimpor {$imported} jadwal sesi secara massal.";
        if (! empty($errors)) {
            $message .= " (Terdapat " . count($errors) . " peringatan/baris dilewati).";
            return back()->with('success', $message)->with('csv_errors', $errors);
        }

        return back()->with('success', $message);
    }
}
