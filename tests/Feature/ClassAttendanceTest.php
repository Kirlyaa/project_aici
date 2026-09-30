<?php

namespace Tests\Feature;

use App\Models\Classroom;
use App\Models\LearningSession;
use App\Models\Module;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ClassAttendanceTest extends TestCase
{
    use RefreshDatabase;

    public function test_tutor_can_fetch_class_attendance_form_data(): void
    {
        $tutor = User::factory()->create(['role' => 'tutor', 'status' => 'aktif']);
        $classroom = Classroom::create([
            'name' => 'Robotik Dasar A',
            'tutor_id' => $tutor->id,
        ]);

        $student1 = User::factory()->create([
            'role' => 'user',
            'status' => 'aktif',
            'classroom_id' => $classroom->id,
            'name' => 'Budi',
        ]);
        $student2 = User::factory()->create([
            'role' => 'user',
            'status' => 'aktif',
            'classroom_id' => $classroom->id,
            'name' => 'Ani',
        ]);

        $module = Module::create([
            'name' => 'Modul 1 Robotik',
            'description' => 'Dasar robotika',
            'tools' => ['Arduino', 'Sensor'],
        ]);

        $response = $this->actingAs($tutor)->getJson(route('tutor.classes.attendance-form', $classroom));

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'classroom' => ['id', 'name'],
            'students',
            'modules',
        ]);
        $response->assertJsonCount(2, 'students');
    }

    public function test_tutor_can_store_meeting_attendance_for_entire_class(): void
    {
        $tutor = User::factory()->create(['role' => 'tutor', 'status' => 'aktif']);
        $classroom = Classroom::create([
            'name' => 'Robotik Dasar B',
            'tutor_id' => $tutor->id,
        ]);

        $student1 = User::factory()->create([
            'role' => 'user',
            'status' => 'aktif',
            'classroom_id' => $classroom->id,
            'name' => 'Budi Pratama',
        ]);
        $student2 = User::factory()->create([
            'role' => 'user',
            'status' => 'aktif',
            'classroom_id' => $classroom->id,
            'name' => 'Siti Nurhaliza',
        ]);

        $module = Module::create([
            'name' => 'Modul Sensor Ultrasonik',
            'description' => 'Mempelajari cara kerja sensor jarak',
            'tools' => ['HC-SR04', 'Breadboard'],
        ]);

        $payload = [
            'date' => '2026-03-30',
            'module_id' => $module->id,
            'title' => 'Pertemuan 5: Sensor Ultrasonik',
            'description' => 'Praktik sensor ultrasonik',
            'tools' => ['HC-SR04', 'Breadboard'],
            'attendances' => [
                [
                    'student_id' => $student1->id,
                    'status' => 'hadir',
                    'note' => 'Aktif bertanya dan merakit dengan baik',
                ],
                [
                    'student_id' => $student2->id,
                    'status' => 'absen', // Tidak Hadir
                    'note' => 'Izin sakit',
                ],
            ],
        ];

        $response = $this->actingAs($tutor)
            ->post(route('tutor.classes.attendance.store', $classroom), $payload);

        $response->assertSessionHas('success');

        // Pastikan learning session tersimpan untuk student 1 (hadir)
        $this->assertDatabaseHas('learning_sessions', [
            'user_id' => $student1->id,
            'classroom_id' => $classroom->id,
            'title' => 'Pertemuan 5: Sensor Ultrasonik',
            'status' => 'hadir',
            'admin_note_for_tutor' => 'Aktif bertanya dan merakit dengan baik',
        ]);

        // Pastikan learning session tersimpan untuk student 2 (tidak hadir / absen)
        $this->assertDatabaseHas('learning_sessions', [
            'user_id' => $student2->id,
            'classroom_id' => $classroom->id,
            'title' => 'Pertemuan 5: Sensor Ultrasonik',
            'status' => 'absen',
            'admin_note_for_tutor' => 'Izin sakit',
        ]);

        // Pastikan modul ter-relasi ke sesi
        $session1 = LearningSession::where('user_id', $student1->id)->first();
        $this->assertNotNull($session1);
        $this->assertTrue($session1->modules->contains($module->id));
    }
}
