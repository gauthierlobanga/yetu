<?php

namespace App\Http\Controllers;

use App\Models\Commande;
use App\Models\DeliveryTracking;
use Illuminate\Http\JsonResponse;

class DeliveryTrackingController extends Controller
{
    public function show(Commande $commande): JsonResponse
    {
        // Vérifier que la commande appartient bien au client connecté
        $user = auth()->user();
        $client = $user ? $user->client : null;

        if (! $client || $commande->client_id !== $client->id) {
            abort(403);
        }

        $tracking = DeliveryTracking::where('commande_id', $commande->id)
            ->with('events')
            ->firstOrFail();

        return response()->json([
            'tracking' => [
                'id' => $tracking->id,
                'status' => $tracking->status,
                'carrier' => $tracking->carrier,
                'current_location' => $tracking->current_location,
                'estimated_delivery_at' => $tracking->estimated_delivery_at?->toIso8601String(),
                'tracking_number' => $tracking->tracking_number,
                'events' => $tracking->events->map(fn ($event) => [
                    'id' => $event->id,
                    'type' => $event->type,
                    'title' => $event->title,
                    'description' => $event->description,
                    'location' => $event->location,
                    'occurred_at' => $event->occurred_at->toIso8601String(),
                ]),
            ],
        ]);
    }
}
