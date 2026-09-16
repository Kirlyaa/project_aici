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

        // B7: Lookup module_id by name instead of hardcoding
        $moduleRobot1 = Module::where('name', 'Modul 1 – Pengenalan Robotika')->first()?->id;
        $moduleRobot2 = Module::where('name', 'Modul 2 – Sensor & Aktuator')->first()?->id
            ?? Module::where('module_type', 'robot')->first()?->id;
        $moduleCoding5 = Module::where('name', 'Modul 5 – Logika Program')->first()?->id
            ?? Module::where('module_type', 'coding')->first()?->id;

        // Define 3 grade entries with different categories (skala 0-5, sesuai validasi StoreGradeEntryRequest)
        $gradeEntriesData = [
            [
                'meeting_number' => 1,
                'module_type' => 'robot',
                'meeting_date' => '2025-04-05',
                'module_id' => $moduleRobot1,
                'fokus' => 4.3,
                'robot_building' => 4.0,
                'tools_management' => 4.1,
                'interaksi' => 4.4,
                'coding' => 3.9,
                'notes' => 'Aira menunjukkan kemajuan yang bagus dalam pemahaman konsep robotika.',
            ],
            [
                'meeting_number' => 2,
                'module_type' => 'robot',
                'meeting_date' => '2025-05-10',
                'module_id' => $moduleRobot2,
                'fokus' => 4.4,
                'robot_building' => 4.3,
                'tools_management' => 4.3,
                'interaksi' => 4.5,
                'coding' => 4.1,
                'notes' => 'Peningkatan signifikan dalam sensitivitas sensor dan aktuator.',
            ],
            [
                'meeting_number' => 3,
                'module_type' => 'coding',
                'meeting_date' => '2025-06-07',
                'module_id' => $moduleCoding5,
                'fokus' => 4.5,
                'robot_building' => null,
                'tools_management' => 4.2,
                'interaksi' => 4.6,
                'coding' => 4.4,
                'notes' => 'Aira sangat mahir dalam penggunaan block programming dan variabel.',
            ],
        ];

        foreach ($gradeEntriesData as $data) {
            $entry = GradeEntry::create([
                'student_id' => $aira->id,
                'tutor_id' => $aiya->id,
                'module_id' => $data['module_id'],
                'learning_session_id' => null,
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
            
            // Manually recalculate average
            $entry->recalculateAverage();
            $entry->save();
        }

        echo "✅ Created 3 grade entries for Aira by tutor Aiya covering all 5 categories.\n";
    }
}
