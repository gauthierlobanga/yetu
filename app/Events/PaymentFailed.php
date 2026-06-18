<?php

namespace App\Events;

use App\Models\Tenant;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

/**
 * Événement déclenché lors de l'échec d'un paiement (ex: abonnement du tenant).
 *
 * Diffuse l'information en temps réel sur le canal privé du tenant concerné.
 */
class PaymentFailed
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Crée une nouvelle instance de l'événement.
     *
     * @param  Tenant  $tenant  Le tenant dont le paiement a échoué.
     * @param  float  $amount  Le montant de la transaction échouée.
     */
    public function __construct(
        public readonly Tenant $tenant,
        public readonly float $amount,
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
