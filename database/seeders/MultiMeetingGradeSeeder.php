<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Module;
use App\Models\GradeEntry;
use Carbon\Carbon;

class MultiMeetingGradeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * Membuat data nilai pertemuan 1 sampai 12 (kelipatan 4: 1-4, 5-8, 9-12)
     * untuk murid Aira agar opsi filter pertemuan di rapor PDF dapat diuji secara maksimal.
     */
    public function run(): void
    {
        $student = User::where('role', 'user')->first();
        $tutor = User::where('role', 'tutor')->first();

        if (!$student || !$tutor) {
            echo "Student or Tutor not found. Skipping MultiMeetingGradeSeeder.\n";
            return;
        }

        $modules = Module::all();

        // 12 pertemuan
        $mockScores = [
            1 => ['fokus' => 4.2, 'robot' => 4.0, 'tools' => 4.1, 'interaksi' => 4.5, 'coding' => 4.0, 'type' => 'robot'],
            2 => ['fokus' => 4.3, 'robot' => 4.2, 'tools' => 4.3, 'interaksi' => 4.6, 'coding' => 4.1, 'type' => 'robot'],
            3 => ['fokus' => 4.5, 'robot' => null, 'tools' => 4.2, 'interaksi' => 4.7, 'coding' => 4.4, 'type' => 'coding'],
            4 => ['fokus' => 4.6, 'robot' => 4.4, 'tools' => 4.5, 'interaksi' => 4.8, 'coding' => 4.5, 'type' => 'robot'],
            // Blok 5-8
            5 => ['fokus' => 4.4, 'robot' => 4.3, 'tools' => 4.4, 'interaksi' => 4.5, 'coding' => 4.2, 'type' => 'robot'],
            6 => ['fokus' => 4.7, 'robot' => 4.6, 'tools' => 4.5, 'interaksi' => 4.9, 'coding' => 4.7, 'type' => 'robot'],
            7 => ['fokus' => 4.8, 'robot' => null, 'tools' => 4.6, 'interaksi' => 4.8, 'coding' => 4.9, 'type' => 'coding'],
            8 => ['fokus' => 4.9, 'robot' => 4.8, 'tools' => 4.7, 'interaksi' => 5.0, 'coding' => 4.8, 'type' => 'robot'],
            // Blok 9-12
            9 => ['fokus' => 4.7, 'robot' => 4.5, 'tools' => 4.6, 'interaksi' => 4.7, 'coding' => 4.6, 'type' => 'robot'],
            10 => ['fokus' => 4.8, 'robot' => 4.7, 'tools' => 4.7, 'interaksi' => 4.8, 'coding' => 4.8, 'type' => 'robot'],
            11 => ['fokus' => 4.9, 'robot' => null, 'tools' => 4.8, 'interaksi' => 4.9, 'coding' => 5.0, 'type' => 'coding'],
            12 => ['fokus' => 5.0, 'robot' => 4.9, 'tools' => 5.0, 'interaksi' => 5.0, 'coding' => 5.0, 'type' => 'robot'],
        ];

        // Hapus nilai lama student agar bersih dan terstruktur rapi 1-12
        GradeEntry::where('student_id', $student->id)->delete();

        $startDate = Carbon::now()->subMonths(3);

        foreach ($mockScores as $meetingNum => $score) {
            $module = $modules->skip(($meetingNum - 1) % max(1, $modules->count()))->first();

            $entry = GradeEntry::create([
                'student_id' => $student->id,
                'tutor_id' => $tutor->id,
                'module_id' => $module?->id,
                'learning_session_id' => null,
                'meeting_number' => $meetingNum,
                'module_type' => $score['type'],
                'meeting_date' => $startDate->copy()->addWeeks($meetingNum - 1)->toDateString(),
                'fokus' => $score['fokus'],
                'robot_building' => $score['robot'],
                'tools_management' => $score['tools'],
                'interaksi' => $score['interaksi'],
                'coding' => $score['coding'],
                'notes' => "Evaluasi pertemuan ke-{$meetingNum}: Kinerja sangat memuaskan dan partisipatif.",
            ]);

            $entry->recalculateAverage();
            $entry->save();
        }

        echo "Berhasil membuat 12 grade entries (pertemuan 1-12) untuk murid: {$student->name}\n";
    }
}
