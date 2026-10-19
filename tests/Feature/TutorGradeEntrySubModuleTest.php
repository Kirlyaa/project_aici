<?php

namespace Tests\Feature;

use App\Models\Classroom;
use App\Models\GradeEntry;
use App\Models\Module;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TutorGradeEntrySubModuleTest extends TestCase
{
    use RefreshDatabase;

    protected User $tutor;
    protected User $student;
    protected Classroom $classroom;
    protected Module $book;
    protected Module $subModule;

    protected function setUp(): void
    {
        parent::setUp();

        $this->tutor = User::factory()->create([
            'role' => 'tutor',
            'email' => 'tutor_submodule@aici.id',
        ]);

        $this->student = User::factory()->create([
            'role' => 'user',
            'email' => 'student_submodule@aici.id',
            'tutor_id' => $this->tutor->id,
        ]);

        $this->classroom = Classroom::create([
            'name' => 'Kelas Robotik A',
            'branch' => 'Jakarta',
            'tutor_id' => $this->tutor->id,
        ]);

        $this->student->classrooms()->attach($this->classroom->id);

        $this->book = Module::create([
            'name' => 'AI Future Town',
            'module_type' => 'robot',
            'parent_id' => null,
        ]);

        $this->subModule = Module::create([
            'name' => 'Modul 1 - Smart Lamp',
            'module_type' => 'robot',
            'parent_id' => $this->book->id,
            'order_index' => 1,
        ]);
    }

    public function test_tutor_can_view_grades_page_with_hierarchical_submodules(): void
    {
        $response = $this->actingAs($this->tutor)->get("/tutor/grades/{$this->student->id}");
        $response->assertOk();

        $pageProps = $response->viewData('page')['props'];
        $this->assertNotEmpty($pageProps['modules']);

        $firstModule = collect($pageProps['modules'])->firstWhere('id', $this->book->id);
        $this->assertNotNull($firstModule);
        $this->assertNotEmpty($firstModule['sub_modules']);
        $this->assertEquals($this->subModule->id, $firstModule['sub_modules'][0]['id']);
    }

    public function test_tutor_can_store_grade_with_submodule_and_book(): void
    {
        $response = $this->actingAs($this->tutor)
            ->withoutMiddleware(\Illuminate\Foundation\Http\Middleware\ValidateCsrfToken::class)
            ->post('/tutor/grades', [
                'student_id' => $this->student->id,
                'book_id' => $this->book->id,
                'sub_module_id' => $this->subModule->id,
                'meeting_number' => 1,
                'module_type' => 'robot',
                'meeting_date' => now()->toDateString(),
                'fokus' => 4.5,
                'robot_building' => 5.0,
                'tools_management' => 4.0,
                'interaksi' => 4.0,
                'coding' => 5.0,
            ]);

        $response->assertRedirect();

        $this->assertDatabaseHas('grade_entries', [
            'student_id' => $this->student->id,
            'meeting_number' => 1,
            'module_id' => $this->subModule->id,
            'book_id' => $this->book->id,
        ]);
    }

    public function test_tutor_can_update_grade_entry_submodule(): void
    {
        $subModule2 = Module::create([
            'name' => 'Modul 2 - Smart Fan',
            'module_type' => 'robot',
            'parent_id' => $this->book->id,
            'order_index' => 2,
        ]);

        $gradeEntry = GradeEntry::create([
            'student_id' => $this->student->id,
            'module_id' => $this->subModule->id,
            'book_id' => $this->book->id,
            'meeting_number' => 1,
            'module_type' => 'robot',
            'meeting_date' => now()->toDateString(),
            'fokus' => 4.0,
            'robot_building' => 4.0,
            'tools_management' => 4.0,
            'interaksi' => 4.0,
            'coding' => 4.0,
            'average' => 4.0,
        ]);

        $response = $this->actingAs($this->tutor)
            ->withoutMiddleware(\Illuminate\Foundation\Http\Middleware\ValidateCsrfToken::class)
            ->put("/tutor/grades/{$gradeEntry->id}", [
                'student_id' => $this->student->id,
                'book_id' => $this->book->id,
                'sub_module_id' => $subModule2->id,
                'meeting_number' => 1,
                'module_type' => 'robot',
                'meeting_date' => now()->toDateString(),
                'fokus' => 5.0,
                'robot_building' => 5.0,
                'tools_management' => 5.0,
                'interaksi' => 5.0,
                'coding' => 5.0,
            ]);

        $response->assertRedirect();

        $this->assertDatabaseHas('grade_entries', [
            'id' => $gradeEntry->id,
            'module_id' => $subModule2->id,
            'book_id' => $this->book->id,
        ]);
    }
}
