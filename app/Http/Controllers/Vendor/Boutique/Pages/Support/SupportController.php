<?php

namespace App\Http\Controllers\Vendor\Boutique\Pages\Support;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Contrôleur de la page de support technique.
 */
class SupportController extends Controller
{
    /**
     * Affiche la page dédiée au support client (assistance technique
     * et commerciale spécifique).
     *
     * @return Response
     */
    public function support()
    {
        return Inertia::render('Vendor/pages/support/Support');
    }
}
