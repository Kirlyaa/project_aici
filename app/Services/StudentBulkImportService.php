<?php

namespace App\Services;

use App\Models\Classroom;
use App\Models\LearningSession;
use App\Models\Module;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Symfony\Component\HttpFoundation\StreamedResponse;

class StudentBulkImportService
{
    /**
     * Parse and import student data from a CSV file.
     *
     * @return array{success: bool, imported_count: int, errors: array<string>}
     */
    public function import(UploadedFile $file): array
    {
        $handle = fopen($file->getRealPath(), 'r');
        if (! $handle) {
            return [
                'success' => false,
                'imported_count' => 0,
                'errors' => ['Gagal membuka berkas CSV.'],
            ];
        }

        // Baca baris pertama (header) dan deteksi delimiter (, atau ;)
        $firstLine = fgets($handle);
        if ($firstLine === false) {
            fclose($handle);
            return [
                'success' => false,
                'imported_count' => 0,
                'errors' => ['Berkas CSV kosong atau tidak terbaca.'],
            ];
        }

        // Hapus UTF-8 BOM jika ada
        if (str_starts_with($firstLine, "\xEF\xBB\xBF")) {
            $firstLine = substr($firstLine, 3);
        }

        $delimiter = (strpos($firstLine, ';') !== false && strpos($firstLine, ',') === false) ? ';' : ',';
        $headerFields = str_getcsv(trim($firstLine), $delimiter);

        $errors = [];
        $validRows = [];
        $seenEmails = [];
        $rowNumber = 1;

        while (($row = fgetcsv($handle, 0, $delimiter)) !== false) {
            $rowNumber++;

            // Jika baris kosong atau hanya 1 elemen null/kosong
            if (empty($row) || (count($row) === 1 && trim((string)$row[0]) === '')) {
                continue;
            }

            // Expected format:
            // 0: Nama Lengkap, 1: Email, 2: Password, 3: Kelas, 4: Modul, 5: Jadwal, 6: Tutor
            $name = trim((string) ($row[0] ?? ''));
            $email = strtolower(trim((string) ($row[1] ?? '')));
            $password = trim((string) ($row[2] ?? ''));
            $className = trim((string) ($row[3] ?? ''));
            $moduleName = trim((string) ($row[4] ?? ''));
            $scheduleRaw = trim((string) ($row[5] ?? ''));
            $tutorIdentifier = trim((string) ($row[6] ?? ''));

            // Abaikan jika baris sepenuhnya kosong
            if ($name === '' && $email === '' && $password === '' && $className === '' && $scheduleRaw === '') {
                continue;
            }

            // Validasi wajib
            if ($name === '') {
                $errors[] = "Baris {$rowNumber}: Nama Lengkap wajib diisi.";
            }

            if ($email === '') {
                $errors[] = "Baris {$rowNumber}: Email wajib diisi.";
            } elseif (! filter_var($email, FILTER_VALIDATE_EMAIL)) {
                $errors[] = "Baris {$rowNumber}: Format email '{$email}' tidak valid.";
            } elseif (isset($seenEmails[$email])) {
                $errors[] = "Baris {$rowNumber}: Email '{$email}' duplikat di dalam file CSV.";
            } elseif (User::where('email', $email)->exists()) {
                $errors[] = "Baris {$rowNumber}: Email '{$email}' sudah terdaftar di sistem.";
            } else {
                $seenEmails[$email] = true;
            }

            if ($password === '') {
                $errors[] = "Baris {$rowNumber}: Password wajib diisi.";
            } elseif (strlen($password) < 6) {
                $errors[] = "Baris {$rowNumber}: Password minimal 6 karakter.";
            }

            // Parse Jadwal jika diisi (Multi-tanggal dipisahkan koma atau titik-koma)
            $parsedDates = [];
            if ($scheduleRaw !== '') {
                // Mendukung pemisah koma atau titik koma
                $separator = str_contains($scheduleRaw, ';') ? ';' : ',';
                $rawDates = array_filter(
                    array_map('trim', explode($separator, $scheduleRaw)),
                    fn($d) => $d !== ''
                );

                foreach ($rawDates as $rawDate) {
                    $dateObj = $this->parseDate($rawDate);
                    if (! $dateObj) {
                        $errors[] = "Baris {$rowNumber}: Tanggal '{$rawDate}' tidak valid (Gunakan format YYYY-MM-DD atau DD/MM/YYYY).";
                    } else {
                        $parsedDates[] = $dateObj;
                    }
                }

                // Urutkan tanggal dari paling awal ke paling akhir (ascending)
                usort($parsedDates, fn(Carbon $a, Carbon $b) => $a->timestamp <=> $b->timestamp);
            }

            $validRows[] = [
                'row' => $rowNumber,
                'name' => $name,
                'email' => $email,
                'password' => $password,
                'class_name' => $className,
                'module_name' => $moduleName,
                'schedule_dates' => $parsedDates,
                'tutor_identifier' => $tutorIdentifier,
            ];
        }

        fclose($handle);

        if (! empty($errors)) {
            return [
                'success' => false,
                'imported_count' => 0,
                'errors' => $errors,
            ];
        }

        if (empty($validRows)) {
            return [
                'success' => false,
                'imported_count' => 0,
                'errors' => ['Tidak ditemukan baris data siswa yang valid untuk diimpor.'],
            ];
        }

        // Cache lookup untuk tutor, classroom, dan module
        $tutors = User::where('role', 'tutor')->get();
        $importedCount = 0;

        DB::transaction(function () use ($validRows, $tutors, &$importedCount) {
            foreach ($validRows as $item) {
                // 1. Resolve Tutor
                $tutorId = null;
                if ($item['tutor_identifier'] !== '') {
                    $tutor = $tutors->first(function ($t) use ($item) {
                        return strcasecmp($t->email, $item['tutor_identifier']) === 0
                            || strcasecmp($t->name, $item['tutor_identifier']) === 0
                            || stripos($t->name, $item['tutor_identifier']) !== false;
                    });
                    if ($tutor) {
                        $tutorId = $tutor->id;
                    }
                }

                // 2. Resolve Classroom
                $classroomId = null;
                $className = $item['class_name'] !== '' ? $item['class_name'] : null;
                if ($className) {
                    $classroom = Classroom::firstOrCreate(
                        ['name' => $className],
                        ['description' => "Kelas {$className}"]
                    );
                    $classroomId = $classroom->id;
                }

                // 3. Buat User Siswa Baru
                /** @var User $student */
                $student = User::create([
                    'name' => $item['name'],
                    'email' => $item['email'],
                    'password' => Hash::make($item['password']),
                    'role' => 'user',
                    'status' => 'aktif',
                    'class' => $className,
                    'classroom_id' => $classroomId,
                    'tutor_id' => $tutorId,
                ]);

                // 4. Resolve Module jika ada
                $module = null;
                if ($item['module_name'] !== '') {
                    $module = Module::where('name', $item['module_name'])
                        ->orWhere('name', 'like', "%{$item['module_name']}%")
                        ->first();

                    if (! $module) {
                        $isCoding = (bool) preg_match('/coding|program|ai|python|scratch/i', $item['module_name']);
                        $module = Module::create([
                            'name' => $item['module_name'],
                            'module_type' => $isCoding ? 'coding' : 'robot',
                            'format' => 'PDF',
                            'size' => '2.5 MB',
                        ]);
                    }
                }

                // 5. Buat Jadwal Pertemuan / LearningSession (Looping Dinamis Multi-Tanggal)
                if (! empty($item['schedule_dates'])) {
                    $totalDates = count($item['schedule_dates']);
                    foreach ($item['schedule_dates'] as $index => $dateCarbon) {
                        /** @var Carbon $dateCarbon */
                        $meetingNumber = $index + 1;
                        $sessionTitle = $item['module_name'] !== ''
                            ? "Pertemuan {$meetingNumber}: {$item['module_name']}"
                            : "Pertemuan {$meetingNumber}: Sesi Pembelajaran {$student->name}";

                        $session = LearningSession::create([
                            'user_id' => $student->id,
                            'tutor_id' => $tutorId,
                            'title' => $sessionTitle,
                            'date_string' => $dateCarbon->translatedFormat('l, d F Y'),
                            'date' => $dateCarbon->toDateString(),
                            'status' => 'akan-datang',
                        ]);

                        if ($module) {
                            $session->modules()->sync([$module->id]);
                        }
                    }
                }

                $importedCount++;
            }
        });

        return [
            'success' => true,
            'imported_count' => $importedCount,
            'errors' => [],
        ];
    }

    /**
     * Download CSV template for bulk student import.
     */
    public function downloadTemplate(): StreamedResponse
    {
        $headers = [
            'Nama Lengkap',
            'Email',
            'Password',
            'Kelas',
            'Modul',
            'Jadwal',
            'Tutor',
        ];

        $sampleData = [
            [
                'Ahmad Fauzan',
                'fauzan@student.aici.id',
                'password123',
                'Robotik Dasar A',
                'Modul 1 – Pengenalan Robotika',
                '2026-10-15, 2026-10-22, 2026-10-29, 2026-11-05, 2026-11-12, 2026-11-19, 2026-11-26, 2026-12-03',
                'tutor@aici.id',
            ],
            [
                'Clarissa Putri',
                'clarissa@student.aici.id',
                'password123',
                'Coding AI Pemula',
                'Modul AI & Machine Learning Dasar',
                '2026-10-18, 2026-10-25, 2026-11-01, 2026-11-08',
                'tutor@aici.id',
            ],
        ];

        $fileName = 'template_bulk_insert_siswa_baru.csv';

        return response()->streamDownload(function () use ($headers, $sampleData) {
            $file = fopen('php://output', 'w');
            fprintf($file, chr(0xEF) . chr(0xBB) . chr(0xBF)); // UTF-8 BOM
            fputcsv($file, $headers);
            foreach ($sampleData as $row) {
                fputcsv($file, $row);
            }
            fclose($file);
        }, $fileName, [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Cache-Control' => 'no-cache, no-store, must-revalidate',
        ]);
    }

    /**
     * Parse date string into Carbon instance.
     */
    protected function parseDate(string $raw): ?Carbon
    {
        $raw = trim($raw);
        if ($raw === '') {
            return null;
        }

        // Check if numeric (Excel serial timestamp date if converted from spreadsheet)
        if (is_numeric($raw)) {
            try {
                if (class_exists(\PhpOffice\PhpSpreadsheet\Shared\Date::class)) {
                    $dt = \PhpOffice\PhpSpreadsheet\Shared\Date::excelToDateTimeObject((float) $raw);
                    return Carbon::instance($dt);
                }
            } catch (\Exception) {
                // fallback
            }
        }

        $formats = ['Y-m-d', 'd/m/Y', 'd-m-Y', 'Y/m/d'];
        foreach ($formats as $fmt) {
            try {
                $parsed = Carbon::createFromFormat($fmt, $raw);
                if ($parsed && $parsed->format($fmt) === $raw) {
                    return $parsed;
                }
            } catch (\Exception) {
                continue;
            }
        }

        try {
            return Carbon::parse($raw);
        } catch (\Exception) {
            return null;
        }
    }
}
