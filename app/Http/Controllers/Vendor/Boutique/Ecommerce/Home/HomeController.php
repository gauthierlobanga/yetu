<?php

namespace App\Http\Controllers\Vendor\Boutique\Ecommerce\Home;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\ProductCategory;
use App\Models\Produit;
use App\Models\Promotion;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Contrôleur de la page d'accueil de la boutique.
 *
 * Agrège les produits phares, les tendances, les catégories, les meilleures ventes
 * et les promotions pour construire la vitrine principale de la boutique.
 */
class HomeController extends Controller
{
    /**
     * Prépare et retourne toutes les données de la page d'accueil (Inertia).
     *
     * Lance les requêtes optimisées (eager loading) pour les bannières,
     * les produits (par catégories, trending, promo) afin d'alimenter la vue.
     *
     * @param  Request  $request  La requête courante.
     * @return Response
     */
    public function homeIndex(Request $request)
    {
        $productsCount = Produit::published()->count();
        // Pour les produits récents, on charge les relations si la vue les utilise
        $recentProducts = Produit::published()
            ->latest()
            ->with(['media', 'brand'])
            ->take(4)
            ->get();

        $hasProductCategories = Schema::hasTable('produit_categories');
        $canLoadProductCategories = $hasProductCategories && Schema::hasTable('produit_categorie_pivot');
        $hasProducts = Schema::hasTable('produits');
        $hasBrands = Schema::hasTable('brands');
        $hasPromotions = Schema::hasTable('promotions');
        $productRelations = ['media', 'brand'];

        if ($canLoadProductCategories) {
            $productRelations[] = 'categories';
        }

        $baseProductQuery = $hasProducts
            ? Produit::published()->inStock()->with($productRelations)
            : null;

        // ========== OPTIMISATION DES CATÉGORIES ==========
        $allCategories = collect();
        $categoriesModels = collect();
        $grouped = collect();
        $getDescendantIds = null;

        if ($canLoadProductCategories) {
            $allCategories = ProductCategory::active()
                ->inMenu()
                ->ordered()
                ->with('media')
                ->get()
                ->keyBy('id');

            $grouped = $allCategories->groupBy('parente_id');

            foreach ($allCategories as $cat) {
                $cat->setRelation('children', $grouped->get($cat->id, collect())->values());
            }

            $categoriesModels = $allCategories->whereNull('parente_id')->values();

            $getDescendantIds = function ($categoryId) use (&$getDescendantIds, $grouped) {
                $ids = [$categoryId];
                foreach ($grouped->get($categoryId, collect()) as $child) {
                    $ids = array_merge($ids, $getDescendantIds($child->id));
                }

                return $ids;
            };
        }

        $categories = $categoriesModels->map(fn ($category) => $this->formatCategory($category));

        // Produits mis en avant
        $featuredPage = $request->input('page', 1);
        $featuredProducts = $hasProducts
            ? Produit::published()
                ->inStock()
                ->featured()
                ->with($productRelations)
                ->paginate(24, ['*'], 'featuredPage', $featuredPage)
                ->through(fn ($product) => $this->formatProduct($product))
            : new LengthAwarePaginator([], 0, 24, $featuredPage);

        // Produits tendance
        $trendingProducts = $hasProducts
            ? Produit::published()
                ->inStock()
                ->bestseller()
                ->with($productRelations)
                ->take(12)
                ->get()
                ->map(fn ($product) => $this->formatProduct($product))
            : collect();

        // Produits par catégorie pour les onglets
        $productsByCategory = [];
        if ($canLoadProductCategories) {
            foreach ($categoriesModels as $category) {
                $categoryIds = $getDescendantIds($category->id);

                $products = Produit::published()
                    ->inStock()
                    ->whereHas('categories', fn ($q) => $q->whereIn('produit_categories.id', $categoryIds))
                    ->with(['media', 'brand'])
                    ->take(6)
                    ->get()
                    ->map(fn ($product) => $this->formatProduct($product));

                if ($products->isNotEmpty()) {
                    $productsByCategory[$category->slug] = [
                        'category' => $this->formatCategory($category),
                        'products' => $products,
                    ];
                }
            }
        }

        // Promotion active dynamique
        $promo = null;
        $activePromotion = $hasPromotions ? Promotion::activePromotion() : null;

        if ($activePromotion && $hasProducts) {
            // 🔧 Ajout de with(['media', 'brand']) pour éviter le lazy loading
            $promoProducts = Produit::published()
                ->inStock()
                ->bestseller()
                ->with(['media', 'brand'])
                ->take(10)
                ->get()
                ->map(fn ($product) => $this->formatProduct($product));

            $promo = [
                'title' => $activePromotion->nom,
                'description' => $activePromotion->description,
                'end_date' => optional($activePromotion->date_fin)->toIso8601String(),
                'image' => $activePromotion->image_url,
                'discount_percentage' => $activePromotion->type === Promotion::TYPE_POURCENTAGE
                    ? (int) $activePromotion->valeur
                    : null,
                'coupons' => $activePromotion->coupons,
                'featuredProducts' => $promoProducts,
                'is_active' => $activePromotion->is_currently_active,
            ];
        }

        // Meilleures ventes
        $bestSellers = $baseProductQuery
            ? (clone $baseProductQuery)
                ->bestseller()
                ->take(10)
                ->get()
                ->map(fn ($product) => $this->formatProduct($product))
            : collect();

        // Deal du jour
        // 🔧 Ajout de with(['media', 'brand'])
        $dealOfTheDay = $hasProducts
            ? Produit::dealOfTheDay()
                ->latest('expires_at')
                ->with(['media', 'brand'])
                ->take(10)
                ->get()
                ->map(function ($product) {
                    $data = $this->formatProduct($product);
                    $data['discount_label'] = $product->reduction_pourcentage
                        ? "-{$product->reduction_pourcentage}%"
                        : null;
                    $data['is_deal_of_the_day'] = true;

                    return $data;
                })
            : collect();

        $brands = $hasBrands
            ? Brand::where('is_active', true)
                ->with('media')
                ->take(12)
                ->get()
                ->map(fn ($brand) => $this->formatBrand($brand))
            : collect();

        return Inertia::render('Vendor/pages/home/Home', [
            'featuredProducts' => $featuredProducts,
            'trendingProducts' => $trendingProducts,
            'categories' => $categories,
            'productsByCategory' => $productsByCategory,
            'promo' => $promo,
            'bestSellers' => $bestSellers,
            'dealOfTheDay' => $dealOfTheDay,
            'brands' => $brands,
            'productsCount' => $productsCount,
            'recentProducts' => $recentProducts,
        ]);
    }

    /**
     * Formate un objet produit pour sa présentation sur l'accueil.
     *
     * Construit le dictionnaire de propriétés, incluant prix remisés, statuts
     * promotionnels, image principale et la marque (brand). Optionnellement
     * les détails complets (images multiples, stock, avis).
     *
     * @param  Produit  $product  Le modèle de produit à formater.
     * @param  bool  $withDetails  Indique si les détails avancés doivent être inclus.
     * @return array<string, mixed> Les données du produit formattées.
     */
    private function formatProduct(Produit $product, bool $withDetails = false): array
    {
        $primaryImage = $product->getPrimaryImage();

        // Désormais 'brand' est toujours chargé, mais on peut ajouter une sécurité
        $brandData = $product->relationLoaded('brand') && $product->brand
            ? ['nom' => $product->brand->nom, 'slug' => $product->brand->slug]
            : null;

        $data = [
            'id' => $product->id,
            'nom' => $product->nom,
            'slug' => $product->slug,
            'quantite_stock' => $product->quantite_stock,
            'prix_ttc' => (float) $product->prix_ttc,
            'prix_promotion' => $product->prix_promotion ? (float) $product->prix_promotion : null,
            'prix_actuel' => (float) $product->prix_actuel,
            'est_en_promotion' => (bool) $product->est_en_promotion,
            'reduction_pourcentage' => $product->reduction_pourcentage,
            'image_principale' => $primaryImage['medium'] ?? null,
            'image_thumb' => $primaryImage['thumb'] ?? null,
            'note_moyenne' => (float) $product->note_moyenne,
            'nombre_avis' => (int) $product->nombre_avis,
            'badge' => $product->is_new ? 'Nouveauté' : ($product->is_bestseller ? 'Best Seller' : null),
            'brand' => $brandData,
            'url' => route('tenant.product.show', $product->slug),
            'sold_count' => (int) $product->sold_count,
        ];

        if ($withDetails) {
            $data['description'] = $product->description_longue;
            $data['short_description'] = $product->short_description;
            $data['images'] = $product->images;

            $data['categories'] = $product->categories->map(fn ($c) => [
                'nom' => $c->nom,
                'slug' => $c->slug,
            ])->values()->toArray();

            $data['variantes'] = $product->variantes->map(fn ($v) => [
                'id' => $v->id,
                'nom' => $v->nom,
                'valeur' => $v->valeur,
                'supplement_prix' => (float) $v->supplement_prix,
                'stock' => (int) $v->stock,
                // Optimisation : calcul direct pour contourner le Lazy Loading de $v->prix_actuel
                'prix_actuel' => (float) ($product->prix_actuel + $v->supplement_prix),
            ])->values()->toArray();

            $data['stock_disponible'] = $product->stock_disponible;

            $avis = $product->approvedAvis()->with('client')->latest()->get();
            $data['avis'] = $avis->map(fn ($a) => [
                'id' => $a->id,
                'note' => (int) $a->note,
                'commentaire' => $a->commentaire,
                'client' => $a->client->full_name ?? 'Client',
                'date' => $a->created_at->diffForHumans(),
                'utile' => $a->votes_utiles ?? 0,
            ])->values()->toArray();

            $distribution = [5 => 0, 4 => 0, 3 => 0, 2 => 0, 1 => 0];
            foreach ($avis as $a) {
                $note = (int) $a->note;
                if (isset($distribution[$note])) {
                    $distribution[$note]++;
                }
            }

            $data['rating_stats'] = [
                'average' => $product->note_moyenne,
                'total' => $avis->count(),
                'distribution' => $distribution,
            ];

            $prixBase = $product->prix_actuel;
            $data['bulk_discounts'] = [
                ['quantity' => 1, 'discount_percentage' => 0,  'price' => $prixBase],
                ['quantity' => 2, 'discount_percentage' => 10, 'price' => round($prixBase * 2 * 0.9, 2)],
                ['quantity' => 3, 'discount_percentage' => 20, 'price' => round($prixBase * 3 * 0.8, 2)],
            ];
        }

        return $data;
    }

    /**
     * Formate une catégorie de produit pour l'accueil.
     *
     * Récupère le nom, le slug, la description, et gère
     * récursivement le formatage des sous-catégories (children).
     *
     * @param  ProductCategory  $category  La catégorie.
     * @return array<string, mixed> Données formatées.
     */
    private function formatCategory(ProductCategory $category): array
    {
        return [
            'id' => $category->id,
            'nom' => $category->nom,
            'slug' => $category->slug,
            'description' => $category->short_description,
            'image' => $category->image_url,
            'icon' => $category->icon_url,
            'url' => route('tenant.product.category.show', $category->slug),
            'children' => $category->relationLoaded('children')
                ? $category->children->map(fn ($child) => $this->formatCategory($child))
                : collect(),
        ];
    }

    /**
     * Formate une marque (Brand) pour l'affichage de la galerie des marques.
     *
     * @param  Brand  $brand  Le modèle de marque.
     * @return array<string, mixed> Données de la marque formatées.
     */
    private function formatBrand(Brand $brand): array
    {
        $logo = $brand->getFirstMediaUrl('logo') ?: Storage::url('images/');

        return [
            'id' => $brand->id,
            'nom' => $brand->nom,
            'slug' => $brand->slug,
            'logo' => $logo,
            'url' => route('tenant.brands.show', $brand->slug),
        ];
    }
}
