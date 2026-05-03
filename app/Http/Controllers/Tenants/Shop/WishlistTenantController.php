<?php

namespace App\Http\Controllers\Tenants\Shop;

use App\Http\Controllers\Controller;
use App\Models\Produit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class WishlistTenantController extends Controller
{
    public function index()
    {
        $client = Auth::user()->client;
        $wishlist = $client->wishlists()->firstOrCreate(['nom' => 'Ma liste'], ['est_publique' => false]);
        $items = $wishlist->items()->with('produit')->get();

        return Inertia::render('tenants/Shop/Wishlist/Index', [
            'wishlist' => $wishlist,
            'items' => $items->map(fn ($i) => [
                'id' => $i->id,
                'produit' => app(ProductTenantController::class)->formatProduct($i->produit),
                'quantite' => $i->quantite,
                'note' => $i->note,
            ]),
        ]);
    }

    public function toggle(Request $request, Produit $produit)
    {
        $client = Auth::user()->client;
        $wishlist = $client->wishlists()->firstOrCreate(['nom' => 'Ma liste']);

        if ($wishlist->items()->where('produit_id', $produit->id)->exists()) {
            $wishlist->removeProduct($produit);
            $message = 'Produit retiré de la wishlist';
        } else {
            $wishlist->addProduct($produit);
            $message = 'Produit ajouté à la wishlist';
        }

        if ($request->wantsJson()) {
            return response()->json(['success' => true, 'message' => $message]);
        }

        return back()->with('success', $message);
    }

    public function remove(Produit $produit)
    {
        $client = Auth::user()->client;
        $wishlist = $client->wishlists()->first();
        if ($wishlist) {
            $wishlist->removeProduct($produit);
        }

        return back()->with('success', 'Produit retiré');
    }
}
