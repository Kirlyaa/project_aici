<?php

namespace Tests\Feature;

use App\Models\Classroom;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Tests\TestCase;

class StudentAndTutorCsvImportTest extends TestCase
{
    use RefreshDatabase;

    public function test_superadmin_can_download_student_csv_template(): void
    {
        $admin = User::factory()->create(['role' => 'superadmin']);

        $response = $this->actingAs($admin)->get('/superadmin/students/template');
        $response->assertStatus(200);
        $this->assertStringContainsString('text/csv', $response->headers->get('Content-Type') ?? '');
    }

    public function test_superadmin_can_import_student_csv(): void
    {
        $admin = User::factory()->create(['role' => 'superadmin']);
        $tutor = User::factory()->create(['role' => 'tutor', 'email' => 'tutor_csv@aici.id', 'name' => 'Tutor CSV']);

        $csvContent = "Nama Lengkap,Email,Password,Kelas,Modul,Jadwal,Tutor\n"
            . "Budi Santoso,budi.santoso@student.aici.id,password123,Robotik Dasar A,Modul 1 – Pengenalan Robotika,2026-10-15; 2026-10-22,{$tutor->email}\n";

        $file = UploadedFile::fake()->createWithContent('students.csv', $csvContent);

        $response = $this->actingAs($admin)->post('/superadmin/students/import-excel', [
            'file' => $file,
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('users', [
            'name' => 'Budi Santoso',
            'email' => 'budi.santoso@student.aici.id',
            'role' => 'user',
            'tutor_id' => $tutor->id,
        ]);
    }

    public function test_superadmin_can_download_tutor_csv_template(): void
    {
        $admin = User::factory()->create(['role' => 'superadmin']);

        $response = $this->actingAs($admin)->get('/superadmin/tutors/template');
        $response->assertStatus(200);
        $this->assertStringContainsString('text/csv', $response->headers->get('Content-Type') ?? '');
    }

    public function test_superadmin_can_import_tutor_csv(): void
    {
        $admin = User::factory()->create(['role' => 'superadmin']);

        $csvContent = "Nama Tutor*,Email*,Password (Default: aici1234),Status (aktif / nonaktif)\n"
            . "Ahmad Baru,ahmad.baru@aici.id,rahasia123,aktif\n";

        $file = UploadedFile::fake()->createWithContent('tutors.csv', $csvContent);

        $response = $this->actingAs($admin)->post('/superadmin/tutors/import-excel', [
            'file' => $file,
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('users', [
            'name' => 'Ahmad Baru',
            'email' => 'ahmad.baru@aici.id',
            'role' => 'tutor',
            'status' => 'aktif',
        ]);
    }
}
