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
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Symfony\Component\HttpFoundation\StreamedResponse;

class StudentBulkImportService
{
    /**
     * Parse and import student data from an Excel/CSV spreadsheet.
     *
     * @return array{success: bool, imported_count: int, errors: array<string>}
     */
    public function import(UploadedFile $file): array
    {
        $spreadsheet = IOFactory::load($file->getRealPath());
        $worksheet = $spreadsheet->getActiveSheet();
        $rows = $worksheet->toArray(null, true, true, true);

        if (count($rows) <= 1) {
            return [
                'success' => false,
                'imported_count' => 0,
                'errors' => ['File spreadsheet kosong atau hanya memiliki header.'],
            ];
        }

        // Expected headers in first row
        // A: Nama Lengkap, B: Email, C: Password, D: Kelas, E: Modul, F: Jadwal, G: Tutor
        $firstRow = array_shift($rows);
        $errors = [];
        $validRows = [];
        $seenEmails = [];
        $rowNumber = 1;

        foreach ($rows as $data) {
            $rowNumber++;

            $name = trim((string) ($data['A'] ?? ''));
            $email = strtolower(trim((string) ($data['B'] ?? '')));
            $password = trim((string) ($data['C'] ?? ''));
            $className = trim((string) ($data['D'] ?? ''));
            $moduleName = trim((string) ($data['E'] ?? ''));
            $scheduleRaw = trim((string) ($data['F'] ?? ''));
            $tutorIdentifier = trim((string) ($data['G'] ?? ''));

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
                $errors[] = "Baris {$rowNumber}: Email '{$email}' duplikat di dalam file Excel.";
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

            // Parse Jadwal jika diisi
            $parsedDate = null;
            if ($scheduleRaw !== '') {
                $parsedDate = $this->parseDate($scheduleRaw);
                if (! $parsedDate) {
                    $errors[] = "Baris {$rowNumber}: Format jadwal/tanggal '{$scheduleRaw}' tidak valid (Gunakan format YYYY-MM-DD atau DD/MM/YYYY).";
                }
            }

            $validRows[] = [
                'row' => $rowNumber,
                'name' => $name,
                'email' => $email,
                'password' => $password,
                'class_name' => $className,
                'module_name' => $moduleName,
                'schedule_date' => $parsedDate,
                'tutor_identifier' => $tutorIdentifier,
            ];
        }

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

                // 5. Buat Jadwal Pertemuan / LearningSession jika tanggal ada
                if ($item['schedule_date']) {
                    /** @var Carbon $dateCarbon */
                    $dateCarbon = $item['schedule_date'];
                    $session = LearningSession::create([
                        'user_id' => $student->id,
                        'tutor_id' => $tutorId,
                        'title' => $item['module_name'] !== '' ? "Sesi: {$item['module_name']}" : "Sesi Pembelajaran {$student->name}",
                        'date_string' => $dateCarbon->translatedFormat('l, d F Y'),
                        'date' => $dateCarbon->toDateString(),
                        'status' => 'akan-datang',
                    ]);

                    if ($module) {
                        $session->modules()->sync([$module->id]);
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
     * Download Excel template for bulk student import.
     */
    public function downloadTemplate(): StreamedResponse
    {
        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle('Template Siswa Baru');

        // Headers
        $headers = [
            'A1' => 'Nama Lengkap',
            'B1' => 'Email',
            'C1' => 'Password',
            'D1' => 'Kelas',
            'E1' => 'Modul',
            'F1' => 'Jadwal',
            'G1' => 'Tutor',
        ];

        foreach ($headers as $cell => $text) {
            $sheet->setCellValue($cell, $text);
        }

        // Header Styling
        $headerRange = 'A1:G1';
        $sheet->getStyle($headerRange)->getFont()->setBold(true)->getColor()->setRGB('FFFFFF');
        $sheet->getStyle($headerRange)->getFill()
            ->setFillType(Fill::FILL_SOLID)
            ->getStartColor()->setRGB('0D9488'); // Teal-600
        $sheet->getStyle($headerRange)->getAlignment()
            ->setHorizontal(Alignment::HORIZONTAL_CENTER)
            ->setVertical(Alignment::VERTICAL_CENTER);

        // Contoh baris data
        $sampleData = [
            ['Ahmad Fauzan', 'fauzan@student.aici.id', 'password123', 'Robotik Dasar A', 'Modul 1 – Pengenalan Robotika', '2026-10-15', 'tutor@aici.id'],
            ['Clarissa Putri', 'clarissa@student.aici.id', 'password123', 'Coding AI Pemula', 'Modul AI & Machine Learning Dasar', '2026-10-18', 'tutor@aici.id'],
        ];

        $rowIndex = 2;
        foreach ($sampleData as $row) {
            $colLetter = 'A';
            foreach ($row as $val) {
                $sheet->setCellValueExplicit($colLetter . $rowIndex, $val, \PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
                $colLetter++;
            }
            $rowIndex++;
        }

        // Auto width
        foreach (range('A', 'G') as $col) {
            $sheet->getColumnDimension($col)->setAutoSize(true);
        }

        $fileName = 'template_bulk_insert_siswa_baru.xlsx';

        return response()->streamDownload(function () use ($spreadsheet) {
            $writer = new Xlsx($spreadsheet);
            $writer->save('php://output');
        }, $fileName, [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Cache-Control' => 'max-age=0',
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

        // Check if numeric (Excel serial timestamp date)
        if (is_numeric($raw)) {
            try {
                $dt = \PhpOffice\PhpSpreadsheet\Shared\Date::excelToDateTimeObject((float) $raw);
                return Carbon::instance($dt);
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
