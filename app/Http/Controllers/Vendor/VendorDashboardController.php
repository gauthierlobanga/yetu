<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
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
            return redirect()->route('vendor.register')->with('error', 'Vous n\'avez pas encore de boutique.');
        }

        $plan = $tenant->plan;

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
                'admin_url' => app(VendorRegistrationService::class)->getVendeurUrl($tenant),
                'plan' => $plan ? [
                    'name' => $plan->name,
                    'price' => $plan->price,
                    'currency' => $plan->currency,
                    'features' => $plan->features,
                    'limits' => $plan->limits,
                ] : null,
            ],
            'freeFeatures' => $this->getFreeFeatures(),
            'paidFeatures' => $this->getPaidFeatures(),
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
}
