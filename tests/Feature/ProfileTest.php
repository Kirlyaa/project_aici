<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProfileTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutMiddleware(\Illuminate\Foundation\Http\Middleware\ValidateCsrfToken::class);
    }

    public function test_profile_page_is_displayed(): void
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->get('/profil');

        $response->assertOk();
    }

    public function test_profile_information_can_be_updated(): void
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->patch('/profil', [
                'name' => 'Test User',
                'email' => 'test@example.com',
            ]);

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect('/profil');

        $user->refresh();

        $this->assertSame('Test User', $user->name);
        $this->assertSame('test@example.com', $user->email);
        $this->assertNull($user->email_verified_at);
    }

    public function test_email_verification_status_is_unchanged_when_the_email_address_is_unchanged(): void
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->patch('/profil', [
                'name' => 'Test User',
                'email' => $user->email,
            ]);

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect('/profil');

        $this->assertNotNull($user->refresh()->email_verified_at);
    }

    public function test_user_can_delete_their_account(): void
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->delete('/profil', [
                'password' => 'password',
            ]);

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect('/');

        $this->assertGuest();
        $this->assertNull($user->fresh());
    }

    public function test_correct_password_must_be_provided_to_delete_account(): void
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->from('/profil')
            ->delete('/profil', [
                'password' => 'wrong-password',
            ]);

        $response
            ->assertSessionHasErrors('password')
            ->assertRedirect('/profil');

        $this->assertNotNull($user->fresh());
    }

    public function test_student_profile_displays_four_meetings_range_and_stats(): void
    {
        $this->seed(\Database\Seeders\TutorSeeder::class);
        $this->seed(\Database\Seeders\AiraLearningSessionSeeder::class);
        $this->seed(\Database\Seeders\AiraGradeEntrySeeder::class);
        $this->seed(\Database\Seeders\AiraStudentCommentSeeder::class);

        $aira = User::where('email', 'aira@aici.id')->first();
        $this->assertNotNull($aira);

        $response = $this->actingAs($aira)->get('/profil');
        $response->assertOk();

        $page = $response->viewData('page');
        $pdfRanges = $page['props']['pdfRanges'];
        $this->assertNotEmpty($pdfRanges);
        $this->assertSame('1-4', $pdfRanges[0]['key']);
        $this->assertSame('Pertemuan 1 - 4', $pdfRanges[0]['label']);

        // Test PDF route
        $pdfResponse = $this->actingAs($aira)->get('/profil/pdf?range=1-4');
        $pdfResponse->assertOk();
        $pdfPage = $pdfResponse->viewData('page');
        $this->assertSame('Pertemuan 1 - 4', $pdfPage['props']['filterInfo']['activeLabel']);
        $this->assertSame(4, $pdfPage['props']['filterInfo']['meetingCount']);
    }
}
