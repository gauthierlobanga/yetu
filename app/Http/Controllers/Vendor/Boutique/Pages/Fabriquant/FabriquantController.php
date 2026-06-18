<?php

namespace App\Http\Controllers\Vendor\Boutique\Pages\Fabriquant;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Contrôleur des fabricants et marques.
 */
class FabriquantController extends Controller
{
    /**
     * Affiche la page listant tous les fabricants ou marques partenaires
     * de la boutique, avec la possibilité d'explorer leurs produits.
     *
     * @return Response
     */
    public function index()
    {
        return Inertia::render('Shop/Fabriquant/Index', []);
    }
}
