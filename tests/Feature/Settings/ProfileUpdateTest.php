<?php

use App\Models\Tenant;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

/*
|--------------------------------------------------------------------------
| Configuration des Tests de Profil Tenant
|--------------------------------------------------------------------------
| On initialise un tenant "test-shop" avec son domaine "test-shop.localhost"
| pour que les middlewares de détection de domaine fonctionnent correctement.
*/
beforeEach(function () {
    // Création du locataire de test
    $this->tenant = Tenant::create([
        'id' => 'test-shop',
        'raison_sociale' => 'Test Shop',
        'slug' => 'test-shop',
    ]);

    // Enregistrement du domaine de test
    $this->tenant->domains()->create([
        'domain' => 'test-shop.localhost',
    ]);

    // Initialisation de la session de tenancy
    tenancy()->initialize($this->tenant);

    // Migration de la base de données du locataire
    Artisan::call('tenants:migrate', ['--tenants' => ['test-shop']]);
});

afterEach(function () {
    // Fin de la session de tenancy
    tenancy()->end();
});

test('profile page is displayed', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->get('http://test-shop.localhost/tenant/settings/profile');

    $response->assertOk();
});

test('profile information can be updated', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->patch('http://test-shop.localhost/tenant/settings/profile', [
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect('http://test-shop.localhost/tenant/settings/profile');

    $user->refresh();

    expect($user->name)->toBe('Test User');
    expect($user->email)->toBe('test@example.com');
    expect($user->email_verified_at)->toBeNull();
});

test('profile avatar can be updated', function () {
    Storage::fake('public');

    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->patch('http://test-shop.localhost/tenant/settings/profile', [
            'name' => $user->name,
            'email' => $user->email,
            'avatar' => UploadedFile::fake()->image('avatar.jpg', 400, 400),
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect('http://test-shop.localhost/tenant/settings/profile');

    $user->refresh();

    expect($user->hasMedia('avatar'))->toBeTrue();
    expect($user->avatar)->not->toBeNull();
});

test('email verification status is unchanged when the email address is unchanged', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->patch('http://test-shop.localhost/tenant/settings/profile', [
            'name' => 'Test User',
            'email' => $user->email,
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect('http://test-shop.localhost/tenant/settings/profile');

    expect($user->refresh()->email_verified_at)->not->toBeNull();
});

test('user can delete their account', function () {
    $user = User::factory()->create([
        'password' => Hash::make('password'),
    ]);

    $response = $this
        ->actingAs($user)
        ->delete('http://test-shop.localhost/tenant/settings/profile', [
            'password' => 'password',
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect('http://test-shop.localhost');

    $this->assertGuest();
    expect($user->fresh())->toBeNull();
});

test('correct password must be provided to delete account', function () {
    $user = User::factory()->create([
        'password' => Hash::make('password'),
    ]);

    $response = $this
        ->actingAs($user)
        ->from('http://test-shop.localhost/tenant/settings/profile')
        ->delete('http://test-shop.localhost/tenant/settings/profile', [
            'password' => 'wrong-password',
        ]);

    $response
        ->assertSessionHasErrors('password')
        ->assertRedirect('http://test-shop.localhost/tenant/settings/profile');

    expect($user->fresh())->not->toBeNull();
});
