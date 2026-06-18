<?php

namespace App\Events;

use App\Models\Commande;
use App\Notifications\OrderNotification;
use App\Services\NotificationService;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

/**
 * Événement déclenché lors du changement de statut d'une commande.
 *
 * Permet de notifier le vendeur et le client du nouveau statut de la commande.
 */
class OrderStatusChanged
{
    use Dispatchable, SerializesModels;

    /**
     * Crée une nouvelle instance de l'événement.
     *
     * @param  Commande  $order  L'instance de la commande modifiée.
     * @param  string  $oldStatus  L'ancien statut de la commande.
     * @param  string  $newStatus  Le nouveau statut de la commande.
     */
    public function __construct(
        public Commande $order,
        public string $oldStatus,
        public string $newStatus,
    ) {}

    /**
     * Traite l'événement : notifie le vendeur et le client.
     *
     * @param  NotificationService  $notificationService  Service de gestion des notifications.
     */
    public function handle(NotificationService $notificationService): void
    {
        // Notifier le vendeur (propriétaire du tenant)
        $notificationService->notifyTenantOwner(
            $this->order->shop,
            OrderNotification::class,
            [
                'order' => $this->order,
                'action' => $this->newStatus,
                'message' => "Commande #{$this->order->number} - Statut: {$this->newStatus}",
            ]
        );

        // Notifier le client
        $notificationService->notifyCustomer(
            $this->order->user,
            OrderNotification::class,
            [
                'order' => $this->order,
                'action' => $this->newStatus,
                'message' => "Votre commande #{$this->order->number} - Statut: {$this->newStatus}",
            ]
        );
    }
}
