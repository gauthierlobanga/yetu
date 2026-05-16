<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use App\Services\TenantPropsService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class VendorSettingsController extends Controller
{
    /**
     * Affiche le formulaire des paramètres de la boutique.
     */
    public function edit(TenantPropsService $tenantProps)
    {
        $user = Auth::user();
        $tenant = $user->tenants()->wherePivot('is_owner', true)->first();

        if (! $tenant) {
            return redirect()->route('vendor.register')
                ->with('error', 'Vous nʼavez pas encore de boutique.');
        }

        return Inertia::render('Vendor/Settings', [
            'tenant' => $tenantProps->getTenantProps($tenant),
        ]);
    }

    /**
     * Met à jour les informations de la boutique.
     */
    public function update(Request $request)
    {
        $user = Auth::user();
        $tenant = $user->tenants()->wherePivot('is_owner', true)->firstOrFail();

        // Connexion vers la base centrale (ici 'pgsql', mais on peut la récupérer dynamiquement)
        $centralConnection = config('tenancy.database.central_connection', config('database.default'));

        $validated = $request->validate([
            'raison_sociale' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:500'],
            'email' => [
                'required',
                'email',
                'max:255',
                function ($attribute, $value, $fail) use ($tenant, $centralConnection) {
                    $exists = DB::connection($centralConnection)
                        ->table('tenants')
                        ->where('email', $value)
                        ->where('id', '<>', $tenant->id)
                        ->exists();

                    if ($exists) {
                        $fail('Cet email est déjà utilisé par une autre boutique.');
                    }
                },
            ],
            'telephone' => ['nullable', 'string', 'max:30'],
            'logo' => ['nullable', 'image', 'mimes:jpeg,png,webp', 'max:2048'],
            'facebook_url' => ['nullable', 'url', 'max:255'],
            'instagram_url' => ['nullable', 'url', 'max:255'],
            'twitter_url' => ['nullable', 'url', 'max:255'],
            'youtube_url' => ['nullable', 'url', 'max:255'],
            'tiktok_url' => ['nullable', 'url', 'max:255'],
        ]);

        $tenant->raison_sociale = $validated['raison_sociale'];
        $tenant->description = $validated['description'];
        $tenant->email = $validated['email'];
        $tenant->telephone = $validated['telephone'];

        $tenant->setConfiguration('facebook_url', $validated['facebook_url']);
        $tenant->setConfiguration('instagram_url', $validated['instagram_url']);
        $tenant->setConfiguration('twitter_url', $validated['twitter_url']);
        $tenant->setConfiguration('youtube_url', $validated['youtube_url']);
        $tenant->setConfiguration('tiktok_url', $validated['tiktok_url']);

        if ($request->hasFile('logo')) {
            $tenant->addMediaFromRequest('logo')->toMediaCollection('tenant_avatar');
        }

        $tenant->save();

        return Redirect::route('vendor.settings')->with('success', 'Paramètres mis à jour avec succès.');
    }
}
