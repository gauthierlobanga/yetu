<?php

namespace App\Jobs;

use App\Mail\CampaignMailable;
use App\Models\Newsletter;
use App\Models\NewsletterCampaign;
use App\Models\NewsletterSend;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SendIndividualNewsletter implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $campaign;

    public $send;

    public $subscriber;

    public function __construct(NewsletterCampaign $campaign, NewsletterSend $send, Newsletter $subscriber)
    {
        $this->campaign = $campaign;
        $this->send = $send;
        $this->subscriber = $subscriber;
    }

    public function handle()
    {
        try {
            Mail::to($this->subscriber->email)->send(new CampaignMailable($this->campaign, $this->send));
        } catch (\Exception $e) {
            $this->send->status = 'erreur';
            $this->send->metadata = ['error' => $e->getMessage()];
            $this->send->save();
        }
    }
}
