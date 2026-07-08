<?php

namespace App\Http\Controllers\Vendor\Boutique\Ecommerce\Commande;

use App\Http\Controllers\Controller;
use App\Models\Commande;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class OrderController extends Controller
{
    use AuthorizesRequests;

    public function ordersIndex()
    {
        $user = Auth::user();
        $client = $user?->client;

        $ordersQuery = $client
            ? $client->commandes()->with(['lignes.produit', 'lignes.variante'])->latest()
            : Commande::query()->whereNull('id');

        // Appliquer les filtres
        if ($status = request('statut')) {
            $ordersQuery->where('statut', $status);
        }
        if ($search = request('search')) {
            $ordersQuery->where(function ($q) use ($search) {
                $q->where('numero_commande', 'like', "%{$search}%")
                    ->orWhereHas('lignes.produit', fn ($q) => $q->where('nom', 'like', "%{$search}%"));
            });
        }

        $orders = $ordersQuery->paginate(10)->withQueryString();

        // Statistiques
        $stats = $client
            ? [
                'total' => $client->commandes()->count(),
                'en_attente' => $client->commandes()->where('statut', 'en_attente')->count(),
                'en_cours' => $client->commandes()->where('statut', 'en_cours')->count(),
                'termine' => $client->commandes()->where('statut', 'termine')->count(),
                'annule' => $client->commandes()->where('statut', 'annule')->count(),
                'rejete' => $client->commandes()->where('statut', 'rejete')->count(),
                'total_amount' => $client->commandes()->where('statut', 'termine')->sum('total'),
            ]
            : [
                'total' => 0,
                'en_attente' => 0,
                'en_cours' => 0,
                'termine' => 0,
                'annule' => 0,
                'rejete' => 0,
                'total_amount' => 0,
            ];

        // Tendance (commandes par mois) – correction PostgreSQL
        $trendData = $client
            ? $client->commandes()
                ->selectRaw("TO_CHAR(date_commande, 'YYYY-MM') as month, COUNT(*) as count, SUM(total) as total_amount")
                ->whereNotNull('date_commande')
                ->groupBy('month')
                ->orderBy('month')
                ->get()
                ->map(fn ($item) => [
                    'month' => $item->month,
                    'count' => (int) $item->count,
                    'amount' => (float) $item->total_amount,
                ])
            : collect();

        return Inertia::render('Vendor/boutique/Orders/Index', [
            'orders' => $orders,
            'stats' => $stats,
            'trendData' => $trendData,
            'filters' => request()->only('statut', 'search'),
        ]);
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
