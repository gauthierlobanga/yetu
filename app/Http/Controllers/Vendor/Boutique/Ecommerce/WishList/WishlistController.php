<?php

namespace App\Http\Controllers\Vendor\Boutique\Ecommerce\WishList;

use App\Events\WishlistActivity;
use App\Http\Controllers\Controller;
use App\Http\Controllers\Vendor\Boutique\Ecommerce\Product\ProductController;
use App\Models\Client;
use App\Models\Produit;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Contrôleur de gestion de la liste d'envies (Wishlist).
 *
 * Permet au client d'ajouter, retirer ou consulter ses produits favoris.
 * Emet également des événements WebSocket pour notifier le vendeur.
 */
class WishlistController extends Controller
{
    /**
     * Affiche le contenu de la liste d'envies (Wishlist) du client.
     *
     * Crée automatiquement une liste par défaut si le client n'en possède pas encore.
     *
     * @return Response
     */
    public function wishlistIndex()
    {
        $client = Auth::user()->client;
        $wishlist = $client->wishlists()->firstOrCreate(['nom' => 'Ma liste'], ['est_publique' => false]);
        // Optimisation : eager loading de produit.media pour éviter un LazyLoadingViolation
        $items = $wishlist->items()->with('produit.media')->get();

        return Inertia::render('Vendor/boutique/Wishlist/Index', [
            'wishlist' => $wishlist,
            'items' => $items->map(fn ($i) => [
                'id' => $i->id,
                'produit' => app(ProductController::class)->formatProduct($i->produit),
                'quantite' => $i->quantite,
                'note' => $i->note,
            ]),
        ]);
    }

    /**
     * Affiche l'interface d'ajout explicite d'éléments à la wishlist.
     *
     * (Actuellement renvoie vers la même vue que l'index de la liste d'envies)
     *
     * @return Response
     */
    public function wishlistAdd()
    {
        $client = Auth::user()->client;
        $wishlist = $client->wishlists()->firstOrCreate(['nom' => 'Ma liste'], ['est_publique' => false]);
        $items = $wishlist->items()->with('produit.media')->get();

        return Inertia::render('Vendor/boutique/Wishlist/Index', [
            'wishlist' => $wishlist,
            'items' => $items->map(fn ($i) => [
                'id' => $i->id,
                'produit' => app(ProductController::class)->formatProduct($i->produit),
                'quantite' => $i->quantite,
                'note' => $i->note,
            ]),
        ]);
    }

    /**
     * Bascule l'état d'un produit dans la wishlist (Ajouter / Retirer).
     *
     * Méthode appelée de manière asynchrone (API/XHR). Ajoute le produit si absent,
     * le retire si présent. Déclenche une notification en temps réel (WishlistActivity) pour le tenant.
     *
     * @param  Produit  $produit  Le produit cible.
     * @return JsonResponse
     */
    public function wishlistToggle(Request $request, Produit $produit)
    {
        $client = Auth::user()->client;
        if (! $client) {
            $client = Auth::user()->client()->create([
                'nom' => Auth::user()->name ?? 'Client',
                'prenom' => '',
                'email' => Auth::user()->email,
                'type' => Client::TYPE_PARTICULIER,
                'statut' => Client::STATUT_ACTIF,
            ]);
        }

        $wishlist = $client->wishlists()->firstOrCreate(['nom' => 'Ma liste']);

        if ($wishlist->items()->where('produit_id', $produit->id)->exists()) {
            $wishlist->removeProduct($produit);
            $message = 'Produit retiré de la wishlist';
            $type = 'wishlist_remove';
        } else {
            $wishlist->addProduct($produit);
            $message = 'Produit ajouté à la wishlist';
            $type = 'wishlist_add';
        }

        // Notification au tenant en temps réel
        $tenant = tenant();
        if ($tenant) {
            event(new WishlistActivity(
                $tenant->id,
                'Activité wishlist',
                "Un client a {$message} : {$produit->nom}",
                $type
            ));
        }

        return response()->json(['success' => true, 'message' => $message]);
    }

    /**
     * Retire explicitement un produit spécifique de la wishlist.
     *
     * Utilisé généralement depuis la page de gestion complète de la liste d'envies.
     *
     * @param  Produit  $produit  Le produit à supprimer.
     * @return RedirectResponse
     */
    public function wishlistRemove(Produit $produit)
    {
        $client = Auth::user()->client;
        $wishlist = $client->wishlists()->first();
        if ($wishlist) {
            $wishlist->removeProduct($produit);
        }

        return back()->with('success', 'Produit retiré');
    }
}
