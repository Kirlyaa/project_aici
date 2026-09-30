<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Symfony\Component\HttpFoundation\StreamedResponse;

class TutorBulkImportService
{
    /**
     * Download CSV template for bulk tutor onboarding.
     */
    public function downloadTemplate(): StreamedResponse
    {
        $headers = [
            'Nama Tutor*',
            'Email*',
            'Password (Default: aici1234)',
            'Status (aktif / nonaktif)',
        ];

        $sampleData = [
            ['Ahmad Fauzi, S.Kom.', 'ahmad.fauzi@aici.id', 'aici1234', 'aktif'],
            ['Siti Nurhaliza, M.Pd.', 'siti.nurhaliza@aici.id', 'aici1234', 'aktif'],
            ['Budi Santoso, S.T.', 'budi.santoso@aici.id', 'aici1234', 'aktif'],
        ];

        $fileName = 'template_import_tutor_aici.csv';

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
     * Parse and import tutors from CSV in an atomic database transaction.
     */
    public function import(UploadedFile $file): array
    {
        $filePath = $file->getRealPath();
        $handle = fopen($filePath, 'r');
        if (! $handle) {
            return [
                'success' => false,
                'imported_count' => 0,
                'errors' => ['Tidak dapat membuka file CSV.'],
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

        $errors = [];
        $tutorsToInsert = [];
        $seenEmails = [];

        // Preload existing user emails for fast O(1) in-memory collision check
        $existingEmails = User::pluck('email')->map(fn($e) => strtolower(trim($e)))->flip()->toArray();

        $rowNumber = 0;
        while (($row = fgetcsv($handle, 0, $delimiter)) !== false) {
            $rowNumber++;

            // Strip UTF-8 BOM if present on first column of first row
            if ($rowNumber === 1 && isset($row[0])) {
                $row[0] = preg_replace('/^\xEF\xBB\xBF/', '', $row[0]);
            }

            // Skip header row
            if ($rowNumber === 1) {
                continue;
            }

            $name     = isset($row[0]) ? trim((string) $row[0]) : '';
            $email    = isset($row[1]) ? strtolower(trim((string) $row[1])) : '';
            $password = isset($row[2]) ? trim((string) $row[2]) : '';
            $status   = isset($row[3]) ? strtolower(trim((string) $row[3])) : '';

            // Ignore blank empty rows
            if ($name === '' && $email === '') {
                continue;
            }

            if ($name === '') {
                $errors[] = "Baris {$rowNumber}: Nama Tutor wajib diisi.";
                continue;
            }

            if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
                $errors[] = "Baris {$rowNumber}: Format email '{$email}' tidak valid.";
                continue;
            }

            if (isset($existingEmails[$email]) || isset($seenEmails[$email])) {
                $errors[] = "Baris {$rowNumber}: Email '{$email}' sudah terdaftar di sistem.";
                continue;
            }

            $seenEmails[$email] = true;

            $statusNormalized = in_array($status, ['aktif', 'nonaktif', 'pending'], true) ? $status : 'aktif';
            $plainPassword = $password !== '' ? $password : 'aici1234';

            $tutorsToInsert[] = [
                'name' => $name,
                'email' => $email,
                'password' => Hash::make($plainPassword),
                'role' => 'tutor',
                'status' => $statusNormalized,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        fclose($handle);

        if (!empty($errors)) {
            return [
                'success' => false,
                'errors' => $errors,
                'imported_count' => 0,
            ];
        }

        if (empty($tutorsToInsert)) {
            return [
                'success' => false,
                'errors' => ['File CSV tidak memuat data tutor yang valid untuk diimpor.'],
                'imported_count' => 0,
            ];
        }

        DB::transaction(function () use ($tutorsToInsert) {
            User::insert($tutorsToInsert);
        });

        return [
            'success' => true,
            'errors' => [],
            'imported_count' => count($tutorsToInsert),
        ];
    }
}
