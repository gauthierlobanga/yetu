<?php

use App\Http\Middleware\HandleInertiaRequests;
use App\Models\Tenant;
use App\Services\TenantPropsService;
use App\Settings\SettingApp;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

function titleTestMiddleware(): HandleInertiaRequests
{
    return new class(app(TenantPropsService::class)) extends HandleInertiaRequests
    {
        protected function getRegionData(Request $request): array
        {
            return [];
        }

        protected function shouldShareCommerceData(Request $request): bool
        {
            return false;
        }
    };
}

afterEach(function () {
    if (function_exists('tenancy') && tenancy()->initialized) {
        tenancy()->end();
    }
});

test('central inertia title name uses the spatie app setting name', function () {
    SettingApp::fake([
        'name' => 'Yetu Central',
        'logo_url' => null,
        'address' => 'Kinshasa',
        'phone' => '+243 000 000 000',
        'email' => 'central@yetu.test',
        'facebook_url' => null,
        'instagram_url' => null,
        'x_url' => null,
        'linkedin_url' => null,
        'youtube_url' => null,
    ], loadMissingValues: false);

    $shared = titleTestMiddleware()->share(Request::create('http://localhost/'));

    expect($shared['name'])->toBe('Yetu Central')
        ->and($shared['appName'])->toBe('Yetu Central')
        ->and($shared['seo']['appName'])->toBe('Yetu Central')
        ->and($shared['seo']['defaultDescription'])->toBe('Bienvenue sur Yetu Central');
});

test('tenant inertia title name uses the vendor raison sociale', function () {
    $tenant = Tenant::factory()->create([
        'id' => 'title_shop',
        'raison_sociale' => 'Maison Lumina',
        'slug' => 'title-shop',
    ]);

    $tenant->domains()->create([
        'id' => (string) Str::orderedUuid(),
        'domain' => 'title-shop.localhost',
    ]);

    $this->prepareTenantDatabase($tenant);
    tenancy()->initialize($tenant);

    $shared = titleTestMiddleware()->share(Request::create('http://title-shop.localhost/'));

    expect($shared['name'])->toBe('Maison Lumina')
        ->and($shared['appName'])->toBe('Maison Lumina')
        ->and($shared['seo']['appName'])->toBe('Maison Lumina')
        ->and($shared['seo']['defaultDescription'])->toBe('Bienvenue sur Maison Lumina');
});
