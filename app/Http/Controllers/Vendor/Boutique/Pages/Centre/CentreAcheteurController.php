<?php

namespace App\Http\Controllers\Vendor\Boutique\Pages\Centre;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Contrôleur du Centre Acheteur.
 *
 * Point d'entrée pour les informations d'accompagnement des acheteurs.
 */
class CentreAcheteurController extends Controller
{
    /**
     * Affiche la page d'accueil du "Centre Acheteur", fournissant des
     * ressources et conseils pour les clients de la plateforme.
     *
     * @return Response
     */
    public function index()
    {
        return Inertia::render('Shop/Acheteur/Index', []);
    }
}
