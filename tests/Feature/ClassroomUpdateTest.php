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

    public function test_updating_classroom_tutor_updates_all_students_in_the_classroom(): void
    {
        $admin = User::factory()->create(['role' => 'superadmin']);
        $oldTutor = User::factory()->create(['role' => 'tutor']);
        $newTutor = User::factory()->create(['role' => 'tutor']);

        $classroom = Classroom::create([
            'name' => 'Kelas Awal',
            'description' => 'Deskripsi Awal',
            'tutor_id' => $oldTutor->id,
        ]);

        $student1 = User::factory()->create([
            'role' => 'user',
            'classroom_id' => $classroom->id,
            'tutor_id' => $oldTutor->id,
        ]);
        $student1->classrooms()->attach($classroom->id);

        $student2 = User::factory()->create([
            'role' => 'user',
            'classroom_id' => $classroom->id,
            'tutor_id' => null,
        ]);
        $student2->classrooms()->attach($classroom->id);

        $response = $this->actingAs($admin)->post(route('superadmin.classes.update', $classroom->id), [
            '_method' => 'PUT',
            'name' => 'Kelas Diperbarui',
            'description' => 'Deskripsi Baru',
            'tutor_id' => $newTutor->id,
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('classrooms', [
            'id' => $classroom->id,
            'tutor_id' => $newTutor->id,
        ]);

        $this->assertEquals($newTutor->id, $student1->fresh()->tutor_id);
        $this->assertEquals($newTutor->id, $student2->fresh()->tutor_id);
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
