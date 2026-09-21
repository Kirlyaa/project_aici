<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use App\Models\User;
use App\Models\Module;
use App\Models\LearningSession;
use App\Models\GradeEntry;
use App\Models\StudentComment;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class LearningSessionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Get or Create Students
        $faris = User::firstOrCreate(
            ['email' => 'student@aici.id'],
            [
                'name' => 'Faris Student',
                'email' => 'student@aici.id',
                'password' => Hash::make('password123'),
                'role' => 'user',
                'status' => 'aktif',
            ]
        );

        $tutorBudi = User::where('email', 'budi@aici.id')->first();
        $tutorAiya = User::where('email', 'aiya@aici.id')->first();
        $tutorSiti = User::where('email', 'siti@aici.id')->first();

        $tutorBudiId = $tutorBudi?->id ?? $tutorAiya?->id;
        $tutorAiyaId = $tutorAiya?->id;
        $tutorSitiId = $tutorSiti?->id ?? $tutorAiya?->id;

        // Bersihkan sesi lama Faris
        LearningSession::where('user_id', $faris->id)->delete();
        GradeEntry::where('student_id', $faris->id)->delete();

        // 2. Sesi Pembelajaran & Kalender untuk Faris Student (Kelas Coding Master B)
        $farisSessions = [
            [
                'title' => 'Pertemuan 1: Dasar Algoritma & Variabel',
                'date_string' => 'Sabtu, 5 April 2025',
                'date' => '2025-04-05',
                'status' => 'hadir',
                'description' => 'Sesi perdana membahas dasar algoritma pemrograman, konsep variabel dan tipe data logika.',
                'tools' => ['Laptop', 'Code Editor', 'Kabel USB'],
                'module_name' => 'Modul 1 – Pengenalan Robotika',
                'module_type' => 'robot',
                'fokus' => 4.2, 'robot' => 4.1, 'tools' => 4.0, 'interaksi' => 4.3, 'coding' => 4.2,
            ],
            [
                'title' => 'Pertemuan 2: Percabangan Kondisional',
                'date_string' => 'Sabtu, 12 April 2025',
                'date' => '2025-04-12',
                'status' => 'hadir',
                'description' => 'Pendalaman logika if-else, percabangan bersarang, dan studi kasus sistem saklar lampu pintar.',
                'tools' => ['Laptop', 'Visual Scripting'],
                'module_name' => 'Modul 5 – Logika Program',
                'module_type' => 'coding',
                'fokus' => 4.4, 'robot' => null, 'tools' => 4.2, 'interaksi' => 4.5, 'coding' => 4.6,
            ],
            [
                'title' => 'Pertemuan 3: Perulangan Loop & Counter',
                'date_string' => 'Sabtu, 19 April 2025',
                'date' => '2025-04-19',
                'status' => 'hadir',
                'description' => 'Implementasi while loop dan for loop untuk animasi grafis dan pergerakan karakter game.',
                'tools' => ['Laptop', 'IDE Scratch'],
                'module_name' => 'Modul 4 – Algoritma Perulangan & Array',
                'module_type' => 'coding',
                'fokus' => 4.5, 'robot' => null, 'tools' => 4.3, 'interaksi' => 4.6, 'coding' => 4.7,
            ],
            [
                'title' => 'Pertemuan 4: Proyek Game Interaktif Mini',
                'date_string' => 'Sabtu, 26 April 2025',
                'date' => '2025-04-26',
                'status' => 'hadir',
                'description' => 'Integrasi logika, skor game, dan timer dalam pembuatan proyek mini game mandiri.',
                'tools' => ['Laptop', 'Asset Pack Suara'],
                'module_name' => 'Modul 6 – Mini Project Robotika',
                'module_type' => 'coding',
                'fokus' => 4.7, 'robot' => null, 'tools' => 4.5, 'interaksi' => 4.7, 'coding' => 4.8,
            ],
            [
                'title' => 'Pertemuan 5: Pengenalan Sensor & Mikrokontroler',
                'date_string' => 'Sabtu, 3 Mei 2025',
                'date' => '2025-05-03',
                'status' => 'hadir',
                'description' => 'Menghubungkan kode program visual ke mikrokontroler fisik untuk membaca tombol dan LED.',
                'tools' => ['Board Arduino/ESP32', 'LED & Resistor', 'Laptop'],
                'module_name' => 'Modul 2 – Sensor & Aktuator',
                'module_type' => 'robot',
                'fokus' => 4.3, 'robot' => 4.2, 'tools' => 4.4, 'interaksi' => 4.4, 'coding' => 4.5,
            ],
            [
                'title' => 'Pertemuan 6: Reschedule Sesi Coding Praktik',
                'date_string' => 'Sabtu, 10 Mei 2025',
                'date' => '2025-05-10',
                'status' => 'reschedule',
                'description' => 'Sesi digeser jadwal karena ada kegiatan ujian sekolah.',
                'tools' => ['Laptop'],
                'module_name' => 'Modul 7 – Integrasi Sensor Lanjutan',
                'module_type' => 'robot',
                'fokus' => null, 'robot' => null, 'tools' => null, 'interaksi' => null, 'coding' => null,
            ],
            [
                'title' => 'Libur Nasional Hari Raya',
                'date_string' => 'Sabtu, 17 Mei 2025',
                'date' => '2025-05-17',
                'status' => 'libur',
                'description' => 'Libur perayaan hari besar nasional.',
                'tools' => [],
                'module_name' => null,
                'module_type' => null,
                'fokus' => null, 'robot' => null, 'tools' => null, 'interaksi' => null, 'coding' => null,
            ],
            [
                'title' => 'Pertemuan 7: Debugging & Refactoring',
                'date_string' => 'Sabtu, 24 Mei 2025',
                'date' => '2025-05-24',
                'status' => 'akan-datang',
                'description' => 'Latihan teknik penanganan bug (error handling) dan optimasi baris kode.',
                'tools' => ['Laptop', 'IDE Coding'],
                'module_name' => 'Modul 3 – Kontrol Motor & Navigasi',
                'module_type' => 'coding',
                'fokus' => null, 'robot' => null, 'tools' => null, 'interaksi' => null, 'coding' => null,
            ],
            [
                'title' => 'Pertemuan 8: Final Project Coding Showcase',
                'date_string' => 'Sabtu, 31 Mei 2025',
                'date' => '2025-05-31',
                'status' => 'akan-datang',
                'description' => 'Showcase dan presentasi karya pemrograman game interaktif di hadapan kelas.',
                'tools' => ['Laptop', 'Proyektor'],
                'module_name' => 'Modul 8 – Autonomous Mobile Robot Final',
                'module_type' => 'coding',
                'fokus' => null, 'robot' => null, 'tools' => null, 'interaksi' => null, 'coding' => null,
            ],
        ];

        $meetingCounter = 1;
        foreach ($farisSessions as $sData) {
            $session = LearningSession::create([
                'user_id' => $faris->id,
                'tutor_id' => $tutorBudiId,
                'title' => $sData['title'],
                'date_string' => $sData['date_string'],
                'date' => $sData['date'],
                'status' => $sData['status'],
                'description' => $sData['description'],
                'tools' => $sData['tools'],
            ]);

            $module = null;
            if (!empty($sData['module_name'])) {
                $module = Module::firstOrCreate(
                    ['name' => $sData['module_name']],
                    [
                        'module_type' => $sData['module_type'] ?? 'general',
                        'format' => 'PDF',
                        'size' => '3.5 MB',
                    ]
                );
                $session->modules()->syncWithoutDetaching([$module->id]);
            }

            // Jika sesi hadir dan memiliki nilai, buatkan GradeEntry
            if ($sData['status'] === 'hadir' && $sData['fokus'] !== null) {
                $entry = GradeEntry::create([
                    'student_id' => $faris->id,
                    'tutor_id' => $tutorBudiId,
                    'module_id' => $module?->id,
                    'learning_session_id' => $session->id,
                    'meeting_number' => $meetingCounter,
                    'module_type' => $sData['module_type'] ?? 'coding',
                    'meeting_date' => $sData['date'],
                    'fokus' => $sData['fokus'],
                    'robot_building' => $sData['robot'],
                    'tools_management' => $sData['tools'],
                    'interaksi' => $sData['interaksi'],
                    'coding' => $sData['coding'],
                    'notes' => "Evaluasi Faris Pertemuan ke-{$meetingCounter}: Menunjukkan kemandirian belajar logika yang solid.",
                ]);
                $entry->recalculateAverage();
                $entry->save();
                $meetingCounter++;
            }
        }

        // Komentar untuk Faris
        StudentComment::updateOrCreate(
            ['student_id' => $faris->id, 'semester' => '2025-04'],
            [
                'tutor_id' => $tutorBudiId,
                'academic_year' => 2025,
                'system_comment' => 'Faris menunjukkan ketertarikan tinggi dalam dunia pemrograman dan algoritma. Kemampuan menyelesaikan tantangan game interaktif sangat baik.',
                'tutor_comment' => 'Faris adalah siswa yang tekun dan cepat menyerap logika kondisi baru.',
                'strengths' => 'Logika pemrograman runtut dan pemikiran analitis tajam.',
                'notes' => 'Tingkatkan kerapian dokumentasi kode dan eksplorasi pemrograman berbasis teks.',
                'average_grade' => 4.45,
                'module_names' => ['Modul 1 – Pengenalan Robotika', 'Modul 5 – Logika Program', 'Modul 4 – Algoritma Perulangan & Array'],
                'is_system_generated' => false,
            ]
        );

        // 3. Sesi & Nilai untuk Siswa Lainnya di Kelas (Aditya Kelas A, Dimas Kelas B, Gilang Kelas C)
        $sampleStudents = [
            [
                'email' => 'aditya.a@aici.id',
                'tutor_id' => $tutorAiyaId,
                'class_title' => 'Robotics Explorer A',
            ],
            [
                'email' => 'dimas.b@aici.id',
                'tutor_id' => $tutorBudiId,
                'class_title' => 'Coding Master B',
            ],
            [
                'email' => 'gilang.c@aici.id',
                'tutor_id' => $tutorSitiId,
                'class_title' => 'AI Innovator C',
            ],
        ];

        $generalModule = Module::firstOrCreate(
            ['name' => 'Modul 1 – Pengenalan Robotika'],
            ['module_type' => 'robot', 'format' => 'PDF', 'size' => '4.2 MB']
        );

        foreach ($sampleStudents as $sInfo) {
            $u = User::where('email', $sInfo['email'])->first();
            if ($u) {
                LearningSession::where('user_id', $u->id)->delete();
                GradeEntry::where('student_id', $u->id)->delete();

                // Sesi 1: Hadir
                $s1 = LearningSession::create([
                    'user_id' => $u->id,
                    'tutor_id' => $sInfo['tutor_id'],
                    'title' => 'Pertemuan 1: Orientasi & Modul Dasar',
                    'date_string' => 'Sabtu, 5 April 2025',
                    'date' => '2025-04-05',
                    'status' => 'hadir',
                    'description' => "Sesi orientasi kelas {$sInfo['class_title']} berjalan dengan penuh antusiasme.",
                    'tools' => ['Laptop', 'Kit Praktek'],
                ]);
                $s1->modules()->syncWithoutDetaching([$generalModule->id]);

                $g1 = GradeEntry::create([
                    'student_id' => $u->id,
                    'tutor_id' => $sInfo['tutor_id'],
                    'module_id' => $generalModule->id,
                    'learning_session_id' => $s1->id,
                    'meeting_number' => 1,
                    'module_type' => 'robot',
                    'meeting_date' => '2025-04-05',
                    'fokus' => 4.2, 'robot_building' => 4.3, 'tools_management' => 4.1, 'interaksi' => 4.4, 'coding' => 4.0,
                    'notes' => 'Partisipasi aktif dan menunjukkan minat belajar yang tinggi.',
                ]);
                $g1->recalculateAverage();
                $g1->save();

                // Sesi 2: Akan datang
                $s2 = LearningSession::create([
                    'user_id' => $u->id,
                    'tutor_id' => $sInfo['tutor_id'],
                    'title' => 'Pertemuan 2: Praktik Lanjutan',
                    'date_string' => 'Sabtu, 12 April 2025',
                    'date' => '2025-04-12',
                    'status' => 'hadir',
                    'description' => 'Praktik lanjutan perakitan dan penulisan skrip.',
                    'tools' => ['Laptop', 'Kit Praktek'],
                ]);
                $s2->modules()->syncWithoutDetaching([$generalModule->id]);

                $g2 = GradeEntry::create([
                    'student_id' => $u->id,
                    'tutor_id' => $sInfo['tutor_id'],
                    'module_id' => $generalModule->id,
                    'learning_session_id' => $s2->id,
                    'meeting_number' => 2,
                    'module_type' => 'robot',
                    'meeting_date' => '2025-04-12',
                    'fokus' => 4.4, 'robot_building' => 4.5, 'tools_management' => 4.2, 'interaksi' => 4.6, 'coding' => 4.2,
                    'notes' => 'Kemajuan konsisten dalam penguasaan alat dan materi.',
                ]);
                $g2->recalculateAverage();
                $g2->save();

                // Sesi Kalender Mendatang
                LearningSession::create([
                    'user_id' => $u->id,
                    'tutor_id' => $sInfo['tutor_id'],
                    'title' => 'Pertemuan 3: Uji Coba Lapangan',
                    'date_string' => 'Sabtu, 19 April 2025',
                    'date' => '2025-04-19',
                    'status' => 'akan-datang',
                    'description' => 'Sesi mendatang untuk menguji coba prototype di lintasan kelas.',
                    'tools' => ['Laptop', 'Kit Praktek'],
                ]);
            }
        }

        echo "✅ Created learning sessions and grades for Faris and classroom students.\n";
    }
}
