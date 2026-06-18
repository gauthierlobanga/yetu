<?php

namespace App\Http\Controllers\Vendor\Boutique\Pages\Seller;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Contrôleur des pages fournisseurs.
 */
class FournisseurController extends Controller
{
    /**
     * Affiche les informations sur les fournisseurs ou la politique
     * d'approvisionnement pour la transparence ou le B2B.
     *
     * @return Response
     */
    public function index()
    {
        return Inertia::render('Shop/Seller/Index', []);
    }
}
