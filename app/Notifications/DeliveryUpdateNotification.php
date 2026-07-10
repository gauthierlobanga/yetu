<?php

namespace App\Notifications;

use App\Models\DeliveryEvent;
use App\Models\DeliveryTracking;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

// facultatif si vous voulez la diffuser en temps réel

class DeliveryUpdateNotification extends Notification
{
    public function __construct(
        public DeliveryTracking $tracking,
        public DeliveryEvent $event
    ) {}

    /**
     * Canaux de diffusion : base de données + (optionnel) broadcast.
     */
    public function via($notifiable): array
    {
        return ['database', 'broadcast']; // ajoutez 'broadcast' si vous voulez du temps réel sur les notifications
    }

    /**
     * Construit la représentation e-mail de la notification.
     *
     * @param  object  $notifiable  L'entité notifiable.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->line('The introduction to the notification.')
            ->action('Notification Action', url('/'))
            ->line('Thank you for using our application!');
    }

    /**
     * Représentation de la notification pour le stockage en base.
     */
    public function toArray($notifiable): array
    {
        return [
            // Identifiant unique pour le frontend
            'id' => $this->id,       // l'ID de la notification elle-même (généré par Laravel)
            'type' => 'delivery_update',
            'title' => $this->event->title,
            'message' => $this->event->description ?? 'Mise à jour de livraison',

            // Métadonnées utiles pour les actions (liens, etc.)
            'data' => [
                'commande_id' => $this->tracking->commande_id,
                'tracking_number' => $this->tracking->tracking_number,
                'tracking_id' => $this->tracking->id,
                'event_id' => $this->event->id,
                'status' => $this->tracking->status,
                'location' => $this->event->location,
                'occurred_at' => $this->event->occurred_at?->toIso8601String(),
            ],

            // URL vers la commande concernée (pour que le clic redirige)
            'url' => route('tenant.orders.show', $this->tracking->commande_id),

            // Horodatage
            'created_at' => now()->toIso8601String(),
        ];
    }

    /**
     * (Optionnel) Représentation pour la diffusion temps réel.
     */
    public function toBroadcast($notifiable): array
    {
        return [
            'id' => $this->id,
            'type' => 'delivery_update',
            'title' => $this->event->title,
            'message' => $this->event->description,
            'url' => route('tenant.orders.show', $this->tracking->commande_id),
        ];
    }
}
