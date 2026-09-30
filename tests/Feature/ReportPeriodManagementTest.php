<?php

namespace Tests\Feature;

use App\Models\GradeEntry;
use App\Models\ReportPeriod;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReportPeriodManagementTest extends TestCase
{
    use RefreshDatabase;

    protected User $superAdmin;
    protected User $tutor;
    protected User $student;

    protected function setUp(): void
    {
        parent::setUp();

        $this->superAdmin = User::factory()->create([
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
        ]);

        // Beri nilai pada beberapa pertemuan (1 s/d 8)
        for ($i = 1; $i <= 8; $i++) {
            GradeEntry::create([
                'student_id' => $this->student->id,
                'meeting_number' => $i,
                'interaksi' => 4.5,
                'fokus' => 4.0,
                'tools_management' => 4.2,
                'coding' => 4.8,
                'robot_building' => 4.3,
                'average' => 4.36,
            ]);
        }
    }

    public function test_only_superadmin_can_access_report_period_management(): void
    {
        // Student cannot access (redirected to their dashboard with error)
        $this->actingAs($this->student)
            ->get(route('superadmin.report-periods.index'))
            ->assertRedirect('/beranda');

        // Tutor cannot access (redirected to tutor dashboard with error)
        $this->actingAs($this->tutor)
            ->get(route('superadmin.report-periods.index'))
            ->assertRedirect('/tutor');

        // Superadmin can access
        $this->actingAs($this->superAdmin)
            ->get(route('superadmin.report-periods.index'))
            ->assertOk();
    }

    public function test_superadmin_can_create_custom_report_periods(): void
    {
        $response = $this->actingAs($this->superAdmin)->post(route('superadmin.report-periods.store'), [
            'name' => 'Fase Dasar',
            'start_meeting' => 1,
            'end_meeting' => 3,
            'order_index' => 1,
            'is_active' => true,
        ]);

        $response->assertSessionHas('success');
        $this->assertDatabaseHas('report_periods', [
            'name' => 'Fase Dasar',
            'start_meeting' => 1,
            'end_meeting' => 3,
        ]);
    }

    public function test_superadmin_can_update_and_delete_report_period(): void
    {
        $period = ReportPeriod::create([
            'name' => 'Fase 1',
            'start_meeting' => 1,
            'end_meeting' => 2,
            'order_index' => 1,
            'is_active' => true,
        ]);

        // Update
        $this->actingAs($this->superAdmin)->put(route('superadmin.report-periods.update', $period), [
            'name' => 'Fase 1 Revisi',
            'start_meeting' => 1,
            'end_meeting' => 3,
            'order_index' => 1,
            'is_active' => true,
        ])->assertSessionHas('success');

        $this->assertDatabaseHas('report_periods', [
            'id' => $period->id,
            'name' => 'Fase 1 Revisi',
            'end_meeting' => 3,
        ]);

        // Delete
        $this->actingAs($this->superAdmin)->delete(route('superadmin.report-periods.destroy', $period))
            ->assertSessionHas('success');

        $this->assertDatabaseMissing('report_periods', ['id' => $period->id]);
    }

    public function test_profile_and_pdf_reflects_superadmin_periods_and_custom_ranges(): void
    {
        ReportPeriod::create([
            'name' => 'Bagian A',
            'start_meeting' => 1,
            'end_meeting' => 3,
            'order_index' => 1,
            'is_active' => true,
        ]);

        ReportPeriod::create([
            'name' => 'Bagian B',
            'start_meeting' => 6,
            'end_meeting' => 7,
            'order_index' => 2,
            'is_active' => true,
        ]);

        // Cek halaman profil murid
        $profileResponse = $this->actingAs($this->student)->get(route('profile.edit'));
        $profileResponse->assertOk();
        $pdfRanges = $profileResponse->original->getData()['page']['props']['pdfRanges'];

        $this->assertCount(3, $pdfRanges); // 1-3, 6-7, all
        $this->assertSame('1-3', $pdfRanges[0]['key']);
        $this->assertSame('6-7', $pdfRanges[1]['key']);

        // Test akses PDF menggunakan rentang kustom bebas (contoh: from=6&to=7)
        $pdfCustomResponse = $this->actingAs($this->student)->get('/profil/pdf?from=6&to=7');
        $pdfCustomResponse->assertOk();
        $filterInfo = $pdfCustomResponse->original->getData()['page']['props']['filterInfo'];
        $this->assertSame('6-7', $filterInfo['selectedRange']);
        $this->assertSame(2, $filterInfo['meetingCount']);
    }
}
