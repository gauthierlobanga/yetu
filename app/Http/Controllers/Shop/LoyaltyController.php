<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class LoyaltyController extends Controller
{
    public function loyaltyIndex()
    {
        $client = Auth::user()->client;
        $compte = $client->compteFidelite ?? $client->compteFidelite()->create(['points' => 0, 'points_cumules' => 0, 'niveau' => 'bronze']);

        return Inertia::render('Shop/Loyalty/Index', ['compte' => $compte->load('transactions')]);
    }

    public function loyaltyRedeem(Request $request)
    {
        $client = Auth::user()->client;
        $compte = $client->compteFidelite;
        if (! $compte) {
            return back()->with('error', 'Aucun compte fidélité');
        }
        $points = $request->input('points', 0);
        if ($compte->utiliserPoints($points, 'Échange de points')) {
            return back()->with('success', "$points points échangés");
        }

        return back()->with('error', 'Points insuffisants');
    }
}
