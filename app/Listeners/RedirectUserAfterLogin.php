<?php

namespace App\Listeners;

use App\Services\VendorRegistrationService;
use Illuminate\Auth\Events\Login;

/**
 * Gère la redirection d'un utilisateur après une connexion réussie.
 *
 * Ce listener vérifie si l'utilisateur est propriétaire d'un locataire (boutique).
 * Si c'est le cas, il définit l'URL prévue vers le tableau de bord du vendeur.
 * Sinon, il redirige l'utilisateur vers la page de sélection de plan.
 */
class RedirectUserAfterLogin
{
    /**
     * Gère l'événement de connexion.
     *
     * @param  Login  $event  L'événement de connexion contenant l'utilisateur authentifié.
     */
    public function handle(Login $event): void
    {
        $user = $event->user;

        $tenant = $user->tenants()
            ->wherePivot('is_owner', true)
            ->first();

        if ($tenant) {

            $url = app(VendorRegistrationService::class)
                ->getVendeurDashboardUrl($tenant);

            session([
                'url.intended' => $url,
            ]);
        } else {

            session([
                'url.intended' => route('plan.index'),
            ]);
        }
    }
}
