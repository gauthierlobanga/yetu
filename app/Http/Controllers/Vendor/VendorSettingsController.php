<?php

namespace App\Http\Controllers\vendor;

use App\Http\Controllers\Controller;
use App\Services\VendorRegistrationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class VendorSettingsController extends Controller
{
    /**
     * Affiche le formulaire des paramètres de la boutique.
     */
    public function edit()
    {
        $user = Auth::user();
        $tenant = $user->tenants()->wherePivot('is_owner', true)->first();

        if (! $tenant) {
            return redirect()->route('vendor.register')
                ->with('error', 'Vous nʼavez pas encore de boutique.');
        }

        return Inertia::render('Vendor/Settings', [
            'tenant' => [
                'id' => $tenant->id,
                'raison_sociale' => $tenant->raison_sociale,
                'slug' => $tenant->slug,
                'description' => $tenant->description,
                'email' => $tenant->email,
                'telephone' => $tenant->telephone,
                'logo_url' => $tenant->getFirstMediaUrl('tenant_avatar', 'medium') ?: null,
                'facebook_url' => $tenant->getConfiguration('facebook_url'),
                'instagram_url' => $tenant->getConfiguration('instagram_url'),
                'twitter_url' => $tenant->getConfiguration('twitter_url'),
                'youtube_url' => $tenant->getConfiguration('youtube_url'),
                'tiktok_url' => $tenant->getConfiguration('tiktok_url'),
                'admin_url' => app(VendorRegistrationService::class)->getVendeurUrl($tenant),
                'url' => app(VendorRegistrationService::class)->getShopUrl($tenant),
                'is_active' => $tenant->is_active,
                'plan' => $tenant->plan ? [
                    'name' => $tenant->plan->name,
                    'price' => $tenant->plan->price,
                    'currency' => $tenant->plan->currency,
                ] : null,
            ],
        ]);
    }

    /**
     * Met à jour les informations de la boutique.
     */
    public function update(Request $request)
    {
        $user = Auth::user();
        $tenant = $user->tenants()->wherePivot('is_owner', true)->firstOrFail();

        $validated = $request->validate([
            'raison_sociale' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:500'],
            'email' => ['required', 'email', 'max:255', Rule::unique('tenants', 'email')->ignore($tenant->id)],
            'telephone' => ['nullable', 'string', 'max:30'],
            'logo' => ['nullable', 'image', 'mimes:jpeg,png,webp', 'max:2048'],
            'facebook_url' => ['nullable', 'url', 'max:255'],
            'instagram_url' => ['nullable', 'url', 'max:255'],
            'twitter_url' => ['nullable', 'url', 'max:255'],
            'youtube_url' => ['nullable', 'url', 'max:255'],
            'tiktok_url' => ['nullable', 'url', 'max:255'],
        ]);

        // Mise à jour du tenant
        $tenant->raison_sociale = $validated['raison_sociale'];
        $tenant->description = $validated['description'];
        $tenant->email = $validated['email'];
        $tenant->telephone = $validated['telephone'];

        // Sauvegarde des URLs réseaux dans la colonne "configuration"
        $tenant->setConfiguration('facebook_url', $validated['facebook_url']);
        $tenant->setConfiguration('instagram_url', $validated['instagram_url']);
        $tenant->setConfiguration('twitter_url', $validated['twitter_url']);
        $tenant->setConfiguration('youtube_url', $validated['youtube_url']);
        $tenant->setConfiguration('tiktok_url', $validated['tiktok_url']);

        // Gestion du logo (Spatie Media Library)
        if ($request->hasFile('logo')) {
            $tenant->addMediaFromRequest('logo')
                ->toMediaCollection('tenant_avatar');
        }

        $tenant->save();

        return Redirect::route('vendor.settings')->with('success', 'Paramètres mis à jour avec succès.');
    }
}
