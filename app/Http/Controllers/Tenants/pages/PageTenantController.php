<?php

namespace App\Http\Controllers\Tenants\pages;

use App\Http\Controllers\Controller;
use App\Models\Adresse;
use App\Models\Commande;
use App\Models\Paiement;
use App\Models\Produit;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class PageTenantController extends Controller
{
    public function contact()
    {
        return Inertia::render('tenants/main/contact/Contact');
    }

    public function help()
    {
        return Inertia::render('tenants/main/help/Help');
    }

    public function about()
    {
        $platformStats = Cache::remember('home_platform_stats', 3600, function () {
            return [
                'pageLoadTime' => '< 1.2s', // Valeur statique ou issue d'un outil de monitoring
                'uptime' => '99.99%',        // Idem
                'supportResponseTime' => '< 2h', // À configurer manuellement ou via un paramètre
                'productsCount' => Produit::published()->count(),
                'ordersProcessed' => Commande::whereIn('statut', [Commande::STATUT_TERMINE, Commande::STATUT_EN_COURS])->count(),
                'paymentMethods' => Paiement::distinct('mode')->count('mode'),
                'countriesServed' => Adresse::distinct('pays')->count('pays'), // Nombre de pays uniques où des commandes ont été livrées
            ];
        });

        return Inertia::render('tenants/main/about/About', [
            'platformStats' => $platformStats,
        ]);
    }

    public function terms()
    {
        return Inertia::render('tenants/main/terms/Terms');
    }

    public function privacy()
    {
        return Inertia::render('tenants/main/privacy/Privacy');
    }

    public function cookies()
    {
        return Inertia::render('tenants/main/cookies/Cookies');
    }

    public function support()
    {
        return Inertia::render('tenants/main/support/Support');
    }

    public function faq()
    {
        return Inertia::render('tenants/main/faq/Faq');
    }

    public function testimonials()
    {
        return Inertia::render('tenants/main/testimonials/Testimonials');
    }
}
