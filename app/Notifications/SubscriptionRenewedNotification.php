<?php

namespace App\Notifications;

use App\Models\Tenant;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Carbon;

/**
 * Notification confirmant le renouvellement réussi d'un abonnement tenant.
 *
 * Envoie un récapitulatif de la nouvelle date d'échéance au vendeur.
 */
class SubscriptionRenewedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Crée une nouvelle instance de la notification.
     *
     * @param  Tenant  $tenant  Le tenant dont l'abonnement a été renouvelé.
     * @param  Carbon|null  $renewedUntil  La nouvelle date limite de l'abonnement.
     */
    public function __construct(
        private readonly Tenant $tenant,
        private readonly ?Carbon $renewedUntil = null,
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
            ->subject("Subscription renouvelée - {$this->tenant->raison_sociale}")
            ->greeting("Bonjour {$notifiable->name},")
            ->line("Votre subscription pour **{$this->tenant->raison_sociale}** a été renouvelée avec succès!")
            ->line("Votre accès est valide jusqu'au {$this->renewedUntil?->format('d/m/Y')}.")
            ->action('Accéder à mon dashboard', route('vendor.dashboard'))
            ->line('Merci de votre confiance!');
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
            'renewed_until' => $this->renewedUntil?->toIso8601String(),
            'message' => 'Votre subscription a été renouvelée avec succès!',
            'type' => 'subscription_renewed',
        ];
    }
}
