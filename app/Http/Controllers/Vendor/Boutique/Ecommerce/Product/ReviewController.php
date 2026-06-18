<?php

namespace App\Http\Controllers\Vendor\Boutique\Ecommerce\Product;

use App\Http\Controllers\Controller;
use App\Models\AvisClient;
use App\Models\Produit;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Contrôleur de gestion des avis clients sur les produits.
 *
 * Permet aux utilisateurs d'afficher, créer, modifier et supprimer
 * leurs propres avis sur un produit de la boutique.
 */
class ReviewController extends Controller
{
    /**
     * Affiche la liste des avis approuvés pour un produit spécifique.
     *
     * Gère la pagination des avis et transmet les données formattées du produit
     * à la vue frontend Inertia.
     *
     * @param  Produit  $produit  Le produit concerné.
     * @return Response
     */
    public function productsReviewsIndex(Produit $produit)
    {
        // Optimisation : chargement des relations media et brand pour éviter le Lazy Loading
        $produit->loadMissing(['media', 'brand']);
        $reviews = $produit->approvedAvis()->with('client')->latest()->paginate(10);

        return Inertia::render('Shop/Products/Reviews', [
            'product' => app(ProductController::class)->formatProduct($produit),
            'reviews' => $reviews,
        ]);
    }

    /**
     * Soumet un nouvel avis client pour un produit donné.
     *
     * Valide la note (1 à 5) et le commentaire, crée l'enregistrement,
     * et le place en attente d'approbation (modération par le tenant).
     *
     * @param  Request  $request  La requête avec note et commentaire.
     * @param  Produit  $produit  Le produit évalué.
     * @return RedirectResponse
     */
    public function productsReviewsStore(Request $request, Produit $produit)
    {
        $validated = $request->validate([
            'note' => 'required|integer|min:1|max:5',
            'commentaire' => 'required|string|min:10',
        ]);

        $client = Auth::user()->client;
        $avis = $client->avis()->create([
            'produit_id' => $produit->id,
            'note' => $validated['note'],
            'commentaire' => $validated['commentaire'],
            'approuve' => false, // Modération
        ]);

        return back()->with('success', 'Votre avis a été soumis et sera publié après modération');
    }

    /**
     * Met à jour un avis client existant.
     *
     * Réinitialise le statut d'approbation (approuve = false) pour
     * nécessiter une nouvelle modération après modification.
     *
     * @param  Request  $request  Les nouvelles données d'avis.
     * @param  AvisClient  $avis  L'instance de l'avis à modifier.
     * @return RedirectResponse
     *
     * @throws AuthorizationException
     */
    public function productsReviewsUpdate(Request $request, AvisClient $avis)
    {
        /** @var AuthorizesRequests $this */
        $this->authorize('update', $avis);
        $validated = $request->validate([
            'note' => 'required|integer|min:1|max:5',
            'commentaire' => 'required|string|min:10',
        ]);

        $avis->update($validated);
        $avis->approuve = false;
        $avis->save();

        return back()->with('success', 'Avis mis à jour');
    }

    /**
     * Supprime un avis client existant.
     *
     * L'autorisation garantit que seul l'auteur de l'avis (ou un rôle autorisé)
     * peut le supprimer.
     *
     * @param  AvisClient  $avis  L'instance de l'avis à détruire.
     * @return RedirectResponse
     *
     * @throws AuthorizationException
     */
    public function productsReviewsDestroy(AvisClient $avis)
    {
        /** @var AuthorizesRequests $this */
        $this->authorize('delete', $avis);
        $avis->delete($avis);

        return back()->with('success', 'Avis supprimé');
    }
}
