<?php

namespace App\Http\Controllers\Vendor\Boutique\Ecommerce\Newsletter;

use App\Http\Controllers\Controller;
use App\Jobs\ProcessNewsletterCampaign;
use App\Mail\CampaignMailable;
use App\Models\NewsletterCampaign;
use App\Models\NewsletterSend;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Inertia\Inertia;

class NewsletterCampaignController extends Controller
{
    public function index()
    {
        // On suppose que l'utilisateur est authentifié et on filtre par cree_par si nécessaire
        $campaigns = NewsletterCampaign::orderBy('created_at', 'desc')->paginate(15);

        return Inertia::render('Vendor/pages/newsletters/Campaigns/Index', [
            'campaigns' => $campaigns,
        ]);
    }

    public function create()
    {
        return Inertia::render('Vendor/pages/newsletters/Campaigns/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'titre' => 'required|string|max:255',
            'sujet' => 'required|string|max:255',
            'contenu_html' => 'required|string',
            'contenu_text' => 'nullable|string',
            'segments_cibles' => 'nullable|array',
            'scheduled_at' => 'nullable|date',
            'status' => 'required|in:brouillon,programme,envoye',
        ]);

        $validated['cree_par'] = auth()->id();

        $campaign = NewsletterCampaign::create($validated);

        if ($campaign->status === 'programme' || $campaign->status === 'envoye') {
            // Nous déclenchons le Job pour traiter la campagne
            if (class_exists(ProcessNewsletterCampaign::class)) {
                $delay = $campaign->scheduled_at ? Carbon::parse($campaign->scheduled_at) : now();
                ProcessNewsletterCampaign::dispatch($campaign)->delay($delay);
            }
        }

        return redirect()->back() // Or redirect()->route('tenant.newsletter.campaigns.index')
            ->with('success', 'Campagne créée avec succès.');
    }

    public function show($id)
    {
        $campaign = NewsletterCampaign::findOrFail($id);

        // Load recent sends using the relationship defined in NewsletterCampaign
        $sends = $campaign->envois()->latest()->take(10)->get();

        return Inertia::render('Vendor/pages/newsletters/Campaigns/Show', [
            'campaign' => $campaign,
            'recentSends' => $sends,
        ]);
    }

    public function edit($id)
    {
        $campaign = NewsletterCampaign::findOrFail($id);

        return Inertia::render('Vendor/pages/newsletters/Campaigns/Edit', [
            'campaign' => $campaign,
        ]);
    }

    public function update(Request $request, $id)
    {
        $campaign = NewsletterCampaign::findOrFail($id);

        if ($campaign->status === 'envoye') {
            return redirect()->back()->with('error', 'Vous ne pouvez pas modifier une campagne déjà envoyée.');
        }

        $validated = $request->validate([
            'titre' => 'required|string|max:255',
            'sujet' => 'required|string|max:255',
            'contenu_html' => 'required|string',
            'contenu_text' => 'nullable|string',
            'segments_cibles' => 'nullable|array',
            'scheduled_at' => 'nullable|date',
            'status' => 'required|in:brouillon,programme,envoye',
        ]);

        $campaign->update($validated);

        if ($campaign->status === 'programme' || $campaign->status === 'envoye') {
            // Re-dispatch if scheduled or sent. In reality, we might want to cancel old jobs,
            // but for simplicity, we dispatch again.
            if (class_exists(ProcessNewsletterCampaign::class)) {
                $delay = $campaign->scheduled_at ? Carbon::parse($campaign->scheduled_at) : now();
                ProcessNewsletterCampaign::dispatch($campaign)->delay($delay);
            }
        }

        return redirect()->back()->with('success', 'Campagne mise à jour avec succès.');
    }

    public function destroy($id)
    {
        $campaign = NewsletterCampaign::findOrFail($id);

        if ($campaign->status === 'envoye') {
            return redirect()->back()->with('error', 'Impossible de supprimer une campagne envoyée.');
        }

        $campaign->delete();

        return redirect()->back()->with('success', 'Campagne supprimée avec succès.');
    }

    public function sendTest(Request $request, $id)
    {
        $request->validate(['email' => 'required|email']);
        $campaign = NewsletterCampaign::findOrFail($id);

        $send = new NewsletterSend;
        $send->id = Str::uuid();
        $send->campaign_id = $campaign->id;

        try {
            Mail::to($request->email)
                ->send(new CampaignMailable($campaign, $send));

            return redirect()->back()->with('success', 'Email de test envoyé avec succès à '.$request->email);
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Erreur lors de l\'envoi : '.$e->getMessage());
        }
    }
}
