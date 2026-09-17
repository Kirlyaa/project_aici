<?php

namespace Tests\Feature;

use App\Models\GradeEntry;
use App\Models\LearningSession;
use App\Models\Module;
use App\Models\StudentComment;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SuperAdminStudentGovernanceTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;
    private User $tutor;
    private User $student;
    private Module $module;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutMiddleware();

        $this->admin = User::factory()->create([
            'role' => 'superadmin',
            'status' => 'aktif',
        ]);

        $this->tutor = User::factory()->create([
            'role' => 'tutor',
            'status' => 'aktif',
        ]);

        $this->student = User::factory()->create([
            'role' => 'user',
            'status' => 'aktif',
            'tutor_id' => $this->tutor->id,
            'class' => 'AI Class A',
        ]);

        $this->module = Module::create([
            'name' => 'Robot Artifical Intelligence',
            'module_type' => 'robot',
        ]);
    }

    public function test_superadmin_can_view_student_account_detail_hub(): void
    {
        $response = $this->actingAs($this->admin)->get("/superadmin/students/{$this->student->id}");
        if ($response->status() !== 200) {
            dump($response->status(), $response->getContent());
        }
        $response->assertOk();
    }

    public function test_superadmin_can_view_student_grade_report(): void
    {
        GradeEntry::create([
            'student_id' => $this->student->id,
            'tutor_id' => $this->tutor->id,
            'module_id' => $this->module->id,
            'meeting_number' => 1,
            'module_type' => 'robot',
            'meeting_date' => now()->toDateString(),
            'fokus' => 4.5,
            'robot_building' => 4.8,
            'tools_management' => 4.2,
            'interaksi' => 4.6,
            'coding' => 4.5,
            'notes' => 'Siswa sangat aktif',
        ]);

        $response = $this->actingAs($this->admin)->get("/superadmin/students/{$this->student->id}/report");
        $response->assertOk();
    }

    public function test_superadmin_can_view_student_pdf_report(): void
    {
        GradeEntry::create([
            'student_id' => $this->student->id,
            'tutor_id' => $this->tutor->id,
            'module_id' => $this->module->id,
            'meeting_number' => 1,
            'module_type' => 'robot',
            'meeting_date' => now()->toDateString(),
            'fokus' => 4.5,
            'robot_building' => 4.8,
            'tools_management' => 4.2,
            'interaksi' => 4.6,
            'coding' => 4.5,
        ]);

        $response = $this->actingAs($this->admin)->get("/superadmin/students/{$this->student->id}/pdf");
        $response->assertOk();
    }

    public function test_superadmin_can_manage_grades_and_comments(): void
    {
        // Akses halaman nilai tutor oleh SuperAdmin
        $gradePageResponse = $this->actingAs($this->admin)->get("/tutor/grades/{$this->student->id}");
        $gradePageResponse->assertOk();

        // Superadmin store grade
        $storeGrade = $this->actingAs($this->admin)->withoutMiddleware(\Illuminate\Foundation\Http\Middleware\ValidateCsrfToken::class)->post('/tutor/grades', [
            'student_id' => $this->student->id,
            'module_id' => $this->module->id,
            'meeting_number' => 1,
            'module_type' => 'robot',
            'meeting_date' => now()->toDateString(),
            'fokus' => 5,
            'robot_building' => 5,
            'tools_management' => 5,
            'interaksi' => 5,
            'coding' => 5,
        ]);
        $storeGrade->assertRedirect();
        $this->assertDatabaseHas('grade_entries', [
            'student_id' => $this->student->id,
            'meeting_number' => 1,
        ]);

        // Akses halaman komentar tutor oleh SuperAdmin
        $commentPageResponse = $this->actingAs($this->admin)->get("/tutor/comments/{$this->student->id}");
        $commentPageResponse->assertOk();

        // Superadmin store comment
        $storeComment = $this->actingAs($this->admin)->withoutMiddleware(\Illuminate\Foundation\Http\Middleware\ValidateCsrfToken::class)->post('/tutor/comments', [
            'student_id' => $this->student->id,
            'semester' => now()->format('Y-m'),
            'notes' => 'Catatan dari superadmin untuk evaluasi belajar siswa.',
        ]);
        $storeComment->assertRedirect();
        $this->assertDatabaseHas('student_comments', [
            'student_id' => $this->student->id,
            'notes' => 'Catatan dari superadmin untuk evaluasi belajar siswa.',
        ]);
    }
}
