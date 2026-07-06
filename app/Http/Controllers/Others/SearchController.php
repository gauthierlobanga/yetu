<?php

namespace App\Http\Controllers\Others;

use App\Http\Controllers\Controller;
use App\Models\ProductCategory;
use App\Models\Produit;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Contrôleur de recherche globale de la boutique (produits et catégories).
 *
 * Fournit une page Inertia et un endpoint API JSON pour la recherche
 * par mots-clés. Les résultats combinent produits et catégories de produits
 * avec un ratio de répartition 75% produits / 25% catégories.
 */
class SearchController extends Controller
{
    /**
     * Affiche la page de résultats de recherche via Inertia.
     *
     * @param  Request  $request  Requête contenant le paramètre `q` (terme de recherche)
     * @return Response La page Inertia avec les résultats et la requête
     */
    public function page(Request $request): Response
    {
        $query = $this->searchQuery($request);
        $limit = $this->resultLimit($request, 24);

        return Inertia::render('Search/Index', [
            'results' => $this->performSearch($query, $limit),
            'query' => $query,
        ]);
    }

    /**
     * Retourne les résultats de recherche au format JSON (endpoint API).
     *
     * @param  Request  $request  Requête contenant `q` et optionnellement `limit`
     * @return JsonResponse Les résultats et la requête au format JSON
     */
    public function api(Request $request): JsonResponse
    {
        $query = $this->searchQuery($request);
        $limit = $this->resultLimit($request, 12);

        return response()->json([
            'results' => $this->performSearch($query, $limit),
            'query' => $query,
        ]);
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function performSearch(string $query, int $limit): array
    {
        if (mb_strlen($query) < 2) {
            return [];
        }

        $productsLimit = max(1, (int) ceil($limit * 0.75));
        $categoriesLimit = max(1, $limit - $productsLimit);

        return $this->products($query, $productsLimit)
            ->merge($this->categories($query, $categoriesLimit))
            ->take($limit)
            ->values()
            ->all();
    }

    /**
     * @return Collection<int, array<string, mixed>>
     */
    private function products(string $query, int $limit): Collection
    {
        return Produit::query()
            ->select([
                'id',
                'nom',
                'slug',
                'short_description',
                'description_longue',
                'prix_ttc',
                'prix_promotion',
                'statut',
                'is_new',
                'is_bestseller',
                'is_featured',
                'published_at',
                'expires_at',
            ])
            ->with('media')
            ->published()
            ->where(function ($builder) use ($query): void {
                $builder
                    ->where('nom', 'LIKE', "%{$query}%")
                    ->orWhere('short_description', 'LIKE', "%{$query}%")
                    ->orWhere('description_longue', 'LIKE', "%{$query}%")
                    ->orWhere('reference', 'LIKE', "%{$query}%")
                    ->orWhere('sku', 'LIKE', "%{$query}%")
                    ->orWhere('ean', 'LIKE', "%{$query}%")
                    ->orWhereHas('categories', function ($categoryQuery) use ($query): void {
                        $categoryQuery->where('produit_categories.nom', 'LIKE', "%{$query}%");
                    });
            })
            ->orderByRaw('CASE WHEN nom LIKE ? THEN 0 ELSE 1 END', ["{$query}%"])
            ->latest('created_at')
            ->limit($limit)
            ->get()
            ->map(fn (Produit $product): array => [
                'id' => $product->id,
                'nom' => $product->nom,
                'slug' => $product->slug,
                'description' => Str::limit(strip_tags((string) ($product->short_description ?: $product->description_longue)), 120),
                'image_principale' => $product->image_principale_thumb,
                'prix_actuel' => (float) $product->prix_actuel,
                'prix_ttc' => (float) $product->prix_ttc,
                'badge' => $this->productBadge($product),
                'url' => route('tenant.product.show', $product->slug),
                'type' => 'product',
                '_type' => 'product',
            ]);
    }

    /**
     * @return Collection<int, array<string, mixed>>
     */
    private function categories(string $query, int $limit): Collection
    {
        return ProductCategory::query()
            ->select(['id', 'nom', 'slug', 'short_description', 'description', 'est_active', 'order'])
            ->withCount([
                'products as produits_count' => fn ($builder) => $builder->published(),
            ])
            ->active()
            ->where(function ($builder) use ($query): void {
                $builder
                    ->where('nom', 'LIKE', "%{$query}%")
                    ->orWhere('short_description', 'LIKE', "%{$query}%")
                    ->orWhere('description', 'LIKE', "%{$query}%");
            })
            ->orderByRaw('CASE WHEN nom LIKE ? THEN 0 ELSE 1 END', ["{$query}%"])
            ->ordered()
            ->limit($limit)
            ->get()
            ->map(fn (ProductCategory $category): array => [
                'id' => $category->id,
                'nom' => $category->nom,
                'slug' => $category->slug,
                'description' => $category->short_description,
                'produits_count' => (int) $category->produits_count,
                'url' => route('tenant.product.category.show', $category->slug),
                'type' => 'category',
                '_type' => 'category',
            ]);
    }

    /**
     * Extrait et nettoie le terme de recherche de la requête HTTP.
     *
     * Supprime les espaces superflus et tronque à 120 caractères maximum.
     *
     * @param  Request  $request  La requête HTTP
     * @return string Le terme de recherche nettoyé
     */
    private function searchQuery(Request $request): string
    {
        return Str::of($request->string('q')->toString())
            ->squish()
            ->limit(120, '')
            ->toString();
    }

    /**
     * Détermine la limite de résultats à retourner.
     *
     * Borne la valeur entre 1 et 48 pour éviter les abus.
     *
     * @param  Request  $request  La requête HTTP
     * @param  int  $default  Valeur par défaut si le paramètre `limit` est absent
     * @return int La limite effective
     */
    private function resultLimit(Request $request, int $default): int
    {
        return max(1, min($request->integer('limit', $default), 48));
    }

    /**
     * Détermine le badge à afficher sur la carte d'un produit.
     *
     * Retourne le premier badge applicable dans l'ordre de priorité :
     * Promo > Nouveau > Populaire > Vedette.
     *
     * @param  Produit  $product  Le modèle de produit
     * @return string|null Le libellé du badge ou null si aucun badge applicable
     */
    private function productBadge(Produit $product): ?string
    {
        if ($product->est_en_promotion) {
            return 'Promo';
        }

        if ($product->is_new) {
            return 'Nouveau';
        }

        if ($product->is_bestseller) {
            return 'Populaire';
        }

        if ($product->is_featured) {
            return 'Vedette';
        }

        return null;
    }
}
