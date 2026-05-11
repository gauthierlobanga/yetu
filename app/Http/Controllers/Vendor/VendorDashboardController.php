<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use App\Models\Client;
use App\Models\Commande;
use App\Models\Panier;
use App\Models\Plan;
use App\Models\Produit;
use App\Services\VendorRegistrationService;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class VendorDashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $tenant = $user->tenants()->wherePivot('is_owner', true)->first();

        if (! $tenant) {
            return redirect()->route('vendor.register')
                ->with('error', 'Vous nʼavez pas encore de boutique.');
        }

        $plan = $tenant->plan;
        $adminUrl = app(VendorRegistrationService::class)->getVendeurUrl($tenant);

        // Statistiques (exécutées dans le schéma du tenant)
        $stats = $tenant->run(function () {
            $productsCount = Produit::count();
            $ordersCount = Commande::count();
            $revenue = Commande::where('statut', 'payee')->sum('total');
            $customersCount = Client::count();
            $abandonedCarts = Panier::where('statut', Panier::STATUT_ACTIF)->count();
            $inventoryCount = Produit::sum('quantite_stock');
            $growthPercent = 12.5; // à calculer plus tard

            return [
                'products_count' => $productsCount,
                'orders_count' => $ordersCount,
                'revenue' => $revenue,
                'customers_count' => $customersCount,
                'abandoned_carts' => $abandonedCarts,
                'inventory_count' => $inventoryCount,
                'growth_percent' => $growthPercent,
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
                        'image' => $p->getImageUrl('thumb') ?? '/placeholder.jpg',
                        'edit_url' => $adminUrl.'/produits/'.$p->id.'/edit',
                    ];
                });
        });

        // Fonctionnalités des plans (centrales)
        $allPlans = Plan::all()
            ->keyBy('name')
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

        return Inertia::render('Vendor/Dashboard', [
            'tenant' => [
                'id' => $tenant->id,
                'raison_sociale' => $tenant->raison_sociale,
                'slug' => $tenant->slug,
                'description' => $tenant->description,
                'email' => $tenant->email,
                'telephone' => $tenant->telephone,
                'statut' => $tenant->statut,
                'is_active' => $tenant->is_active,
                'domain' => $tenant->domains()->first()?->domain,
                'url' => app(VendorRegistrationService::class)->getShopUrl($tenant),
                'admin_url' => $adminUrl,
                'plan' => $plan ? [
                    'name' => $plan->name,
                    'price' => $plan->price,
                    'currency' => $plan->currency,
                    'features' => $currentPlanFeatures,
                ] : null,
            ],
            'stats' => $stats,
            'trial' => $trial,
            'recentProducts' => $recentProducts,
            'currentPlanFeatures' => $currentPlanFeatures,
            'allPlansFeatures' => $allPlans->pluck('features', 'name')->toArray(),
        ]);
    }
}
