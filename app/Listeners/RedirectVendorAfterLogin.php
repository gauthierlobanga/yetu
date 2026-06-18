<?php

namespace App\Listeners;

use Illuminate\Auth\Events\Login;

/**
 * Gère potentiellement la redirection d'un vendeur après sa connexion.
 *
 * Actuellement, la logique de redirection est gérée par des contrôleurs
 * spécifiques (CustomLoginResponse ou TenantSsoLoginController).
 * Ce listener sert d'espace réservé pour de futures actions post-connexion spécifiques aux vendeurs.
 */
class RedirectVendorAfterLogin
{
    /**
     * Gère l'événement de connexion.
     *
     * @param  Login  $event  L'événement de connexion.
     */
    public function handle(Login $event): void
    {
        // Redirection gérée par CustomLoginResponse ou TenantSsoLoginController
    }
}
