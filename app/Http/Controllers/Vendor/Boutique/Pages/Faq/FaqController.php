<?php

namespace App\Http\Controllers\Vendor\Boutique\Pages\Faq;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Contrôleur de la Foire Aux Questions (FAQ).
 */
class FaqController extends Controller
{
    /**
     * Affiche la Foire Aux Questions (FAQ), avec les questions courantes
     * et leurs réponses détaillées organisées par catégories.
     *
     * @return Response
     */
    public function faq()
    {
        return Inertia::render('Vendor/pages/faq/Faq');
    }
}
