<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\LearningSession;
use App\Models\Module;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Tests\TestCase;

class CalendarCsvImportTest extends TestCase
{
    use RefreshDatabase;
    public function test_superadmin_can_download_csv_template(): void
    {
        $admin = User::where('role', 'superadmin')->first();
        if (!$admin) {
            $admin = User::factory()->create(['role' => 'superadmin']);
        }

        $response = $this->actingAs($admin)->get(route('superadmin.calendar.template'));
        $response->assertStatus(200);
        $this->assertStringContainsString('spreadsheetml', $response->headers->get('Content-Type') ?? '');
    }

    public function test_superadmin_can_import_calendar_csv(): void
    {
        $this->withoutMiddleware();

        $admin = User::where('role', 'superadmin')->first();
        if (!$admin) {
            $admin = User::factory()->create(['role' => 'superadmin']);
        }

        $student = User::where('role', 'user')->first();
        if (!$student) {
            $student = User::factory()->create(['role' => 'user', 'email' => 'test_murid@aici.id']);
        }

        $csvContent = "tanggal,status,judul,modul,email_murid\n"
            . "2026-11-01,hadir,Pertemuan Pembuka,,{$student->email}\n"
            . "2026-11-08,akan-datang,Pertemuan Lanjutan,,{$student->email}\n";

        $file = UploadedFile::fake()->createWithContent('import_jadwal.csv', $csvContent);

        $response = $this->actingAs($admin)->post(route('superadmin.calendar.import-csv'), [
            'csv_file' => $file,
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('learning_sessions', [
            'user_id' => $student->id,
            'date' => '2026-11-01 00:00:00',
            'status' => 'hadir',
            'title' => 'Pertemuan Pembuka',
        ]);
        $this->assertDatabaseHas('learning_sessions', [
            'user_id' => $student->id,
            'date' => '2026-11-08 00:00:00',
            'status' => 'akan-datang',
            'title' => 'Pertemuan Lanjutan',
        ]);
    }

    public function test_superadmin_can_import_calendar_excel(): void
    {
        $this->withoutMiddleware();

        $admin = User::where('role', 'superadmin')->first();
        if (!$admin) {
            $admin = User::factory()->create(['role' => 'superadmin']);
        }

        $student = User::where('role', 'user')->first();
        if (!$student) {
            $student = User::factory()->create(['role' => 'user', 'email' => 'student_excel@aici.id']);
        }

        $spreadsheet = new \PhpOffice\PhpSpreadsheet\Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setCellValue('A1', 'Tanggal');
        $sheet->setCellValue('B1', 'Status');
        $sheet->setCellValue('C1', 'Judul Pertemuan');
        $sheet->setCellValue('D1', 'Modul');
        $sheet->setCellValue('E1', 'Email Murid');
        $sheet->setCellValue('F1', 'Tutor');
        $sheet->setCellValue('G1', 'Catatan');

        $sheet->setCellValue('A2', '2026-12-01');
        $sheet->setCellValue('B2', 'hadir');
        $sheet->setCellValue('C2', 'Pertemuan 1 Excel');
        $sheet->setCellValue('D2', 'Modul Excel Robotics');
        $sheet->setCellValue('E2', $student->email);
        $sheet->setCellValue('F2', '');
        $sheet->setCellValue('G2', 'Catatan sesi Excel');

        $tempPath = tempnam(sys_get_temp_dir(), 'test_cal_') . '.xlsx';
        $writer = new \PhpOffice\PhpSpreadsheet\Writer\Xlsx($spreadsheet);
        $writer->save($tempPath);

        $file = new UploadedFile($tempPath, 'jadwal.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', null, true);

        $response = $this->actingAs($admin)->post(route('superadmin.calendar.import-csv'), [
            'csv_file' => $file,
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('learning_sessions', [
            'user_id' => $student->id,
            'date' => '2026-12-01 00:00:00',
            'status' => 'hadir',
            'title' => 'Pertemuan 1 Excel',
            'admin_note_for_tutor' => 'Catatan sesi Excel',
        ]);

        if (file_exists($tempPath)) {
            @unlink($tempPath);
        }
    }
}
