<?php

namespace App\Http\Controllers\Vendor\Boutique\Pages\Contact;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreContactRequest;
use App\Models\Contact;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Contrôleur pour la page et le formulaire de contact.
 *
 * Gère les demandes de support envoyées via le formulaire public.
 */
class ContactBoutiqueController extends Controller
{
    /**
     * Affiche le formulaire et les informations de contact de la boutique.
     */
    public function contactIndex(): Response
    {
        return Inertia::render('Vendor/pages/contact-us/Contact', $this->getPageProps());
    }

    /**
     * Alias pour afficher le formulaire de contact.
     */
    public function contactCreate(): Response
    {
        return Inertia::render('Vendor/pages/contact-us/Contact', $this->getPageProps());
    }

    /**
     * Traite et sauvegarde la soumission du formulaire de contact.
     *
     * Infère la priorité de la demande et enregistre les métadonnées de la requête.
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

        return to_route('tenant.page.contact')->with('success', 'Votre message a bien ete envoye. Notre equipe vous recontactera tres vite.');
    }

    /**
     * Fournit les métadonnées et catégories nécessaires pour le rendu
     * de la page de contact (titre, horaires, etc.).
     *
     * @return array<string, mixed>
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
