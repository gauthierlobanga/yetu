<?php

namespace App\Http\Controllers\Vendor\Boutique\Ecommerce\Newsletter;

use App\Http\Controllers\Controller;
use App\Models\Newsletter;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

/**
 * Contrôleur de gestion de la newsletter côté boutique.
 *
 * Permet aux visiteurs de s'inscrire ou se désinscrire des communications
 * promotionnelles de la boutique.
 */
class NewsletterController extends Controller
{
    /**
     * Inscrit un visiteur à la newsletter.
     *
     * Valide l'adresse e-mail puis l'ajoute à la base de données.
     * Si l'e-mail existe déjà ou est invalide, la validation échouera.
     *
     * @param  Request  $request  La requête HTTP contenant le champ 'email'.
     * @return RedirectResponse
     */
    public function newsletterSubscribe(Request $request)
    {
        $request->validate(['email' => 'required|email|unique:newsletters,email']);
        Newsletter::create(['email' => $request->email, 'is_subscribed' => true]);

        return back()->with('success', 'Inscription réussie');
    }

    /**
     * Désinscrit un visiteur de la newsletter.
     *
     * Recherche l'e-mail dans la base et met à jour son statut 'is_subscribed' à false.
     *
     * @param  Request  $request  La requête HTTP contenant le champ 'email'.
     * @return RedirectResponse
     */
    public function newsletterUnsubscribe(Request $request)
    {
        $request->validate(['email' => 'required|email']);
        Newsletter::where('email', $request->email)->update(['is_subscribed' => false]);

        return back()->with('success', 'Désinscription réussie');
    }
}
