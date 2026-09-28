<?php

namespace App\Services;

use App\Models\LearningSession;
use App\Models\Module;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use PhpOffice\PhpSpreadsheet\Cell\Coordinate;
use PhpOffice\PhpSpreadsheet\Cell\DataType;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Reader\Csv as CsvReader;
use PhpOffice\PhpSpreadsheet\Shared\Date as ExcelDate;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Symfony\Component\HttpFoundation\StreamedResponse;

class CalendarBulkImportService
{
    /**
     * Download formatted Excel (.xlsx) template for bulk calendar schedule import.
     * Styling matches AICI standard with Teal-600 header and formatted sample data.
     */
    public function downloadTemplate(): StreamedResponse
    {
        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle('Template Jadwal Kalender');

        // Headers
        // A: Tanggal, B: Status, C: Judul Pertemuan, D: Modul, E: Email Murid, F: Tutor, G: Catatan
        $headers = [
            'A1' => 'Tanggal',
            'B1' => 'Status',
            'C1' => 'Judul Pertemuan',
            'D1' => 'Modul',
            'E1' => 'Email Murid',
            'F1' => 'Tutor',
            'G1' => 'Catatan',
        ];

        foreach ($headers as $cell => $text) {
            $sheet->setCellValue($cell, $text);
        }

        // Header Styling - Teal-600 background, bold white text, centered
        $headerRange = 'A1:G1';
        $sheet->getStyle($headerRange)->applyFromArray([
            'font' => [
                'bold' => true,
                'color' => ['rgb' => 'FFFFFF'],
                'size' => 11,
            ],
            'fill' => [
                'fillType' => Fill::FILL_SOLID,
                'startColor' => ['rgb' => '0D9488'], // Teal-600 (Signature AICI green/teal)
            ],
            'alignment' => [
                'horizontal' => Alignment::HORIZONTAL_CENTER,
                'vertical' => Alignment::VERTICAL_CENTER,
            ],
            'borders' => [
                'allBorders' => [
                    'borderStyle' => Border::BORDER_THIN,
                    'color' => ['rgb' => '0F766E'], // Teal-700
                ],
            ],
        ]);
        $sheet->getRowDimension(1)->setRowHeight(28);

        // Sample Data Rows (Using same students & modules from student import template)
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
                'reschedule',
                'Pertemuan 3 – Pemrograman Kontrol Motor',
                'Modul 1 – Pengenalan Robotika',
                'fauzan@student.aici.id',
                'tutor@aici.id',
                'Dijadwalkan ulang atas permohonan siswa',
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

        $rowIdx = 2;
        foreach ($sampleData as $row) {
            $colLetter = 'A';
            foreach ($row as $val) {
                $sheet->setCellValueExplicit($colLetter . $rowIdx, $val, DataType::TYPE_STRING);
                $colLetter++;
            }
            $sheet->getRowDimension($rowIdx)->setRowHeight(22);
            $rowIdx++;
        }

        $lastRow = $rowIdx - 1;
        $dataRange = "A2:G{$lastRow}";
        $sheet->getStyle($dataRange)->applyFromArray([
            'alignment' => [
                'vertical' => Alignment::VERTICAL_CENTER,
            ],
            'borders' => [
                'allBorders' => [
                    'borderStyle' => Border::BORDER_THIN,
                    'color' => ['rgb' => 'E2E8F0'],
                ],
            ],
        ]);

        // Center align for Tanggal (col A) and Status (col B)
        $sheet->getStyle("A2:B{$lastRow}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);

        // Auto width for columns
        foreach (range('A', 'G') as $col) {
            $sheet->getColumnDimension($col)->setAutoSize(true);
        }

        $fileName = 'template_bulk_jadwal_kalender.xlsx';

        return response()->streamDownload(
            function () use ($spreadsheet) {
                $writer = new Xlsx($spreadsheet);
                $writer->save('php://output');
            },
            $fileName,
            [
                'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Cache-Control' => 'max-age=0',
            ]
        );
    }

    /**
     * Parse and import calendar schedule entries from Excel (.xlsx, .xls) or CSV file.
     *
     * @return array{success: bool, imported_count: int, errors: array<string>, warnings: array<string>}
     */
    public function import(UploadedFile $file): array
    {
        $filePath = $file->getRealPath();
        $extension = strtolower($file->getClientOriginalExtension());

        try {
            if (in_array($extension, ['csv', 'txt'], true)) {
                $reader = new CsvReader();
                $firstLine = fgets(fopen($filePath, 'r'));
                $delimiter = (strpos($firstLine, ';') !== false && strpos($firstLine, ',') === false) ? ';' : ',';
                $reader->setDelimiter($delimiter);
                $spreadsheet = $reader->load($filePath);
            } else {
                $spreadsheet = IOFactory::load($filePath);
            }
        } catch (\Throwable $e) {
            return [
                'success' => false,
                'imported_count' => 0,
                'errors' => ['Gagal membaca file spreadsheet: ' . $e->getMessage()],
                'warnings' => [],
            ];
        }

        $sheet = $spreadsheet->getActiveSheet();
        $highestRow = $sheet->getHighestRow();

        if ($highestRow <= 1) {
            return [
                'success' => false,
                'imported_count' => 0,
                'errors' => ['File spreadsheet kosong atau hanya memiliki baris header.'],
                'warnings' => [],
            ];
        }

        // Map header columns dynamically
        $headerMap = $this->resolveHeaderColumns($sheet);

        $errors = [];
        $warnings = [];
        $validSessions = [];
        $validStatuses = ['hadir', 'absen', 'libur', 'reschedule', 'akan-datang'];

        // Preload students and tutors for fast lookup
        $studentsByEmail = User::where('role', 'user')->get()->keyBy(fn($u) => strtolower(trim($u->email)));
        $tutorsByEmail = User::where('role', 'tutor')->get()->keyBy(fn($u) => strtolower(trim($u->email)));
        $tutors = User::where('role', 'tutor')->get();

        for ($row = 2; $row <= $highestRow; $row++) {
            $tanggalRaw   = $this->getCellValue($sheet->getCell("{$headerMap['date']}{$row}"));
            $statusRaw    = $this->getCellValue($sheet->getCell("{$headerMap['status']}{$row}"));
            $judul        = $this->getCellValue($sheet->getCell("{$headerMap['title']}{$row}"));
            $modulNama    = $this->getCellValue($sheet->getCell("{$headerMap['module']}{$row}"));
            $emailMurid   = strtolower($this->getCellValue($sheet->getCell("{$headerMap['student_email']}{$row}")));
            $tutorRaw     = $this->getCellValue($sheet->getCell("{$headerMap['tutor']}{$row}"));
            $adminNote    = $this->getCellValue($sheet->getCell("{$headerMap['note']}{$row}"));

            // Skip completely empty rows
            if ($tanggalRaw === '' && $statusRaw === '' && $emailMurid === '') {
                continue;
            }

            if ($tanggalRaw === '') {
                $errors[] = "Baris {$row}: Tanggal wajib diisi.";
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
                    $errors[] = "Baris {$row}: Format tanggal '{$dateStr}' tidak valid. Gunakan format YYYY-MM-DD atau DD/MM/YYYY.";
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
                $errors[] = "Baris {$row}: Status '{$statusRaw}' tidak valid. Pilihan: " . implode(', ', $validStatuses);
                continue;
            }

            // Validasi email murid
            if ($emailMurid === '') {
                $errors[] = "Baris {$row}: Email Murid wajib diisi.";
                continue;
            }

            if (! isset($studentsByEmail[$emailMurid])) {
                $errors[] = "Baris {$row}: Murid dengan email '{$emailMurid}' tidak ditemukan di sistem.";
                continue;
            }

            $student = $studentsByEmail[$emailMurid];
            $tutorId = $student->tutor_id;

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
                        $warnings[] = "Baris {$row}: Tutor '{$tutorRaw}' tidak ditemukan, menggunakan tutor binaan murid.";
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
                    'row' => $row,
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
                'errors' => ['File spreadsheet tidak memuat baris jadwal yang valid untuk diimpor.'],
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
     * Map header columns dynamically by header name or fall back to positional defaults.
     *
     * @param \PhpOffice\PhpSpreadsheet\Worksheet\Worksheet $sheet
     * @return array<string, string>
     */
    protected function resolveHeaderColumns($sheet): array
    {
        $highestColumn = $sheet->getHighestColumn();
        $highestColumnIndex = Coordinate::columnIndexFromString($highestColumn);

        $map = [
            'date' => null,
            'status' => null,
            'title' => null,
            'module' => null,
            'student_email' => null,
            'tutor' => null,
            'note' => null,
        ];

        for ($col = 1; $col <= $highestColumnIndex; $col++) {
            $colLetter = Coordinate::stringFromColumnIndex($col);
            $header = strtolower(trim((string) $sheet->getCell("{$colLetter}1")->getValue()));

            if ($map['date'] === null && preg_match('/tanggal|date|jadwal/i', $header)) {
                $map['date'] = $colLetter;
            } elseif ($map['status'] === null && preg_match('/status|kehadiran/i', $header)) {
                $map['status'] = $colLetter;
            } elseif ($map['title'] === null && preg_match('/judul|title|topik|nama sesi|pertemuan/i', $header)) {
                $map['title'] = $colLetter;
            } elseif ($map['module'] === null && preg_match('/modul|module/i', $header)) {
                $map['module'] = $colLetter;
            } elseif ($map['student_email'] === null && (preg_match('/murid|siswa|student|email_murid/i', $header) || ($header === 'email' && $map['tutor'] !== $colLetter))) {
                $map['student_email'] = $colLetter;
            } elseif ($map['tutor'] === null && preg_match('/tutor|pengajar|guru/i', $header)) {
                $map['tutor'] = $colLetter;
            } elseif ($map['note'] === null && preg_match('/catatan|note|keterangan|admin/i', $header)) {
                $map['note'] = $colLetter;
            }
        }

        // Positional defaults (compatible with old 5-column CSV: tanggal, status, judul, modul, email_murid)
        $map['date']          = $map['date'] ?? 'A';
        $map['status']        = $map['status'] ?? 'B';
        $map['title']         = $map['title'] ?? 'C';
        $map['module']        = $map['module'] ?? 'D';
        $map['student_email'] = $map['student_email'] ?? 'E';
        $map['tutor']         = $map['tutor'] ?? 'F';
        $map['note']          = $map['note'] ?? 'G';

        return $map;
    }

    /**
     * Safely read cell value supporting dates, numbers, and strings.
     *
     * @param \PhpOffice\PhpSpreadsheet\Cell\Cell|null $cell
     */
    protected function getCellValue($cell): string
    {
        if ($cell === null) {
            return '';
        }

        if (ExcelDate::isDateTime($cell)) {
            try {
                $dt = ExcelDate::excelToDateTimeObject($cell->getValue());
                return $dt->format('Y-m-d');
            } catch (\Throwable $e) {
                // fall through
            }
        }

        $val = $cell->getValue();
        if ($val === null) {
            return '';
        }

        if (is_numeric($val) && (float) $val > 30000 && (float) $val < 60000) {
            try {
                $dt = ExcelDate::excelToDateTimeObject((float) $val);
                return $dt->format('Y-m-d');
            } catch (\Throwable $e) {
                // fall through
            }
        }

        return trim((string) $val);
    }

    /**
     * Parse date string supporting ISO, common Indonesian formats, and Excel timestamps.
     */
    protected function parseDate(string $raw): ?Carbon
    {
        $raw = trim($raw);
        if ($raw === '') {
            return null;
        }

        // Numeric Excel timestamp serial
        if (is_numeric($raw) && (float) $raw > 30000 && (float) $raw < 60000) {
            try {
                $dt = ExcelDate::excelToDateTimeObject((float) $raw);
                return Carbon::instance($dt);
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

