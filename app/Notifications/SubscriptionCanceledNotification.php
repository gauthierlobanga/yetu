<?php

namespace App\Notifications;

use App\Models\Tenant;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Carbon;

class SubscriptionCanceledNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        private readonly Tenant $tenant,
        private readonly ?Carbon $graceUntil = null,
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

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
