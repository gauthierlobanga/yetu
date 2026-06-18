<?php

namespace App\Notifications;

use App\Models\Tenant;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

/**
 * Notification envoyée suite à l'échec d'un paiement (ex: renouvellement d'abonnement).
 *
 * Alerte le locataire (tenant) pour qu'il mette à jour son moyen de paiement.
 */
class PaymentFailedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Crée une nouvelle instance de la notification.
     *
     * @param  Tenant  $tenant  Le tenant concerné par l'échec de paiement.
     * @param  string  $errorMessage  Le message d'erreur associé à l'échec.
     */
    public function __construct(
        private readonly Tenant $tenant,
        private readonly string $errorMessage,
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
            ->subject("Paiement échoué pour {$this->tenant->raison_sociale}")
            ->greeting("Bonjour {$notifiable->name},")
            ->line('Le paiement de votre subscription a échoué.')
            ->line("**Erreur:** {$this->errorMessage}")
            ->line('Veuillez mettre à jour votre méthode de paiement.')
            ->action('Gérer mon abonnement', route('subscription.show'))
            ->line('Si le problème persiste, veuillez contacter notre support.');
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
            'error_message' => $this->errorMessage,
            'message' => 'Paiement échoué. Veuillez mettre à jour votre méthode de paiement.',
            'type' => 'payment_failed',
        ];
    }
}
