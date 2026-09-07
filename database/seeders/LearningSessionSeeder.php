<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use App\Models\User;
use App\Models\Module;
use App\Models\LearningSession;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class LearningSessionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Create Students
        $student = User::firstOrCreate(
            ['email' => 'student@aici.id'],
            [
                'name' => 'Faris Student',
                'email' => 'student@aici.id',
                'password' => Hash::make('password123'),
                'role' => 'user',
                'status' => 'aktif',
            ]
        );

        $aira = User::firstOrCreate(
            ['email' => 'aira@aici.id'],
            [
                'name' => 'Aira Student',
                'email' => 'aira@aici.id',
                'password' => Hash::make('password123'),
                'role' => 'user',
                'status' => 'aktif',
            ]
        );

        // 2. Define Data from sessions.ts
        $sessionsData = [
            [
                'title' => 'Sesi April',
                'date_string' => 'Sabtu, 5 April 2025',
                'date' => '2025-04-05',
                'status' => 'hadir',
                'description' => 'Sesi perdana membahas konsep dasar robotika dan block coding. Faris sangat antusias dan langsung mencoba membuat program sederhana. Materi mencakup pemahaman tentang sensor, aktuator, dan bagaimana logika pemrograman digunakan untuk mengontrol pergerakan robot.',
                'tools' => ['Kit Robot Dasar', 'Laptop', 'Kabel USB'],
                'modules' => [['name' => 'Modul 1 – Pengenalan Robotika', 'format' => 'PDF', 'size' => '4.2 MB']],
            ],
            [
                'title' => 'Sesi Mei 1',
                'date_string' => 'Sabtu, 10 Mei 2025',
                'date' => '2025-05-10',
                'status' => 'hadir',
                'description' => 'Pendalaman materi sensor dan percobaan langsung menggunakan kit robot.',
                'tools' => ['Kit Robot Dasar', 'Laptop'],
                'modules' => [['name' => 'Modul 2 – Sensor & Aktuator', 'format' => 'PDF', 'size' => '3.8 MB']],
            ],
            [
                'title' => 'Sesi Mei 2',
                'date_string' => 'Sabtu, 17 Mei 2025',
                'date' => '2025-05-17',
                'status' => 'absen',
                'description' => 'Sesi ini membahas kontrol motor dan pergerakan dasar robot.',
                'tools' => ['Kit Robot Dasar', 'Laptop', 'Kabel USB'],
                'modules' => [['name' => 'Modul 3 – Kontrol Motor', 'format' => 'PDF', 'size' => '2.9 MB']],
            ],
            [
                'title' => 'Intro Lanjutan',
                'date_string' => 'Sabtu, 7 Juni 2025',
                'date' => '2025-06-07',
                'status' => 'hadir',
                'description' => 'Pengenalan pemrograman lanjutan dan logika kondisional.',
                'tools' => ['Laptop', 'Kabel USB'],
                'modules' => [['name' => 'Modul A – Intro Lanjutan', 'format' => 'PDF', 'size' => '3.1 MB']],
            ],
            [
                'title' => 'Coding Dasar 2',
                'date_string' => 'Sabtu, 14 Juni 2025',
                'date' => '2025-06-14',
                'status' => 'hadir',
                'description' => 'Latihan coding dasar menggunakan block programming dan pengenalan variabel.',
                'tools' => ['Laptop'],
                'modules' => [['name' => 'Modul A – Coding Dasar', 'format' => 'PDF', 'size' => '2.5 MB']],
            ],
            [
                'title' => 'Perkenalan Robot & Coding Dasar',
                'date_string' => 'Sabtu, 5 Juli 2025',
                'date' => '2025-07-05',
                'status' => 'hadir',
                'description' => 'Sesi perdana membahas konsep dasar robotika dan block coding. Faris sangat antusias dan langsung mencoba membuat program sederhana. Materi mencakup pemahaman tentang sensor, aktuator, dan bagaimana logika pemrograman digunakan untuk mengontrol pergerakan robot.',
                'tools' => ['Kit Robot Dasar', 'Laptop', 'Kabel USB'],
                'modules' => [['name' => 'Modul 1 – Pengenalan Robotika', 'format' => 'PDF', 'size' => '4.2 MB']],
            ],
            [
                'title' => 'Sensor & Aktuator',
                'date_string' => 'Sabtu, 12 Juli 2025',
                'date' => '2025-07-12',
                'status' => 'hadir',
                'description' => 'Mempelajari cara kerja sensor ultrasonik, infrared, dan aktuator motor.',
                'tools' => ['Kit Robot Dasar', 'Laptop', 'Kabel USB'],
                'modules' => [['name' => 'Modul 2 – Sensor & Input', 'format' => 'PDF', 'size' => '3.5 MB']],
            ],
            [
                'title' => 'Konstruksi Robot Bergerak',
                'date_string' => 'Sabtu, 19 Juli 2025',
                'date' => '2025-07-19',
                'status' => 'absen',
                'description' => 'Perakitan robot bergerak dan konfigurasi dasar.',
                'tools' => ['Kit Robot Dasar', 'Obeng', 'Kabel USB'],
                'modules' => [['name' => 'Modul 3 – Konstruksi Robot', 'format' => 'PDF', 'size' => '5.1 MB']],
            ],
            [
                'title' => 'Line Following Robot',
                'date_string' => 'Sabtu, 26 Juli 2025',
                'date' => '2025-07-26',
                'status' => 'reschedule',
                'description' => 'Membangun robot yang dapat mengikuti garis menggunakan sensor infrared.',
                'tools' => ['Kit Robot Dasar', 'Laptop', 'Kabel USB'],
                'modules' => [['name' => 'Modul 4 – Line Following', 'format' => 'PDF', 'size' => '4.0 MB']],
            ],
            [
                'title' => 'Loop & Kondisi',
                'date_string' => 'Sabtu, 2 Agustus 2025',
                'date' => '2025-08-02',
                'status' => 'akan-datang',
                'description' => 'Belajar penggunaan loop dan kondisi dalam pemrograman robot.',
                'tools' => ['Laptop'],
                'modules' => [['name' => 'Modul 5 – Logika Program', 'format' => 'PDF', 'size' => '3.2 MB']],
            ],
            [
                'title' => 'Proyek Mini: Robot Penjaga',
                'date_string' => 'Sabtu, 9 Agustus 2025',
                'date' => '2025-08-09',
                'status' => 'akan-datang',
                'description' => 'Proyek mini membuat robot penjaga dengan sensor gerak.',
                'tools' => ['Kit Robot Dasar', 'Laptop', 'Kabel USB', 'Sensor Gerak'],
                'modules' => [['name' => 'Modul 6 – Mini Project', 'format' => 'PDF', 'size' => '4.8 MB']],
            ],
            [
                'title' => 'Presentasi & Review',
                'date_string' => 'Sabtu, 16 Agustus 2025',
                'date' => '2025-08-16',
                'status' => 'akan-datang',
                'description' => 'Presentasi hasil proyek dan review keseluruhan materi semester.',
                'tools' => ['Laptop', 'Robot Proyek'],
                'modules' => [['name' => 'Modul 7 – Review', 'format' => 'PDF', 'size' => '2.1 MB']],
            ],
            [
                'title' => 'Libur Sekolah',
                'date_string' => 'Sabtu, 6 April 2025',
                'date' => '2025-04-06',
                'status' => 'libur',
                'description' => 'Hari libur',
                'tools' => [],
                'modules' => [],
            ],
            [
                'title' => 'Libur Nasional',
                'date_string' => 'Sabtu, 17 Juli 2025',
                'date' => '2025-07-17',
                'status' => 'libur',
                'description' => 'Hari libur nasional',
                'tools' => [],
                'modules' => [],
            ],
        ];

        foreach ($sessionsData as $data) {
            // Create for student (Faris Student)
            $session = LearningSession::create([
                'user_id' => $student->id,
                'title' => $data['title'],
                'date_string' => $data['date_string'],
                'date' => $data['date'],
                'status' => $data['status'],
                'description' => $data['description'],
                'tools' => $data['tools'],
            ]);

            foreach ($data['modules'] as $moduleData) {
                $module = Module::firstOrCreate(
                    ['name' => $moduleData['name']],
                    [
                        'format' => $moduleData['format'],
                        'size' => $moduleData['size'],
                        'module_type' => 'general',
                    ]
                );
                $session->modules()->attach($module->id);
            }

            // Also create for Aira
            $airaSession = LearningSession::create([
                'user_id' => $aira->id,
                'title' => $data['title'],
                'date_string' => $data['date_string'],
                'date' => $data['date'],
                'status' => $data['status'],
                'description' => $data['description'],
                'tools' => $data['tools'],
            ]);

            foreach ($data['modules'] as $moduleData) {
                $module = Module::firstOrCreate(
                    ['name' => $moduleData['name']],
                    [
                        'format' => $moduleData['format'],
                        'size' => $moduleData['size'],
                        'module_type' => 'general',
                    ]
                );
                $airaSession->modules()->attach($module->id);
            }
        }
    }
}
