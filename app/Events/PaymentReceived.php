<?php

namespace App\Events;

use App\Models\Order;
use App\Notifications\PaymentNotification;
use App\Services\NotificationService;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

/**
 * Événement déclenché lors de la réception d'un paiement pour une commande.
 *
 * Gère l'envoi des notifications respectives au vendeur et au client.
 */
class PaymentReceived
{
    use Dispatchable, SerializesModels;

    /**
     * Crée une nouvelle instance de l'événement.
     *
     * @param  Order  $order  La commande associée au paiement.
     * @param  float  $amount  Le montant reçu.
     * @param  string  $status  Le statut du paiement (par défaut 'completed').
     */
    public function __construct(
        public Order $order,
        public float $amount,
        public string $status = 'completed',
    ) {}

    /**
     * Traite l'événement : notifie le vendeur et le client.
     *
     * @param  NotificationService  $notificationService  Service de gestion des notifications.
     */
    public function handle(NotificationService $notificationService): void
    {
        // Notifier le vendeur
        $notificationService->notifyTenantOwner(
            $this->order->shop,
            PaymentNotification::class,
            [
                'order' => $this->order,
                'amount' => $this->amount,
                'status' => $this->status,
                'message' => "Paiement de {$this->amount}€ reçu",
            ]
        );

        // Notifier le client
        $notificationService->notifyCustomer(
            $this->order->user,
            PaymentNotification::class,
            [
                'order' => $this->order,
                'amount' => $this->amount,
                'status' => $this->status,
                'message' => "Votre paiement de {$this->amount}€ a été confirmé",
            ]
        );
    }
}
