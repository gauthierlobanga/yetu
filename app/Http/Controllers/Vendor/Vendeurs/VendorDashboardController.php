<?php

namespace App\Http\Controllers\Vendor\Vendeurs;

use App\Http\Controllers\Controller;
use App\Models\Client;
use App\Models\Commande;
use App\Models\Panier;
use App\Models\Plan;
use App\Models\ProductCategory; // ou Categorie selon votre modèle
use App\Models\Produit;
use App\Models\User;
use App\Services\TenantPropsService;
use App\Services\VendorRegistrationService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class VendorDashboardController extends Controller
{
    public function index(TenantPropsService $tenantProps)
    {
        $user = Auth::user();
        $tenant = $this->resolveOwnedTenant($user);

        if (! $tenant) {
            abort(403);
        }

        $plan = $tenant->plan;
        $adminUrl = app(VendorRegistrationService::class)->getVendeurUrl($tenant);

        // Statistiques (exécutées dans le schéma du tenant)
        $stats = $tenant->run(function () {
            // Produits
            $productsCount = Produit::count();
            $publishedCount = Produit::where('statut', Produit::STATUS_PUBLISHED)->count();
            $outOfStockCount = Produit::where('quantite_stock', '<=', 0)->count();
            $inventoryCount = Produit::sum('quantite_stock');

            // Catégories (ajustez le nom du modèle selon votre projet)
            $categoriesCount = ProductCategory::count();

            // Commandes
            $ordersCount = Commande::count();
            // Revenus basés sur les commandes valides (non annulées/rejetées)
            $revenue = Commande::whereNotIn('statut', [Commande::STATUT_ANNULEE, Commande::STATUT_REJETEE])
                ->sum('total');
            $averageOrderValue = $ordersCount > 0 ? $revenue / $ordersCount : 0;

            // Clients
            $customersCount = Client::count();
            $newCustomersThisMonth = Client::whereDate('created_at', '>=', now()->startOfMonth())->count();

            // Paniers abandonnés (corrigé : on compte les paniers avec statut "abandonne")
            $abandonedCarts = Panier::where('statut', Panier::STATUT_ABANDONNE)
                ->whereNull('deleted_at') // sécurité si SoftDeletes n'est pas implémenté
                ->count();

            // Croissance mensuelle (calculée)
            $previousMonthRevenue = Commande::whereNotIn('statut', [Commande::STATUT_ANNULEE, Commande::STATUT_REJETEE])
                ->whereMonth('date_commande', now()->subMonth()->month)
                ->whereYear('date_commande', now()->subMonth()->year)
                ->sum('total');
            $growthPercent = $previousMonthRevenue > 0
                ? round((($revenue - $previousMonthRevenue) / $previousMonthRevenue) * 100, 1)
                : 0;

            // Métriques additionnelles
            $additional = [
                'published_products' => $publishedCount,
                'out_of_stock_products' => $outOfStockCount,
                'average_order_value' => round($averageOrderValue, 2),
                'new_customers_this_month' => $newCustomersThisMonth,
            ];

            return [
                'products_count' => $productsCount,
                'orders_count' => $ordersCount,
                'revenue' => $revenue,
                'customers_count' => $customersCount,
                'abandoned_carts' => $abandonedCarts,
                'inventory_count' => $inventoryCount,
                'categories_count' => $categoriesCount,
                'growth_percent' => $growthPercent,
                'additional' => $additional,
            ];
        });

        // Période d’essai
        $trial = null;
        if ($tenant->date_activation && $tenant->date_expiration) {
            $remainingDays = (int) now()->diffInDays($tenant->date_expiration, false);
            $trial = [
                'start' => $tenant->date_activation->toDateString(),
                'end' => $tenant->date_expiration->toDateString(),
                'remaining_days' => max(0, $remainingDays),
            ];
        }

        // Produits récents (dans le tenant)
        $recentProducts = $tenant->run(function () use ($adminUrl) {
            return Produit::latest()
                ->take(5)
                ->get()
                ->map(function ($p) use ($adminUrl) {
                    return [
                        'id' => $p->id,
                        'nom' => $p->nom,
                        'slug' => $p->slug,
                        'prix' => $p->prix_actuel,
                        'stock' => $p->quantite_stock,
                        'statut' => $p->statut,
                        'image' => $p->getImageUrl('thumb') ?? '/storage/images/loafers-leaning-along-white-wall.jpg',
                        'edit_url' => $adminUrl.'/produits/'.$p->id.'/edit',
                    ];
                });
        });

        // Fonctionnalités des plans (centrales)
        $allPlans = Plan::where('is_active', true)
            ->get()
            ->map(function ($plan) {
                $features = is_array($plan->features) ? $plan->features : json_decode($plan->features, true) ?? [];

                return [
                    'name' => $plan->name,
                    'price' => $plan->price,
                    'currency' => $plan->currency,
                    'features' => $features,
                ];
            });

        $currentPlanFeatures = [];
        if ($plan) {
            $featuresRaw = $plan->features;
            $currentPlanFeatures = is_array($featuresRaw) ? $featuresRaw : json_decode($featuresRaw, true) ?? [];
        }

        $subscription = $tenant->subscription;

        return Inertia::render('Vendor/Dashboard', [
            'tenant' => $tenantProps->getTenantProps($tenant),
            'theme' => $tenant->theme(),
            'stats' => $stats,
            'trial' => $trial,
            'subscription' => $subscription ? [
                'status' => $subscription->stripe_status,
                'is_active' => $subscription->isActive(),
                'is_paid' => ! $subscription->plan->isFree(),
                'trial_ends_at' => $subscription->trial_ends_at?->toIso8601String(),
            ] : null,
            'recentProducts' => $recentProducts,
            'currentPlanFeatures' => $currentPlanFeatures,
            'allPlansFeatures' => $allPlans->pluck('features', 'name')->toArray(),
        ]);
    }

    private function getFreeFeatures(): array
    {
        return [
            'Gestion des produits (illimités selon plan)',
            'Gestion des commandes',
            'Statistiques de base',
            'Personnalisation du thème (basique)',
            'Sous-domaine gratuit',
            'Paiement à la livraison',
        ];
    }

    private function getPaidFeatures(): array
    {
        return [
            'Nom de domaine personnalisé',
            'Thèmes premium',
            'Paiement en ligne (Stripe, PayPal)',
            'Statistiques avancées',
            'API REST',
            'Marketplace multi-vendeurs',
            'Programme de fidélité',
            'Support prioritaire',
        ];
    }

    private function resolveOwnedTenant(?User $user)
    {
        $tenant = function_exists('tenant') ? tenant() : null;

        if (! $tenant || ! $user) {
            return null;
        }

        $ownsTenant = DB::connection(config('tenancy.database.central_connection', config('database.default')))
            ->table('user_tenant')
            ->where('tenant_id', $tenant->id)
            ->where('user_id', $user->id)
            ->where('is_owner', true)
            ->exists();

        return $ownsTenant ? $tenant : null;
    }
}
