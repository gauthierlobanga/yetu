<?php

namespace App\Http\Controllers\Vendor\Boutique\Pages\Help;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Contrôleur du Centre d'Aide.
 */
class HelpController extends Controller
{
    /**
     * Affiche le centre d'aide pour guider le client dans l'utilisation
     * de la plateforme et ses achats.
     *
     * @return Response
     */
    public function help()
    {
        return Inertia::render('Vendor/pages/help/Help');
    }
}
