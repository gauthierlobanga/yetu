<?php

namespace App\Jobs;

use App\Models\Subscription;
use App\Notifications\SubscriptionRenewedNotification;
use App\Services\SubscriptionService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;

/**
 * Job responsable du renouvellement d'un abonnement.
 *
 * Ce job vérifie si l'abonnement est configuré pour un renouvellement automatique,
 * effectue le renouvellement via le service dédié, et notifie l'utilisateur.
 */
class RenewSubscriptionJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Crée une nouvelle instance du job.
     *
     * @param  Subscription  $subscription  L'abonnement à renouveler.
     */
    public function __construct(
        private readonly Subscription $subscription
    ) {}

    /**
     * Exécute le job.
     *
     * @param  SubscriptionService  $subscriptionService  Le service gérant les abonnements.
     */
    public function handle(SubscriptionService $subscriptionService): void
    {
        try {
            // Check if auto-renewal is enabled
            if (! $this->subscription->auto_renewal) {
                Log::info('Subscription auto-renewal disabled', [
                    'subscription_id' => $this->subscription->id,
                ]);

                return;
            }

            // Renew the subscription
            $renewed = $subscriptionService->renewSubscription($this->subscription);

            // Notify user
            if ($renewed->user) {
                Notification::send($renewed->user, new SubscriptionRenewedNotification(
                    $renewed->tenant,
                    $renewed->current_period_end
                ));
            }

            Log::info('Subscription renewed successfully', [
                'subscription_id' => $this->subscription->id,
                'tenant_id' => $this->subscription->tenant_id,
                'new_period_end' => $renewed->current_period_end,
            ]);
        } catch (\Exception $e) {
            Log::error('Error renewing subscription', [
                'subscription_id' => $this->subscription->id,
                'error' => $e->getMessage(),
            ]);

            // Retry the job
            $this->release(delay: 60); // Retry after 60 seconds
        }
    }
}
