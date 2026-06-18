<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

/**
 * Événement déclenché lors d'une interaction avec la liste d'envies (Wishlist).
 *
 * Notifie le vendeur lorsqu'un client ajoute ou retire un produit de sa liste d'envies.
 */
class WishlistActivity implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public string $tenantId;

    public string $title;

    public string $message;

    public string $type; // 'wishlist_add' ou 'wishlist_remove'

    /**
     * Crée une nouvelle instance de l'événement.
     *
     * @param  string  $tenantId  L'identifiant du tenant (vendeur) concerné.
     * @param  string  $title  Le titre de l'activité.
     * @param  string  $message  Le message descriptif.
     * @param  string  $type  Le type d'action (ex: 'wishlist_add' ou 'wishlist_remove').
     */
    public function __construct(string $tenantId, string $title, string $message, string $type = 'wishlist_add')
    {
        $this->tenantId = $tenantId;
        $this->title = $title;
        $this->message = $message;
        $this->type = $type;
    }

    /**
     * Détermine les canaux sur lesquels l'événement doit être diffusé.
     */
    public function broadcastOn(): Channel
    {
        return new Channel('tenant.'.$this->tenantId);
    }

    /**
     * Nom sous lequel l'événement est diffusé.
     */
    public function broadcastAs(): string
    {
        return 'wishlist.activity';
    }
}
