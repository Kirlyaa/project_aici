<?php

namespace Tests\Feature;

use App\Models\Classroom;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Tests\TestCase;

class ClassroomUpdateTest extends TestCase
{
    use RefreshDatabase;

    public function test_superadmin_can_update_classroom_via_post_with_method_put(): void
    {
        $admin = User::factory()->create(['role' => 'superadmin']);
        $tutor = User::factory()->create(['role' => 'tutor']);
        $classroom = Classroom::create([
            'name' => 'Kelas Awal',
            'description' => 'Deskripsi Awal',
            'tutor_id' => null,
        ]);

        $response = $this->actingAs($admin)->post(route('superadmin.classes.update', $classroom->id), [
            '_method' => 'PUT',
            'name' => 'Kelas Diperbarui',
            'description' => 'Deskripsi Baru',
            'tutor_id' => $tutor->id,
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('classrooms', [
            'id' => $classroom->id,
            'name' => 'Kelas Diperbarui',
            'description' => 'Deskripsi Baru',
            'tutor_id' => $tutor->id,
        ]);
    }

    public function test_superadmin_can_update_classroom_with_empty_tutor_and_image(): void
    {
        $admin = User::factory()->create(['role' => 'superadmin']);
        $classroom = Classroom::create([
            'name' => 'Kelas Awal',
            'description' => 'Deskripsi Awal',
            'tutor_id' => null,
        ]);

        $image = UploadedFile::fake()->image('cover.jpg', 600, 400);

        $response = $this->actingAs($admin)->post(route('superadmin.classes.update', $classroom->id), [
            '_method' => 'PUT',
            'name' => 'Kelas Baru Banget',
            'description' => '',
            'tutor_id' => '',
            'photo' => $image,
        ]);

        $response->assertRedirect();
        $response->assertSessionHasNoErrors();
        $this->assertDatabaseHas('classrooms', [
            'id' => $classroom->id,
            'name' => 'Kelas Baru Banget',
            'tutor_id' => null,
        ]);
    }
}
