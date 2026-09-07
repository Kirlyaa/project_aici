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
        // Get Aira student
        $aira = User::where('email', 'aira@aici.id')->first();
        
        if (!$aira) {
            echo "Aira student not found. Skipping seeder.\n";
            return;
        }

        // Define 5 sessions with mixed statuses
        $sessionsData = [
            [
                'title' => 'Pengenalan Robotika',
                'date' => '2025-04-05',
                'status' => 'hadir',
                'description' => 'Sesi perdana membahas konsep dasar robotika dan block coding. Aira sangat antusias dan langsung mencoba membuat program sederhana.',
                'modules' => [1], // Modul 1
            ],
            [
                'title' => 'Sensor & Aktuator',
                'date' => '2025-05-10',
                'status' => 'hadir',
                'description' => 'Pendalaman materi sensor dan percobaan langsung menggunakan kit robot.',
                'modules' => [2], // Modul 2
            ],
            [
                'title' => 'Kontrol Motor',
                'date' => '2025-05-17',
                'status' => 'absen',
                'description' => 'Sesi ini membahas kontrol motor dan pergerakan dasar robot. Aira tidak hadir.',
                'modules' => [3], // Modul 3
            ],
            [
                'title' => 'Pemrograman Lanjutan',
                'date' => '2025-06-07',
                'status' => 'reschedule',
                'description' => 'Pengenalan pemrograman lanjutan dan logika kondisional. Jadwal diubah.',
                'modules' => [4], // Modul A
            ],
            [
                'title' => 'Coding Dasar 2',
                'date' => '2025-06-14',
                'status' => 'akan-datang',
                'description' => 'Latihan coding dasar menggunakan block programming dan pengenalan variabel.',
                'modules' => [5], // Modul A - Coding Dasar
            ],
        ];

        foreach ($sessionsData as $data) {
            // Create learning session for Aira
            $session = LearningSession::create([
                'user_id' => $aira->id,
                'title' => $data['title'],
                'date_string' => Carbon::createFromFormat('Y-m-d', $data['date'])->format('l, d F Y'),
                'date' => $data['date'],
                'status' => $data['status'],
                'description' => $data['description'],
                'tools' => ['Kit Robot Dasar', 'Laptop', 'Kabel USB'],
            ]);

            // Attach modules
            foreach ($data['modules'] as $moduleId) {
                try {
                    $session->modules()->attach($moduleId);
                } catch (\Exception $e) {
                    // Module might not exist, skip
                }
            }
        }

        echo "✅ Created 5 learning sessions for Aira with mixed statuses.\n";
    }
}
