<?php

namespace App\Services;

use App\Models\Module;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ModuleBulkImportService
{
    /**
     * Expected CSV columns:
     * 0: Nama Modul (name) [Wajib]
     * 1: Buku Induk (book_title / parent) [Opsional, jika kosong = Buku Induk / Root]
     * 2: Tipe Modul (module_type: robot, coding, general) [Wajib, default: robot]
     * 3: Urutan (order_index) [Opsional, default: 0]
     * 4: Deskripsi (description) [Opsional]
     * 5: URL / Path Gambar (image) [Opsional]
     * 6: Alat & Bahan / Tools (tools: dipisahkan koma atau titik koma) [Opsional]
     */
    public function downloadTemplate(): StreamedResponse
    {
        $headers = [
            'Nama Modul',
            'Buku Induk',
            'Tipe',
            'Urutan',
            'Deskripsi',
            'URL Gambar',
            'Alat dan Bahan',
        ];

        $sampleData = [
            // Contoh 1: Buku Induk Kurikulum Robotika
            [
                'Buku Robotika: Robotic Engineering & Automation',
                '',
                'robot',
                '1',
                'Koleksi kurikulum lengkap robotika, sensor, aktuator, dan mikrokontroler.',
                '/images/modules/book-robotics.png',
                'Arduino Uno, Breadboard, Jumper Wires',
            ],
            // Contoh 2: Sub Modul (Pertemuan 1) di bawah Buku Robotika
            [
                'Pertemuan 1 – Pengenalan Komponen Robotika',
                'Buku Robotika: Robotic Engineering & Automation',
                'robot',
                '1',
                'Pengenalan mikrokontroler Arduino dan komponen elektronika dasar.',
                '',
                'Arduino Uno, LED, Resistor 220 Ohm, Kabel USB',
            ],
            // Contoh 3: Sub Modul (Pertemuan 2) di bawah Buku Robotika
            [
                'Pertemuan 2 – Sensor Jarak Ultrasonik & Buzzer',
                'Buku Robotika: Robotic Engineering & Automation',
                'robot',
                '2',
                'Praktik perakitan sensor jarak dan integrasi alarm buzzer.',
                '',
                'HC-SR04, Active Buzzer, Jumper Cable',
            ],
            // Contoh 4: Buku Induk Kurikulum Coding & AI
            [
                'Buku AI & Coding: Computational Thinking & AI',
                '',
                'coding',
                '2',
                'Kurikulum logika komputasi, Scratch, Python, dan dasar kecerdasan buatan.',
                '/images/modules/book-coding.png',
                'Laptop, Python 3, Visual Studio Code',
            ],
            // Contoh 5: Sub Modul (Pertemuan 1) di bawah Buku Coding & AI
            [
                'Pertemuan 1 – Logika Algoritma & Variabel Python',
                'Buku AI & Coding: Computational Thinking & AI',
                'coding',
                '1',
                'Dasar algoritma sekuensial, tipe data, dan manipulasi variabel.',
                '',
                'Python 3, VS Code',
            ],
        ];

        return response()->streamDownload(function () use ($headers, $sampleData) {
            $handle = fopen('php://output', 'w');

            // UTF-8 BOM agar terbaca sempurna di Microsoft Excel
            fputs($handle, "\xEF\xBB\xBF");

            // Header baris
            fputcsv($handle, $headers);

            // Data baris contoh
            foreach ($sampleData as $row) {
                fputcsv($handle, $row);
            }

            fclose($handle);
        }, 'template-import-modul.csv', [
            'Content-Type' => 'text/csv; charset=UTF-8',
        ]);
    }

    /**
     * Import modules from CSV file.
     *
     * @return array{success: bool, imported_count: int, updated_count: int, errors: array<string>}
     */
    public function import(UploadedFile $file, ?int $userId = null): array
    {
        $handle = fopen($file->getRealPath(), 'r');
        if (! $handle) {
            return [
                'success' => false,
                'imported_count' => 0,
                'updated_count' => 0,
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
                'updated_count' => 0,
                'errors' => ['Berkas CSV kosong atau tidak dapat dibaca.'],
            ];
        }

        // Hapus UTF-8 BOM jika ada
        if (str_starts_with($firstLine, "\xEF\xBB\xBF")) {
            $firstLine = substr($firstLine, 3);
        }

        $delimiter = (strpos($firstLine, ';') !== false && strpos($firstLine, ',') === false) ? ';' : ',';

        $errors = [];
        $rows = [];
        $rowNumber = 1;
        $validTypes = ['robot', 'coding', 'general'];

        // Cache untuk parent books yang ditemukan atau baru dibuat
        $parentCache = [];

        while (($row = fgetcsv($handle, 0, $delimiter)) !== false) {
            $rowNumber++;

            if (empty($row) || (count($row) === 1 && trim((string)$row[0]) === '')) {
                continue;
            }

            // Expected Columns:
            // 0: Nama Modul
            // 1: Buku Induk
            // 2: Tipe
            // 3: Urutan
            // 4: Deskripsi
            // 5: URL Gambar
            // 6: Alat dan Bahan
            $name = trim((string) ($row[0] ?? ''));
            $parentBookTitle = trim((string) ($row[1] ?? ''));
            $rawType = strtolower(trim((string) ($row[2] ?? '')));
            $orderIndexRaw = trim((string) ($row[3] ?? ''));
            $description = trim((string) ($row[4] ?? ''));
            $image = trim((string) ($row[5] ?? ''));
            $toolsRaw = trim((string) ($row[6] ?? ''));

            // Abaikan jika seluruh kolom kosong
            if ($name === '' && $parentBookTitle === '' && $rawType === '') {
                continue;
            }

            if ($name === '') {
                $errors[] = "Baris {$rowNumber}: 'Nama Modul' wajib diisi.";
                continue;
            }

            // Normalize type
            $moduleType = 'robot';
            if ($rawType !== '') {
                if (in_array($rawType, $validTypes, true)) {
                    $moduleType = $rawType;
                } elseif (str_contains($rawType, 'code') || str_contains($rawType, 'koding') || str_contains($rawType, 'program')) {
                    $moduleType = 'coding';
                } elseif (str_contains($rawType, 'umum') || str_contains($rawType, 'general')) {
                    $moduleType = 'general';
                } elseif (str_contains($rawType, 'robot')) {
                    $moduleType = 'robot';
                } else {
                    $errors[] = "Baris {$rowNumber}: Tipe modul '{$rawType}' tidak valid (pilih: robot, coding, atau general).";
                    continue;
                }
            }

            // Parse order_index
            $orderIndex = 0;
            if ($orderIndexRaw !== '' && is_numeric($orderIndexRaw)) {
                $orderIndex = (int) $orderIndexRaw;
            }

            // Parse tools
            $tools = null;
            if ($toolsRaw !== '') {
                // Split by comma or semicolon
                $separator = str_contains($toolsRaw, ';') ? ';' : ',';
                $parsedTools = array_values(array_filter(
                    array_map('trim', explode($separator, $toolsRaw)),
                    fn ($t) => $t !== ''
                ));
                if (! empty($parsedTools)) {
                    $tools = $parsedTools;
                }
            }

            $rows[] = [
                'rowNumber' => $rowNumber,
                'name' => $name,
                'parentBookTitle' => $parentBookTitle,
                'module_type' => $moduleType,
                'order_index' => $orderIndex,
                'description' => $description !== '' ? $description : null,
                'image' => $image !== '' ? $image : null,
                'tools' => $tools,
            ];
        }

        fclose($handle);

        if (! empty($errors)) {
            return [
                'success' => false,
                'imported_count' => 0,
                'updated_count' => 0,
                'errors' => $errors,
            ];
        }

        if (empty($rows)) {
            return [
                'success' => false,
                'imported_count' => 0,
                'updated_count' => 0,
                'errors' => ['File CSV tidak memiliki baris data modul untuk diproses.'],
            ];
        }

        $importedCount = 0;
        $updatedCount = 0;

        DB::beginTransaction();
        try {
            foreach ($rows as $data) {
                $parentId = null;
                $bookTitle = null;

                // Jika kolom Buku Induk diisi
                if (! empty($data['parentBookTitle'])) {
                    $parentTitle = $data['parentBookTitle'];
                    $cacheKey = strtolower($parentTitle);

                    if (! isset($parentCache[$cacheKey])) {
                        // Cari parent module berdasarkan name atau book_title
                        $parent = Module::whereNull('parent_id')
                            ->where(function ($q) use ($parentTitle) {
                                $q->where('name', $parentTitle)
                                  ->orWhere('book_title', $parentTitle);
                            })
                            ->first();

                        if (! $parent) {
                            // Buat Buku Induk otomatis jika belum ada di database
                            $parent = Module::create([
                                'name' => $parentTitle,
                                'book_title' => $parentTitle,
                                'parent_id' => null,
                                'order_index' => 0,
                                'module_type' => $data['module_type'],
                                'format' => 'Buku Panduan',
                                'description' => "Buku kurikulum untuk {$parentTitle}",
                                'created_by' => $userId,
                            ]);
                        }

                        $parentCache[$cacheKey] = $parent;
                    }

                    $parentObj = $parentCache[$cacheKey];
                    $parentId = $parentObj->id;
                    $bookTitle = $parentObj->name;
                } else {
                    // Jika tanpa Buku Induk, baris ini sendiri adalah Buku Induk
                    $bookTitle = $data['name'];
                }

                // Cek apakah modul dengan nama ini sudah ada
                $existing = Module::where('name', $data['name'])->first();

                if ($existing) {
                    $existing->update([
                        'parent_id' => $parentId ?? $existing->parent_id,
                        'book_title' => $bookTitle ?? $existing->book_title,
                        'module_type' => $data['module_type'],
                        'order_index' => $data['order_index'] > 0 ? $data['order_index'] : $existing->order_index,
                        'description' => $data['description'] ?? $existing->description,
                        'image' => $data['image'] ?? $existing->image,
                        'tools' => $data['tools'] ?? $existing->tools,
                    ]);
                    $updatedCount++;
                } else {
                    Module::create([
                        'name' => $data['name'],
                        'parent_id' => $parentId,
                        'book_title' => $bookTitle,
                        'order_index' => $data['order_index'],
                        'module_type' => $data['module_type'],
                        'format' => $parentId ? 'Sub Modul' : 'Buku Panduan',
                        'size' => null,
                        'description' => $data['description'],
                        'image' => $data['image'],
                        'tools' => $data['tools'],
                        'created_by' => $userId,
                    ]);
                    $importedCount++;
                }
            }

            DB::commit();

            return [
                'success' => true,
                'imported_count' => $importedCount,
                'updated_count' => $updatedCount,
                'errors' => [],
            ];
        } catch (\Throwable $e) {
            DB::rollBack();

            return [
                'success' => false,
                'imported_count' => 0,
                'updated_count' => 0,
                'errors' => ['Terjadi kesalahan saat memproses data: ' . $e->getMessage()],
            ];
        }
    }
}
