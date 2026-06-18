<?php

namespace App\Http\Controllers\Vendor\Boutique\Pages\About;

use App\Http\Controllers\Controller;
use App\Models\Country;
use App\Models\Paiement;
use App\Models\Produit;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Contrôleur de la page 'À propos'.
 *
 * Gère l'affichage des informations générales de la boutique.
 */
class AboutController extends Controller
{
    /**
     * Affiche la page 'À propos de nous', présentant l'histoire, la mission
     * et les valeurs de la boutique au client.
     *
     * @return Response
     */
    public function about()
    {
        $platformStats = Cache::remember('home_platform_stats', 3600, function () {
            return [
                'pageLoadTime' => '< 1.2s', // Valeur statique ou issue d'un outil de monitoring
                'uptime' => '99.99%',        // Idem
                'supportResponseTime' => '< 2h', // À configurer manuellement ou via un paramètre
                'productsCount' => Produit::published()->count('id'),
                // 'ordersProcessed' => Commande::whereIn('statut', [Commande::STATUT_TERMINE, Commande::STATUT_EN_COURS])->count(),
                'paymentMethods' => Paiement::distinct('mode')->count('mode'),
                'countriesServed' => Country::distinct('name')->count('region'), // Nombre de pays uniques où des commandes ont été livrées
                // 'countriesServed' => Adresse::distinct('pays')->count('pays'), // Nombre de pays uniques où des commandes ont été livrées
            ];
        });

        return Inertia::render('Vendor/pages/about/About', [
            'platformStats' => $platformStats,
        ]);
    }
}
