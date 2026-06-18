<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

/**
 * Événement déclenché lors de l'envoi d'une notification en base de données.
 *
 * Cet événement diffuse un signal immédiat sur un canal privé afin que l'interface
 * utilisateur soit mise à jour en temps réel.
 */
class TenantDatabaseNotificationsSent implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Crée une nouvelle instance de l'événement.
     *
     * @param  string  $userId  L'identifiant de l'utilisateur concerné.
     * @param  string  $tenantId  L'identifiant du tenant (vendeur).
     */
    public function __construct(
        public readonly string $userId,
        public readonly string $tenantId,
    ) {}

    /**
     * Définit le canal privé sur lequel l'événement est diffusé.
     */
    public function broadcastOn(): PrivateChannel
    {
        return new PrivateChannel("tenant.{$this->tenantId}.users.{$this->userId}");
    }

    public function broadcastAs(): string
    {
        return 'database-notifications.sent';
    }
}
