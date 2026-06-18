<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PageView;
use App\Models\Visitor;
use App\Models\VisitorEvent;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Response;

/**
 * Contrôleur gérant le tableau de bord d'analyse (Analytics) des visiteurs.
 *
 * Ce contrôleur fournit les vues et les données relatives au suivi des visiteurs,
 * des pages vues et des événements déclenchés par les utilisateurs sur la plateforme.
 */
class VisitorAnalyticsController extends Controller
{
    /**
     * Affiche le tableau de bord principal des statistiques (Analytics).
     *
     * Cette méthode rassemble plusieurs métriques clés : visiteurs actifs, total
     * des visiteurs, nombre total de pages vues, visiteurs du jour, ainsi que
     * le classement des pages les plus visitées et l'évolution des visites sur 30 jours.
     *
     * @return Response Vue Inertia du dashboard d'analytics.
     */
    public function dashboard()
    {
        $activeVisitors = Visitor::active()->count();
        $totalVisitors = Visitor::count();
        $totalPageViews = PageView::count();
        $todayVisitors = Visitor::whereDate('first_visit_at', today())->count();

        // Top pages
        $topPages = PageView::select('url', DB::raw('count(*) as views'))
            ->groupBy('url')
            ->orderByDesc('views')
            ->limit(10)
            ->get();

        // Visites par jour (dernier 30 jours)
        $visitsByDay = Visitor::select(DB::raw('DATE(first_visit_at) as date'), DB::raw('count(*) as count'))
            ->where('first_visit_at', '>=', now()->subDays(30))
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        return inertia('Admin/analytics/Dashboard', [
            'activeVisitors' => $activeVisitors,
            'totalVisitors' => $totalVisitors,
            'totalPageViews' => $totalPageViews,
            'todayVisitors' => $todayVisitors,
            'topPages' => $topPages,
            'visitsByDay' => $visitsByDay,
        ]);
    }

    /**
     * Affiche la liste paginée de tous les visiteurs.
     *
     * Récupère les visiteurs triés par date de dernière visite et inclut la relation
     * de la dernière page visitée pour chaque visiteur.
     *
     * @param  Request  $request  Requête courante (utilisée implicitement pour la pagination).
     * @return Response Vue Inertia listant les visiteurs.
     */
    public function visitorsList(Request $request)
    {
        $visitors = Visitor::with('lastPageView')
            ->orderBy('last_visit_at', 'desc')
            ->paginate(20);

        return inertia('Admin/analytics/Visitors', ['visitors' => $visitors]);
    }

    /**
     * Affiche le profil détaillé d'un visiteur spécifique.
     *
     * Charge les relations des pages vues (triées de la plus récente à la plus ancienne)
     * et l'historique des événements liés à ce visiteur.
     *
     * @param  int  $id  L'identifiant unique du visiteur.
     * @return Response Vue Inertia détaillant le parcours du visiteur.
     */
    public function visitorDetail($id)
    {
        $visitor = Visitor::with(['pageViews' => function ($q) {
            $q->orderBy('viewed_at', 'desc');
        }, 'events'])->findOrFail($id);

        return inertia('Admin/analytics/VisitorDetail', ['visitor' => $visitor]);
    }

    /**
     * Récupère la liste des événements récents des visiteurs.
     *
     * Cette méthode est typiquement utilisée par une API ou un composant asynchrone
     * pour afficher un flux (feed) d'activités récentes (jusqu'à 50 événements).
     *
     * @return JsonResponse Liste JSON des 50 derniers événements.
     */
    public function recentEvents()
    {
        $events = VisitorEvent::with('visitor')
            ->orderBy('occurred_at', 'desc')
            ->limit(50)
            ->get();

        return response()->json($events);
    }
}
