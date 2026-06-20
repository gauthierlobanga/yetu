<?php

namespace App\Http\Controllers\Vendor\Boutique\Ecommerce\Newsletter;

use App\Http\Controllers\Controller;
use App\Models\NewsletterSend;
use Illuminate\Http\Request;

class NewsletterTrackingController extends Controller
{
    public function trackOpen($send_id)
    {
        $send = NewsletterSend::with('campaign')->find($send_id);
        if ($send && ! $send->opened_at) {
            $send->opened_at = now();
            $send->status = 'ouvert';
            $send->save();

            if ($send->campaign) {
                $send->campaign->increment('total_ouverts');
            }
        }

        // Return a 1x1 transparent GIF
        return response(base64_decode('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'))
            ->header('Content-Type', 'image/gif');
    }

    public function trackClick(Request $request, $send_id)
    {
        $send = NewsletterSend::with('campaign')->find($send_id);
        $url = $request->query('url');

        if ($send && $url) {
            if (! $send->clicked_at) {
                $send->clicked_at = now();
                if ($send->status !== 'clique') {
                    $send->status = 'clique';
                    if ($send->campaign) {
                        $send->campaign->increment('total_clics');
                    }
                }
                $send->save();
            }

            return redirect()->away($url);
        }

        return redirect('/');
    }
}
