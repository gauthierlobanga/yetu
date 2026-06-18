<?php

namespace App\Http\Controllers\Vendor\Boutique\Pages\Term;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Contrôleur des termes et conditions.
 */
class TermController extends Controller
{
    /**
     * Affiche les Conditions Générales de Vente (CGV) et d'Utilisation
     * de la plateforme de la boutique.
     *
     * @return Response
     */
    public function terms()
    {
        return Inertia::render('Vendor/pages/terms/Terms');
    }
}
