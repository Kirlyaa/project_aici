<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use App\Models\User;
use App\Models\StudentComment;

class AiraStudentCommentSeeder extends Seeder
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

        // Define comments for semester 2025-04 (Blok Pertemuan 1-4) dan 2025-05 (Blok Pertemuan 5-8)
        $commentsData = [
            // === EVALUASI BLOK 1: PERTEMUAN 1 - 4 (APRIL 2025) ===
            [
                'semester' => '2025-04',
                'academic_year' => 2025,
                'system_comment' => 'Aira telah menyelesaikan siklus 4 pertemuan pertama dengan capaian sangat memuaskan. Terjadi perkembangan konsisten mulai dari pengenalan struktur mekanik robotika, integrasi sensor & aktuator, logika algoritma pemrograman, hingga perancangan proyek mini mandiri.',
                'tutor_comment' => 'Aira adalah siswi yang bersemangat, disiplin, dan cepat memahami materi baru. Kemandirian dalam memecahkan masalah logika saat coding patut diapresiasi.',
                'strengths' => 'Pemahaman logika komputasional cepat, perakitan kabel dan sensor rapi, serta komunikatif saat berdiskusi di kelas.',
                'notes' => 'Pertahankan fokus saat sesi bongkar-pasang komponen dan persiapkan eksplorasi pengendalian motor PWM pada siklus berikutnya.',
                'average_grade' => 4.49,
                'module_names' => [
                    'Modul 1 – Pengenalan Robotika',
                    'Modul 2 – Sensor & Aktuator',
                    'Modul 5 – Logika Program',
                    'Modul 6 – Mini Project Robotika',
                ],
                'is_system_generated' => false,
            ],

            // === EVALUASI BLOK 2: PERTEMUAN 5 - 8 (MEI 2025) ===
            [
                'semester' => '2025-05',
                'academic_year' => 2025,
                'system_comment' => 'Pada siklus pertemuan 5 hingga 8, Aira menunjukkan kematangan kompetensi luar biasa dalam perancangan Autonomous Mobile Robot. Penguasaan array multi-dimensi, modul driver motor DC, dan kalibrasi sensor infrared menghasilkan robot otonom dengan performa lintasan yang presisi dan stabil.',
                'tutor_comment' => 'Luar biasa! Aira menunjukkan dedikasi dan kegigihan tinggi. Saat robot menghadapi deviasi jalur pada pengujian final, Aira mampu melakukan debugging parameter logika secara mandiri hingga berhasil sempurna.',
                'strengths' => 'Kemampuan debugging algoritma mandiri, kalibrasi sensor otonom presisi tinggi, dan daya analitis yang tajam.',
                'notes' => 'Sangat direkomendasikan untuk mewakili kelas dalam ajang kompetisi sains robotika tingkat regional serta melanjutkan ke jenjang IoT & Artificial Intelligence.',
                'average_grade' => 4.74,
                'module_names' => [
                    'Modul 3 – Kontrol Motor & Navigasi',
                    'Modul 4 – Algoritma Perulangan & Array',
                    'Modul 7 – Integrasi Sensor Lanjutan',
                    'Modul 8 – Autonomous Mobile Robot Final',
                ],
                'is_system_generated' => false,
            ],
        ];

        foreach ($commentsData as $data) {
            StudentComment::updateOrCreate(
                [
                    'student_id' => $aira->id,
                    'semester'   => $data['semester'],
                ],
                [
                    'tutor_id'            => $aiya->id,
                    'academic_year'       => $data['academic_year'],
                    'system_comment'      => $data['system_comment'],
                    'tutor_comment'       => $data['tutor_comment'],
                    'strengths'           => $data['strengths'],
                    'notes'               => $data['notes'],
                    'average_grade'       => $data['average_grade'],
                    'module_names'        => $data['module_names'],
                    'is_system_generated' => $data['is_system_generated'],
                ]
            );
        }

        echo "✅ Created student comments for Aira covering 2 evaluation blocks (2025-04 & 2025-05).\n";
    }
}
