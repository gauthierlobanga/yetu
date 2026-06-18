<?php

namespace App\Http\Controllers\Vendor\Boutique\Ecommerce\Category;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Vendor\Boutique\Ecommerce\Product\ProductController;
use App\Models\ProductCategory;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Contrôleur gérant l'affichage des catégories de produits côté boutique.
 *
 * Permet au client de naviguer dans le catalogue par catégorie, avec filtres,
 * produits associés et arborescence (sous-catégories).
 */
class CategoryController extends Controller
{
    /**
     * Affiche la page listant toutes les catégories principales.
     *
     * Charge les catégories actives, triées selon l'ordre défini,
     * et transmet la liste formatée à la vue Inertia.
     *
     * @return Response
     */
    public function categoriesIndex()
    {
        $categories = ProductCategory::active()->ordered()->with('media')->get()
            ->map(fn ($c) => $this->formatCategory($c));

        return Inertia::render('Vendor/boutique/Categories/Index', ['categories' => $categories]);
    }

    /**
     * Affiche le détail d'une catégorie et ses produits.
     *
     * Charge les produits en stock et publiés de cette catégorie avec pagination,
     * ainsi que ses sous-catégories et le fil d'Ariane (breadcrumb) pour la navigation.
     *
     * @param  ProductCategory  $category  La catégorie à afficher.
     * @return Response
     */
    public function categoriesShow(ProductCategory $category)
    {
        $category->load('media');
        // Optimisation : eager loading de media et brand pour éviter le Lazy Loading dans formatProduct
        $products = $category->products()->published()->inStock()->with(['media', 'brand'])->paginate(24)
            ->through(fn ($p) => app(ProductController::class)->formatProduct($p));

        $subcategories = $category->children()->active()->ordered()->get()->map(fn ($c) => $this->formatCategory($c));
        $breadcrumb = $category->getBreadcrumb();

        return Inertia::render('Vendor/boutique/Categories/Show', [
            'category' => $this->formatCategory($category),
            'products' => $products,
            'subcategories' => $subcategories,
            'breadcrumb' => $breadcrumb,
        ]);
    }

    /**
     * Formate les données d'une catégorie pour le frontend.
     *
     * Sélectionne uniquement les attributs nécessaires (id, slug, images, url)
     * pour optimiser la taille du payload JSON envoyé à Inertia.
     *
     * @param  ProductCategory  $category  La catégorie à formater.
     * @return array<string, mixed> Les données formatées.
     */
    private function formatCategory(ProductCategory $category): array
    {
        return [
            'id' => $category->id,
            'nom' => $category->nom,
            'slug' => $category->slug,
            'description' => $category->short_description,
            'image' => $category->image,
            'icon' => $category->icon,
            'banner' => $category->banner,
            'image_thumb' => $category->image_thumb,
            'url' => route('tenant.product.category.show', $category->slug),
            'products_count' => $category->products_count,
        ];
    }
}
