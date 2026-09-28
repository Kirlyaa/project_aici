<?php

namespace Tests\Feature;

use App\Models\Classroom;
use App\Models\LearningSession;
use App\Models\Module;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TutorCalendarTest extends TestCase
{
    use RefreshDatabase;

    public function test_tutor_can_access_teaching_calendar(): void
    {
        $tutor = User::factory()->create(['role' => 'tutor']);
        $student = User::factory()->create(['role' => 'user', 'tutor_id' => $tutor->id]);

        $session = LearningSession::create([
            'user_id' => $student->id,
            'tutor_id' => $tutor->id,
            'title' => 'Sesi Mengajar Tutor 1',
            'date_string' => 'Senin, 10 November 2025',
            'date' => '2025-11-10',
            'status' => 'akan-datang',
        ]);

        $response = $this->actingAs($tutor)->get(route('tutor.teaching-calendar'));
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Tutor/TeachingCalendarManager')
            ->has('sessions', 1)
            ->where('sessions.0.id', $session->id)
            ->where('sessions.0.title', 'Sesi Mengajar Tutor 1')
        );
    }

    public function test_tutor_can_update_session_status(): void
    {
        $tutor = User::factory()->create(['role' => 'tutor']);
        $student = User::factory()->create(['role' => 'user', 'tutor_id' => $tutor->id]);

        $session = LearningSession::create([
            'user_id' => $student->id,
            'tutor_id' => $tutor->id,
            'title' => 'Sesi Mengajar',
            'date_string' => 'Senin, 10 November 2025',
            'date' => '2025-11-10',
            'status' => 'akan-datang',
        ]);

        $response = $this->actingAs($tutor)->put(route('tutor.calendar.update', $session->id), [
            'status' => 'hadir',
            'student_id' => $student->id,
            'title' => 'Sesi Mengajar',
            'date_string' => 'Senin, 10 November 2025',
            'date' => '2025-11-10',
        ]);

        $response->assertSessionHas('success');
        $this->assertDatabaseHas('learning_sessions', [
            'id' => $session->id,
            'status' => 'hadir',
        ]);
    }

    public function test_superadmin_can_access_tutor_calendar(): void
    {
        $superadmin = User::factory()->create(['role' => 'superadmin']);
        $tutor = User::factory()->create(['role' => 'tutor']);
        $student = User::factory()->create(['role' => 'user', 'tutor_id' => $tutor->id]);

        $session = LearningSession::create([
            'user_id' => $student->id,
            'tutor_id' => $tutor->id,
            'title' => 'Jadwal Mengajar Khusus',
            'date_string' => 'Selasa, 11 November 2025',
            'date' => '2025-11-11',
            'status' => 'akan-datang',
        ]);

        $response = $this->actingAs($superadmin)->get(route('superadmin.calendar.tutors', $tutor->id));
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('SuperAdmin/TutorCalendarManager')
            ->where('tutorId', $tutor->id)
            ->has('sessions', 1)
            ->where('sessions.0.id', $session->id)
        );
    }

    public function test_superadmin_can_create_and_manage_session_with_tutor_id(): void
    {
        $superadmin = User::factory()->create(['role' => 'superadmin']);
        $tutor = User::factory()->create(['role' => 'tutor']);
        $student = User::factory()->create(['role' => 'user']);

        $response = $this->actingAs($superadmin)->post(route('superadmin.calendar.store'), [
            'student_id' => $student->id,
            'tutor_id' => $tutor->id,
            'title' => 'Pertemuan AI Dasar',
            'date_string' => 'Rabu, 12 November 2025',
            'date' => '2025-11-12',
            'status' => 'akan-datang',
            'admin_note_for_tutor' => 'Harap siapkan kit robotika',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('learning_sessions', [
            'user_id' => $student->id,
            'tutor_id' => $tutor->id,
            'title' => 'Pertemuan AI Dasar',
            'admin_note_for_tutor' => 'Harap siapkan kit robotika',
        ]);
    }

    public function test_tutor_cannot_create_session_directly(): void
    {
        $tutor = User::factory()->create(['role' => 'tutor']);
        $student = User::factory()->create(['role' => 'user', 'tutor_id' => $tutor->id]);

        $response = $this->actingAs($tutor)->post(route('tutor.calendar.store'), [
            'student_id' => $student->id,
            'title' => 'Pertemuan Mandiri Tutor',
            'date_string' => 'Kamis, 13 November 2025',
            'date' => '2025-11-13',
            'status' => 'akan-datang',
        ]);

        $response->assertStatus(403);
    }
}
