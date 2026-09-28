<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use Symfony\Component\HttpFoundation\StreamedResponse;

class TutorBulkImportService
{
    /**
     * Download formatted Excel template for bulk tutor onboarding.
     */
    public function downloadTemplate(): StreamedResponse
    {
        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle('Template Import Tutor');

        // Headers
        $headers = [
            'A1' => 'Nama Tutor*',
            'B1' => 'Email*',
            'C1' => 'Password (Default: aici1234)',
            'D1' => 'Status (aktif / nonaktif)',
        ];

        foreach ($headers as $cell => $text) {
            $sheet->setCellValue($cell, $text);
        }

        // Header Styling
        $headerRange = 'A1:D1';
        $sheet->getStyle($headerRange)->applyFromArray([
            'font' => [
                'bold' => true,
                'color' => ['rgb' => 'FFFFFF'],
                'size' => 11,
            ],
            'fill' => [
                'fillType' => Fill::FILL_SOLID,
                'startColor' => ['rgb' => '0D9488'], // Teal-600
            ],
            'alignment' => [
                'horizontal' => Alignment::HORIZONTAL_CENTER,
                'vertical' => Alignment::VERTICAL_CENTER,
            ],
            'borders' => [
                'allBorders' => [
                    'borderStyle' => Border::BORDER_THIN,
                    'color' => ['rgb' => '0F766E'],
                ],
            ],
        ]);
        $sheet->getRowDimension(1)->setRowHeight(28);

        // Sample Data Rows
        $sampleData = [
            ['Ahmad Fauzi, S.Kom.', 'ahmad.fauzi@aici.id', 'aici1234', 'aktif'],
            ['Siti Nurhaliza, M.Pd.', 'siti.nurhaliza@aici.id', 'aici1234', 'aktif'],
            ['Budi Santoso, S.T.', 'budi.santoso@aici.id', 'aici1234', 'aktif'],
        ];

        $rowIdx = 2;
        foreach ($sampleData as $row) {
            $sheet->setCellValue("A{$rowIdx}", $row[0]);
            $sheet->setCellValue("B{$rowIdx}", $row[1]);
            $sheet->setCellValue("C{$rowIdx}", $row[2]);
            $sheet->setCellValue("D{$rowIdx}", $row[3]);
            $rowIdx++;
        }

        // Auto size columns
        foreach (range('A', 'D') as $col) {
            $sheet->getColumnDimension($col)->setAutoSize(true);
        }

        $fileName = 'template_import_tutor_aici.xlsx';

        return response()->stream(
            function () use ($spreadsheet) {
                $writer = IOFactory::createWriter($spreadsheet, 'Xlsx');
                $writer->save('php://output');
            },
            200,
            [
                'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition' => "attachment; filename=\"{$fileName}\"",
                'Cache-Control' => 'max-age=0',
            ]
        );
    }

    /**
     * Parse and import tutors in an atomic database transaction.
     */
    public function import(UploadedFile $file): array
    {
        $filePath = $file->getRealPath();
        $spreadsheet = IOFactory::load($filePath);
        $sheet = $spreadsheet->getActiveSheet();
        $highestRow = $sheet->getHighestRow();

        $errors = [];
        $tutorsToInsert = [];
        $seenEmails = [];

        // Preload existing user emails for fast O(1) in-memory collision check
        $existingEmails = User::pluck('email')->map(fn($e) => strtolower(trim($e)))->flip()->toArray();

        for ($row = 2; $row <= $highestRow; $row++) {
            $name     = trim((string) $sheet->getCell("A{$row}")->getValue());
            $email    = strtolower(trim((string) $sheet->getCell("B{$row}")->getValue()));
            $password = trim((string) $sheet->getCell("C{$row}")->getValue());
            $status   = strtolower(trim((string) $sheet->getCell("D{$row}")->getValue()));

            // Ignore blank empty rows
            if ($name === '' && $email === '') {
                continue;
            }

            if ($name === '') {
                $errors[] = "Baris {$row}: Nama Tutor wajib diisi.";
                continue;
            }

            if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
                $errors[] = "Baris {$row}: Format email '{$email}' tidak valid.";
                continue;
            }

            if (isset($existingEmails[$email]) || isset($seenEmails[$email])) {
                $errors[] = "Baris {$row}: Email '{$email}' sudah terdaftar di sistem.";
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
                'errors' => ['File spreadsheet tidak memuat data tutor yang valid untuk diimpor.'],
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
