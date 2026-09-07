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

        // Define 2 comments for different semesters
        $commentsData = [
            [
                'semester' => '2025-05',
                'academic_year' => 2025,
                'system_comment' => 'Aira menunjukkan pemahaman yang baik tentang dasar-dasar robotika. Fokus dan perhatiannya terhadap detail sangat baik, dan dia mampu mengikuti instruksi dengan baik.',
                'tutor_comment' => 'Aira adalah siswa yang sangat termotivasi. Dia selalu bertanya ketika tidak mengerti dan aktif berpartisipasi dalam setiap sesi pembelajaran.',
                'average_grade' => 8.55,
                'is_system_generated' => false,
            ],
            [
                'semester' => '2025-06',
                'academic_year' => 2025,
                'system_comment' => 'Aira telah membuat kemajuan luar biasa dalam pemrograman dan kontrol motor. Kemampuannya untuk menangkap konsep kompleks sangat mengesankan.',
                'tutor_comment' => 'Terus pertahankan semangat dan dedikasi ini Aira! Kamu memiliki potensi yang besar dalam bidang robotika dan coding.',
                'average_grade' => 8.75,
                'is_system_generated' => false,
            ],
        ];

        foreach ($commentsData as $data) {
            StudentComment::create([
                'student_id' => $aira->id,
                'tutor_id' => $aiya->id,
                'semester' => $data['semester'],
                'academic_year' => $data['academic_year'],
                'system_comment' => $data['system_comment'],
                'tutor_comment' => $data['tutor_comment'],
                'average_grade' => $data['average_grade'],
                'module_names' => ['Modul 1 - Pengenalan Robotika', 'Modul 2 - Sensor & Aktuator'],
                'is_system_generated' => $data['is_system_generated'],
            ]);
        }

        echo "✅ Created 2 student comments for Aira from tutor Aiya for different semesters.\n";
    }
}
