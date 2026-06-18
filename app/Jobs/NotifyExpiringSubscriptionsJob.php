<?php

namespace App\Jobs;

use App\Services\SubscriptionService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

/**
 * Job responsable de la notification des abonnements expirant prochainement.
 *
 * Ce job utilise le service d'abonnement pour envoyer des rappels
 * aux utilisateurs dont l'abonnement expire bientôt.
 */
class NotifyExpiringSubscriptionsJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Exécute le job.
     *
     * @param  SubscriptionService  $subscriptionService  Le service gérant les abonnements.
     */
    public function handle(SubscriptionService $subscriptionService): void
    {
        try {
            // Send notifications for subscriptions expiring in 7 days
            $notified = $subscriptionService->notifyExpiringSubscriptions();

            Log::info('Expiring subscriptions notifications sent', [
                'count' => $notified->count(),
            ]);
        } catch (\Exception $e) {
            Log::error('Error notifying expiring subscriptions', [
                'error' => $e->getMessage(),
            ]);

            // Retry the job
            $this->release(delay: 300); // Retry after 5 minutes
        }
    }
}
