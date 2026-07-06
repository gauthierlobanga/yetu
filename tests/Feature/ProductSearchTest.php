<?php

use App\Http\Middleware\EnsureTenantSubscription;
use App\Models\Brand;
use App\Models\ProductCategory;
use App\Models\Produit;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Str;

beforeEach(function () {
    $tenant = Tenant::create([
        'id' => 'search_shop',
        'raison_sociale' => 'Search Shop',
        'slug' => 'search-shop',
        'is_active' => true,
        'statut' => Tenant::STATUT_ACTIF,
    ]);

    $tenant->domains()->create([
        'id' => Str::orderedUuid(),
        'domain' => 'search-shop.localhost',
    ]);

    $this->prepareTenantDatabase($tenant);

    tenancy()->initialize($tenant);

    Artisan::call('tenants:migrate', ['--tenants' => ['search_shop']]);

    $this->withoutMiddleware(EnsureTenantSubscription::class);
});

afterEach(function () {
    if (function_exists('tenancy') && tenancy()->initialized) {
        tenancy()->end();
    }
});

test('api search returns only products and product categories', function () {
    User::factory()->create([
        'name' => 'Lumina Blog Author',
    ]);

    $brand = Brand::create([
        'id' => (string) Str::orderedUuid(),
        'name' => 'Lumina Brand',
        'slug' => 'lumina-brand',
    ]);

    $category = ProductCategory::create([
        'id' => (string) Str::orderedUuid(),
        'nom' => 'Lumina Maison',
        'slug' => 'lumina-maison',
        'description' => 'Accessoires lumineux pour la maison.',
        'short_description' => 'Accessoires lumineux',
        'seo_title' => 'Lumina Maison',
        'seo_description' => 'Accessoires lumineux pour la maison.',
        'seo_keywords' => ['lumina'],
        'est_active' => true,
    ]);

    $product = Produit::create([
        'id' => (string) Str::orderedUuid(),
        'brand_id' => $brand->id,
        'reference' => 'LUM-001',
        'nom' => 'Lampe Lumina Moderne',
        'slug' => 'lampe-lumina-moderne',
        'short_description' => 'Lampe moderne pour salon.',
        'description_longue' => 'Une lampe Lumina moderne et élégante.',
        'prix_ht' => 80,
        'prix_ttc' => 96,
        'quantite_stock' => 12,
        'sku' => 'LUMINA-001',
        'statut' => Produit::STATUS_PUBLISHED,
        'seo_title' => 'Lampe Lumina Moderne',
        'seo_description' => 'Lampe moderne pour salon.',
        'seo_keywords' => ['lumina'],
        'published_at' => now(),
    ]);

    $product->categories()->attach($category->id, [
        'is_primary' => true,
        'order' => 1,
    ]);

    $response = $this->getJson('http://search-shop.localhost/api/search?q=lumina&limit=10');

    $response
        ->assertSuccessful()
        ->assertJsonPath('query', 'lumina')
        ->assertJsonCount(2, 'results')
        ->assertJsonPath('results.0._type', 'product')
        ->assertJsonPath('results.1._type', 'category');

    expect(collect($response->json('results'))->pluck('_type')->all())
        ->toBe(['product', 'category']);
});
