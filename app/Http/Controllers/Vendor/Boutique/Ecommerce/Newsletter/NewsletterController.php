<?php

namespace App\Http\Controllers\Vendor\Boutique\Ecommerce\Newsletter;

use App\Http\Controllers\Controller;
use App\Models\Newsletter;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

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

        $newsletter = new Newsletter;
        $newsletter->email = $request->email;
        $newsletter->is_active = true;
        $newsletter->confirmed_at = now();
        $newsletter->token_confirmation = Str::random(60);
        $newsletter->source = 'formulaire';
        $newsletter->ip_address = $request->ip();
        $newsletter->user_agent = $request->userAgent();
        $newsletter->save();

        return back()->with('success', 'Inscription réussie');
    }

    /**
     * Désinscrit un visiteur de la newsletter.
     *
     * Recherche l'e-mail dans la base et met à jour son statut 'is_active' à false.
     *
     * @param  Request  $request  La requête HTTP contenant le champ 'email'.
     * @return RedirectResponse
     */
    public function newsletterUnsubscribe(Request $request)
    {
        $request->validate(['email' => 'required|email']);
        Newsletter::where('email', $request->email)->update(['is_active' => false]);

        return back()->with('success', 'Désinscription réussie');
    }
}
