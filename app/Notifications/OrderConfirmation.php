<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

/**
 * Notification de confirmation de commande envoyée au client.
 *
 * S'assure que le client reçoit un e-mail résumant les détails de sa commande.
 */
class OrderConfirmation extends Notification
{
    use Queueable;

    /**
     * Crée une nouvelle instance de la notification.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Détermine les canaux de distribution de la notification.
     *
     * @param  object  $notifiable  L'entité notifiable (généralement un User).
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
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
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
