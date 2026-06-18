<?php

namespace App\Http\Controllers\Central\Pages\Home;

use App\Http\Controllers\Controller;
use App\Models\Plan;
use App\Models\Produit;
use App\Models\Tenant;
use Inertia\Inertia;
use Inertia\Response;
use Nnjeim\World\Models\Country;

/**
 * Contrôleur gérant la page d'accueil (Hero Central) de la plateforme.
 *
 * Il compile les données nécessaires à la présentation de la landing page,
 * notamment les plans d'abonnement, les statistiques globales et les témoignages.
 */
class HeroCentralController extends Controller
{
    /**
     * Affiche la page d'accueil principale du site vitrine.
     *
     * Rassemble les données dynamiques :
     * - Les plans actifs et triés, formatés pour l'affichage frontend.
     * - Les statistiques globales (boutiques créées, produits, pays).
     * - Une liste de témoignages clients.
     *
     * @return Response Vue Inertia contenant les données d'accueil.
     */
    public function Index()
    {
        $plans = Plan::active()->ordered()->get()->map(fn ($plan) => [
            'id' => $plan->id,
            'name' => $plan->name,
            'description' => $plan->description,
            'highlight' => $plan->highlight,
            'price' => $plan->price,
            'currency' => $plan->currency,
            'interval' => $plan->interval,
            'trial_days' => $plan->trial_days,
            'is_featured' => $plan->is_featured,
            'is_recommended' => $plan->is_recommended,
            'features' => $plan->features,
            'badge' => $plan->badge,
            'badge_color' => $plan->badge_color,
            'button_text' => $plan->button_text,
        ]);

        $stats = [
            'stores_created' => Tenant::count('id'),
            'products_listed' => Produit::published()->count('id'),
            'countries_served' => Country::count('id'),
        ];

        $testimonials = [
            [
                'name' => 'Marie K.',
                'store' => 'Les Pépites de Marie',
                'quote' => 'Grâce à Yetu, j\'ai pu lancer ma boutique en un week-end. Les outils sont incroyablement simples.',
                'avatar' => 'https://randomuser.me/api/portraits/women/1.jpg',
            ],
            [
                'name' => 'Jean-Paul M.',
                'store' => 'Artisanat du Kivu',
                'quote' => 'J\'ai triplé mes ventes depuis que je suis passé sur Yetu. Le support est réactif et efficace.',
                'avatar' => 'https://randomuser.me/api/portraits/men/1.jpg',
            ],
        ];

        return Inertia::render('app/home/Home', [
            'plans' => $plans,
            'stats' => $stats,
            'testimonials' => $testimonials,
        ]);
    }
}
