<?php

namespace Tests\Feature;

use App\Models\Classroom;
use App\Models\LearningSession;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TutorStudentFilterTest extends TestCase
{
    use RefreshDatabase;

    public function test_tutor_only_sees_their_own_students_on_dashboard(): void
    {
        $tutorA = User::factory()->create(['role' => 'tutor', 'status' => 'aktif', 'name' => 'Tutor A']);
        $tutorB = User::factory()->create(['role' => 'tutor', 'status' => 'aktif', 'name' => 'Tutor B']);

        $studentA = User::factory()->create([
            'role' => 'user',
            'status' => 'aktif',
            'name' => 'Murid A',
            'tutor_id' => $tutorA->id,
            'class' => 'Kelas A',
        ]);

        $studentB = User::factory()->create([
            'role' => 'user',
            'status' => 'aktif',
            'name' => 'Murid B',
            'tutor_id' => $tutorB->id,
            'class' => 'Kelas B',
        ]);

        // Tutor A mengunjungi dashboard
        $responseA = $this->actingAs($tutorA)->get(route('tutor.dashboard'));
        $responseA->assertStatus(200);
        $responseA->assertInertia(fn ($page) => $page
            ->component('Tutor/Dashboard')
            ->has('students', 1)
            ->where('students.0.id', $studentA->id)
            ->where('students.0.name', 'Murid A')
            ->where('stats.total_students', 1)
            ->has('classes', 1)
            ->where('classes.0.name', 'Kelas A')
        );

        // Tutor B mengunjungi dashboard
        $responseB = $this->actingAs($tutorB)->get(route('tutor.dashboard'));
        $responseB->assertStatus(200);
        $responseB->assertInertia(fn ($page) => $page
            ->component('Tutor/Dashboard')
            ->has('students', 1)
            ->where('students.0.id', $studentB->id)
            ->where('students.0.name', 'Murid B')
            ->where('stats.total_students', 1)
            ->has('classes', 1)
            ->where('classes.0.name', 'Kelas B')
        );
    }

    public function test_tutor_sees_students_from_assigned_classroom(): void
    {
        $tutor = User::factory()->create(['role' => 'tutor', 'status' => 'aktif']);
        $classroom = Classroom::create([
            'name' => 'Kelas Robotik 1',
            'tutor_id' => $tutor->id,
        ]);

        $studentInClass = User::factory()->create([
            'role' => 'user',
            'status' => 'aktif',
            'name' => 'Murid Robotik',
            'classroom_id' => $classroom->id,
            'tutor_id' => null,
        ]);

        $response = $this->actingAs($tutor)->get(route('tutor.dashboard'));
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Tutor/Dashboard')
            ->has('students', 1)
            ->where('students.0.id', $studentInClass->id)
        );
    }

    public function test_tutor_sees_students_with_scheduled_sessions(): void
    {
        $tutor = User::factory()->create(['role' => 'tutor', 'status' => 'aktif']);
        $otherTutor = User::factory()->create(['role' => 'tutor', 'status' => 'aktif']);

        $student = User::factory()->create([
            'role' => 'user',
            'status' => 'aktif',
            'name' => 'Murid Sesi',
            'tutor_id' => $otherTutor->id,
        ]);

        LearningSession::create([
            'user_id' => $student->id,
            'tutor_id' => $tutor->id,
            'title' => 'Sesi Pengganti',
            'date_string' => 'Senin, 10 November 2025',
            'date' => '2025-11-10',
            'status' => 'akan-datang',
        ]);

        $response = $this->actingAs($tutor)->get(route('tutor.dashboard'));
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Tutor/Dashboard')
            ->has('students', 1)
            ->where('students.0.id', $student->id)
        );
    }

    public function test_superadmin_can_see_all_students_on_tutor_dashboard(): void
    {
        $superadmin = User::factory()->create(['role' => 'superadmin', 'status' => 'aktif']);
        $tutorA = User::factory()->create(['role' => 'tutor', 'status' => 'aktif']);
        $tutorB = User::factory()->create(['role' => 'tutor', 'status' => 'aktif']);

        User::factory()->create(['role' => 'user', 'status' => 'aktif', 'tutor_id' => $tutorA->id]);
        User::factory()->create(['role' => 'user', 'status' => 'aktif', 'tutor_id' => $tutorB->id]);

        $response = $this->actingAs($superadmin)->get(route('tutor.dashboard'));
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Tutor/Dashboard')
            ->has('students', 2)
            ->where('stats.total_students', 2)
        );
    }

    public function test_tutor_calendar_dropdown_only_lists_taught_students(): void
    {
        $tutorA = User::factory()->create(['role' => 'tutor', 'status' => 'aktif']);
        $tutorB = User::factory()->create(['role' => 'tutor', 'status' => 'aktif']);

        $studentA = User::factory()->create(['role' => 'user', 'status' => 'aktif', 'tutor_id' => $tutorA->id]);
        $studentB = User::factory()->create(['role' => 'user', 'status' => 'aktif', 'tutor_id' => $tutorB->id]);

        $response = $this->actingAs($tutorA)->get(route('tutor.teaching-calendar'));
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Tutor/TeachingCalendarManager')
            ->has('students', 1)
            ->where('students.0.id', $studentA->id)
        );
    }
}
