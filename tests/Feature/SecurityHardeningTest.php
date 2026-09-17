<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SecurityHardeningTest extends TestCase
{
    use RefreshDatabase;

    public function test_tutor_cannot_manage_another_tutors_student(): void
    {
        $tutorA = User::factory()->create(['role' => 'tutor', 'status' => 'aktif']);
        $tutorB = User::factory()->create(['role' => 'tutor', 'status' => 'aktif']);
        $studentA = User::factory()->create(['role' => 'user', 'tutor_id' => $tutorA->id]);

        $this->assertTrue($tutorA->managesStudent($studentA));
        $this->assertFalse($tutorB->managesStudent($studentA));
    }

    public function test_tutor_can_manage_unassigned_student(): void
    {
        $tutor = User::factory()->create(['role' => 'tutor', 'status' => 'aktif']);
        $student = User::factory()->create(['role' => 'user', 'tutor_id' => null]);

        $this->assertTrue($tutor->managesStudent($student));
    }

    public function test_superadmin_can_manage_any_student(): void
    {
        $admin = User::factory()->create(['role' => 'superadmin']);
        $tutor = User::factory()->create(['role' => 'tutor', 'status' => 'aktif']);
        $student = User::factory()->create(['role' => 'user', 'tutor_id' => $tutor->id]);

        $this->assertTrue($admin->managesStudent($student));
    }
}
