<?php

namespace App\Http\Controllers\Tenants\Shop;

use App\Http\Controllers\Controller;
use App\Models\Client;
use App\Models\Coupon;
use App\Models\ItemPanier;
use App\Models\Panier;
use App\Models\Produit;
use App\Models\VarianteProduit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Auth as FacadesAuth;
use Inertia\Inertia;

class CartTenantController extends Controller
{
    public function index(Request $request)
    {
        $cart = $this->getOrCreateCart($request);

        return Inertia::render('tenants/Shop/Carts/Index', [
            'cart' => $this->formatCart($cart),
        ]);
    }

    public function add(Request $request, Produit $produit)
    {
        $validated = $request->validate([
            'quantite' => 'integer|min:1',
            'variante_id' => 'nullable|exists:variante_produits,id',
        ]);

        $cart = $this->getOrCreateCart($request);
        $variante = isset($validated['variante_id']) ? VarianteProduit::find($validated['variante_id']) : null;

        $cart->ajouterItem($produit, $validated['quantite'] ?? 1, $variante);

        if ($request->wantsJson()) {
            return response()->json(['success' => true, 'cart' => $this->formatCart($cart)]);
        }

        return redirect()->route('tenant.cart.index')->with('success', 'Produit ajouté au panier');
    }

    public function update(Request $request, ItemPanier $item)
    {
        $request->validate(['quantite' => 'required|integer|min:1']);

        $item->quantite = $request->quantite;
        $item->prix_total = $item->prix_unitaire * $item->quantite;
        $item->save();

        $item->panier->recalculerTotaux();

        return back()->with('success', 'Panier mis à jour');
    }

    public function remove(ItemPanier $item)
    {
        $item->delete();
        $item->panier->recalculerTotaux();

        return back()->with('success', 'Article retiré du panier');
    }

    public function clear(Request $request)
    {
        $cart = $this->getOrCreateCart($request);
        $cart->vider();

        return back()->with('success', 'Panier vidé');
    }

    public function applyCoupon(Request $request)
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

    public function removeCoupon(Request $request)
    {
        $cart = $this->getOrCreateCart($request);
        $cart->promotions()->detach();
        $cart->total_remises = 0;
        $cart->recalculerTotaux();

        return back()->with('success', 'Code promo retiré');
    }

    public function getOrCreateCart(Request $request): Panier
    {
        if (Auth::check()) {
            $user = Auth::user();
            $client = $user->client;
            if (! $client) {
                $client = $user->client()->create([
                    'nom' => $user->name ?? 'Client',
                    'prenom' => '',
                    'email' => $user->email,
                    'type' => Client::TYPE_PARTICULIER,
                    'statut' => Client::STATUT_ACTIF,
                ]);
            }
            $cart = Panier::firstOrCreate(
                ['client_id' => $client->id, 'statut' => Panier::STATUT_ACTIF],
                ['date_creation' => now(), 'expires_at' => now()->addDays(7)]
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

    public function formatCart(Panier $cart): array
    {
        // Charger les relations nécessaires pour éviter les requêtes N+1
        $cart->load(['items', 'promotions']);

        return [
            'id' => $cart->id,
            'nb_articles' => $cart->nb_articles,
            'sous_total' => (float) $cart->sous_total,
            'total_taxes' => (float) $cart->total_taxes,
            'total_livraison' => (float) $cart->total_livraison,
            'total_remises' => (float) $cart->total_remises,
            'total_general' => (float) $cart->total_general,
            'items' => $cart->items->map(fn ($item) => [
                'id' => $item->id,
                'produit' => [
                    'id' => $item->produit->id,
                    'nom' => $item->nom_produit,
                    'slug' => $item->produit->slug,
                    'image' => $item->image,
                ],
                'quantite' => (int) $item->quantite,
                'prix_unitaire' => (float) $item->prix_unitaire,   // ✅ cast explicite
                'prix_total' => (float) $item->prix_total,         // ✅ cast explicite
            ])->values(),
            'promotions' => $cart->promotions->map(fn ($p) => [
                'code' => $p->code,
                'montant' => (float) $p->pivot->montant_applique,   // ✅ cast explicite
            ])->values(),
        ];
    }

    public function getCart(Request $request): Panier
    {
        if (FacadesAuth::check()) {
            $client = FacadesAuth::user()->client;
            if (! $client) {
                $client = FacadesAuth::user()->client()->create();
            }
            $cart = Panier::firstOrCreate(
                ['client_id' => $client->id, 'statut' => Panier::STATUT_ACTIF],
                ['date_creation' => now(), 'expires_at' => now()->addDays(7)]
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

    public function calculate(Request $request)
    {
        $request->validate([
            'item_ids' => 'array',
            'item_ids.*' => 'integer|exists:item_paniers,id',
        ]);

        $cart = $this->getOrCreateCart($request);
        $selectedIds = $request->input('item_ids', []);

        if (empty($selectedIds)) {
            return response()->json([
                'calculatedTotals' => [
                    'sous_total' => 0,
                    'total_taxes' => 0,
                    'total_livraison' => 0,
                    'total_remises' => 0,
                    'total_general' => 0,
                    'selected_count' => 0,
                ],
            ])->header('X-Inertia', 'false');
        }

        $selectedItems = $cart->items()->whereIn('id', $selectedIds)->get();

        $sousTotal = $selectedItems->sum('prix_total');
        $totalTaxes = $selectedItems->sum(fn ($item) => $item->taxe_unitaire * $item->quantite);
        $totalLivraison = $cart->total_livraison;
        $totalRemises = $cart->total_remises;
        $totalGeneral = $sousTotal + $totalTaxes + $totalLivraison - $totalRemises;

        return response()->json([
            'calculatedTotals' => [
                'sous_total' => round($sousTotal, 2),
                'total_taxes' => round($totalTaxes, 2),
                'total_livraison' => round($totalLivraison, 2),
                'total_remises' => round($totalRemises, 2),
                'total_general' => round($totalGeneral, 2),
                'selected_count' => $selectedItems->sum('quantite'),
            ],
        ])->header('X-Inertia', 'false');
    }
}
