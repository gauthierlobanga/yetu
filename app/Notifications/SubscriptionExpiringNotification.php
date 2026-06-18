<?php

namespace App\Notifications;

use App\Models\Tenant;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Carbon;

/**
 * Notification prévenant de l'expiration imminente d'un abonnement tenant.
 *
 * Incite le vendeur à renouveler son offre ou à passer à un plan payant
 * s'il est en fin de période d'essai.
 */
class SubscriptionExpiringNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Crée une nouvelle instance de la notification.
     *
     * @param  Tenant  $tenant  Le tenant concerné.
     * @param  Carbon|null  $expiresAt  La date d'expiration prévue.
     */
    public function __construct(
        private readonly Tenant $tenant,
        private readonly ?Carbon $expiresAt = null,
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
        if ($this->expiresAt?->isPast()) {
            return (new MailMessage)
                ->subject("Passez à un plan payant pour '{$this->tenant->raison_sociale}'")
                ->greeting("Bonjour {$notifiable->name},")
                ->line("La période d'essai de votre boutique **{$this->tenant->raison_sociale}** est terminée.")
                ->line('Votre boutique reste créée. Choisissez un plan payant pour continuer avec les fonctionnalités avancées.')
                ->action('Gérer mon abonnement', route('subscription.show'))
                ->line('Merci d\'avoir utilisé notre plateforme!');
        }

        $daysLeft = $this->expiresAt?->diffInDays(now());

        return (new MailMessage)
            ->subject("Votre subscription '{$this->tenant->raison_sociale}' expire bientôt")
            ->greeting("Bonjour {$notifiable->name},")
            ->line("Votre subscription pour la boutique **{$this->tenant->raison_sociale}** expire dans {$daysLeft} jour(s).")
            ->line("Après cette date, votre accès sera bloqué si vous n'avez pas renouvelé votre abonnement.")
            ->action('Gérer mon abonnement', route('subscription.show'))
            ->line('Merci d\'avoir utilisé notre plateforme!');
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
            'expires_at' => $this->expiresAt?->toIso8601String(),
            'message' => $this->expiresAt?->isPast()
                ? 'Votre période d\'essai est terminée. Passez à un plan payant.'
                : 'Votre subscription expire dans 7 jours.',
            'type' => 'subscription_expiring',
        ];
    }
}
