<?php

namespace App\Http\Controllers\Vendor\Boutique\Pages\Privacy;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Contrôleur de confidentialité.
 */
class PrivacyController extends Controller
{
    /**
     * Affiche la page relative à la Politique de Confidentialité et
     * au traitement des données personnelles (RGPD, etc.).
     *
     * @return Response
     */
    public function privacy()
    {
        return Inertia::render('Vendor/pages/privacy/Privacy');
    }
}
