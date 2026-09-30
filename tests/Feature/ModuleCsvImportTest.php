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
}
