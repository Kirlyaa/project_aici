<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Module;
use App\Models\GradeEntry;
use App\Models\LearningSession;
use Carbon\Carbon;

class RaporSeeder extends Seeder
{
    /**
     * Seeder data nilai untuk 4 pertemuan siklus rapor lengkap beserta komentar tutor.
     * Digunakan untuk memastikan 5 grafik (1 summary + 4 pertemuan) memiliki data valid dan konsisten.
     */
    public function run(): void
    {
        $aira = User::where('email', 'aira@aici.id')->first();
        $tutorAiya = User::where('email', 'aiya@aici.id')->first();

        if ($aira && $tutorAiya) {
            // Modul untuk 4 pertemuan siklus pertama
            $modules = [
                1 => Module::firstOrCreate(
                    ['name' => 'Modul 1 – Pengenalan Robotika'],
                    ['module_type' => 'robot', 'format' => 'PDF', 'size' => '4.2 MB']
                ),
                2 => Module::firstOrCreate(
                    ['name' => 'Modul 2 – Sensor & Aktuator'],
                    ['module_type' => 'robot', 'format' => 'PDF', 'size' => '3.8 MB']
                ),
                3 => Module::firstOrCreate(
                    ['name' => 'Modul 5 – Logika Program'],
                    ['module_type' => 'coding', 'format' => 'PDF', 'size' => '3.2 MB']
                ),
                4 => Module::firstOrCreate(
                    ['name' => 'Modul 6 – Mini Project Robotika'],
                    ['module_type' => 'robot', 'format' => 'PDF', 'size' => '4.8 MB']
                ),
            ];

            // 4 Pertemuan Siklus Rapor Aira
            $meetingsData = [
                1 => [
                    'module_id' => $modules[1]->id,
                    'module_type' => 'robot',
                    'date' => '2025-04-05',
                    'fokus' => 4.30,
                    'robot_building' => 4.20,
                    'tools_management' => 4.10,
                    'interaksi' => 4.40,
                    'coding' => 4.00,
                    'notes' => 'Pertemuan 1: Aira menunjukkan adaptasi dan ketertarikan tinggi pada pengenalan dasar robotika. Pemahaman fungsi masing-masing komponen mekanik sangat cepat dan mampu bekerja sama dengan rekan sekelas secara kooperatif.',
                ],
                2 => [
                    'module_id' => $modules[2]->id,
                    'module_type' => 'robot',
                    'date' => '2025-04-12',
                    'fokus' => 4.50,
                    'robot_building' => 4.40,
                    'tools_management' => 4.30,
                    'interaksi' => 4.60,
                    'coding' => 4.20,
                    'notes' => 'Pertemuan 2: Pemahaman sensor ultrasonik dan aktuator gerak meningkat pesat. Mampu melakukan kalibrasi jarak rintangan dengan rapi, teliti, serta cermat dalam penggunaan perkakas praktikum.',
                ],
                3 => [
                    'module_id' => $modules[3]->id,
                    'module_type' => 'coding',
                    'date' => '2025-04-19',
                    'fokus' => 4.60,
                    'robot_building' => null, // Modul coding kriteria 4 aspek
                    'tools_management' => 4.40,
                    'interaksi' => 4.70,
                    'coding' => 4.80,
                    'notes' => 'Pertemuan 3: Sangat unggul dalam logika percabangan kondisional dan perulangan loop. Aira berhasil memecahkan tantangan algoritma pemrograman secara mandiri dengan sintaks yang rapi.',
                ],
                4 => [
                    'module_id' => $modules[4]->id,
                    'module_type' => 'robot',
                    'date' => '2025-04-26',
                    'fokus' => 4.80,
                    'robot_building' => 4.70,
                    'tools_management' => 4.60,
                    'interaksi' => 4.80,
                    'coding' => 4.70,
                    'notes' => 'Pertemuan 4: Performa istimewa pada proyek mini mandiri. Integrasi antara kode kontrol dan rakitan fisik robot otonom berfungsi dengan sempurna dan akurat menyelesaikan lintasan uji coba.',
                ],
            ];

            foreach ($meetingsData as $mNum => $m) {
                $session = LearningSession::where('user_id', $aira->id)
                    ->where('date', $m['date'])
                    ->first();

                $entry = GradeEntry::updateOrCreate(
                    [
                        'student_id' => $aira->id,
                        'meeting_number' => $mNum,
                    ],
                    [
                        'tutor_id' => $tutorAiya->id,
                        'module_id' => $m['module_id'],
                        'learning_session_id' => $session?->id,
                        'module_type' => $m['module_type'],
                        'meeting_date' => $m['date'],
                        'fokus' => $m['fokus'],
                        'robot_building' => $m['robot_building'],
                        'tools_management' => $m['tools_management'],
                        'interaksi' => $m['interaksi'],
                        'coding' => $m['coding'],
                        'notes' => $m['notes'],
                    ]
                );

                $entry->recalculateAverage();
                $entry->save();
            }

            echo "✅ RaporSeeder: Berhasil menyimpan data nilai dan komentar tutor untuk 4 pertemuan murid Aira.\n";
        }
    }
}
