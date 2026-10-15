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

    public function test_student_import_restores_soft_deleted_student_with_matching_email(): void
    {
        $admin = User::factory()->create(['role' => 'superadmin']);
        $deletedStudent = User::factory()->create([
            'role' => 'user',
            'name' => 'Siswa Lama',
            'email' => 'deleted.student@student.aici.id',
        ]);
        $deletedStudent->delete();

        $csvContent = "Nama Lengkap,Email,Password,Kelas,Modul,Jadwal,Tutor\n"
            . "Siswa Baru,deleted.student@student.aici.id,password123,,,,\n";
        $file = UploadedFile::fake()->createWithContent('students.csv', $csvContent);

        $response = $this->actingAs($admin)->post('/superadmin/students/import-excel', [
            'file' => $file,
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('success', 'Berhasil mengimpor 1 data siswa baru.');
        $this->assertDatabaseHas('users', [
            'id' => $deletedStudent->id,
            'name' => 'Siswa Baru',
            'email' => 'deleted.student@student.aici.id',
            'role' => 'user',
            'deleted_at' => null,
        ]);
        $this->assertSame(1, User::withTrashed()->where('email', 'deleted.student@student.aici.id')->count());
    }

    public function test_student_import_generates_unique_email_when_email_is_blank(): void
    {
        $admin = User::factory()->create(['role' => 'superadmin']);

        $csvContent = "Nama Lengkap,Email,Password,Kelas,Modul,Jadwal,Tutor\n"
            . "Siswa Tanpa Email,,password123,Robotik Dasar A,Modul 1 – Pengenalan Robotika,2026-10-15,\n";

        $file = UploadedFile::fake()->createWithContent('students_blank_email.csv', $csvContent);

        $response = $this->actingAs($admin)->post('/superadmin/students/import-excel', [
            'file' => $file,
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('success', 'Berhasil mengimpor 1 data siswa baru.');

        $student = User::where('name', 'Siswa Tanpa Email')->first();
        $this->assertNotNull($student);
        $this->assertNotSame('', $student->email);
        $this->assertMatchesRegularExpression('/@student\.local$/', $student->email);
    }

    public function test_student_import_allows_reimporting_existing_student_email_without_aborting_the_batch(): void
    {
        $admin = User::factory()->create(['role' => 'superadmin']);
        $existing = User::factory()->create([
            'role' => 'user',
            'name' => 'Siswa Lama',
            'email' => 'lama@student.aici.id',
            'classroom_id' => null,
        ]);

        $csvContent = "Nama Lengkap,Email,Password,Kelas,Modul,Jadwal,Tutor\n"
            . "Siswa Baru,lama@student.aici.id,password123,Robotik Dasar A,Modul 1 – Pengenalan Robotika,2026-10-15,\n"
            . "Siswa Baru 2,baru@student.aici.id,password123,Robotik Dasar A,Modul 1 – Pengenalan Robotika,2026-10-16,\n";

        $file = UploadedFile::fake()->createWithContent('students_existing_email.csv', $csvContent);

        $response = $this->actingAs($admin)->post('/superadmin/students/import-excel', [
            'file' => $file,
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('success', 'Berhasil mengimpor 1 data siswa baru.');
        $this->assertDatabaseHas('users', ['email' => 'baru@student.aici.id', 'name' => 'Siswa Baru 2']);
        $this->assertDatabaseHas('users', ['id' => $existing->id, 'name' => 'Siswa Baru']);
    }

    public function test_student_import_supports_unquoted_multi_value_submodule_and_date_columns(): void
    {
        $admin = User::factory()->create(['role' => 'superadmin']);
        User::factory()->create(['role' => 'tutor', 'email' => 'yoel@aici.id', 'name' => 'Yoel']);

        $csvContent = "Nama Lengkap,Email,Password,Kelas,Modul,Sub Modul,Jadwal,Tutor\n"
            . "Jacoeb Soepandji Adhisuryo,jacoeb@student.aici.id,password123,Jumat 16.00 AI Future Town,AI Future Town,Modul 1 - Between Inches, Modul 2 - Master Translator, Modul 3 - Graphic Tablet,2026-08-07, 2026-08-14, 2026-09-04,yoel@aici.id\n";

        $file = UploadedFile::fake()->createWithContent('students_unquoted_multi_values.csv', $csvContent);

        $response = $this->actingAs($admin)->post('/superadmin/students/import-excel', [
            'file' => $file,
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('success', 'Berhasil mengimpor 1 data siswa baru.');

        $student = User::where('email', 'jacoeb@student.aici.id')->first();
        $this->assertNotNull($student);
        $sessions = $student->learningSessions()->orderBy('date')->get();
        $this->assertCount(3, $sessions);
        $this->assertEquals('Pertemuan 1: Modul 1 - Between Inches', $sessions[0]->title);
        $this->assertEquals('Pertemuan 2: Modul 2 - Master Translator', $sessions[1]->title);
        $this->assertEquals('Pertemuan 3: Modul 3 - Graphic Tablet', $sessions[2]->title);
    }

    public function test_student_import_supports_real_world_csv_with_many_unquoted_submodules_and_dates(): void
    {
        $admin = User::factory()->create(['role' => 'superadmin']);
        User::factory()->create(['role' => 'tutor', 'email' => 'lion@aici.id', 'name' => 'Lion']);

        $csvContent = "Nama Lengkap,Email,Password,Kelas,Modul,Sub Modul,Jadwal,Tutor\n"
            . "Abdillah Faqih Dhaniswara,abdillah@student.aici.id,password123,Jumat 16.00 AI Smart Life,AI Smart Life,Modul 1 - Desk lamp, Modul 2 - Smart Fan, Modul 3 - Smart Garage, Modul 4 - Smart Garden, Modul 5 - My AI Home, Modul 6 - Trash can, Modul 7 - Smart Air Circulator,2026-08-06, 2026-08-13, 2026-09-04, 2026-09-11, 2026-09-18, 2026-09-25, 2026-10-02,lion@aici.id\n";

        $file = UploadedFile::fake()->createWithContent('students_real_world_unquoted.csv', $csvContent);

        $response = $this->actingAs($admin)->post('/superadmin/students/import-excel', [
            'file' => $file,
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('success', 'Berhasil mengimpor 1 data siswa baru.');

        $student = User::where('email', 'abdillah@student.aici.id')->first();
        $this->assertNotNull($student);
        $this->assertCount(7, $student->learningSessions()->orderBy('date')->get());
    }

    public function test_superadmin_can_open_classroom_management_with_multi_class_students(): void
    {
        $admin = User::factory()->create(['role' => 'superadmin']);
        $classA = Classroom::create(['name' => 'Kelas A']);
        $classB = Classroom::create(['name' => 'Kelas B']);

        $student = User::factory()->create([
            'role' => 'user',
            'name' => 'Siswa Multi Kelas',
            'email' => 'multi.class@student.test',
            'classroom_id' => $classA->id,
            'class' => $classA->name,
        ]);
        $student->syncClassrooms([$classA->id, $classB->id], $classA->id);

        $response = $this->actingAs($admin)->get('/superadmin/classes');

        $response->assertOk();
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

    public function test_tutor_import_skips_duplicate_email_inside_same_csv_batch(): void
    {
        $admin = User::factory()->create(['role' => 'superadmin']);
        User::factory()->create(['role' => 'tutor', 'email' => 'yoel@aici.id', 'name' => 'Yoel Lama']);

        $csvContent = "Nama Tutor*,Email*,Password (Default: aici1234),Status (aktif / nonaktif)\n"
            . "Yoel Baru,yoel@aici.id,aici1234,aktif\n"
            . "Yoel Duplikat,yoel@aici.id,aici1234,aktif\n"
            . "Tutor Baru,tutor.baru@aici.id,aici1234,aktif\n";

        $file = UploadedFile::fake()->createWithContent('tutors_duplicate_email.csv', $csvContent);

        $response = $this->actingAs($admin)->post('/superadmin/tutors/import-excel', [
            'file' => $file,
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('success', 'Berhasil mengimpor 1 data tutor baru.');
        $this->assertDatabaseHas('users', ['email' => 'tutor.baru@aici.id', 'role' => 'tutor']);
    }
}
