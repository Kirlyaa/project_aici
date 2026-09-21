<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use App\Models\User;
use App\Models\Module;
use App\Models\LearningSession;
use Carbon\Carbon;

class AiraLearningSessionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get Aira student & Aiya tutor
        $aira = User::where('email', 'aira@aici.id')->first();
        $aiya = User::where('email', 'aiya@aici.id')->first();
        
        if (!$aira) {
            echo "Aira student not found. Skipping seeder.\n";
            return;
        }

        $tutorId = $aiya?->id;

        // Bersihkan sesi lama Aira agar sinkron 8 pertemuan hadir + 4 sesi kalender (reschedule, libur, akan-datang)
        LearningSession::where('user_id', $aira->id)->delete();

        // 8 Pertemuan utama berstatus 'hadir' (1-4 di April 2025, 5-8 di Mei 2025)
        // Ditambah 4 sesi kalender berikutnya (Juni 2025) untuk menguji seluruh status kalender
        $sessionsData = [
            // === BLOK 1: PERTEMUAN 1 - 4 (APRIL 2025) ===
            [
                'title' => 'Pertemuan 1: Pengenalan Robotika',
                'date' => '2025-04-05',
                'status' => 'hadir',
                'description' => 'Sesi perdana membahas arsitektur dasar robotika, mikrokontroler, dan lingkungan block coding. Aira sangat antusias merakit rangka dasar.',
                'module_name' => 'Modul 1 – Pengenalan Robotika',
                'module_type' => 'robot',
                'tools' => ['Kit Robot Dasar', 'Laptop', 'Kabel USB', 'Obeng Presisi'],
            ],
            [
                'title' => 'Pertemuan 2: Sensor & Aktuator',
                'date' => '2025-04-12',
                'status' => 'hadir',
                'description' => 'Mempelajari cara kerja sensor ultrasonik jarak dan aktuator servo. Aira berhasil mengkalibrasi jarak deteksi halangan.',
                'module_name' => 'Modul 2 – Sensor & Aktuator',
                'module_type' => 'robot',
                'tools' => ['Sensor Ultrasonik', 'Servo SG90', 'Kit Robot Dasar', 'Laptop'],
            ],
            [
                'title' => 'Pertemuan 3: Logika Pemrograman',
                'date' => '2025-04-19',
                'status' => 'hadir',
                'description' => 'Eksplorasi logika algoritma percabangan (if-else), variabel status, dan operator pembanding pada coding.',
                'module_name' => 'Modul 5 – Logika Program',
                'module_type' => 'coding',
                'tools' => ['Laptop', 'IDE Block Coding', 'Lembar Kerja Logika'],
            ],
            [
                'title' => 'Pertemuan 4: Mini Project Robotika',
                'date' => '2025-04-26',
                'status' => 'hadir',
                'description' => 'Integrasi menyeluruh sensor, kontrol motor, dan logika percabangan dalam proyek robot penghindar rintangan sederhana.',
                'module_name' => 'Modul 6 – Mini Project Robotika',
                'module_type' => 'robot',
                'tools' => ['Kit Robot Lengkap', 'Baterai Li-ion', 'Laptop', 'Track Uji Coba'],
            ],

            // === BLOK 2: PERTEMUAN 5 - 8 (MEI 2025) ===
            [
                'title' => 'Pertemuan 5: Kontrol Motor & Navigasi',
                'date' => '2025-05-03',
                'status' => 'hadir',
                'description' => 'Pembahasan modul driver motor H-Bridge (L298N/TB6612) dan teknik kontrol kecepatan PWM untuk pergerakan presisi.',
                'module_name' => 'Modul 3 – Kontrol Motor & Navigasi',
                'module_type' => 'robot',
                'tools' => ['Driver Motor DC', 'Motor TT Gear', 'Kit Chassis Robot', 'Multimeter'],
            ],
            [
                'title' => 'Pertemuan 6: Algoritma Perulangan & Array',
                'date' => '2025-05-10',
                'status' => 'hadir',
                'description' => 'Pemrograman tingkat lanjut: pengulangan loop bersarang (nested loop), array data sensor, dan fungsi modular.',
                'module_name' => 'Modul 4 – Algoritma Perulangan & Array',
                'module_type' => 'coding',
                'tools' => ['Laptop', 'Code Editor', 'Modul Array Scratch/Python'],
            ],
            [
                'title' => 'Pertemuan 7: Integrasi Sensor Lanjutan',
                'date' => '2025-05-17',
                'status' => 'hadir',
                'description' => 'Pemasangan sensor garis reflektif (infrared array) dan sensor warna TCS3200 untuk navigasi jalur kompleks.',
                'module_name' => 'Modul 7 – Integrasi Sensor Lanjutan',
                'module_type' => 'robot',
                'tools' => ['Sensor Infrared 5-Channel', 'Sensor Warna TCS3200', 'Robot Chassis', 'Laptop'],
            ],
            [
                'title' => 'Pertemuan 8: Autonomous Mobile Robot Final',
                'date' => '2025-05-24',
                'status' => 'hadir',
                'description' => 'Puncak pembelajaran siklus 8 pertemuan: perakitan dan pemrograman robot penelusur jalur otomatis (line tracer otonom) dengan tantangan rintangan.',
                'module_name' => 'Modul 8 – Autonomous Mobile Robot Final',
                'module_type' => 'robot',
                'tools' => ['Autonomous Robot Kit', 'Arena Kompetisi', 'Stopwatch', 'Laptop'],
            ],

            // === SESI KALENDER BERIKUTNYA (JUNI 2025) - STATUS DIVERSIFIKASI ===
            [
                'title' => 'Pertemuan 9: Persiapan Kompetisi Robotika',
                'date' => '2025-06-07',
                'status' => 'reschedule',
                'description' => 'Sesi dijadwalkan ulang atas permohonan orang tua murid karena Aira mewakili sekolah dalam olimpiade matematika.',
                'module_name' => 'Modul 9 – Intro Pemrograman AI',
                'module_type' => 'coding',
                'tools' => ['Laptop', 'Modul Panduan Kompetisi'],
            ],
            [
                'title' => 'Libur Semester & Jeda Pembelajaran',
                'date' => '2025-06-14',
                'status' => 'libur',
                'description' => 'Kegiatan belajar mengajar ditiadakan dalam rangka libur cuti bersama semester genap.',
                'tools' => [],
                'module_name' => null,
                'module_type' => null,
            ],
            [
                'title' => 'Pertemuan 10: Internet of Things (IoT) Dasar',
                'date' => '2025-06-21',
                'status' => 'akan-datang',
                'description' => 'Pengenalan mikrokontroler ESP32, konektivitas Wi-Fi nirkabel, dan pengiriman telemetri sensor ke dashboard cloud IoT.',
                'module_name' => 'Modul 10 – IoT & Telemetri Dasar',
                'module_type' => 'robot',
                'tools' => ['Board ESP32 DevKit', 'Sensor DHT11', 'Breadboard & Jumper', 'Laptop'],
            ],
            [
                'title' => 'Pertemuan 11: Machine Learning Sederhana',
                'date' => '2025-06-28',
                'status' => 'akan-datang',
                'description' => 'Eksperimen kecerdasan buatan pengenalan gestur tangan menggunakan Teachable Machine untuk mengendalikan robot nirkabel.',
                'module_name' => 'Modul 11 – Vision & Machine Learning',
                'module_type' => 'coding',
                'tools' => ['Webcam Laptop', 'Model AI Teachable Machine', 'ESP32 Receiver'],
            ],
        ];

        foreach ($sessionsData as $data) {
            // Create learning session for Aira with tutor_id
            $session = LearningSession::create([
                'user_id' => $aira->id,
                'tutor_id' => $tutorId,
                'title' => $data['title'],
                'date_string' => Carbon::createFromFormat('Y-m-d', $data['date'])->translatedFormat('l, d F Y'),
                'date' => $data['date'],
                'status' => $data['status'],
                'description' => $data['description'],
                'tools' => $data['tools'],
            ]);

            // If module specified, attach
            if (!empty($data['module_name'])) {
                $module = Module::firstOrCreate(
                    ['name' => $data['module_name']],
                    [
                        'module_type' => $data['module_type'],
                        'format' => 'PDF',
                        'size' => '4.2 MB',
                    ]
                );

                $session->modules()->syncWithoutDetaching([$module->id]);
            }
        }

        echo "✅ Created 12 learning sessions for Aira (8 hadir, 1 reschedule, 1 libur, 2 akan-datang).\n";
    }
}
