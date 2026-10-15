<?php

namespace Database\Seeders;

use App\Models\Classroom;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class ClearClassroomSeeder extends Seeder
{
    /**
     * Kosongkan seluruh data kelas dan lepaskan relasi kelas dari user/siswa.
     */
    public function run(): void
    {
        // 1. Lepaskan relasi classroom_id dan string class dari semua user
        User::query()->update([
            'classroom_id' => null,
            'class' => null,
        ]);

        // 2. Nonaktifkan foreign key check sementara jika perlu, lalu bersihkan tabel classrooms
        Schema::disableForeignKeyConstraints();
        Classroom::truncate();
        Schema::enableForeignKeyConstraints();

        $this->command?->info('✅ Seluruh data kelas berhasil dihapus & relasi kelas pada user dikosongkan.');
    }
}
