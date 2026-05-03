<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\Retour;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AccountDashboardController extends Controller
{
    public function AccountDashboardIndex()
    {
        $client = Auth::user()?->client;

        abort_unless($client, 404);

        $wishlist = $client->wishlists()->withCount('items')->first();
        $compteFidelite = $client->compteFidelite()->with('transactions')->first();
        $recentOrders = $client->commandes()
            ->withCount('lignes')
            ->latest()
            ->take(5)
            ->get();

        $pendingReturns = Retour::query()
            ->whereHas('commande', fn ($query) => $query->where('client_id', $client->id))
            ->whereIn('statut', [
                Retour::STATUT_EN_ATTENTE,
                Retour::STATUT_ACCEPTE,
                Retour::STATUT_EN_COURS,
            ])
            ->count();

        return Inertia::render('Shop/Dashboard/Index', [
            'stats' => [
                'orders_count' => $client->commandes()->count(),
                'completed_orders' => $client->commandes()->where('statut', 'termine')->count(),
                'addresses_count' => $client->adresses()->count(),
                'wishlist_items_count' => $wishlist?->items_count ?? 0,
                'pending_returns_count' => $pendingReturns,
                'loyalty_points' => $compteFidelite?->points ?? 0,
                'loyalty_level' => $compteFidelite?->niveau_libelle ?? 'Bronze',
            ],
            'recentOrders' => $recentOrders,
            'wishlist' => $wishlist,
            'loyalty' => $compteFidelite,
        ]);
    }
}
