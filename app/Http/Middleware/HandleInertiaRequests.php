<?php

// namespace App\Http\Middleware;

// use Illuminate\Http\Request;
// use Illuminate\Support\Facades\Cache;
// use Inertia\Middleware;

// class HandleInertiaRequests extends Middleware
// {

//     public function share(Request $request): array
//     {
//         $user = $request->user();

//         return [
//             ...parent::share($request),
//             'name' => config('app.name'),
//             'auth' => [
//                 'user' => $user ? [
//                     'id' => $user->id,
//                     'name' => $user->name,
//                     'email' => $user->email,
//                     'avatar_url' => $user->avatar_url ?? null,
//                     'preferences' => $user->preferences,
//                 ] : null,
//                 // Permissions formatées pour accès rapide
//                 'permissions' => $permissionsData['flat'], // Pour vérification simple
//                 'permissions_map' => $permissionsData['map'], // Pour vérification par modèle
//                 'roles' => $user?->roles->pluck('name') ?? [],
//             ],
//             // 'auth' => [
//             //     'user' => $request->user(),
//             //     'avatar' => $user->avatar_url ?? null,
//             //     'permissions' => $user->permissions_list ?? [],
//             //     'roles' => $user->roles_list ?? [],
//             // ],
//             'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
//             'flash' => [
//                 'success' => fn() => $request->session()->has('success'),
//                 'error' => fn() => $request->session()->has('error'),
//                 'message' => fn() => $request->session()->get('message'),
//                 'warning' => fn() => $request->session()->get('warning'),
//             ]
//         ];
//     }

//     /**
//      * Optimisation des permissions pour React
//      * Structure:
//      * - flat: ['View:Post', 'Create:Post', 'Update:User', ...]
//      * - map: ['Post' => ['View', 'Create', 'Update'], 'User' => ['View', 'Delete']]
//      */
//     private function getUserPermissionsData($user): array
//     {
//         if (!$user) {
//             return ['flat' => [], 'map' => []];
//         }

//         // Cache pour éviter de recalculer à chaque requête
//         $cacheKey = "user_permissions_{$user->id}_v2";

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

//                     if (!isset($permissionsMap[$model])) {
//                         $permissionsMap[$model] = [];
//                     }

//                     $permissionsMap[$model][$action] = true;
//                 } else {
//                     // Permissions sans modèle (générales)
//                     $permissionsMap['global'][$permission] = true;
//                 }
//             }

//             return [
//                 'flat' => $flatPermissions,
//                 'map' => $permissionsMap,
//             ];
//         });
//     }
// }

namespace App\Http\Middleware;

use App\Http\Controllers\Shop\CartController;
use App\Http\Controllers\Shop\ProductController;
use App\Models\Brand;
use App\Models\ProductCategory;
use App\Models\Produit;
use App\Models\User;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Schema;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
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
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        try {
            $user = $request->user();
        } catch (QueryException $e) {
            // Vérifier que l'erreur est bien due à un UUID invalide
            if (str_contains($e->getMessage(), 'Invalid text representation') ||
                str_contains($e->getMessage(), 'uuid')) {
                // Déconnecter l'utilisateur et invalider la session
                auth()->logout();
                $request->session()->invalidate();
                $user = null;
            } else {
                // Relancer les autres erreurs SQL
                throw $e;
            }
        }

        $shouldShareCommerceData = $this->shouldShareCommerceData($request);

        // Initialisation des données par défaut
        $permissionsData = ['flat' => [], 'map' => []];
        $avatar = null;
        $rolesList = [];

        if ($user) {
            // Récupération des données utilisateur
            $permissionsData = $this->getUserPermissionsData($user);
            $avatar = $user->avatar_url ?? null;
            $rolesList = $user->roles->pluck('name')->toArray();
        }

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'avatar_url' => $user->avatar_url,
                    'preferences' => $user->preferences ?? [],
                ] : null,
                'permissions' => $user ? $user->getAllPermissions()->pluck('name')->toArray() : [],
                'permissions_map' => $user ? $this->buildPermissionsMap($user) : [],
                'roles' => $user ? $user->roles->pluck('name')->toArray() : [],
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
                'message' => fn () => $request->session()->get('message'),
                'warning' => fn () => $request->session()->get('warning'),
            ],
            'headerData' => $shouldShareCommerceData ? $this->getHeaderData() : [
                'categories' => [],
                'brands' => [],
            ],
            'cart' => function () use ($request) {
                if (
                    ! $this->shouldShareCommerceData($request) ||
                    $request->is('admin*') ||
                    $request->is('horizon*')
                ) {
                    return null;
                }
                try {
                    $cartController = app(CartController::class);
                    $cart = $cartController->getOrCreateCart($request);

                    return $cartController->formatCart($cart);
                } catch (\Exception $e) {
                    return null;
                }
            },

            'recommendedProducts' => function () {
                if (! Schema::hasTable('produits')) {
                    return [];
                }

                $productController = app(ProductController::class);

                try {
                    return Produit::published()
                        ->inStock()
                        ->take(8)
                        ->get()
                        ->map(fn ($p) => $productController->formatProduct($p));
                } catch (\Throwable) {
                    return [];
                }
            },
        ];

    }

    /**
     * Récupère et structure les permissions de l'utilisateur
     *
     * @param  User|null  $user
     * @return array{flat: array, map: array}
     */
    private function getUserPermissionsData($user): array
    {
        if (! $user) {
            return ['flat' => [], 'map' => []];
        }

        // Cache pour éviter de recalculer à chaque requête
        $cacheKey = "user_permissions_{$user->id}_v3";

        return Cache::remember($cacheKey, now()->addMinutes(5), function () use ($user) {
            $allPermissions = $user->getAllPermissions()->pluck('name')->toArray();

            // Structure plate pour vérification rapide
            $flatPermissions = $allPermissions;

            // Structure hiérarchique par modèle
            $permissionsMap = [];
            foreach ($allPermissions as $permission) {
                // Format attendu: "Action:Model" (ex: "View:Post", "Create:Product")
                if (str_contains($permission, ':')) {
                    [$action, $model] = explode(':', $permission, 2);

                    if (! isset($permissionsMap[$model])) {
                        $permissionsMap[$model] = [];
                    }

                    $permissionsMap[$model][$action] = true;
                } else {
                    // Permissions sans modèle
                    if (! isset($permissionsMap['global'])) {
                        $permissionsMap['global'] = [];
                    }
                    $permissionsMap['global'][$permission] = true;
                }
            }

            return [
                'flat' => $flatPermissions,
                'map' => $permissionsMap,
            ];
        });
    }

    private function buildPermissionsMap($user): array
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

    private function shouldShareCommerceData(Request $request): bool
    {
        return $request->routeIs('nmarket.*', 'shop.*', 'blog.*', 'contact.*', 'search*');
    }

    private function getHeaderData(): array
    {
        try {
            $categories = [];

            if (Schema::hasTable('produit_categories ')) {
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
                        'url' => route('shop.categories.show', $category->slug),
                        'image' => $category->getFirstMediaUrl('icon') ?: $category->getFirstMediaUrl('image'),
                    ])
                    ->all();
            }

            $brands = [];

            if (Schema::hasTable('brands')) {
                $brands = Brand::query()
                    ->when(
                        method_exists(Brand::class, 'scopeActive'),
                        fn ($query) => $query->active(),
                    )
                    ->when(
                        method_exists(Brand::class, 'scopeFeatured'),
                        fn ($query) => $query->featured(),
                    )
                    ->take(10)
                    ->get(['id', 'name', 'slug'])
                    ->toArray();
            }

            return [
                'categories' => $categories,
                'brands' => $brands,
            ];
        } catch (\Throwable) {
            return [
                'categories' => [],
                'brands' => [],
            ];
        }
    }
}
