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
 * Événement déclenché lors du renouvellement d'un abonnement tenant.
 *
 * Diffuse l'information en temps réel sur le canal du tenant concerné.
 */
class TenantSubscriptionRenewed implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Crée une nouvelle instance de l'événement.
     *
     * @param  Tenant  $tenant  Le tenant dont l'abonnement a été renouvelé.
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
