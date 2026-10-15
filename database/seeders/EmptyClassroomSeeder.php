<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class EmptyClassroomSeeder extends Seeder
{
    /**
     * Seeder kelas kosong.
     * Tidak membuat data kelas apapun sehingga tabel classrooms tetap bersih/kosong.
     */
    public function run(): void
    {
        // Sengaja dibiarkan kosong untuk state kelas bersih/tanpa data awal.
        $this->command?->info('ℹ️ EmptyClassroomSeeder dieksekusi: Tidak ada data kelas yang dibuat.');
    }
}
