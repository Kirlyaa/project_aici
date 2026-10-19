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

            // Jika seluruh baris terbungkus tanda petik (misal copy-paste dari Excel atau Google Sheets),
            // fgetcsv menganggap 1 baris utuh sebagai 1 kolom tunggal. Kita re-parse string di dalamnya.
            if (count($row) === 1 && (str_contains($row[0], ',') || str_contains($row[0], ';'))) {
                $innerDelimiter = (strpos($row[0], ';') !== false && strpos($row[0], ',') === false) ? ';' : ',';
                $row = str_getcsv($row[0], $innerDelimiter);
            }

            if (count($row) > 8) {
                $row = $this->normalizeUnquotedMultiValueRow($row);
            }

                // Format dukung:
            // Baru: Nama Lengkap, Email, Password, Kelas, Modul, Sub Modul, Jadwal, Tutor
            // Lama: Nama Lengkap, Email, Password, Kelas, Modul, Jadwal, Tutor
            $name = trim((string) ($row[0] ?? ''));
            $email = strtolower(trim((string) ($row[1] ?? '')));
            if ($email === '') {
                $email = $this->generateUniqueEmail($name, $rowNumber);
            }
            $password = trim((string) ($row[2] ?? ''));
            $className = trim((string) ($row[3] ?? ''));
            $moduleName = trim((string) ($row[4] ?? ''));

            if (count($row) >= 8) {
                $subModuleRaw = trim((string) ($row[5] ?? ''));
                $scheduleRaw = trim((string) ($row[6] ?? ''));
                $tutorIdentifier = trim((string) ($row[7] ?? ''));
            } else {
                $subModuleRaw = '';
                $scheduleRaw = trim((string) ($row[5] ?? ''));
                $tutorIdentifier = trim((string) ($row[6] ?? ''));
            }

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
                continue;
            } else {
                $existingUser = User::withTrashed()->where('email', $email)->first();
                if ($existingUser && $existingUser->role !== 'user') {
                    $errors[] = "Baris {$rowNumber}: Email '{$email}' sudah terdaftar di sistem.";
                } else {
                    $seenEmails[$email] = true;
                }
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

            $subModuleNames = $this->parseList($subModuleRaw, [';', '|', "\n"]);
            if (empty($subModuleNames) && $moduleName !== '') {
                $subModuleNames = [$moduleName];
            }

            $validRows[] = [
                'row' => $rowNumber,
                'name' => $name,
                'email' => $email,
                'password' => $password,
                'class_name' => $className,
                'module_name' => $moduleName,
                'submodule_names' => $subModuleNames,
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

                // 2. Resolve Classroom(s)
                $classroomIds = [];
                $classNames = $this->parseList((string) ($item['class_name'] ?? ''), [';', '|', "\n", ',']);
                if (empty($classNames) && ($item['class_name'] ?? '') !== '') {
                    $classNames = [(string) $item['class_name']];
                }

                foreach ($classNames as $className) {
                    $cleanClassName = trim((string) $className);
                    if ($cleanClassName === '') {
                        continue;
                    }

                    $classroom = Classroom::firstOrCreate(
                        ['name' => $cleanClassName],
                        ['description' => "Kelas {$cleanClassName}"]
                    );
                    $classroomIds[] = $classroom->id;
                }

                $classroomId = $classroomIds[0] ?? null;
                $primaryClassName = $classroomId ? Classroom::find($classroomId)?->name : null;

                // 3. Buat User Siswa Baru
                $studentData = [
                    'name' => $item['name'],
                    'email' => $item['email'],
                    'password' => Hash::make($item['password']),
                    'role' => 'user',
                    'status' => 'aktif',
                    'class' => $primaryClassName,
                    'classroom_id' => $classroomId,
                    'tutor_id' => $tutorId,
                ];

                /** @var User|null $student */
                $student = User::withTrashed()
                    ->where(function ($q) use ($item) {
                        $q->where('email', $item['email'])
                          ->orWhere('email', 'like', $item['email'] . '.deleted.%');
                    })
                    ->first();
                $isNewStudent = false;

                if ($student?->role === 'user') {
                    if ($student->trashed()) {
                        $student->restore();
                        $isNewStudent = true;
                    }
                    $student->update($studentData);
                } else {
                    $student = User::create($studentData);
                    $isNewStudent = true;
                }

                $student->syncClassrooms($classroomIds, $classroomId);

                // 4. Resolve Module / buku induk dan sub modul sesuai urutan jadwal
                $module = null;
                $resolvedSubModules = [];
                if ($item['module_name'] !== '') {
                    $module = Module::where(function ($query) use ($item) {
                        $query->where('name', $item['module_name'])
                            ->orWhere('book_title', $item['module_name'])
                            ->orWhere('name', 'like', "%{$item['module_name']}%")
                            ->orWhere('book_title', 'like', "%{$item['module_name']}%")
                            ->whereNull('parent_id');
                    })->first();

                    if (! $module) {
                        $module = Module::where('name', $item['module_name'])
                            ->orWhere('book_title', $item['module_name'])
                            ->first();
                    }

                    if (! $module) {
                        $isCoding = (bool) preg_match('/coding|program|ai|python|scratch/i', $item['module_name']);
                        $module = Module::create([
                            'name' => $item['module_name'],
                            'book_title' => $item['module_name'],
                            'parent_id' => null,
                            'order_index' => 1,
                            'module_type' => $isCoding ? 'coding' : 'robot',
                            'format' => 'Buku Panduan',
                            'size' => '2.5 MB',
                        ]);
                    }

                    $subModuleNames = $item['submodule_names'] ?? [];
                    if (! empty($subModuleNames)) {
                        foreach ($subModuleNames as $index => $subName) {
                            $cleanName = trim((string) $subName);
                            if ($cleanName === '') {
                                continue;
                            }

                            $resolved = Module::where('name', $cleanName)
                                ->where(function ($query) use ($module) {
                                    $query->where('parent_id', $module->id)
                                        ->orWhereNull('parent_id');
                                })
                                ->first();

                            if (! $resolved) {
                                $resolved = Module::create([
                                    'name' => $cleanName,
                                    'book_title' => $module->book_title ?? $module->name,
                                    'parent_id' => $module->id,
                                    'order_index' => $index + 1,
                                    'module_type' => $module->module_type,
                                    'format' => 'Sub Modul',
                                    'description' => 'Dibuat dari import CSV siswa.',
                                ]);
                            }

                            $resolvedSubModules[] = $resolved;
                        }
                    }
                }

                // 5. Buat Jadwal Pertemuan / LearningSession (Looping Dinamis Multi-Tanggal)
                if (! empty($item['schedule_dates'])) {
                    $sessionModuleNames = ! empty($resolvedSubModules)
                        ? $resolvedSubModules
                        : ($module ? [$module] : []);

                    foreach ($item['schedule_dates'] as $index => $dateCarbon) {
                        /** @var Carbon $dateCarbon */
                        $meetingNumber = $index + 1;
                        $titleName = $sessionModuleNames[$index]->name ?? $sessionModuleNames[0]->name ?? $item['module_name'] ?? 'Sesi Pembelajaran';
                        $sessionTitle = $item['module_name'] !== ''
                            ? "Pertemuan {$meetingNumber}: {$titleName}"
                            : "Pertemuan {$meetingNumber}: Sesi Pembelajaran {$student->name}";

                        $session = LearningSession::create([
                            'user_id' => $student->id,
                            'tutor_id' => $tutorId,
                            'title' => $sessionTitle,
                            'date_string' => $dateCarbon->translatedFormat('l, d F Y'),
                            'date' => $dateCarbon->toDateString(),
                            'status' => 'akan-datang',
                        ]);

                        $sessionModuleIds = ! empty($resolvedSubModules)
                            ? [($sessionModuleNames[$index]->id ?? $resolvedSubModules[0]->id)]
                            : ($module ? [$module->id] : []);

                        if (! empty($sessionModuleIds)) {
                            $session->syncModules($sessionModuleIds);
                        }
                    }
                }

                if ($isNewStudent) {
                    $importedCount++;
                }
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
            'Sub Modul',
            'Jadwal',
            'Tutor',
        ];

        $sampleData = [
            [
                'Ahmad Fauzan',
                'fauzan@student.aici.id',
                'password123',
                'Robotik Dasar A',
                'Buku Robotika Dasar',
                'Modul 1 – Between Inches;Modul 2 – Sensor Jarak;Modul 3 – Motor Driver',
                '2026-10-15;2026-10-22;2026-10-29',
                'tutor@aici.id',
            ],
            [
                'Clarissa Putri',
                'clarissa@student.aici.id',
                'password123',
                'Coding AI Pemula',
                'Buku AI & Coding Dasar',
                'Modul 1 – Logika Komputasi;Modul 2 – Scratch;Modul 3 – Python',
                '2026-10-18;2026-10-25;2026-11-01',
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

    protected function normalizeUnquotedMultiValueRow(array $row): array
    {
        if (count($row) <= 8) {
            return $row;
        }

        $name = trim((string) ($row[0] ?? ''));
        $email = strtolower(trim((string) ($row[1] ?? '')));
        $password = trim((string) ($row[2] ?? ''));
        $className = trim((string) ($row[3] ?? ''));
        $moduleName = trim((string) ($row[4] ?? ''));

        $rest = array_slice($row, 5);
        $tutorIdentifier = trim((string) array_pop($rest));

        $subParts = [];
        $dateParts = [];
        $seenDate = false;

        foreach ($rest as $value) {
            $clean = trim((string) $value, " \t\n\r,;|");
            if ($clean === '') {
                continue;
            }

            if ($this->parseDate($clean) !== null) {
                $seenDate = true;
                $dateParts[] = $clean;
                continue;
            }

            if ($seenDate) {
                $dateParts[] = $clean;
            } else {
                $subParts[] = $clean;
            }
        }

        if (empty($subParts) && empty($dateParts) && ! empty($rest)) {
            foreach ($rest as $value) {
                $clean = trim((string) $value, " \t\n\r,;|");
                if ($clean === '') {
                    continue;
                }

                if ($this->parseDate($clean) !== null) {
                    $dateParts[] = $clean;
                } else {
                    $subParts[] = $clean;
                }
            }
        }

        return [
            $name,
            $email,
            $password,
            $className,
            $moduleName,
            implode(';', $subParts),
            implode(';', $dateParts),
            $tutorIdentifier,
        ];
    }

    protected function generateUniqueEmail(string $name, int $rowNumber): string
    {
        $base = preg_replace('/[^a-z0-9]+/i', '-', strtolower(trim($name))) ?: 'student';
        $base = trim($base, '-');
        $base = $base !== '' ? $base : 'student';

        $suffix = substr(md5($base . ':' . $rowNumber . ':' . microtime(true)), 0, 8);

        return $base . '.' . $suffix . '@student.local';
    }

    protected function parseList(string $raw, array $preferredSeparators = [';', '|', "\n", ',']): array
    {
        $value = trim($raw);
        if ($value === '') {
            return [];
        }

        foreach ($preferredSeparators as $separator) {
            if ($separator !== '' && str_contains($value, $separator)) {
                $parts = array_map('trim', explode($separator, $value));
                return array_values(array_filter($parts, fn ($part) => $part !== ''));
            }
        }

        if (str_contains($value, ',')) {
            $parts = array_map('trim', preg_split('/\s*,\s*/', $value) ?: []);
            return array_values(array_filter($parts, fn ($part) => $part !== ''));
        }

        return [$value];
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
