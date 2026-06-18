<?php

namespace App\Http\Controllers\Central\Pages\Term;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Contrôleur responsable des conditions générales d'utilisation (CGU/CGV).
 */
class TermController extends Controller
{
    /**
     * Affiche la page des conditions générales.
     *
     * @return Response Vue Inertia pour les termes et conditions.
     */
    public function terms()
    {
        return Inertia::render('app/terms/Terms');
    }
}
