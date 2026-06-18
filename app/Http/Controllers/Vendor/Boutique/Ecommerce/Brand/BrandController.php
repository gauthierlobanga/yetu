<?php

namespace App\Http\Controllers\Vendor\Boutique\Ecommerce\Brand;

use App\Http\Controllers\Controller;
use App\Models\Brand;

/**
 * Contrôleur gérant l'affichage des marques (Brands) sur la boutique.
 */
class BrandController extends Controller
{
    /**
     * Affiche la liste de toutes les marques disponibles.
     *
     * @return mixed
     */
    public function brandsIndex()
    {
        //
    }

    /**
     * Affiche les détails d'une marque spécifique.
     *
     * @return mixed
     */
    public function brandsShow(Brand $brand)
    {
        //
    }
}
