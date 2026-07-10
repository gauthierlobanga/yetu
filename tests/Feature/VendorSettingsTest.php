<?php

use App\Models\Tenant;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

afterEach(function () {
    if (function_exists('tenancy') && tenancy()->initialized) {
        tenancy()->end();
    }
});

test('vendor settings persist social links and address on the central tenant record', function () {
    $user = User::factory()->create();
    $tenant = Tenant::factory()->create([
        'id' => 'settings_shop',
        'raison_sociale' => 'Ancienne Boutique',
        'slug' => 'settings-shop',
        'email' => 'old@example.com',
        'configuration' => [
            'facebook_url' => 'https://facebook.com/old-shop',
            'address' => 'Ancienne adresse',
        ],
    ]);

    $tenant->domains()->create([
        'id' => (string) Str::orderedUuid(),
        'domain' => 'settings-shop.localhost',
    ]);

    DB::table('user_tenant')->insert([
        'id' => (string) Str::orderedUuid(),
        'tenant_id' => $tenant->id,
        'user_id' => $user->id,
        'is_owner' => true,
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $this->prepareTenantDatabase($tenant);

    $response = $this
        ->actingAs($user)
        ->from('http://settings-shop.localhost/parametres')
        ->put('http://settings-shop.localhost/parametres', [
            'raison_sociale' => 'Boutique Lumina',
            'description' => 'Une boutique lumineuse.',
            'email' => 'contact@lumina.test',
            'telephone' => '+243 812 345 678',
            'forme_juridique' => 'societe_commerciale',
            'facebook_url' => 'https://facebook.com/lumina',
            'instagram_url' => 'https://instagram.com/lumina',
            'twitter_url' => 'https://x.com/lumina',
            'youtube_url' => 'https://youtube.com/@lumina',
            'tiktok_url' => 'https://tiktok.com/@lumina',
            'address' => '12 Avenue Lumina, Kinshasa',
            'remove_logo' => false,
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect('http://settings-shop.localhost/parametres');

    $centralTenant = tenancy()->central(fn () => Tenant::findOrFail($tenant->id));

    expect($centralTenant->raison_sociale)->toBe('Boutique Lumina')
        ->and($centralTenant->email)->toBe('contact@lumina.test')
        ->and($centralTenant->type_entite)->toBe('societe_commerciale')
        ->and($centralTenant->getConfiguration('facebook_url'))->toBe('https://facebook.com/lumina')
        ->and($centralTenant->getConfiguration('instagram_url'))->toBe('https://instagram.com/lumina')
        ->and($centralTenant->getConfiguration('twitter_url'))->toBe('https://x.com/lumina')
        ->and($centralTenant->getConfiguration('youtube_url'))->toBe('https://youtube.com/@lumina')
        ->and($centralTenant->getConfiguration('tiktok_url'))->toBe('https://tiktok.com/@lumina')
        ->and($centralTenant->getConfiguration('address'))->toBe('12 Avenue Lumina, Kinshasa');
});
