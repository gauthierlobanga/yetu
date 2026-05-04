<?php

namespace App\Fortify\Responses;

use Laravel\Fortify\Contracts\LoginResponse;

class CustomLoginResponse implements LoginResponse
{
    public function toResponse($request)
    {
        // Rediriger en fonction du domaine
        if (in_array($request->getHost(), config('tenancy.central_domains'))) {
            return redirect()->intended(route('vendor.dashboard'));
        }

        // Par défaut, sur un tenant, aller à l’accueil de la boutique
        return redirect()->intended('/');
    }
}
