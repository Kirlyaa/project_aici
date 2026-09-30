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
        $this->assertStringContainsString('text/csv', $response->headers->get('Content-Type') ?? '');
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

    public function test_superadmin_can_import_calendar_csv_with_seven_columns(): void
    {
        $this->withoutMiddleware();

        $admin = User::where('role', 'superadmin')->first();
        if (!$admin) {
            $admin = User::factory()->create(['role' => 'superadmin']);
        }

        $student = User::where('role', 'user')->first();
        if (!$student) {
            $student = User::factory()->create(['role' => 'user', 'email' => 'student_csv_7@aici.id']);
        }

        $csvContent = "Tanggal,Status,Judul Pertemuan,Modul,Email Murid,Tutor,Catatan\n"
            . "2026-12-01,hadir,Pertemuan 1 CSV,Modul CSV Robotics,{$student->email},,Catatan sesi CSV\n";

        $file = UploadedFile::fake()->createWithContent('jadwal.csv', $csvContent);

        $response = $this->actingAs($admin)->post(route('superadmin.calendar.import-csv'), [
            'csv_file' => $file,
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('learning_sessions', [
            'user_id' => $student->id,
            'date' => '2026-12-01 00:00:00',
            'status' => 'hadir',
            'title' => 'Pertemuan 1 CSV',
            'admin_note_for_tutor' => 'Catatan sesi CSV',
        ]);
    }

    public function test_superadmin_can_import_calendar_csv_with_default_tutor_id(): void
    {
        $this->withoutMiddleware();

        $admin = User::factory()->create(['role' => 'superadmin']);
        $tutor = User::factory()->create(['role' => 'tutor']);
        $student = User::factory()->create(['role' => 'user', 'email' => 'student_tutor_csv@aici.id', 'tutor_id' => null]);

        $csvContent = "Tanggal,Status,Judul Pertemuan,Modul,Email Murid,Tutor,Catatan\n"
            . "2026-12-15,akan-datang,Pertemuan Khusus Tutor,,{$student->email},,Diampu tutor aktif\n";

        $file = UploadedFile::fake()->createWithContent('jadwal_tutor.csv', $csvContent);

        $response = $this->actingAs($admin)->post(route('superadmin.calendar.import-csv'), [
            'csv_file' => $file,
            'tutor_id' => $tutor->id,
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('learning_sessions', [
            'user_id' => $student->id,
            'tutor_id' => $tutor->id,
            'date' => '2026-12-15 00:00:00',
            'status' => 'akan-datang',
            'title' => 'Pertemuan Khusus Tutor',
        ]);
    }
}
