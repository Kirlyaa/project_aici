<?php

namespace Tests\Feature;

use App\Models\Module;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Tests\TestCase;

class ModuleCsvImportTest extends TestCase
{
    use RefreshDatabase;

    private User $superadmin;

    protected function setUp(): void
    {
        parent::setUp();

        $this->superadmin = User::where('role', 'superadmin')->first()
            ?? User::factory()->create([
                'role' => 'superadmin',
                'email' => 'admin_test@aici.id',
            ]);
    }

    public function test_superadmin_can_download_module_csv_template(): void
    {
        $response = $this->actingAs($this->superadmin)
            ->get(route('superadmin.modules.template'));

        $response->assertOk();
        $response->assertHeader('content-type', 'text/csv; charset=UTF-8');
    }

    public function test_superadmin_can_import_modules_from_csv(): void
    {
        $csvContent = "\xEF\xBB\xBF" .
            "Nama Modul,Buku Induk,Tipe,Urutan,Deskripsi,URL Gambar,Alat dan Bahan\n" .
            "Buku Robotika Baru,,robot,1,Deskripsi buku robot,/images/cover.png,\"Arduino Uno, Breadboard\"\n" .
            "Pertemuan 1 Sensor,Buku Robotika Baru,robot,1,Materi sensor,,Ultrasonic Sensor\n" .
            "Pertemuan 2 Motor Driver,Buku Robotika Baru,robot,2,Materi motor,,\"L298N, Motor DC\"";

        $file = UploadedFile::fake()->createWithContent('modules.csv', $csvContent);

        $response = $this->actingAs($this->superadmin)
            ->post(route('superadmin.modules.import-csv'), [
                'file' => $file,
            ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        // Verifikasi Buku Induk terbuat
        $this->assertDatabaseHas('modules', [
            'name' => 'Buku Robotika Baru',
            'parent_id' => null,
            'module_type' => 'robot',
        ]);

        $parent = Module::where('name', 'Buku Robotika Baru')->first();
        $this->assertNotNull($parent);

        // Verifikasi Sub Modul terbuat dan terhubung ke Buku Induk
        $this->assertDatabaseHas('modules', [
            'name' => 'Pertemuan 1 Sensor',
            'parent_id' => $parent->id,
            'order_index' => 1,
            'module_type' => 'robot',
        ]);

        $this->assertDatabaseHas('modules', [
            'name' => 'Pertemuan 2 Motor Driver',
            'parent_id' => $parent->id,
            'order_index' => 2,
            'module_type' => 'robot',
        ]);

        $sub1 = Module::where('name', 'Pertemuan 1 Sensor')->first();
        $this->assertEquals(['Ultrasonic Sensor'], $sub1->tools);

        $sub2 = Module::where('name', 'Pertemuan 2 Motor Driver')->first();
        $this->assertEquals(['L298N', 'Motor DC'], $sub2->tools);
    }

    public function test_import_updates_existing_module(): void
    {
        $existing = Module::create([
            'name' => 'Modul Lama',
            'module_type' => 'robot',
            'order_index' => 0,
        ]);

        $csvContent = "Nama Modul,Buku Induk,Tipe,Urutan,Deskripsi,URL Gambar,Alat dan Bahan\n" .
            "Modul Lama,,coding,5,Deskripsi diperbarui,,Python";

        $file = UploadedFile::fake()->createWithContent('modules_update.csv', $csvContent);

        $response = $this->actingAs($this->superadmin)
            ->post(route('superadmin.modules.import-csv'), [
                'file' => $file,
            ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('modules', [
            'id' => $existing->id,
            'name' => 'Modul Lama',
            'module_type' => 'coding',
            'order_index' => 5,
            'description' => 'Deskripsi diperbarui',
        ]);
    }

    public function test_student_bulk_import_uses_submodule_names_for_meeting_titles_in_order(): void
    {
        $csvContent = "Nama Lengkap,Email,Password,Kelas,Modul,Sub Modul,Jadwal,Tutor\n" .
            "Aisyah Putri,aisyah@test.com,password123,Robotik Dasar A,Buku Robotika Dasar,Modul 1 - Between Inches;Modul 2 - Sensor Jarak,2026-10-15;2026-10-22,tutor@aici.id\n";

        $file = UploadedFile::fake()->createWithContent('students_submodule.csv', $csvContent);

        $superadmin = User::factory()->create(['role' => 'superadmin']);
        User::factory()->create(['role' => 'tutor', 'email' => 'tutor@aici.id']);

        $response = $this->actingAs($superadmin)
            ->post(route('superadmin.students.import-excel'), ['file' => $file]);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $student = User::where('email', 'aisyah@test.com')->first();
        $this->assertNotNull($student);

        $sessions = $student->learningSessions()->orderBy('date')->get();
        $this->assertCount(2, $sessions);
        $this->assertEquals('Pertemuan 1: Modul 1 - Between Inches', $sessions[0]->title);
        $this->assertEquals('Pertemuan 2: Modul 2 - Sensor Jarak', $sessions[1]->title);
    }

    public function test_student_can_belong_to_multiple_classrooms_and_bulk_class_list_is_synced(): void
    {
        $classA = \App\Models\Classroom::create(['name' => 'Robotik Dasar A']);
        $classB = \App\Models\Classroom::create(['name' => 'Coding AI Pemula']);

        $student = User::factory()->create([
            'role' => 'user',
            'email' => 'multi@class.test',
            'classroom_id' => $classA->id,
            'class' => $classA->name,
        ]);

        $student->syncClassrooms([$classA->id, $classB->id]);

        $this->assertCount(2, $student->classrooms()->get());
        $this->assertEqualsCanonicalizing([$classA->id, $classB->id], $student->classrooms()->pluck('classrooms.id')->all());

        $csvContent = "Nama Lengkap,Email,Password,Kelas,Modul,Jadwal,Tutor\n" .
            "Budi Santoso,budi@test.com,password123,Robotik Dasar A;Coding AI Pemula,Buku Robotika Dasar,2026-10-15,tutor@aici.id\n";

        $file = UploadedFile::fake()->createWithContent('students_multi_class.csv', $csvContent);

        $superadmin = User::factory()->create(['role' => 'superadmin']);
        User::factory()->create(['role' => 'tutor', 'email' => 'tutor@aici.id']);

        $response = $this->actingAs($superadmin)
            ->post(route('superadmin.students.import-excel'), ['file' => $file]);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $imported = User::where('email', 'budi@test.com')->firstOrFail();
        $this->assertNotNull($imported);
        $this->assertNotNull($imported->classroom_id);
        $this->assertEqualsCanonicalizing(
            [$classA->id, $classB->id],
            $imported->classrooms()->pluck('classrooms.id')->all()
        );
    }
}
