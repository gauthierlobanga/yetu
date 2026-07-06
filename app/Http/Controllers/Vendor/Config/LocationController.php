<?php

namespace App\Http\Controllers\Vendor\Config;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Nnjeim\World\Models\City;
use Nnjeim\World\Models\Country;

/**
 * Contrôleur responsable de la gestion des emplacements (pays et villes).
 *
 * Fournit des API pour récupérer la liste des pays et des villes
 * afin de configurer les localisations pour un vendeur.
 */
class LocationController extends Controller
{
    /**
     * Récupère la liste de tous les pays.
     *
     * Renvoie les informations basiques des pays triés par ordre alphabétique,
     * incluant l'identifiant, le code ISO2, le nom et l'emoji du drapeau.
     *
     * @return JsonResponse Réponse JSON contenant la collection de pays.
     */
    public function countries(): JsonResponse
    {
        $countries = Country::select('id', 'iso2', 'name', 'emoji', 'phone_code')
            ->orderBy('name')
            ->get();

        return response()->json($countries);
    }

    /**
     * Récupère la liste des villes pour un pays spécifique.
     *
     * Renvoie les villes associées à l'identifiant du pays fourni,
     * triées par ordre alphabétique.
     *
     * @param  Country  $country  L'instance du pays pour lequel récupérer les villes.
     * @return JsonResponse Réponse JSON contenant la collection de villes.
     */
    public function cities(Country $country): JsonResponse
    {
        $cities = City::where('country_id', $country->id)
            ->orderBy('name')
            ->get(['id', 'name']);

        return response()->json($cities);
    }
}
