<?php

namespace App\Http\Controllers\Tenants\Shop;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\ProductCategory;
use App\Models\Produit;
use Inertia\Inertia;
use Inertia\Response;

class HomeTenantController extends Controller
{
    public function index(): Response
    {
        $tenant = tenant(); // le tenant courant identifié par stancl/tenancy

        // // Produits en vedette (les mieux notés, en stock, publiés)
        $featuredProducts = Produit::with(['brand', 'categories', 'media'])
            ->where('statut', Produit::STATUS_PUBLISHED)
            ->where('is_featured', true)
            ->inStock()
            ->orderBy('average_rating', 'desc')
            ->limit(12)
            ->get()
            ->map(fn ($p) => $this->formatProduct($p));

        // Nouveautés
        $newArrivals = Produit::with(['brand', 'media'])
            ->where('statut', Produit::STATUS_PUBLISHED)
            ->inStock()
            ->latest()
            ->limit(8)
            ->get()
            ->map(fn ($p) => $this->formatProduct($p));

        // Catégories (top 8)
        $categories = ProductCategory::where('est_active', true)
            ->withCount(['products' => fn ($q) => $q->where('statut', Produit::STATUS_PUBLISHED)])
            ->orderBy('order')
            ->limit(8)
            ->get()
            ->map(fn ($c) => [
                'id' => $c->id,
                'nom' => $c->nom,
                'slug' => $c->slug,
                'icon' => $c->icon ?? '🛍️',
                'products_count' => $c->produits_count,
            ]);

        // Marques / Artisans
        $brands = Brand::where('is_active', true)
            ->with('media')
            ->orderBy('sort_order')
            ->limit(6)
            ->get()
            ->map(fn ($b) => [
                'id' => $b->id,
                'name' => $b->name,
                'slug' => $b->slug,
                'logo' => $b->getFirstMediaUrl('logo'),
            ]);

        return Inertia::render('tenants/Shop/Home/Index', [
            'tenant' => [
                'id' => $tenant->id,
                'raison_sociale' => $tenant->raison_sociale,
                'slug' => $tenant->slug,
                'logo' => $tenant->getFilamentAvatarUrl(),
                'banner' => $tenant->getFirstMediaUrl('banner') ?? null,
                'description' => $tenant->description ?? 'Découvrez l’artisanat congolais authentique',
            ],
            'featuredProducts' => $featuredProducts,
            'newArrivals' => $newArrivals,
            'categories' => $categories,
            'brands' => $brands,
        ]);
    }

    private function formatProduct($product): array
    {
        return [
            'id' => $product->id,
            'nom' => $product->nom,
            'slug' => $product->slug,
            'prix_ttc' => $product->prix_ttc,
            'prix_promotion' => $product->prix_promotion,
            'image' => $product->getFirstMediaUrl('featured', 'card'),
            'average_rating' => $product->average_rating,
            'reviews_count' => $product->reviews_count,
            'brand' => $product->brand?->name,
            'in_stock' => $product->quantite_stock > 0,
        ];
    }
}
