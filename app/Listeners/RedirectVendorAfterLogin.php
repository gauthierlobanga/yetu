<?php

namespace App\Listeners;

use Illuminate\Auth\Events\Login;
use Illuminate\Support\Facades\Session;

class RedirectVendorAfterLogin
{
    public function handle(Login $event): void
    {
        $user = $event->user;

        // Ignorer les connexions dans le contexte tenant (acheteurs)
        if (function_exists('tenancy') && tenancy()->initialized) {
            return;
        }

        // Vérifier si l'utilisateur a un tenant (est vendeur)
        $tenant = $user->tenants()->wherePivot('is_owner', true)->first();

        if ($tenant) {
            Session::put('url.intended', route('central.account-selection.index'));
        } else {
            // Pas de boutique → rediriger vers le choix du plan
            Session::put('url.intended', route('plan.index'));
        }
    }
}
