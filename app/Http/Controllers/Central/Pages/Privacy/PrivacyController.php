<?php

namespace App\Http\Controllers\Central\Pages\Privacy;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Contrôleur responsable de la politique de confidentialité.
 */
class PrivacyController extends Controller
{
    /**
     * Affiche la page de la politique de confidentialité (Privacy Policy).
     *
     * @return Response Vue Inertia pour la confidentialité.
     */
    public function privacy()
    {
        return Inertia::render('app/privacy/Privacy');
    }
}
