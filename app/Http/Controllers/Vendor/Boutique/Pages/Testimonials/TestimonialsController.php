<?php

namespace App\Http\Controllers\Vendor\Boutique\Pages\Testimonials;

use App\Http\Controllers\Controller;
use Inertia\Response;

/**
 * Contrôleur des témoignages.
 */
class TestimonialsController extends Controller
{
    /**
     * Affiche la page dédiée aux témoignages et avis globaux laissés
     * par les clients sur le service de la boutique.
     *
     * @return Response
     */
    public function index()
    {
        return inertia('Vendor/pages/testimonials/Testimonials', []);
    }
}
