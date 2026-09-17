<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\LearningSession;
use App\Models\Module;
use Illuminate\Http\UploadedFile;
use Tests\TestCase;

class CalendarCsvImportTest extends TestCase
{
    public function test_superadmin_can_download_csv_template(): void
    {
        $admin = User::where('role', 'superadmin')->first();
        if (!$admin) {
            $admin = User::factory()->create(['role' => 'superadmin']);
        }

        $response = $this->actingAs($admin)->get(route('superadmin.calendar.template'));
        $response->assertStatus(200);
        $response->assertHeader('Content-Type', 'text/csv; charset=UTF-8');
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
            'date' => '2026-11-01',
            'status' => 'hadir',
            'title' => 'Pertemuan Pembuka',
        ]);
        $this->assertDatabaseHas('learning_sessions', [
            'user_id' => $student->id,
            'date' => '2026-11-08',
            'status' => 'akan-datang',
            'title' => 'Pertemuan Lanjutan',
        ]);
    }
}
