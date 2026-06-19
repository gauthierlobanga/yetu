<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class ProcessScheduledCampaigns extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'newsletter:process-scheduled';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Process scheduled newsletter campaigns whose scheduled_at time has passed.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $campaigns = \App\Models\NewsletterCampaign::where('status', 'programme')
            ->whereNotNull('scheduled_at')
            ->where('scheduled_at', '<=', now())
            ->get();

        if ($campaigns->isEmpty()) {
            $this->info('No scheduled campaigns to process at this time.');
            return;
        }

        foreach ($campaigns as $campaign) {
            $this->info("Dispatching campaign ID: {$campaign->id}");
            // ProcessNewsletterCampaign marks it as "envoye", so it won't be processed again
            \App\Jobs\ProcessNewsletterCampaign::dispatch($campaign);
        }

        $this->info("Successfully processed {$campaigns->count()} campaigns.");
    }
}
