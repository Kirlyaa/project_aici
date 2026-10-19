<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
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

    public function test_user_can_update_avatar_without_name_or_email(): void
    {
        Storage::fake('public');

        $user = User::factory()->create([
            'role' => 'user',
            'name' => 'Original Name',
            'email' => 'student@example.com',
            'avatar' => null,
        ]);

        $file = UploadedFile::fake()->image('profile.jpg', 400, 400)->size(500);

        $response = $this
            ->actingAs($user)
            ->post('/profil', [
                '_method' => 'PATCH',
                'avatar' => $file,
            ]);

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect('/profil');

        $user->refresh();
        $this->assertSame('Original Name', $user->name);
        $this->assertNotNull($user->avatar);
        $this->assertStringStartsWith('avatars/', $user->avatar);
    }

    public function test_student_cannot_change_name(): void
    {
        $user = User::factory()->create([
            'role' => 'user',
            'name' => 'Student Original Name',
            'email' => 'student@example.com',
        ]);

        $response = $this
            ->actingAs($user)
            ->post('/profil', [
                '_method' => 'PATCH',
                'name' => 'Attempted Changed Name',
            ]);

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect('/profil');

        $user->refresh();
        $this->assertSame('Student Original Name', $user->name);
    }

    public function test_user_can_upload_profile_avatar(): void
    {
        Storage::fake('public');

        $user = User::factory()->create([
            'name' => 'Student User',
            'avatar' => null,
        ]);

        $file = UploadedFile::fake()->image('profile.jpg', 400, 400)->size(500);

        $response = $this
            ->actingAs($user)
            ->post('/profil', [
                'name' => 'Student User',
                'avatar' => $file,
            ]);

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect('/profil');

        $user->refresh();
        $this->assertNotNull($user->avatar);
        $this->assertStringStartsWith('avatars/', $user->avatar);
        Storage::disk('public')->assertExists($user->avatar);
        $this->assertNotEmpty($user->avatar_url);
    }

    public function test_old_avatar_is_deleted_when_new_avatar_uploaded(): void
    {
        Storage::fake('public');

        // Put an initial file
        $oldFilePath = 'avatars/old_avatar.jpg';
        Storage::disk('public')->put($oldFilePath, 'dummy-content');

        $user = User::factory()->create([
            'avatar' => $oldFilePath,
        ]);

        $newFile = UploadedFile::fake()->image('new_profile.png', 300, 300)->size(400);

        $response = $this
            ->actingAs($user)
            ->post('/profil', [
                'name' => $user->name,
                'avatar' => $newFile,
            ]);

        $response->assertSessionHasNoErrors()->assertRedirect('/profil');

        $user->refresh();
        $this->assertNotSame($oldFilePath, $user->avatar);
        Storage::disk('public')->assertMissing($oldFilePath);
        Storage::disk('public')->assertExists($user->avatar);
    }

    public function test_user_can_remove_avatar(): void
    {
        Storage::fake('public');

        $oldFilePath = 'avatars/avatar_to_remove.jpg';
        Storage::disk('public')->put($oldFilePath, 'dummy-content');

        $user = User::factory()->create([
            'avatar' => $oldFilePath,
        ]);

        $response = $this
            ->actingAs($user)
            ->post('/profil', [
                'name' => $user->name,
                'remove_avatar' => '1',
            ]);

        $response->assertSessionHasNoErrors()->assertRedirect('/profil');

        $user->refresh();
        $this->assertNull($user->avatar);
        $this->assertStringContainsString('ui-avatars.com', $user->avatar_url);
        Storage::disk('public')->assertMissing($oldFilePath);
    }

    public function test_avatar_validation_rejects_invalid_file_type(): void
    {
        Storage::fake('public');

        $user = User::factory()->create();
        $invalidFile = UploadedFile::fake()->create('document.pdf', 500, 'application/pdf');

        $response = $this
            ->actingAs($user)
            ->post('/profil', [
                'name' => $user->name,
                'avatar' => $invalidFile,
            ]);

        $response->assertSessionHasErrors('avatar');
    }

    public function test_avatar_validation_rejects_file_larger_than_2mb(): void
    {
        Storage::fake('public');

        $user = User::factory()->create();
        // 3000 KB > 2048 KB
        $oversizedFile = UploadedFile::fake()->image('large.jpg')->size(3000);

        $response = $this
            ->actingAs($user)
            ->post('/profil', [
                'name' => $user->name,
                'avatar' => $oversizedFile,
            ]);

        $response->assertSessionHasErrors('avatar');
    }
}
