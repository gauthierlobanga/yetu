<?php

namespace App\Mail;

use App\Models\NewsletterCampaign;
use App\Models\NewsletterSend;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class CampaignMailable extends Mailable
{
    use Queueable, SerializesModels;

    public $campaign;
    public $send;

    public function __construct(NewsletterCampaign $campaign, NewsletterSend $send)
    {
        $this->campaign = $campaign;
        $this->send = $send;
    }

    public function build()
    {
        $trackingPixel = route('tenant.newsletter.track.open', ['send_id' => $this->send->id]);
        
        // Wrap links? (For a full implementation, you'd parse DOM and replace hrefs)
        // For simplicity, we just append tracking pixel.
        $htmlContent = $this->campaign->contenu_html;
        $htmlContent .= '<img src="' . $trackingPixel . '" width="1" height="1" style="display:none;" />';

        // Remplace tags variables like {{prenom}}
        if ($this->send->subscriber) {
            $htmlContent = str_replace('{{prenom}}', $this->send->subscriber->prenom ?? '', $htmlContent);
            $htmlContent = str_replace('{{nom}}', $this->send->subscriber->nom ?? '', $htmlContent);
        }

        return $this->subject($this->campaign->sujet)
                    ->html($htmlContent);
    }
}
