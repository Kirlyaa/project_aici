<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use App\Models\User;
use App\Models\Module;
use App\Models\GradeEntry;
use Carbon\Carbon;

class AiraGradeEntrySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get Aira student and Aiya tutor
        $aira = User::where('email', 'aira@aici.id')->first();
        $aiya = User::where('email', 'aiya@aici.id')->first();
        
        if (!$aira || !$aiya) {
            echo "Aira student or Aiya tutor not found. Skipping seeder.\n";
            return;
        }

        // Pastikan semua modul yang dibutuhkan tersedia dengan tipe yang tepat
        $modules = [
            'm1' => Module::firstOrCreate(
                ['name' => 'Modul 1 – Pengenalan Robotika'],
                ['module_type' => 'robot', 'format' => 'PDF', 'size' => '4.2 MB']
            ),
            'm2' => Module::firstOrCreate(
                ['name' => 'Modul 2 – Sensor & Aktuator'],
                ['module_type' => 'robot', 'format' => 'PDF', 'size' => '3.8 MB']
            ),
            'm3' => Module::firstOrCreate(
                ['name' => 'Modul 3 – Kontrol Motor & Navigasi'],
                ['module_type' => 'robot', 'format' => 'PDF', 'size' => '4.0 MB']
            ),
            'm4' => Module::firstOrCreate(
                ['name' => 'Modul 4 – Algoritma Perulangan & Array'],
                ['module_type' => 'coding', 'format' => 'PDF', 'size' => '3.5 MB']
            ),
            'm5' => Module::firstOrCreate(
                ['name' => 'Modul 5 – Logika Program'],
                ['module_type' => 'coding', 'format' => 'PDF', 'size' => '3.2 MB']
            ),
            'm6' => Module::firstOrCreate(
                ['name' => 'Modul 6 – Mini Project Robotika'],
                ['module_type' => 'robot', 'format' => 'PDF', 'size' => '4.8 MB']
            ),
            'm7' => Module::firstOrCreate(
                ['name' => 'Modul 7 – Integrasi Sensor Lanjutan'],
                ['module_type' => 'robot', 'format' => 'PDF', 'size' => '4.5 MB']
            ),
            'm8' => Module::firstOrCreate(
                ['name' => 'Modul 8 – Autonomous Mobile Robot Final'],
                ['module_type' => 'robot', 'format' => 'PDF', 'size' => '5.2 MB']
            ),
        ];

        // Ambil 8 sesi hadir Aira secara urut tanggal
        $sessions = \App\Models\LearningSession::where('user_id', $aira->id)
            ->where('status', 'hadir')
            ->orderBy('date', 'asc')
            ->get();

        // Bersihkan data nilai lama Aira agar selalu konsisten dan tidak duplikat
        GradeEntry::where('student_id', $aira->id)->delete();

        // 8 Pertemuan Lengkap: Blok 1 (Pertemuan 1-4) & Blok 2 (Pertemuan 5-8)
        $gradeEntriesData = [
            // === BLOK 1: PERTEMUAN 1 - 4 (APRIL 2025) ===
            [
                'meeting_number' => 1,
                'module_type' => 'robot',
                'meeting_date' => '2025-04-05',
                'module_id' => $modules['m1']->id,
                'session_index' => 0,
                'fokus' => 4.3,
                'robot_building' => 4.2,
                'tools_management' => 4.1,
                'interaksi' => 4.4,
                'coding' => 4.0,
                'notes' => 'Pertemuan 1: Aira menunjukkan kemajuan yang sangat baik dalam pengenalan komponen dan dasar robotika.',
            ],
            [
                'meeting_number' => 2,
                'module_type' => 'robot',
                'meeting_date' => '2025-04-12',
                'module_id' => $modules['m2']->id,
                'session_index' => 1,
                'fokus' => 4.5,
                'robot_building' => 4.4,
                'tools_management' => 4.3,
                'interaksi' => 4.6,
                'coding' => 4.2,
                'notes' => 'Pertemuan 2: Peningkatan pemahaman pada perakitan sensor ultrasonik dan aktuator gerak.',
            ],
            [
                'meeting_number' => 3,
                'module_type' => 'coding',
                'meeting_date' => '2025-04-19',
                'module_id' => $modules['m5']->id,
                'session_index' => 2,
                'fokus' => 4.6,
                'robot_building' => null, // Modul coding murni (4 kriteria)
                'tools_management' => 4.4,
                'interaksi' => 4.7,
                'coding' => 4.8,
                'notes' => 'Pertemuan 3: Aira sangat cepat menangkap logika percabangan kondisi dan perulangan loop.',
            ],
            [
                'meeting_number' => 4,
                'module_type' => 'robot',
                'meeting_date' => '2025-04-26',
                'module_id' => $modules['m6']->id,
                'session_index' => 3,
                'fokus' => 4.8,
                'robot_building' => 4.7,
                'tools_management' => 4.6,
                'interaksi' => 4.8,
                'coding' => 4.7,
                'notes' => 'Pertemuan 4: Berhasil mengintegrasikan pemrograman dan mekanik robot dalam proyek mini secara mandiri.',
            ],

            // === BLOK 2: PERTEMUAN 5 - 8 (MEI 2025) ===
            [
                'meeting_number' => 5,
                'module_type' => 'robot',
                'meeting_date' => '2025-05-03',
                'module_id' => $modules['m3']->id,
                'session_index' => 4,
                'fokus' => 4.6,
                'robot_building' => 4.5,
                'tools_management' => 4.5,
                'interaksi' => 4.7,
                'coding' => 4.4,
                'notes' => 'Pertemuan 5: Pengendalian PWM kecepatan roda robot dan navigasi motor driver berlangsung sangat mulus.',
            ],
            [
                'meeting_number' => 6,
                'module_type' => 'coding',
                'meeting_date' => '2025-05-10',
                'module_id' => $modules['m4']->id,
                'session_index' => 5,
                'fokus' => 4.7,
                'robot_building' => null, // Modul coding murni (4 kriteria)
                'tools_management' => 4.6,
                'interaksi' => 4.8,
                'coding' => 4.9,
                'notes' => 'Pertemuan 6: Menguasai array multi-elemen untuk penampung data sensor dengan kode yang sangat bersih.',
            ],
            [
                'meeting_number' => 7,
                'module_type' => 'robot',
                'meeting_date' => '2025-05-17',
                'module_id' => $modules['m7']->id,
                'session_index' => 6,
                'fokus' => 4.8,
                'robot_building' => 4.8,
                'tools_management' => 4.7,
                'interaksi' => 4.9,
                'coding' => 4.7,
                'notes' => 'Pertemuan 7: Kalibrasi sensor garis 5-channel dan sensor warna berhasil mendeteksi lintasan secara akurat.',
            ],
            [
                'meeting_number' => 8,
                'module_type' => 'robot',
                'meeting_date' => '2025-05-24',
                'module_id' => $modules['m8']->id,
                'session_index' => 7,
                'fokus' => 4.9,
                'robot_building' => 4.9,
                'tools_management' => 4.8,
                'interaksi' => 5.0,
                'coding' => 4.9,
                'notes' => 'Pertemuan 8: Final Project Autonomous Robot berhasil menaklukkan seluruh rintangan dengan waktu tercepat.',
            ],
        ];

        foreach ($gradeEntriesData as $data) {
            $session = $sessions->get($data['session_index']);

            $entry = GradeEntry::create([
                'student_id' => $aira->id,
                'tutor_id' => $aiya->id,
                'module_id' => $data['module_id'],
                'learning_session_id' => $session?->id,
                'meeting_number' => $data['meeting_number'],
                'module_type' => $data['module_type'],
                'meeting_date' => $data['meeting_date'],
                'fokus' => $data['fokus'],
                'robot_building' => $data['robot_building'],
                'tools_management' => $data['tools_management'],
                'interaksi' => $data['interaksi'],
                'coding' => $data['coding'],
                'notes' => $data['notes'],
            ]);

            // Hitung nilai rata-rata resmi per pertemuan
            $entry->recalculateAverage();
            $entry->save();
        }

        echo "✅ Created 8 grade entries (Pertemuan 1-4 & 5-8) for Aira.\n";
    }
}
