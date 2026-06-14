<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileDeleteRequest;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Show the user's profile settings page.
     */
    public function edit(Request $request): Response
    {
        $request->user()->load(['client', 'adresses']); // charge les relations

        return Inertia::render('settings/profile', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    // public function update(ProfileUpdateRequest $request): RedirectResponse
    // {
    //     $validated = $request->validated();

    //     unset($validated['avatar']);

    //     $request->user()->fill($validated);

    //     if ($request->user()->isDirty('email')) {
    //         $request->user()->email_verified_at = null;

    //         if (Schema::hasColumn($request->user()->getTable(), 'email_verifie')) {
    //             $request->user()->email_verifie = false;
    //         }
    //     }

    //     $request->user()->save();

    //     if ($request->hasFile('avatar')) {
    //         $request->user()
    //             ->addMediaFromRequest('avatar')
    //             ->toMediaCollection('avatar');

    //         $request->user()->forceFill([
    //             'avatar' => $request->user()->avatar_url,
    //         ])->save();
    //     }

    //     // Redirige dynamiquement vers le profil acheteur si on est dans le contexte d'un tenant.
    //     if (Route::has('acheteur.profile.edit')) {
    //         return to_route('acheteur.profile.edit');
    //     }

    //     return to_route('profile.edit');
    // }
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $user = $request->user();

        // Remplir les colonnes directes (name, email)
        unset($validated['avatar']);
        $user->fill($validated);

        // Si l'email change, réinitialiser la vérification
        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
            if (Schema::hasColumn($user->getTable(), 'email_verifie')) {
                $user->email_verifie = false;
            }
        }

        // Sauvegarde des préférences (phone, city, country, locale, currency, notifications)
        $preferences = $user->preferences ?? [];
        $preferenceFields = ['phone', 'city', 'country', 'locale', 'currency', 'notifications_email', 'notifications_offers'];
        foreach ($preferenceFields as $field) {
            if ($request->has($field)) {
                $preferences[$field] = $request->input($field);
            }
        }
        $user->preferences = $preferences;

        $user->save();

        // Gestion de l'avatar
        if ($request->hasFile('avatar')) {
            $user->addMediaFromRequest('avatar')->toMediaCollection('avatar');
            $user->forceFill(['avatar' => $user->avatar_url])->save();
        }

        // Redirection
        if (Route::has('acheteur.profile.edit')) {
            return to_route('acheteur.profile.edit');
        }

        return to_route('profile.edit');
    }

    /**
     * Delete the user's profile.
     */
    public function destroy(ProfileDeleteRequest $request): RedirectResponse
    {
        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        // Redirige dynamiquement vers l'accueil de la boutique si on est dans le contexte d'un tenant, sinon vers l'accueil général.
        if (Route::has('tenant.home')) {
            return to_route('tenant.home');
        }

        return to_route('home');
    }
}
