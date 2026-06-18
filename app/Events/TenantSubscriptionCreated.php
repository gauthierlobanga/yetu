<?php

namespace App\Events;

use App\Models\Tenant;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

/**
 * Événement déclenché lors de la création d'un nouvel abonnement tenant.
 *
 * Permet de signaler en temps réel la prise en compte de la souscription.
 */
class TenantSubscriptionCreated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Crée une nouvelle instance de l'événement.
     *
     * @param  Tenant  $tenant  Le tenant qui vient de souscrire.
     */
    public function __construct(
        public readonly Tenant $tenant,
    ) {}

    /**
     * Détermine les canaux sur lesquels l'événement doit être diffusé.
     *
     * @return array<int, Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel("tenant.{$this->tenant->id}"),
        ];
    }
}
