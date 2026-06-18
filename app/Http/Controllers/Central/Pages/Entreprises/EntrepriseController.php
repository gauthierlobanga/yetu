<?php

namespace App\Http\Controllers\Central\Pages\Entreprises;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Contrôleur gérant la présentation de l'entreprise.
 */
class EntrepriseController extends Controller
{
    /**
     * Affiche la page présentant les services ou l'historique de l'entreprise.
     *
     * @return Response Vue Inertia de la page entreprise.
     */
    public function entrepriseIndex()
    {
        return Inertia::render('app/entreprise/Index');
    }
}
