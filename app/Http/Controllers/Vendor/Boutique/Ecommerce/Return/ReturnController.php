<?php

namespace App\Http\Controllers\Vendor\Boutique\Ecommerce\Return;

use App\Http\Controllers\Controller;
use App\Models\Commande;
use App\Models\Retour;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Contrôleur gérant les retours et réclamations côté client.
 *
 * Permet au client de lister ses retours, d'initier une nouvelle demande
 * de retour pour une commande, et d'en suivre le statut.
 */
class ReturnController extends Controller
{
    /**
     * Affiche l'historique des retours effectués par le client.
     *
     * Filtre les retours appartenant aux commandes du client courant
     * et les renvoie sous forme paginée.
     *
     * @return Response
     */
    public function returnsIndex()
    {
        $client = Auth::user()->client;
        $returns = Retour::whereHas('commande', fn ($q) => $q->where('client_id', $client->id))
            ->with('commande')->latest()->paginate(10);

        return Inertia::render('Vendor/boutique/Returns/Index', ['returns' => $returns]);
    }

    /**
     * Affiche le formulaire de création d'une demande de retour.
     *
     * Vérifie les droits du client sur la commande avant d'afficher
     * le formulaire permettant de sélectionner les lignes à retourner.
     *
     * @param  Commande  $commande  La commande concernée.
     * @return Response
     *
     * @throws AuthorizationException
     */
    public function returnsCreate(Commande $commande)
    {
        /** @var AuthorizesRequests $this */
        $this->authorize('return', $commande);
        $commande->load('lignes.produit');

        return Inertia::render('Vendor/boutique/Returns/Create', ['commande' => $commande]);
    }

    /**
     * Enregistre une nouvelle demande de retour.
     *
     * Valide les lignes sélectionnées, les quantités, l'état (défectueux, etc.)
     * et le motif. Crée ensuite l'entité Retour et ses lignes associées.
     *
     * @param  Request  $request  La requête contenant les détails du retour.
     * @return RedirectResponse
     *
     * @throws AuthorizationException
     */
    public function returnsStore(Request $request)
    {
        $validated = $request->validate([
            'commande_id' => 'required|exists:commandes,id',
            'motif' => 'required|string',
            'lignes' => 'required|array',
            'lignes.*.ligne_commande_id' => 'required|exists:ligne_commandes,id',
            'lignes.*.quantite' => 'required|integer|min:1',
            'lignes.*.etat' => 'required|in:conforme,defectueux,endommage,incomplet',
        ]);
        $commande = Commande::findOrFail($validated['commande_id']);

        /** @var AuthorizesRequests $this */
        $this->authorize('return', $commande);

        $retour = Retour::create([
            'commande_id' => $commande->id,
            'motif' => $validated['motif'],
            'statut' => Retour::STATUT_EN_ATTENTE,
            'date_demande' => now(),
        ]);
        foreach ($validated['lignes'] as $ligneData) {
            $ligne = $commande->lignes()->find($ligneData['ligne_commande_id']);
            $retour->lignes()->create([
                'ligne_commande_id' => $ligne->id,
                'quantite' => $ligneData['quantite'],
                'montant' => $ligne->prix_total * ($ligneData['quantite'] / $ligne->quantite),
                'etat' => $ligneData['etat'],
            ]);
        }

        return redirect()->route('tenant.return.show', $retour)->with('success', 'Demande de retour enregistrée');
    }

    /**
     * Affiche les détails d'une demande de retour existante.
     *
     * Permet au client de suivre le traitement de sa réclamation
     * (En attente, Approuvé, Rejeté).
     *
     * @param  Retour  $retour  La demande de retour à consulter.
     * @return Response
     *
     * @throws AuthorizationException
     */
    public function returnsShow(Retour $retour)
    {
        /** @var AuthorizesRequests $this */
        $this->authorize('view', $retour);
        $retour->load(['lignes.ligneCommande.produit', 'commande']);

        return Inertia::render('Vendor/boutique/Returns/Show', ['return' => $retour]);
    }
}
