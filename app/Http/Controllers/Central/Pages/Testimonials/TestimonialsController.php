<?php

namespace App\Http\Controllers\Central\Pages\Testimonials;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Contrôleur gérant l'affichage étendu des témoignages clients.
 */
class TestimonialsController extends Controller
{
    /**
     * Affiche la page dédiée aux témoignages clients de la plateforme.
     *
     * @return Response Vue Inertia listant les témoignages.
     */
    public function testimonials()
    {
        return Inertia::render('app/testimonials/Testimonials');
    }
}
