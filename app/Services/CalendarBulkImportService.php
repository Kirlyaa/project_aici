<?php

namespace App\Services;

use App\Models\LearningSession;
use App\Models\Module;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\StreamedResponse;

class CalendarBulkImportService
{
    /**
     * Download formatted CSV template for bulk calendar schedule import.
     */
    public function downloadTemplate(): StreamedResponse
    {
        $headers = [
            'Tanggal',
            'Status',
            'Judul Pertemuan',
            'Modul',
            'Email Murid',
            'Tutor',
            'Catatan',
        ];

        $sampleData = [
            [
                '2026-10-15',
                'hadir',
                'Pertemuan 1 – Pengenalan Robotika',
                'Modul 1 – Pengenalan Robotika',
                'fauzan@student.aici.id',
                'tutor@aici.id',
                'Sesi perdana pengenalan komponen robot',
            ],
            [
                '2026-10-22',
                'hadir',
                'Pertemuan 2 – Sensor & Motor Driver',
                'Modul 1 – Pengenalan Robotika',
                'fauzan@student.aici.id',
                'tutor@aici.id',
                'Latihan wiring sensor ultrasonik',
            ],
            [
                '2026-10-29',
                'libur',
                'Libur Nasional',
                '',
                'fauzan@student.aici.id',
                '',
                'Hari libur nasional',
            ],
            [
                '2026-11-05',
                'akan-datang',
                'Pertemuan 3 – Pemrograman Kontrol Motor',
                'Modul 1 – Pengenalan Robotika',
                'fauzan@student.aici.id',
                'tutor@aici.id',
                'Membawa kit robotika',
            ],
            [
                '2026-11-12',
                'akan-datang',
                'Pertemuan 4 – Navigasi Line Follower',
                'Modul 1 – Pengenalan Robotika',
                'fauzan@student.aici.id',
                'tutor@aici.id',
                'Membawa kit line follower',
            ],
            [
                '2026-10-18',
                'hadir',
                'Pertemuan 1 – Dasar AI & Machine Learning',
                'Modul AI & Machine Learning Dasar',
                'clarissa@student.aici.id',
                'tutor@aici.id',
                'Pengenalan konsep artificial intelligence',
            ],
            [
                '2026-10-25',
                'akan-datang',
                'Pertemuan 2 – Supervised Learning & Dataset',
                'Modul AI & Machine Learning Dasar',
                'clarissa@student.aici.id',
                'tutor@aici.id',
                'Eksplorasi dataset klasifikasi',
            ],
        ];

        $fileName = 'template_bulk_jadwal_kalender.csv';

        return response()->streamDownload(
            function () use ($headers, $sampleData) {
                $file = fopen('php://output', 'w');
                fprintf($file, chr(0xEF) . chr(0xBB) . chr(0xBF)); // UTF-8 BOM
                fputcsv($file, $headers);
                foreach ($sampleData as $row) {
                    fputcsv($file, $row);
                }
                fclose($file);
            },
            $fileName,
            [
                'Content-Type' => 'text/csv; charset=UTF-8',
                'Cache-Control' => 'no-cache, no-store, must-revalidate',
            ]
        );
    }

    /**
     * Parse and import calendar schedule entries from CSV file.
     *
     * @param UploadedFile $file
     * @param int|null $defaultTutorId Optional default tutor ID if row does not specify tutor
     * @return array{success: bool, imported_count: int, errors: array<string>, warnings: array<string>}
     */
    public function import(UploadedFile $file, ?int $defaultTutorId = null): array
    {
        $filePath = $file->getRealPath();
        $handle = fopen($filePath, 'r');
        if (! $handle) {
            return [
                'success' => false,
                'imported_count' => 0,
                'errors' => ['Tidak dapat membuka file CSV.'],
                'warnings' => [],
            ];
        }

        // Auto-detect delimiter
        $firstLine = fgets($handle);
        $delimiter = ',';
        if ($firstLine !== false) {
            $commaCount = substr_count($firstLine, ',');
            $semicolonCount = substr_count($firstLine, ';');
            if ($semicolonCount > $commaCount) {
                $delimiter = ';';
            }
        }
        rewind($handle);

        $firstRow = fgetcsv($handle, 0, $delimiter);
        if ($firstRow === false || empty($firstRow)) {
            fclose($handle);
            return [
                'success' => false,
                'imported_count' => 0,
                'errors' => ['File CSV kosong atau tidak memiliki baris data.'],
                'warnings' => [],
            ];
        }

        // Clean BOM if present on first column
        if (isset($firstRow[0])) {
            $firstRow[0] = preg_replace('/^\xEF\xBB\xBF/', '', $firstRow[0]);
        }

        $headerMap = $this->resolveHeaderColumns($firstRow);

        $errors = [];
        $warnings = [];
        $validSessions = [];
        $validStatuses = ['hadir', 'absen', 'libur', 'akan-datang'];

        // Preload students and tutors for fast lookup
        $studentsByEmail = User::where('role', 'user')->get()->keyBy(fn($u) => strtolower(trim($u->email)));
        $tutorsByEmail = User::where('role', 'tutor')->get()->keyBy(fn($u) => strtolower(trim($u->email)));
        $tutors = User::where('role', 'tutor')->get();

        $rowNumber = 1;
        while (($row = fgetcsv($handle, 0, $delimiter)) !== false) {
            $rowNumber++;

            $tanggalRaw   = isset($row[$headerMap['date']]) ? trim((string) $row[$headerMap['date']]) : '';
            $statusRaw    = isset($row[$headerMap['status']]) ? trim((string) $row[$headerMap['status']]) : '';
            $judul        = isset($row[$headerMap['title']]) ? trim((string) $row[$headerMap['title']]) : '';
            $modulNama    = isset($row[$headerMap['module']]) ? trim((string) $row[$headerMap['module']]) : '';
            $emailMurid   = isset($row[$headerMap['student_email']]) ? strtolower(trim((string) $row[$headerMap['student_email']])) : '';
            $tutorRaw     = isset($row[$headerMap['tutor']]) ? trim((string) $row[$headerMap['tutor']]) : '';
            $adminNote    = isset($row[$headerMap['note']]) ? trim((string) $row[$headerMap['note']]) : '';

            // Skip completely empty rows
            if ($tanggalRaw === '' && $statusRaw === '' && $emailMurid === '') {
                continue;
            }

            if ($tanggalRaw === '') {
                $errors[] = "Baris {$rowNumber}: Tanggal wajib diisi.";
                continue;
            }

            // Support multi-dates separated by comma (e.g. 2026-10-15, 2026-10-22)
            $dateStrings = array_filter(
                array_map('trim', explode(',', $tanggalRaw)),
                fn($d) => $d !== ''
            );

            $parsedDates = [];
            foreach ($dateStrings as $dateStr) {
                $dateCarbon = $this->parseDate($dateStr);
                if (! $dateCarbon) {
                    $errors[] = "Baris {$rowNumber}: Format tanggal '{$dateStr}' tidak valid. Gunakan format YYYY-MM-DD atau DD/MM/YYYY.";
                } else {
                    $parsedDates[] = $dateCarbon;
                }
            }

            if (empty($parsedDates) && count($dateStrings) > 0) {
                continue;
            }

            // Normalisasi & validasi status
            $statusNormalized = strtolower(str_replace(' ', '-', $statusRaw));
            if ($statusNormalized === '') {
                $statusNormalized = 'akan-datang';
            }

            if (! in_array($statusNormalized, $validStatuses, true)) {
                $errors[] = "Baris {$rowNumber}: Status '{$statusRaw}' tidak valid. Pilihan: " . implode(', ', $validStatuses);
                continue;
            }

            // Validasi email murid
            if ($emailMurid === '') {
                $errors[] = "Baris {$rowNumber}: Email Murid wajib diisi.";
                continue;
            }

            if (! isset($studentsByEmail[$emailMurid])) {
                $errors[] = "Baris {$rowNumber}: Murid dengan email '{$emailMurid}' tidak ditemukan di sistem.";
                continue;
            }

            $student = $studentsByEmail[$emailMurid];
            $tutorId = $defaultTutorId ?? $student->tutor_id;

            // Resolve Tutor jika ditentukan
            if ($tutorRaw !== '') {
                $tutorKey = strtolower($tutorRaw);
                if (isset($tutorsByEmail[$tutorKey])) {
                    $tutorId = $tutorsByEmail[$tutorKey]->id;
                } else {
                    $foundTutor = $tutors->first(function ($t) use ($tutorRaw) {
                        return strcasecmp($t->name, $tutorRaw) === 0
                            || stripos($t->name, $tutorRaw) !== false;
                    });
                    if ($foundTutor) {
                        $tutorId = $foundTutor->id;
                    } else {
                        $warnings[] = "Baris {$rowNumber}: Tutor '{$tutorRaw}' tidak ditemukan, menggunakan tutor binaan murid.";
                    }
                }
            }

            // Sort dates ascending
            usort($parsedDates, fn(Carbon $a, Carbon $b) => $a->timestamp <=> $b->timestamp);
            $totalDates = count($parsedDates);

            foreach ($parsedDates as $index => $dateCarbon) {
                $meetingNum = $index + 1;
                $title = $judul !== ''
                    ? ($totalDates > 1 && ! preg_match('/pertemuan\s*\d+/i', $judul) ? "Pertemuan {$meetingNum}: {$judul}" : $judul)
                    : ($modulNama !== '' ? ($totalDates > 1 ? "Pertemuan {$meetingNum}: {$modulNama}" : $modulNama) : ('Sesi ' . $dateCarbon->toDateString()));

                $humanDateString = $dateCarbon->translatedFormat('l, d F Y');

                $validSessions[] = [
                    'row' => $rowNumber,
                    'user_id' => $student->id,
                    'tutor_id' => $tutorId,
                    'classroom_id' => $student->classroom_id,
                    'title' => $title,
                    'date_string' => $humanDateString,
                    'date' => $dateCarbon->toDateString(),
                    'status' => $statusNormalized,
                    'admin_note_for_tutor' => $adminNote ?: null,
                    'modul_name' => $modulNama,
                ];
            }
        }

        fclose($handle);

        if (! empty($errors)) {
            return [
                'success' => false,
                'errors' => $errors,
                'warnings' => $warnings,
                'imported_count' => 0,
            ];
        }

        if (empty($validSessions)) {
            return [
                'success' => false,
                'errors' => ['File CSV tidak memuat baris jadwal yang valid untuk diimpor.'],
                'warnings' => $warnings,
                'imported_count' => 0,
            ];
        }

        $importedCount = 0;
        DB::transaction(function () use ($validSessions, &$importedCount) {
            foreach ($validSessions as $item) {
                /** @var LearningSession $session */
                $session = LearningSession::create([
                    'user_id' => $item['user_id'],
                    'tutor_id' => $item['tutor_id'],
                    'classroom_id' => $item['classroom_id'],
                    'title' => $item['title'],
                    'date_string' => $item['date_string'],
                    'date' => $item['date'],
                    'status' => $item['status'],
                    'admin_note_for_tutor' => $item['admin_note_for_tutor'],
                ]);

                if (! empty($item['modul_name'])) {
                    $modulNama = $item['modul_name'];
                    $modul = Module::where('name', $modulNama)
                        ->orWhere('name', 'like', "%{$modulNama}%")
                        ->first();

                    if (! $modul) {
                        $isCoding = (bool) preg_match('/coding|program|ai|algoritma|scratch|python/i', $modulNama);
                        $modul = Module::create([
                            'name' => $modulNama,
                            'module_type' => $isCoding ? 'coding' : 'robot',
                            'format' => 'PDF',
                            'size' => '4.2 MB',
                        ]);
                    }

                    $session->modules()->sync([$modul->id]);
                }

                $importedCount++;
            }
        });

        return [
            'success' => true,
            'errors' => [],
            'warnings' => $warnings,
            'imported_count' => $importedCount,
        ];
    }

    /**
     * Map header columns dynamically by header name or fall back to positional indices.
     *
     * @param array<int, string> $headerRow
     * @return array<string, int>
     */
    protected function resolveHeaderColumns(array $headerRow): array
    {
        $map = [
            'date' => null,
            'status' => null,
            'title' => null,
            'module' => null,
            'student_email' => null,
            'tutor' => null,
            'note' => null,
        ];

        foreach ($headerRow as $colIdx => $rawHeader) {
            $header = strtolower(trim((string) $rawHeader));

            if ($map['date'] === null && preg_match('/tanggal|date|jadwal/i', $header)) {
                $map['date'] = $colIdx;
            } elseif ($map['status'] === null && preg_match('/status|kehadiran/i', $header)) {
                $map['status'] = $colIdx;
            } elseif ($map['title'] === null && preg_match('/judul|title|topik|nama sesi|pertemuan/i', $header)) {
                $map['title'] = $colIdx;
            } elseif ($map['module'] === null && preg_match('/modul|module/i', $header)) {
                $map['module'] = $colIdx;
            } elseif ($map['student_email'] === null && (preg_match('/murid|siswa|student|email_murid/i', $header) || ($header === 'email' && $map['tutor'] !== $colIdx))) {
                $map['student_email'] = $colIdx;
            } elseif ($map['tutor'] === null && preg_match('/tutor|pengajar|guru/i', $header)) {
                $map['tutor'] = $colIdx;
            } elseif ($map['note'] === null && preg_match('/catatan|note|keterangan|admin/i', $header)) {
                $map['note'] = $colIdx;
            }
        }

        // Positional defaults (compatible with old 5-column and 7-column CSV)
        $map['date']          = $map['date'] ?? 0;
        $map['status']        = $map['status'] ?? 1;
        $map['title']         = $map['title'] ?? 2;
        $map['module']        = $map['module'] ?? 3;
        $map['student_email'] = $map['student_email'] ?? 4;
        $map['tutor']         = $map['tutor'] ?? 5;
        $map['note']          = $map['note'] ?? 6;

        return $map;
    }

    /**
     * Parse date string supporting ISO and common Indonesian formats.
     */
    protected function parseDate(string $raw): ?Carbon
    {
        $raw = trim($raw);
        if ($raw === '') {
            return null;
        }

        // Check if numeric (Excel serial timestamp date if converted from spreadsheet)
        if (is_numeric($raw) && (float) $raw > 30000 && (float) $raw < 60000) {
            try {
                if (class_exists(\PhpOffice\PhpSpreadsheet\Shared\Date::class)) {
                    $dt = \PhpOffice\PhpSpreadsheet\Shared\Date::excelToDateTimeObject((float) $raw);
                    return Carbon::instance($dt);
                }
            } catch (\Throwable $e) {
                // fall through
            }
        }

        $formats = ['Y-m-d', 'd/m/Y', 'd-m-Y', 'Y/m/d', 'm/d/Y', 'j/n/Y', 'j-n-Y'];
        foreach ($formats as $fmt) {
            try {
                $parsed = Carbon::createFromFormat($fmt, $raw);
                if ($parsed && $parsed->format($fmt) === $raw) {
                    return $parsed;
                }
            } catch (\Throwable $e) {
                // Try next format
            }
        }

        try {
            return Carbon::parse($raw);
        } catch (\Throwable $e) {
            return null;
        }
    }
}

