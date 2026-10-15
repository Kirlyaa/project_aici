<?php

namespace Tests\Feature;

use App\Models\Classroom;
use App\Models\LearningSession;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TutorSessionIntegrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_tutor_management_displays_correct_session_count_matching_calendar(): void
    {
        $superAdmin = User::factory()->create(['role' => 'superadmin']);
        $tutor = User::factory()->create(['role' => 'tutor', 'status' => 'aktif']);

        $classroom = Classroom::create([
            'name' => 'Kelas Coding Alpha',
            'tutor_id' => $tutor->id,
        ]);

        // Dua murid di kelas yang sama
        $student1 = User::factory()->create([
            'role' => 'user',
            'status' => 'aktif',
            'tutor_id' => $tutor->id,
            'classroom_id' => $classroom->id,
        ]);

        $student2 = User::factory()->create([
            'role' => 'user',
            'status' => 'aktif',
            'tutor_id' => $tutor->id,
            'classroom_id' => $classroom->id,
        ]);

        // Pertemuan 1 untuk kedua murid (tanggal sama)
        LearningSession::create([
            'user_id' => $student1->id,
            'classroom_id' => $classroom->id,
            'tutor_id' => $tutor->id,
            'title' => 'Pertemuan 1',
            'date_string' => '2026-10-20',
            'date' => '2026-10-20',
            'status' => 'akan-datang',
        ]);
        LearningSession::create([
            'user_id' => $student2->id,
            'classroom_id' => $classroom->id,
            'tutor_id' => $tutor->id,
            'title' => 'Pertemuan 1',
            'date_string' => '2026-10-20',
            'date' => '2026-10-20',
            'status' => 'akan-datang',
        ]);

        // Pertemuan 2 untuk kedua murid (tanggal sama)
        LearningSession::create([
            'user_id' => $student1->id,
            'classroom_id' => $classroom->id,
            'tutor_id' => $tutor->id,
            'title' => 'Pertemuan 2',
            'date_string' => '2026-10-27',
            'date' => '2026-10-27',
            'status' => 'akan-datang',
        ]);
        LearningSession::create([
            'user_id' => $student2->id,
            'classroom_id' => $classroom->id,
            'tutor_id' => $tutor->id,
            'title' => 'Pertemuan 2',
            'date_string' => '2026-10-27',
            'date' => '2026-10-27',
            'status' => 'akan-datang',
        ]);

        $response = $this->actingAs($superAdmin)->get(route('superadmin.tutors'));
        $response->assertOk();

        $users = $response->viewData('page')['props']['users']['data'];
        $tutorData = collect($users)->firstWhere('id', $tutor->id);

        $this->assertNotNull($tutorData);
        $this->assertEquals(2, $tutorData['students_count']);
        // Meskipun ada 4 record session (2 murid x 2 pertemuan), sesi kelas yang dihitung adalah 2 pertemuan!
        $this->assertEquals(2, $tutorData['sessions_count']);
        $this->assertEquals(1, $tutorData['classrooms_count']);
        $this->assertCount(1, $tutorData['classrooms']);
        $this->assertEquals('Kelas Coding Alpha', $tutorData['classrooms'][0]['name']);
        $this->assertEquals(2, $tutorData['classrooms'][0]['meetings_count']);
    }

    public function test_assigning_student_to_tutor_synchronizes_student_sessions(): void
    {
        $superAdmin = User::factory()->create(['role' => 'superadmin']);
        $tutor = User::factory()->create(['role' => 'tutor', 'status' => 'aktif']);

        $student = User::factory()->create([
            'role' => 'user',
            'status' => 'aktif',
            'tutor_id' => null,
        ]);

        $session = LearningSession::create([
            'user_id' => $student->id,
            'tutor_id' => null,
            'title' => 'Pertemuan 1',
            'date_string' => '2026-10-20',
            'date' => '2026-10-20',
            'status' => 'akan-datang',
        ]);

        $this->actingAs($superAdmin)->post(route('superadmin.tutors.assign-student', $tutor), [
            'student_id' => $student->id,
        ]);

        $this->assertEquals($tutor->id, $student->fresh()->tutor_id);
        $this->assertEquals($tutor->id, $session->fresh()->tutor_id);
    }

    public function test_updating_classroom_tutor_synchronizes_sessions(): void
    {
        $superAdmin = User::factory()->create(['role' => 'superadmin']);
        $oldTutor = User::factory()->create(['role' => 'tutor', 'status' => 'aktif']);
        $newTutor = User::factory()->create(['role' => 'tutor', 'status' => 'aktif']);

        $classroom = Classroom::create([
            'name' => 'Kelas Robotika',
            'tutor_id' => $oldTutor->id,
        ]);

        $student = User::factory()->create([
            'role' => 'user',
            'status' => 'aktif',
            'tutor_id' => $oldTutor->id,
            'classroom_id' => $classroom->id,
        ]);

        $session = LearningSession::create([
            'user_id' => $student->id,
            'classroom_id' => $classroom->id,
            'tutor_id' => $oldTutor->id,
            'title' => 'Pertemuan Robotika 1',
            'date_string' => '2026-10-20',
            'date' => '2026-10-20',
            'status' => 'akan-datang',
        ]);

        $this->actingAs($superAdmin)->put(route('superadmin.classes.update', $classroom), [
            'name' => 'Kelas Robotika Updated',
            'tutor_id' => $newTutor->id,
        ]);

        $this->assertEquals($newTutor->id, $student->fresh()->tutor_id);
        $this->assertEquals($newTutor->id, $session->fresh()->tutor_id);
    }
}
