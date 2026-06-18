<?php

namespace App\Http\Controllers\Vendor\Boutique\Pages\Cookie;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Contrôleur d'informations sur les Cookies.
 */
class CookieController extends Controller
{
    /**
     * Affiche la politique d'utilisation des cookies et la gestion
     * des consentements de l'utilisateur.
     *
     * @return Response
     */
    public function cookie()
    {
        return Inertia::render('Vendor/pages/cookies/Cookies');
    }
}
