<?php

namespace App\Http\Controllers\Central\Pages\Support;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Contrôleur gérant la page de support technique et d'assistance.
 */
class SupportController extends Controller
{
    /**
     * Affiche la page de support globale.
     *
     * @return Response Vue Inertia pour le support.
     */
    public function support()
    {
        return Inertia::render('app/support/Support');
    }
}
