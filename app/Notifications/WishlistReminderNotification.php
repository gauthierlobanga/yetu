<?php

namespace App\Notifications;

use App\Models\Wishlist;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Notification;

/**
 * Notification de rappel pour la liste d'envies (Wishlist).
 *
 * Rappelle à un utilisateur qu'il possède des articles dans sa liste d'envies
 * et l'incite à procéder à l'achat.
 */
class WishlistReminderNotification extends Notification
{
    use Queueable;

    /**
     * Crée une nouvelle instance de la notification.
     *
     * @param  Wishlist  $wishlist  La liste d'envies concernée.
     */
    public function __construct(public Wishlist $wishlist) {}

    /**
     * Détermine les canaux de distribution de la notification.
     *
     * @param  object  $notifiable  L'entité notifiable.
     * @return array<int, string>
     */
    public function via($notifiable): array
    {
        return ['mail', 'database', 'broadcast'];
    }

    /**
     * Construit la représentation en tableau (database) de la notification.
     *
     * @param  object  $notifiable  L'entité notifiable.
     * @return array<string, mixed>
     */
    public function toArray($notifiable): array
    {
        return [
            'title' => 'Rappel wishlist',
            'message' => 'Vous avez des articles dans votre wishlist. Consultez-les et ajoutez-les à votre panier !',
            'url' => route('tenant.wishlist.index'),
            'type' => 'wishlist_reminder',
            'wishlist_id' => $this->wishlist->id,
        ];
    }

    /**
     * Construit la représentation pour la diffusion WebSockets.
     *
     * @param  object  $notifiable  L'entité notifiable.
     */
    public function toBroadcast($notifiable): BroadcastMessage
    {
        return new BroadcastMessage($this->toArray($notifiable));
    }
}
