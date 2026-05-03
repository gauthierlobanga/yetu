<?php

/**
 * Middleware de partage des données Inertia pour toute l'application.
 *
 * Ce middleware injecte automatiquement dans chaque vue React :
 * - les informations de l'utilisateur authentifié (profil, permissions, rôles)
 * - les données de l'en-tête (catégories, marques)
 * - le panier en cours (via CartController)
 * - les produits recommandés
 * - le contexte multi‑tenant (isTenant, tenant, tenantRoutePrefix)
 * - les messages flash et l'état de la sidebar
 *
 * @see https://inertiajs.com/shared-data
 */

namespace App\Http\Middleware;

use App\Http\Controllers\Shop\CartController;
use App\Http\Controllers\Shop\ProductController;
use App\Models\Brand;
use App\Models\ProductCategory;
use App\Models\Produit;
use App\Models\User;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Schema;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default with every Inertia response.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        // 1. [Multi‑tenant] Détection du contexte locataire (stancl/tenancy)
        $tenant = $this->resolveCurrentTenant();
        $isTenant = $tenant !== null;
        $tenantRoutePrefix = $isTenant ? 'tenant.' : '';

        // 2. Authentification sécurisée (gère le cas d'UUID invalide en session)
        $user = $this->resolveUser($request);

        // 3. Préparation des données partagées
        $shouldShareCommerceData = $this->shouldShareCommerceData($request);

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => $this->getAuthData($user),
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'flash' => $this->getFlashData($request),
            'headerData' => $shouldShareCommerceData ? $this->getHeaderData() : ['categories' => [], 'brands' => []],
            'cart' => $this->resolveCart($request, $shouldShareCommerceData),
            'recommendedProducts' => $this->getRecommendedProducts($request, $shouldShareCommerceData),
            'isTenant' => $isTenant,
            'tenant' => $tenant ? [
                'id' => $tenant->id,
                'raison_sociale' => $tenant->raison_sociale,
                'slug' => $tenant->slug,
                'logo' => $tenant->getFilamentAvatarUrl(),
            ] : null,
            'tenantRoutePrefix' => $tenantRoutePrefix,
        ];
    }

    /**
     * Résout le tenant courant via stancl/tenancy.
     * Protégé contre l'absence du package.
     */
    private function resolveCurrentTenant(): mixed
    {
        if (function_exists('tenant')) {
            return tenant();
        }

        return null;
    }

    /**
     * Résout l'utilisateur authentifié, en gérant proprement une session corrompue
     * (ex: ancien identifiant entier avant passage aux UUID).
     */
    private function resolveUser(Request $request): ?User
    {
        try {
            return $request->user();
        } catch (QueryException $e) {
            // SQLSTATE 22P02 = invalid input syntax (UUID attendu, entier reçu)
            if ($e->getCode() === '22P02') {
                Auth::logout();
                $request->session()->invalidate();

                return null;
            }
            throw $e; // Autre erreur inattendue
        }
    }

    /**
     * Prépare les informations d'authentification partagées avec le frontend.
     *
     * @return array<string, mixed>
     */
    private function getAuthData(?User $user): array
    {
        if (! $user) {
            return [
                'user' => null,
                'permissions' => [],
                'permissions_map' => [],
                'roles' => [],
            ];
        }

        return [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'avatar_url' => $user->avatar_url,
                'preferences' => $user->preferences ?? [],
            ],
            'permissions' => $user->getAllPermissions()->pluck('name')->toArray(),
            'permissions_map' => $this->buildPermissionsMap($user),
            'roles' => $user->roles->pluck('name')->toArray(),
        ];
    }

    /**
     * Extrait les messages flash de la session.
     *
     * @return array<string, \Closure>
     */
    private function getFlashData(Request $request): array
    {
        return [
            'success' => fn () => $request->session()->get('success'),
            'error' => fn () => $request->session()->get('error'),
            'message' => fn () => $request->session()->get('message'),
            'warning' => fn () => $request->session()->get('warning'),
        ];
    }

    /**
     * Détermine si les données commerciales (panier, header) doivent être partagées.
     *
     * On exclut les routes admin, horizon, API et toute autre route hors application.
     */
    private function shouldShareCommerceData(Request $request): bool
    {
        if ($request->is('admin*', 'horizon*', 'api*')) {
            return false;
        }

        return true;
    }

    /**
     * Récupère et formate le panier actif de l'utilisateur (via CartController).
     * Retourne null si le partage n'est pas nécessaire ou en cas d'erreur.
     */
    private function resolveCart(Request $request, bool $shouldShare): ?array
    {
        if (! $shouldShare || $request->is('admin*', 'horizon*')) {
            return null;
        }

        try {
            $cartController = app(CartController::class);
            $cart = $cartController->getOrCreateCart($request);

            return $cartController->formatCart($cart);
        } catch (\Exception) {
            return null;
        }
    }

    /**
     * Récupère une liste de produits recommandés pour l'affichage (jusqu'à 8).
     */
    private function getRecommendedProducts(Request $request, bool $shouldShare): array
    {
        if (! $shouldShare || ! Schema::hasTable('produits')) {
            return [];
        }

        try {
            $productController = app(ProductController::class);

            return Produit::published()
                ->inStock()
                ->take(8)
                ->get()
                ->map(fn ($p) => $productController->formatProduct($p))
                ->toArray();
        } catch (\Throwable) {
            return [];
        }
    }

    /**
     * Construit une carte des permissions organisée par modèle.
     * Exemple de format : [ 'Post' => [ 'view' => true, 'create' => true ], ... ]
     */
    private function buildPermissionsMap(User $user): array
    {
        $map = [];
        $permissions = $user->getAllPermissions()->pluck('name')->toArray();

        foreach ($permissions as $permission) {
            if (str_contains($permission, ':')) {
                [$action, $model] = explode(':', $permission, 2);
                if (! isset($map[$model])) {
                    $map[$model] = [];
                }
                $map[$model][$action] = true;
            }
        }

        return $map;
    }

    /**
     * Fournit les données de l'en-tête (catégories et marques) pour le menu de navigation.
     *
     * @return array{categories: array, brands: array}
     */
    private function getHeaderData(): array
    {
        try {
            $categories = [];
            if (Schema::hasTable('produit_categories')) {
                $categories = ProductCategory::active()
                    ->inMenu()
                    ->parents()
                    ->ordered()
                    ->with('media')
                    ->get()
                    ->map(fn ($category) => [
                        'id' => $category->id,
                        'nom' => $category->nom,
                        'slug' => $category->slug,
                        'url' => $this->resolveCategoryUrl($category->slug),
                        'image' => $category->getFirstMediaUrl('icon') ?: $category->getFirstMediaUrl('image'),
                    ])
                    ->all();
            }

            $brands = [];
            if (Schema::hasTable('brands')) {
                $brands = Brand::query()
                    ->when(method_exists(Brand::class, 'scopeActive'), fn ($q) => $q->active())
                    ->when(method_exists(Brand::class, 'scopeFeatured'), fn ($q) => $q->featured())
                    ->take(10)
                    ->get(['id', 'name', 'slug'])
                    ->toArray();
            }

            return compact('categories', 'brands');
        } catch (\Throwable) {
            return ['categories' => [], 'brands' => []];
        }
    }

    /**
     * Résout l'URL d'une catégorie selon que la route nommée existe (tenant ou central).
     */
    private function resolveCategoryUrl(string $slug): string
    {
        // On préfère la version avec préfixe tenant si elle existe
        if (Route::has('tenant.categories.show')) {
            return route('tenant.categories.show', $slug);
        }
        if (Route::has('product.category.show')) {
            return route('product.category.show', $slug);
        }

        return url("shop/categories/{$slug}");
    }
}
// namespace App\Http\Middleware;

// use App\Http\Controllers\Shop\CartController;
// use App\Http\Controllers\Shop\ProductController;
// use App\Models\Brand;
// use App\Models\ProductCategory;
// use App\Models\Produit;
// use App\Models\User;
// use Illuminate\Database\QueryException;
// use Illuminate\Http\Request;
// use Illuminate\Support\Facades\Auth;
// use Illuminate\Support\Facades\Cache;
// use Illuminate\Support\Facades\Route;
// use Illuminate\Support\Facades\Schema;
// use Inertia\Middleware;

// class HandleInertiaRequests extends Middleware
// {
//     /**
//      * The root template that's loaded on the first page visit.
//      *
//      * @see https://inertiajs.com/server-side-setup#root-template
//      *
//      * @var string
//      */
//     protected $rootView = 'app';

//     /**
//      * Determines the current asset version.
//      *
//      * @see https://inertiajs.com/asset-versioning
//      */
//     public function version(Request $request): ?string
//     {
//         return parent::version($request);
//     }

//     /**
//      * Define the props that are shared by default.
//      *
//      * @see https://inertiajs.com/shared-data
//      *
//      * @return array<string, mixed>
//      */
//     public function share(Request $request): array
//     {

//         $tenant = tenant(); // fonction helper de stancl/tenancy
//         $isTenant = $tenant !== null;
//         $tenantRoutePrefix = $isTenant ? 'tenant.' : '';

//         try {
//             $user = $request->user();
//         } catch (QueryException $e) {
//             // Vérifier que l'erreur est bien due à un UUID invalide
//             if (str_contains($e->getMessage(), 'Invalid text representation') ||
//                 str_contains($e->getMessage(), 'uuid')) {
//                 // Déconnecter l'utilisateur et invalider la session
//                 Auth::logout();
//                 $request->session()->invalidate();
//                 $user = null;
//             } else {
//                 // Relancer les autres erreurs SQL
//                 throw $e;
//             }
//         }

//         $shouldShareCommerceData = $this->shouldShareCommerceData($request);

//         // Initialisation des données par défaut
//         $permissionsData = ['flat' => [], 'map' => []];
//         $avatar = null;
//         $rolesList = [];

//         if ($user) {
//             // Récupération des données utilisateur
//             $permissionsData = $this->getUserPermissionsData($user);
//             $avatar = $user->avatar_url ?? null;
//             $rolesList = $user->roles->pluck('name')->toArray();
//         }

//         return [
//             ...parent::share($request),
//             'name' => config('app.name'),
//             'auth' => [
//                 'user' => $user ? [
//                     'id' => $user->id,
//                     'name' => $user->name,
//                     'email' => $user->email,
//                     'avatar_url' => $user->avatar_url,
//                     'preferences' => $user->preferences ?? [],
//                 ] : null,
//                 'permissions' => $user ? $user->getAllPermissions()->pluck('name')->toArray() : [],
//                 'permissions_map' => $user ? $this->buildPermissionsMap($user) : [],
//                 'roles' => $user ? $user->roles->pluck('name')->toArray() : [],
//             ],
//             'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
//             'flash' => [
//                 'success' => fn () => $request->session()->get('success'),
//                 'error' => fn () => $request->session()->get('error'),
//                 'message' => fn () => $request->session()->get('message'),
//                 'warning' => fn () => $request->session()->get('warning'),
//             ],
//             'headerData' => $shouldShareCommerceData ? $this->getHeaderData() : [
//                 'categories' => [],
//                 'brands' => [],
//             ],
//             'cart' => function () use ($request) {
//                 if (
//                     ! $this->shouldShareCommerceData($request) ||
//                     $request->is('admin*') ||
//                     $request->is('horizon*')
//                 ) {
//                     return null;
//                 }
//                 try {
//                     $cartController = app(CartController::class);
//                     $cart = $cartController->getOrCreateCart($request);

//                     return $cartController->formatCart($cart);
//                 } catch (\Exception $e) {
//                     return null;
//                 }
//             },

//             'recommendedProducts' => function () {
//                 if (! Schema::hasTable('produits')) {
//                     return [];
//                 }

//                 $productController = app(ProductController::class);

//                 try {
//                     return Produit::published()
//                         ->inStock()
//                         ->take(8)
//                         ->get()
//                         ->map(fn ($p) => $productController->formatProduct($p));
//                 } catch (\Throwable) {
//                     return [];
//                 }
//             },
//             'isTenant' => $isTenant,
//             'tenant' => $tenant ? [
//                 'id' => $tenant->id,
//                 'raison_sociale' => $tenant->raison_sociale,
//                 'slug' => $tenant->slug,
//                 'logo' => $tenant->getFilamentAvatarUrl(),
//             ] : null,
//             'tenantRoutePrefix' => $tenantRoutePrefix,
//         ];

//     }

//     /**
//      * Récupère et structure les permissions de l'utilisateur
//      *
//      * @param  User|null  $user
//      * @return array{flat: array, map: array}
//      */
//     private function getUserPermissionsData($user): array
//     {
//         if (! $user) {
//             return ['flat' => [], 'map' => []];
//         }

//         // Cache pour éviter de recalculer à chaque requête
//         $cacheKey = "user_permissions_{$user->id}_v3";

//         return Cache::remember($cacheKey, now()->addMinutes(5), function () use ($user) {
//             $allPermissions = $user->getAllPermissions()->pluck('name')->toArray();

//             // Structure plate pour vérification rapide
//             $flatPermissions = $allPermissions;

//             // Structure hiérarchique par modèle
//             $permissionsMap = [];
//             foreach ($allPermissions as $permission) {
//                 // Format attendu: "Action:Model" (ex: "View:Post", "Create:Product")
//                 if (str_contains($permission, ':')) {
//                     [$action, $model] = explode(':', $permission, 2);

//                     if (! isset($permissionsMap[$model])) {
//                         $permissionsMap[$model] = [];
//                     }

//                     $permissionsMap[$model][$action] = true;
//                 } else {
//                     // Permissions sans modèle
//                     if (! isset($permissionsMap['global'])) {
//                         $permissionsMap['global'] = [];
//                     }
//                     $permissionsMap['global'][$permission] = true;
//                 }
//             }

//             return [
//                 'flat' => $flatPermissions,
//                 'map' => $permissionsMap,
//             ];
//         });
//     }

//     private function buildPermissionsMap($user): array
//     {
//         $map = [];
//         $permissions = $user->getAllPermissions()->pluck('name')->toArray();

//         foreach ($permissions as $permission) {
//             if (str_contains($permission, ':')) {
//                 [$action, $model] = explode(':', $permission, 2);
//                 if (! isset($map[$model])) {
//                     $map[$model] = [];
//                 }
//                 $map[$model][$action] = true;
//             }
//         }

//         return $map;
//     }

//     private function shouldShareCommerceData(Request $request): bool
//     {
//         return $request->routeIs('tenant.*', '*', 'blog.*', 'contact.*', 'search*');
//     }

//     private function getHeaderData(): array
//     {
//         try {
//             $categories = [];

//             if (Schema::hasTable('produit_categories')) {
//                 $categories = ProductCategory::active()
//                     ->inMenu()
//                     ->parents()
//                     ->ordered()
//                     ->with('media')
//                     ->get()
//                     ->map(fn ($category) => [
//                         'id' => $category->id,
//                         'nom' => $category->nom,
//                         'slug' => $category->slug,
//                         'url' => Route::has('categories.show')
//                             ? route('categories.show', $category->slug)
//                             : url("shop/categories/{$category->slug}"),
//                         'image' => $category->getFirstMediaUrl('icon') ?: $category->getFirstMediaUrl('image'),
//                     ])
//                     ->all();
//             }

//             $brands = [];

//             if (Schema::hasTable('brands')) {
//                 $brands = Brand::query()
//                     ->when(
//                         method_exists(Brand::class, 'scopeActive'),
//                         fn ($query) => $query->active(),
//                     )
//                     ->when(
//                         method_exists(Brand::class, 'scopeFeatured'),
//                         fn ($query) => $query->featured(),
//                     )
//                     ->take(10)
//                     ->get(['id', 'name', 'slug'])
//                     ->toArray();
//             }

//             return [
//                 'categories' => $categories,
//                 'brands' => $brands,
//             ];
//         } catch (\Throwable) {
//             return [
//                 'categories' => [],
//                 'brands' => [],
//             ];
//         }
//     }
// }
