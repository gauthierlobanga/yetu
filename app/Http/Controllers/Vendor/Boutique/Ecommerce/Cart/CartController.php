<?php

namespace App\Http\Controllers\Vendor\Boutique\Ecommerce\Cart;

use App\Http\Controllers\Controller;
use App\Models\Client;
use App\Models\Coupon;
use App\Models\ItemPanier;
use App\Models\Panier;
use App\Models\Produit;
use App\Models\RelancePanier;
use App\Models\User;
use App\Models\VarianteProduit;
use App\Models\VisitorEvent;
use Illuminate\Database\QueryException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpKernel\Exception\HttpException;

/**
 * Contrôleur gérant le panier d'achat de la boutique.
 * Permet d'ajouter, modifier, supprimer des articles, et appliquer des codes promo.
 */
class CartController extends Controller
{
    /**
     * Affiche la page du panier avec les articles et totaux.
     *
     * @return Response
     */
    public function cartIndex(Request $request)
    {
        $cart = $this->getOrCreateCart($request);

        return Inertia::render('Vendor/boutique/Carts/Index', [
            'cart' => $this->formatCart($cart),
        ]);
    }

    /**
     * Ajoute un produit (et éventuellement une variante) au panier.
     *
     * @return RedirectResponse|JsonResponse
     */
    public function cartAdd(Request $request, Produit $produit)
    {
        $validated = $request->validate([
            'quantite' => 'integer|min:1',
            'variante_id' => 'nullable|exists:variante_produits,id',
        ]);

        $cart = $this->getOrCreateCart($request);
        $variante = isset($validated['variante_id']) ? VarianteProduit::find($validated['variante_id']) : null;

        $cart->ajouterItem($produit, $validated['quantite'] ?? 1, $variante);

        $this->recordCartEvent($request, $produit);

        if ($request->wantsJson()) {
            return response()->json(['success' => true, 'cart' => $this->formatCart($cart)]);
        }

        return redirect()->route('tenant.cart.index')->with('success', 'Produit ajouté au panier');
    }

    /**
     * Met à jour la quantité d'un article spécifique dans le panier.
     *
     * @return RedirectResponse|JsonResponse
     */
    public function cartUpdate(Request $request, ItemPanier $item)
    {
        $this->authorizeCartItemAccess($request, $item);

        $request->validate(['quantite' => 'required|integer|min:1']);

        $item->quantite = $request->quantite;
        $item->prix_total = $item->prix_unitaire * $item->quantite;
        $item->save();

        $item->panier->recalculerTotaux();

        if ($request->wantsJson()) {
            return response()->json([
                'cart' => $this->formatCart($item->panier),
            ]);
        }

        return back()->with('success', 'Panier mis à jour');
    }

    /**
     * Retire un article du panier.
     *
     * @return RedirectResponse
     */
    public function cartRemove(Request $request, ItemPanier $item)
    {
        $this->authorizeCartItemAccess($request, $item);

        $item->delete();
        $item->panier->recalculerTotaux();

        return back()->with('success', 'Article retiré du panier');
    }

    /**
     * Vide intégralement le panier.
     *
     * @return RedirectResponse
     */
    public function cartClear(Request $request)
    {
        $cart = $this->getOrCreateCart($request);
        $cart->vider();

        return back()->with('success', 'Panier vidé');
    }

    /**
     * Applique un code promo au panier.
     *
     * @return RedirectResponse
     */
    public function cartApplyCoupon(Request $request)
    {
        $request->validate(['code' => 'required|string']);
        $cart = $this->getOrCreateCart($request);
        $coupon = Coupon::where('code', $request->code)->actif()->first();

        if (! $coupon || ! $coupon->est_valide) {
            return back()->withErrors(['code' => 'Code promo invalide ou expiré']);
        }

        $reduction = $coupon->calculerReduction($cart->sous_total);
        if ($reduction <= 0) {
            return back()->withErrors(['code' => 'Le montant minimum du panier n\'est pas atteint']);
        }

        $cart->promotions()->attach($coupon, [
            'montant_applique' => $reduction,
            'applied_at' => now(),
            'code_saisi' => $request->code,
        ]);

        $cart->total_remises += $reduction;
        $cart->recalculerTotaux();
        $coupon->incrementUtilisation();

        return back()->with('success', 'Code promo appliqué');
    }

    /**
     * Retire le code promo actuellement appliqué au panier.
     *
     * @return RedirectResponse
     */
    public function cartRemoveCoupon(Request $request)
    {
        $cart = $this->getOrCreateCart($request);
        $cart->promotions()->detach();
        $cart->total_remises = 0;
        $cart->recalculerTotaux();

        return back()->with('success', 'Code promo retiré');
    }

    /**
     * Récupère le panier actif de l'utilisateur ou de la session, sinon le crée.
     */
    public function getOrCreateCart(Request $request): Panier
    {
        if (Auth::check()) {
            $user = Auth::user();
            $client = $this->getOrCreateClientForUser($user);
            $cart = Panier::firstOrCreate(
                ['client_id' => $client->id, 'statut' => Panier::STATUT_ACTIF],
                ['user_id' => $user->id, 'date_creation' => now(), 'expires_at' => now()->addDays(7)]
            );
        } else {
            $sessionId = $request->session()->getId();
            $cart = Panier::firstOrCreate(
                ['session_id' => $sessionId, 'statut' => Panier::STATUT_ACTIF],
                ['date_creation' => now(), 'expires_at' => now()->addDays(7)]
            );
        }

        return $cart;
    }

    /**
     * Formate les données du panier pour les renvoyer en JSON ou à la vue Inertia.
     */
    public function formatCart(Panier $cart): array
    {
        // Optimisation : eager loading pour éviter un LazyLoadingViolation sur l'accès aux relations de l'item du panier
        $cart->load(['items.produit.media', 'items.variante', 'promotions']);

        // 🔥 Trier les items par ID pour un ordre stable
        $items = $cart->items->sortBy('id')->values();

        return [
            'id' => $cart->id,
            'nb_articles' => $cart->nb_articles,
            'sous_total' => $cart->sous_total,
            'total_taxes' => $cart->total_taxes,
            'total_livraison' => $cart->total_livraison,
            'total_remises' => $cart->total_remises,
            'total_general' => $cart->total_general,
            'items' => $items->map(fn ($item) => [
                'id' => $item->id,
                'produit' => [
                    'id' => $item->produit->id,
                    'nom' => $item->nom_produit,
                    'slug' => $item->produit->slug,
                    'image' => $item->produit->getImageUrl('small')
                        ?: Storage::url('images/loafers-leaning-along-white-wall.jpg'),
                ],
                'quantite' => (int) $item->quantite,
                'prix_unitaire' => (float) $item->prix_unitaire,
                'prix_total' => (float) $item->prix_total,
            ])->values(),
            'promotions' => $cart->promotions->map(fn ($p) => [
                'code' => $p->code,
                'montant' => (float) $p->pivot->montant_applique,
            ])->values(),
        ];
    }

    /**
     * Retourne l'instance du panier actif courant.
     */
    public function getCart(Request $request): Panier
    {
        return $this->getOrCreateCart($request);
    }

    /**
     * Vérifie que l'item du panier appartient bien au panier de l'utilisateur/session courant.
     *
     * @throws HttpException
     */
    private function authorizeCartItemAccess(Request $request, ItemPanier $item): void
    {
        $userCart = $this->getOrCreateCart($request);

        if ($item->panier_id !== $userCart->id) {
            abort(403, 'Accès non autorisé à cet article du panier.');
        }
    }

    /**
     * Calcule le total du panier basé sur une sélection spécifique d'articles.
     *
     * @return JsonResponse
     */
    public function cartCalculate(Request $request)
    {
        $request->validate([
            'item_ids' => 'sometimes|array',
            'item_ids.*' => 'string',
        ]);

        $cart = $this->getOrCreateCart($request);
        $selectedIds = $request->input('item_ids', []);

        $validIds = $cart->items()
            ->whereIn('id', $selectedIds)
            ->pluck('id')
            ->toArray();

        if (empty($validIds)) {
            return response()->json([
                'calculatedTotals' => [
                    'sous_total' => 0,
                    'total_taxes' => 0,
                    'total_livraison' => 0,
                    'total_remises' => 0,
                    'total_general' => 0,
                    'selected_count' => 0,
                ],
            ]);
        }

        $selectedItems = $cart->items()->whereIn('id', $validIds)->get();

        $sousTotal = $selectedItems->sum('prix_total');
        $totalTaxes = $selectedItems->sum(fn ($item) => ($item->taxe_unitaire ?? 0) * $item->quantite);

        return response()->json([
            'calculatedTotals' => [
                'sous_total' => round($sousTotal, 2),
                'total_taxes' => round($totalTaxes, 2),
                'total_livraison' => (float) $cart->total_livraison,
                'total_remises' => (float) $cart->total_remises,
                'total_general' => round($sousTotal + $totalTaxes + $cart->total_livraison - $cart->total_remises, 2),
                'selected_count' => $selectedItems->sum('quantite'),
            ],
        ]);
    }

    /**
     * Récupère ou crée un profil client rattaché à l'utilisateur.
     */
    private function getOrCreateClientForUser(User $user): Client
    {
        return $user->client()->firstOrCreate(
            [],
            [
                'nom' => $user->name ?? 'Client',
                'prenom' => '',
                'email' => $user->email,
                'type' => Client::TYPE_PARTICULIER,
                'statut' => Client::STATUT_ACTIF,
            ]
        );
    }

    /**
     * Enregistre un événement de type 'add_to_cart' pour les statistiques/visiteurs.
     */
    private function recordCartEvent(Request $request, Produit $produit): void
    {
        try {
            $event = new VisitorEvent;
            if (! $event->getConnection()->getSchemaBuilder()->hasTable($event->getTable())) {
                return;
            }

            VisitorEvent::create([
                'session_id' => Session::getId(),
                'visitor_id' => $request->cookie('y_visitor'),
                'event_type' => 'add_to_cart',
                'product_id' => $produit->id,
                'occurred_at' => now(),
            ]);
        } catch (QueryException $e) {
            Log::debug('Add-to-cart visitor event skipped.', [
                'tenant_id' => function_exists('tenant') ? tenant()?->id : null,
                'product_id' => $produit->id,
                'error' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Récupère un panier abandonné via un lien de relance.
     */
    public function cartRecover(Request $request, RelancePanier $relance)
    {
        $relance->marquerClique();

        $panier = $relance->abandonPanier->panier;

        if ($panier) {
            // Set the session ID to the recovered cart's session or link it to the user
            if (Auth::check()) {
                $panier->user_id = Auth::id();
                $panier->client_id = $this->getOrCreateClientForUser(Auth::user())->id;
            } else {
                $panier->session_id = $request->session()->getId();
            }
            $panier->statut = Panier::STATUT_ACTIF;
            $panier->save();

            $relance->abandonPanier->marquerRecupere();

            return redirect()->route('tenant.cart.index')
                ->with('success', 'Votre panier a été récupéré avec succès.');
        }

        return redirect()->route('tenant.home')->withErrors('Impossible de récupérer ce panier.');
    }
}
