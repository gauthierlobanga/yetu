<?php

namespace App\Notifications;

use App\Models\Tenant;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Carbon;

/**
 * Notification envoyée suite à l'annulation d'un abonnement tenant.
 *
 * Informe le vendeur de l'annulation de son offre et précise la date
 * limite de sa période de grâce (accès temporaire restant).
 */
class SubscriptionCanceledNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Crée une nouvelle instance de la notification.
     *
     * @param  Tenant  $tenant  Le tenant concerné.
     * @param  Carbon|null  $graceUntil  La date limite d'accès en lecture seule (période de grâce).
     */
    public function __construct(
        private readonly Tenant $tenant,
        private readonly ?Carbon $graceUntil = null,
    ) {}

    /**
     * Détermine les canaux de distribution de la notification.
     *
     * @param  object  $notifiable  L'entité notifiable.
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    /**
     * Construit la représentation e-mail de la notification.
     *
     * @param  object  $notifiable  L'entité notifiable.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject("Subscription annulée - {$this->tenant->raison_sociale}")
            ->greeting("Bonjour {$notifiable->name},")
            ->line("Votre subscription pour **{$this->tenant->raison_sociale}** a été annulée.")
            ->line("Vous avez accès à votre boutique jusqu'au {$this->graceUntil?->format('d/m/Y')}.")
            ->line('Après cette date, votre accès sera complètement bloqué.')
            ->line('Si vous souhaitez réactiver votre abonnement, veuillez vous reconnecter.')
            ->action('Gérer mon abonnement', route('subscription.show'))
            ->line('Merci pour votre compréhension.');
    }

    /**
     * Construit la représentation en base de données de la notification.
     *
     * @param  object  $notifiable  L'entité notifiable.
     * @return array<string, mixed>
     */
    public function toDatabase(object $notifiable): array
    {
        return [
            'tenant_id' => $this->tenant->id,
            'tenant_name' => $this->tenant->raison_sociale,
            'grace_until' => $this->graceUntil?->toIso8601String(),
            'message' => 'Votre subscription a été annulée.',
            'type' => 'subscription_canceled',
        ];
    }
}
