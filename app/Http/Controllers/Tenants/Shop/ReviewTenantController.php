<?php

namespace App\Http\Controllers\Tenants\Shop;

use App\Http\Controllers\Controller;
use App\Models\AvisClient;
use App\Models\Produit;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ReviewTenantController extends Controller
{
    public function index(Produit $produit)
    {
        $reviews = $produit->approvedAvis()->with('client')->latest()->paginate(10);

        return Inertia::render('tenants/Shop/Products/Reviews', [
            'product' => app(ProductTenantController::class)->formatProduct($produit),
            'reviews' => $reviews,
        ]);
    }

    public function store(Request $request, Produit $produit)
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

    public function update(Request $request, AvisClient $avis)
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
}
