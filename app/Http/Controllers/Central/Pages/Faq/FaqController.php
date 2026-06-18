<?php

namespace App\Http\Controllers\Central\Pages\Faq;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Contrôleur responsable de la Foire Aux Questions (FAQ).
 */
class FaqController extends Controller
{
    /**
     * Affiche la page de la FAQ publique du panel central.
     *
     * @return Response Vue Inertia contenant les questions fréquemment posées.
     */
    public function faq()
    {
        return Inertia::render('app/faq/Faq');
    }
}
