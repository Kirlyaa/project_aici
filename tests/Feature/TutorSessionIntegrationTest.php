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

    public function test_superadmin_can_update_tutor_basic_info(): void
    {
        $superAdmin = User::factory()->create(['role' => 'superadmin']);
        $tutor = User::factory()->create(['role' => 'tutor', 'status' => 'aktif', 'email' => 'yoel@aici.com']);

        $response = $this->actingAs($superAdmin)->put(route('superadmin.tutors.update', $tutor), [
            'name' => 'Yoel Updated',
            'email' => 'yoel@aici.id',
            'status' => 'aktif',
        ]);

        $response->assertSessionHasNoErrors();
        $this->assertEquals('Yoel Updated', $tutor->fresh()->name);
        $this->assertEquals('yoel@aici.id', $tutor->fresh()->email);
    }

    public function test_soft_deleting_user_frees_email_for_another_user(): void
    {
        $oldUser = User::factory()->create([
            'email' => 'kak.yoel@aici.id',
            'role' => 'tutor',
        ]);
        $oldUser->delete();

        $this->assertStringContainsString('.deleted.', $oldUser->fresh()->email);

        $superAdmin = User::factory()->create(['role' => 'superadmin']);
        $newTutor = User::factory()->create([
            'email' => 'yoel.temp@aici.com',
            'role' => 'tutor',
        ]);

        $response = $this->actingAs($superAdmin)->put(route('superadmin.tutors.update', $newTutor), [
            'name' => 'Yoel',
            'email' => 'kak.yoel@aici.id',
            'status' => 'aktif',
        ]);

        $response->assertSessionHasNoErrors();
        $this->assertEquals('kak.yoel@aici.id', $newTutor->fresh()->email);
    }

    public function test_superadmin_can_update_tutor_password(): void
    {
        $superAdmin = User::factory()->create(['role' => 'superadmin']);
        $tutor = User::factory()->create(['role' => 'tutor', 'status' => 'aktif']);

        $response = $this->actingAs($superAdmin)->put(route('superadmin.tutors.update', $tutor), [
            'name' => $tutor->name,
            'email' => $tutor->email,
            'status' => 'aktif',
            'password' => 'newpassword123',
            'password_confirmation' => 'newpassword123',
        ]);

        $response->assertSessionHasNoErrors();
        $this->assertTrue(\Illuminate\Support\Facades\Hash::check('newpassword123', $tutor->fresh()->password));
    }

    public function test_superadmin_can_assign_and_sync_classrooms_when_updating_tutor(): void
    {
        $superAdmin = User::factory()->create(['role' => 'superadmin']);
        $tutor = User::factory()->create(['role' => 'tutor', 'status' => 'aktif']);

        $classroomA = Classroom::create(['name' => 'Kelas Alpha', 'tutor_id' => null]);
        $classroomB = Classroom::create(['name' => 'Kelas Beta', 'tutor_id' => null]);

        $studentA = User::factory()->create(['role' => 'user', 'classroom_id' => $classroomA->id, 'tutor_id' => null]);
        $sessionA = LearningSession::create([
            'user_id' => $studentA->id,
            'classroom_id' => $classroomA->id,
            'tutor_id' => null,
            'title' => 'Sesi Alpha',
            'date_string' => '2026-10-25',
            'date' => '2026-10-25',
            'status' => 'akan-datang',
        ]);

        // Assign classroomA to tutor
        $response = $this->actingAs($superAdmin)->put(route('superadmin.tutors.update', $tutor), [
            'name' => $tutor->name,
            'email' => $tutor->email,
            'status' => 'aktif',
            'classroom_ids' => [$classroomA->id],
        ]);

        $response->assertSessionHasNoErrors();
        $this->assertEquals($tutor->id, $classroomA->fresh()->tutor_id);
        $this->assertEquals($tutor->id, $studentA->fresh()->tutor_id);
        $this->assertEquals($tutor->id, $sessionA->fresh()->tutor_id);

        // Now update: swap classroomA for classroomB
        $response2 = $this->actingAs($superAdmin)->put(route('superadmin.tutors.update', $tutor), [
            'name' => $tutor->name,
            'email' => $tutor->email,
            'status' => 'aktif',
            'classroom_ids' => [$classroomB->id],
        ]);

        $response2->assertSessionHasNoErrors();
        $this->assertNull($classroomA->fresh()->tutor_id);
        $this->assertNull($studentA->fresh()->tutor_id);
        $this->assertNull($sessionA->fresh()->tutor_id);
        $this->assertEquals($tutor->id, $classroomB->fresh()->tutor_id);
    }

    public function test_superadmin_can_store_tutor_with_assigned_classrooms(): void
    {
        $superAdmin = User::factory()->create(['role' => 'superadmin']);
        $classroom = Classroom::create(['name' => 'Kelas Baru', 'tutor_id' => null]);
        $student = User::factory()->create(['role' => 'user', 'classroom_id' => $classroom->id, 'tutor_id' => null]);

        $response = $this->actingAs($superAdmin)->post(route('superadmin.tutors.store'), [
            'name' => 'Tutor Baru',
            'email' => 'tutor.baru@aici.id',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'status' => 'aktif',
            'classroom_ids' => [$classroom->id],
        ]);

        $response->assertSessionHasNoErrors();
        $newTutor = User::where('email', 'tutor.baru@aici.id')->firstOrFail();
        $this->assertEquals($newTutor->id, $classroom->fresh()->tutor_id);
        $this->assertEquals($newTutor->id, $student->fresh()->tutor_id);
    }
}
