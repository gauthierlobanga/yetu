<?php

namespace App\Http\Controllers\Central\Pages\Help;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Contrôleur responsable du centre d'aide (Help Center).
 */
class HelpController extends Controller
{
    /**
     * Affiche la page d'aide globale de la plateforme.
     *
     * @return Response Vue Inertia du centre d'aide.
     */
    public function help()
    {
        return Inertia::render('app/help/Help');
    }
}
