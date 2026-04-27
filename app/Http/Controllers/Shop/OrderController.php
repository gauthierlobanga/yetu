<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\Commande;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index()
    {
        $client = Auth::user()->client;
        $orders = $client->commandes()->with('lignes.produit')->latest()->paginate(10);

        return Inertia::render('Shop/Orders/Index', ['orders' => $orders]);
    }

    public function show(Commande $commande)
    {
        /** @var AuthorizesRequests $this */
        $this->authorize('view', $commande);
        $commande->load(['lignes.produit', 'adresseFacturation', 'adresseLivraison', 'paiements']);

        return Inertia::render('Shop/Orders/Show', ['order' => $commande]);
    }

    public function cancel(Commande $commande)
    {
        /** @var AuthorizesRequests $this */
        $this->authorize('cancel', $commande);
        $commande->annuler();
        foreach ($commande->lignes as $ligne) {
            $ligne->produit->incrementerStock($ligne->quantite);
        }

        return back()->with('success', 'Commande annulée');
    }

    public function invoice(Commande $commande)
    {
        /** @var AuthorizesRequests $this */
        $this->authorize('view', $commande);

        // À implémenter avec un package PDF (ex: barryvdh/laravel-dompdf)
        return back()->with('info', 'Facture en cours de génération');
    }
}
