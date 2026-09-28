<?php

namespace Tests\Feature;

use App\Models\Module;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ModuleCatalogTest extends TestCase
{
    use RefreshDatabase;

    public function test_student_and_tutor_see_two_book_covers_with_submodules(): void
    {
        // 1. Create 2 Book Covers
        $robotBook = Module::create([
            'name' => 'Buku Robotika: Robotic Engineering & Automation',
            'book_title' => 'Buku Robotika: Robotic Engineering & Automation',
            'parent_id' => null,
            'order_index' => 1,
            'module_type' => 'robot',
            'description' => 'Panduan lengkap perakitan dan pemrograman robotika.',
        ]);

        $codingBook = Module::create([
            'name' => 'Buku AI & Coding: Computational Thinking & AI',
            'book_title' => 'Buku AI & Coding: Computational Thinking & AI',
            'parent_id' => null,
            'order_index' => 2,
            'module_type' => 'coding',
            'description' => 'Materi algoritma komputasi, Scratch, Python, dan AI.',
        ]);

        // 2. Create sub-modules for robotBook
        Module::create([
            'name' => 'Robotika Dasar 01: Mengenal Komponen & Sensor',
            'book_title' => $robotBook->name,
            'parent_id' => $robotBook->id,
            'order_index' => 1,
            'module_type' => 'robot',
            'description' => 'Pengenalan mikrokontroler dan sensor ultrasonik.',
        ]);

        Module::create([
            'name' => 'Robotika Dasar 02: Sistem Aktuator & Servo',
            'book_title' => $robotBook->name,
            'parent_id' => $robotBook->id,
            'order_index' => 2,
            'module_type' => 'robot',
            'description' => 'Menggerakkan motor servo dan mekanisme lengan robot.',
        ]);

        // 3. Create sub-modules for codingBook
        Module::create([
            'name' => 'Coding Dasar 01: Logika Pemrograman Visual',
            'book_title' => $codingBook->name,
            'parent_id' => $codingBook->id,
            'order_index' => 1,
            'module_type' => 'coding',
            'description' => 'Pengenalan loop dan percabangan pada visual blocks.',
        ]);

        // 4. Test Student Route /modul (student role in DB is 'user')
        $student = User::factory()->create(['role' => 'user']);
        $response = $this->actingAs($student)->get('/modul');
        $response->assertStatus(200);
        $response->assertInertia(fn($page) => $page
            ->component('User/ModulesViewer')
            ->has('books', 2)
            ->where('books.0.type', 'robot')
            ->where('books.0.subModulesCount', 2)
            ->where('books.1.type', 'coding')
            ->where('books.1.subModulesCount', 1)
        );

        // 5. Test Tutor Route /tutor/modules
        $tutor = User::factory()->create(['role' => 'tutor']);
        $tutorResponse = $this->actingAs($tutor)->get('/tutor/modules');
        $tutorResponse->assertStatus(200);
        $tutorResponse->assertInertia(fn($page) => $page
            ->component('Tutor/ModulesViewer')
            ->has('books', 2)
            ->where('books.0.type', 'robot')
            ->where('books.1.type', 'coding')
        );

        // 6. Test SuperAdmin Route /superadmin/modules
        $superadmin = User::factory()->create(['role' => 'superadmin']);
        $adminResponse = $this->actingAs($superadmin)->get('/superadmin/modules');
        $adminResponse->assertStatus(200);
        $adminResponse->assertInertia(fn($page) => $page
            ->component('SuperAdmin/ModuleManagement')
            ->has('books', 2)
            ->where('books.0.type', 'robot')
            ->where('books.0.subModulesCount', 2)
            ->where('books.1.type', 'coding')
            ->where('books.1.subModulesCount', 1)
        );
    }

    public function test_dynamic_n_books_are_accessible_realtime_across_roles(): void
    {
        // Add 3rd and 4th books dynamically
        $book3 = Module::create([
            'name' => 'Buku Internet of Things (IoT) & Cloud',
            'book_title' => 'Buku Internet of Things (IoT) & Cloud',
            'parent_id' => null,
            'order_index' => 3,
            'module_type' => 'general',
            'description' => 'Materi sensor IoT, ESP32, MQTT, dan Dashboard Cloud.',
        ]);

        Module::create([
            'name' => 'IoT Sesi 01: Setup ESP32 & MQTT',
            'book_title' => $book3->name,
            'parent_id' => $book3->id,
            'order_index' => 1,
            'module_type' => 'general',
            'description' => 'Koneksi WiFi dan pengiriman payload telemetry.',
        ]);

        $student = User::factory()->create(['role' => 'user']);
        $response = $this->actingAs($student)->get('/modul');
        $response->assertStatus(200);
        $response->assertInertia(fn($page) => $page
            ->component('User/ModulesViewer')
            ->has('books', 1)
            ->where('books.0.name', 'Buku Internet of Things (IoT) & Cloud')
            ->where('books.0.subModulesCount', 1)
        );

        $tutor = User::factory()->create(['role' => 'tutor']);
        $tutorResponse = $this->actingAs($tutor)->get('/tutor/modules');
        $tutorResponse->assertStatus(200);
        $tutorResponse->assertInertia(fn($page) => $page
            ->component('Tutor/ModulesViewer')
            ->has('books', 1)
            ->where('books.0.name', 'Buku Internet of Things (IoT) & Cloud')
        );
    }

    public function test_tutor_module_view_filters_by_student_class_context(): void
    {
        // 1. Create a Robotics Book
        $robotBook = Module::create([
            'name' => 'Buku Robotika: Robotic Engineering',
            'book_title' => 'Buku Robotika: Robotic Engineering',
            'parent_id' => null,
            'order_index' => 1,
            'module_type' => 'robot',
            'description' => 'Materi robotika.',
        ]);

        Module::create([
            'name' => 'Submodul Robot 1',
            'book_title' => $robotBook->name,
            'parent_id' => $robotBook->id,
            'order_index' => 1,
            'module_type' => 'robot',
        ]);

        // 2. Create an AI & Coding Book
        $aiBook = Module::create([
            'name' => 'Buku AI & Coding: Machine Learning',
            'book_title' => 'Buku AI & Coding: Machine Learning',
            'parent_id' => null,
            'order_index' => 2,
            'module_type' => 'coding',
            'description' => 'Materi AI.',
        ]);

        Module::create([
            'name' => 'Submodul AI 1',
            'book_title' => $aiBook->name,
            'parent_id' => $aiBook->id,
            'order_index' => 1,
            'module_type' => 'coding',
        ]);

        // 3. Create student Aira in "AI Engineer" class
        $studentAira = User::factory()->create([
            'role' => 'user',
            'name' => 'Aira',
            'class' => 'AI Engineer',
        ]);

        // 4. Test Tutor access with student query param
        $tutor = User::factory()->create(['role' => 'tutor']);
        $response = $this->actingAs($tutor)->get("/tutor/modules?student={$studentAira->id}");
        $response->assertStatus(200);
        $response->assertInertia(fn($page) => $page
            ->component('Tutor/ModulesViewer')
            ->has('books', 1)
            ->where('books.0.id', $aiBook->id)
            ->where('books.0.type', 'coding')
            ->where('filterContext.studentName', 'Aira')
            ->where('filterContext.className', 'AI Engineer')
        );
    }
}
