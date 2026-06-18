<?php

namespace App\Http\Controllers\Vendor\Boutique\Ecommerce\Commande;

use App\Http\Controllers\Controller;
use App\Models\Commande;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

/**
 * Contrôleur de gestion des commandes côté boutique (client).
 */
class OrderController extends Controller
{
    public function ordersIndex()
    {
        $user = Auth::user();
        $client = $user?->client;

        $orders = $client
            ? $client->commandes()->with(['lignes.produit', 'lignes.variante'])->latest()->paginate(10)
            : collect();

        return Inertia::render('Vendor/boutique/Orders/Index', ['orders' => $orders]);
    }

    public function ordersShow(Commande $commande)
    {
        $this->authorize('view', $commande);
        $commande->load(['lignes.produit', 'lignes.variante', 'adresseFacturation', 'adresseLivraison', 'paiements']);

        return Inertia::render('Vendor/boutique/Orders/Show', ['order' => $commande]);
    }

    public function ordersCancel(Commande $commande)
    {
        $this->authorize('cancel', $commande);

        $commande->annuler();

        foreach ($commande->lignes as $ligne) {
            if ($ligne->variante) {
                $ligne->variante->incrementerStock($ligne->quantite);
            } else {
                $ligne->produit->incrementerStock($ligne->quantite);
            }
        }

        return back()->with('success', 'Commande annulée et stocks réajustés.');
    }

    public function ordersInvoice(Commande $commande)
    {
        $this->authorize('view', $commande);

        $commande->load(['client', 'lignes.produit', 'lignes.variante', 'adresseFacturation', 'adresseLivraison']);

        $pdf = Pdf::loadView('pdf.invoice', [
            'commande' => $commande,
            'company' => [
                'name' => config('app.name'),
                'address' => config('company_address', ''),
                'email' => config('company_email', ''),
                'phone' => config('company_phone', ''),
                'siret' => config('company_siret', ''),
                'tva' => config('company_tva', ''),
            ],
        ]);

        $pdf->setPaper('A4', 'portrait');
        $pdf->setOptions(['defaultFont' => 'sans-serif', 'isHtml5ParserEnabled' => true, 'isRemoteEnabled' => true]);

        $filename = sprintf('facture-%s.pdf', $commande->numero_commande ?? $commande->id);

        return $pdf->download($filename);
    }
}
