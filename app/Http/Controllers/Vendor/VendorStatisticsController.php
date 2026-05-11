<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use App\Models\Client;
use App\Models\Commande;
use App\Models\ProductCategory;
use App\Models\Produit;
use App\Services\VendorRegistrationService;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class VendorStatisticsController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $tenant = $user->tenants()->wherePivot('is_owner', true)->first();

        if (! $tenant) {
            return redirect()->route('vendor.register')
                ->with('error', 'Vous nʼavez pas encore de boutique.');
        }

        // Détermine si le plan autorise les statistiques avancées
        $planAllowsAdvanced = $tenant->plan && $tenant->plan->price > 0;

        // Exécute les requêtes dans le schéma du tenant
        $stats = $tenant->run(function () use ($planAllowsAdvanced) {

            // 1. Évolution des ventes (6 derniers mois)
            $salesOverTime = Commande::select(
                DB::raw("to_char(date_commande, 'YYYY-MM') as month"),
                DB::raw('SUM(total) as revenue'),
                DB::raw('COUNT(*) as orders')
            )
                ->where('statut', 'payee')
                ->where('date_commande', '>=', Carbon::now()->subMonths(6)->startOfMonth())
                ->groupBy('month')
                ->orderBy('month')
                ->get()
                ->toArray();

            // 2. Top produits (par chiffre d'affaires)
            $topProducts = Produit::withSum('ligneCommandes', 'prix_total')
                ->withCount('ligneCommandes as quantity')
                ->orderByDesc('ligne_commandes_sum_prix_total')
                ->take(5)
                ->get()
                ->map(fn ($p) => [
                    'id' => $p->id,
                    'nom' => $p->nom,
                    'total_sales' => $p->ligne_commandes_sum_prix_total ?? 0,
                    'quantity' => $p->quantity ?? 0,
                ])
                ->toArray();

            // 3. Clients
            $totalCustomers = Client::count();
            $newThisMonth = Client::where('created_at', '>=', Carbon::now()->startOfMonth())->count();
            $retentionRate = $totalCustomers > 0
                ? round((($totalCustomers - $newThisMonth) / $totalCustomers) * 100, 1)
                : 0;

            $customerMetrics = [
                'total_customers' => $totalCustomers,
                'new_this_month' => $newThisMonth,
                'retention_rate' => $retentionRate,
            ];

            // 4. Répartition par catégorie (uniquement si plan avancé)
            $categoryBreakdown = [];
            if ($planAllowsAdvanced) {
                $categoryBreakdown = ProductCategory::withCount('products')
                    ->whereHas('products.ligneCommandes')
                    ->get()
                    ->map(fn ($cat) => [
                        'name' => $cat->nom,
                        'percentage' => $cat->products->sum(function ($p) {
                            return $p->ligneCommandes->sum('prix_total');
                        }),
                    ])
                    ->toArray();
            }

            return compact('salesOverTime', 'topProducts', 'customerMetrics', 'categoryBreakdown');
        });

        return Inertia::render('Vendor/Statistics', [
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
                'admin_url' => app(VendorRegistrationService::class)->getVendeurUrl($tenant),
                'plan' => $tenant->plan ? [
                    'name' => $tenant->plan->name,
                    'price' => $tenant->plan->price,
                    'currency' => $tenant->plan->currency,
                ] : null,
            ],
            'salesOverTime' => $stats['salesOverTime'],
            'topProducts' => $stats['topProducts'],
            'categoryBreakdown' => $stats['categoryBreakdown'],
            'customerMetrics' => $stats['customerMetrics'],
            'planAllowsAdvancedStats' => $planAllowsAdvanced,
        ]);
    }
}
