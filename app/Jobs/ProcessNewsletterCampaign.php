<?php

namespace App\Jobs;

use App\Models\Newsletter;
use App\Models\NewsletterCampaign;
use App\Models\NewsletterSend;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class ProcessNewsletterCampaign implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $campaign;

    public function __construct(NewsletterCampaign $campaign)
    {
        $this->campaign = $campaign;
    }

    public function handle()
    {
        // Don't process if cancelled
        if ($this->campaign->status === 'annule') {
            return;
        }

        // Marquer la campagne comme envoyée en cours (ou juste envoyé)
        $this->campaign->status = 'envoye';
        if (! $this->campaign->sent_at) {
            $this->campaign->sent_at = now();
        }
        $this->campaign->save();

        // Construire la requête pour les abonnés
        $query = Newsletter::actifs();

        // Appliquer la segmentation d'audience
        if (! empty($this->campaign->segments_cibles)) {
            $segments = $this->campaign->segments_cibles;

            // Filtrer par source d'inscription
            if (! empty($segments['source'])) {
                $query->where('source', $segments['source']);
            }

            // Filtrer par date d'inscription
            if (! empty($segments['date_after'])) {
                $query->where('created_at', '>=', $segments['date_after']);
            }
            if (! empty($segments['date_before'])) {
                $query->where('created_at', '<=', $segments['date_before']);
            }
        }

        $subscribers = $query->get();
        foreach ($subscribers as $subscriber) {
            // Créer le send tracking record
            $send = NewsletterSend::create([
                'campaign_id' => $this->campaign->id,
                'newsletter_id' => $subscriber->id,
                'email' => $subscriber->email,
                'status' => 'envoye',
            ]);

            // Dispatcher le job individuel pour éviter les time-out sur de grandes listes
            SendIndividualNewsletter::dispatch($this->campaign, $send, $subscriber);

            // Increment compteur localement
            $this->campaign->increment('total_envoyes');
        }
    }
}
