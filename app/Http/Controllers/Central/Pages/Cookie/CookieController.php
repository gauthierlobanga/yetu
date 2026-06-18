<?php

namespace App\Http\Controllers\Central\Pages\Cookie;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Contrôleur responsable de la page de politique des cookies.
 */
class CookieController extends Controller
{
    /**
     * Affiche la page d'information sur les cookies.
     *
     * @return Response Vue Inertia de la politique des cookies.
     */
    public function cookie()
    {
        return Inertia::render('app/cookies/Cookies');
    }
}
