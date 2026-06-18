<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Tenant;
use App\Models\Visit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Response;

/**
 * Contrôleur responsable de la génération et de l'affichage des statistiques
 * de visites sur le panel d'administration central.
 */
class VisitorStatsController extends Controller
{
    /**
     * Affiche les statistiques globales de visites (centrales et par tenant).
     *
     * Regroupe les données de visites en fonction d'une période donnée (aujourd'hui,
     * cette semaine, ce mois, cette année) et calcule les totaux (visites totales,
     * visiteurs uniques). Affiche également le top 10 des boutiques (tenants) ayant
     * le plus de trafic.
     *
     * @param  Request  $request  Requête contenant le filtre de période ('period').
     * @return Response Vue Inertia affichant les statistiques.
     */
    public function index(Request $request)
    {
        $period = $request->input('period', 'week');
        $startDate = match ($period) {
            'today' => now()->startOfDay(),
            'week' => now()->startOfWeek(),
            'month' => now()->startOfMonth(),
            'year' => now()->startOfYear(),
            default => now()->subDays(30),
        };

        // Visites du domaine central (visitable_type = null)
        $centralQuery = Visit::whereNull('visitable_type')
            ->where('visited_at', '>=', $startDate);

        // Statistiques par tenant
        $tenantStats = Visit::whereNotNull('visitable_type')
            ->where('visited_at', '>=', $startDate)
            ->select('visitable_type', 'visitable_id', DB::raw('count(*) as visits'), DB::raw('count(distinct visitor_id) as uniques'))
            ->groupBy('visitable_type', 'visitable_id')
            ->get();

        $tenantIds = $tenantStats->pluck('visitable_id')->unique();
        $tenants = Tenant::whereIn('id', $tenantIds)->get()->keyBy('id');

        $topTenants = $tenantStats->map(function ($stat) use ($tenants) {
            $tenant = $tenants[$stat->visitable_id] ?? null;

            return (object) [
                'raison_sociale' => $tenant?->raison_sociale ?? $stat->visitable_id,
                'visits' => $stat->visits,
                'uniques' => $stat->uniques,
            ];
        })->sortByDesc('visits')->take(10)->values();

        // Évolution des 30 derniers jours (central)
        $dailyCentral = Visit::whereNull('visitable_type')
            ->where('visited_at', '>=', now()->subDays(30))
            ->select(DB::raw('DATE(visited_at) as date'), DB::raw('count(*) as visits'), DB::raw('count(distinct visitor_id) as uniques'))
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        $data = [
            'total_visits_central' => (clone $centralQuery)->count(),
            'unique_visitors_central' => (clone $centralQuery)->distinct('visitor_id')->count('visitor_id'),
            'total_visits_tenants' => $tenantStats->sum('visits'),
            'unique_visitors_tenants' => $tenantStats->sum('uniques'),
            'top_tenants' => $topTenants,
            'daily_central' => $dailyCentral,
        ];

        return inertia('Admin/Statistics/Visitors', $data);
    }
}
