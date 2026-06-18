<?php

namespace App\Http\Controllers\Central\Pages\Contact;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreContactRequest;
use App\Models\Contact;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Contrôleur gérant la page de contact et la soumission des formulaires de contact
 * sur la partie publique (panel central) de l'application.
 */
class ContactCentralController extends Controller
{
    /**
     * Affiche la page principale de contact.
     *
     * @return Response Vue Inertia du formulaire de contact avec les métadonnées.
     */
    public function contactIndex(): Response
    {
        return Inertia::render('app/contact-us/Contact', $this->getPageProps());
    }

    /**
     * Affiche la page de création/soumission d'un contact (alias de contactIndex).
     *
     * @return Response Vue Inertia du formulaire de contact.
     */
    public function contactCreate(): Response
    {
        return Inertia::render('app/contact-us/Contact', $this->getPageProps());
    }

    /**
     * Enregistre le message de contact envoyé par l'utilisateur.
     *
     * Valide les données entrantes, détermine la priorité en fonction de la catégorie,
     * enregistre l'adresse IP et le User-Agent pour la sécurité/l'anti-spam, puis
     * redirige avec un message de succès.
     *
     * @param  StoreContactRequest  $request  Requête validée contenant les infos de contact.
     * @return RedirectResponse Redirection vers la page de contact avec un message flash.
     */
    public function contactStore(StoreContactRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        Contact::create([
            'nom' => $validated['nom'],
            'prenom' => $validated['prenom'] ?? null,
            'email' => $validated['email'],
            'telephone' => $validated['telephone'] ?? null,
            'categorie' => $validated['categorie'],
            'sujet' => $validated['sujet'],
            'message' => $validated['message'],
            'status' => Contact::STATUS_EN_ATTENTE,
            'priorite' => Contact::inferPriority($validated['categorie'], $validated['message']),
            'ip_address' => $request->ip(),
            'user_agent' => Str::limit((string) $request->userAgent(), 255, ''),
            'metadata' => array_filter([
                'source' => 'contact_page',
                'url' => $request->fullUrl(),
                'locale' => app()->getLocale(),
            ]),
        ]);

        return to_route('contact')->with('success', 'Votre message a bien ete envoye. Notre equipe vous recontactera tres vite.');
    }

    /**
     * Prépare les propriétés et métadonnées partagées avec la vue de contact.
     *
     * Fournit les catégories de sujets de contact possibles ainsi que les informations
     * générales de contact de l'entreprise (e-mail, temps de réponse, etc.).
     *
     * @return array Tableau associatif des propriétés de la page.
     */
    private function getPageProps(): array
    {
        return [
            'categories' => Contact::getCategories(),
            'contactMeta' => [
                'appName' => config('app.name'),
                'email' => config('mail.from.address', 'contact@plateform-ecommerces.test'),
                'phone' => null,
                'responseTime' => '< 24h ouvrees',
                'availability' => 'Traitement prioritaire du lundi au samedi',
                'supportHours' => 'Support commercial et technique pendant les heures ouvrables',
                'location' => 'Accompagnement a distance et sur rendez-vous',
            ],
        ];
    }
}
