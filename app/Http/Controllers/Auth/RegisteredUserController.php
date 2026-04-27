<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Client;
use App\Models\Tenant;
use App\Models\User;
use App\Support\Tenancy\TenantContext;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    public function create(): Response
    {
        $tenant = app(TenantContext::class)->current();

        return Inertia::render('Auth/Register', [
            'tenant' => $tenant ? [
                'id' => $tenant->id,
                'raison_sociale' => $tenant->raison_sociale,
                'slug' => $tenant->slug,
                'logo' => $tenant->getFilamentAvatarUrl(),
            ] : null,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $tenant = app(TenantContext::class)->current();

        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'is_active' => true,
            'email_verifie' => false,
        ]);

        // Si on est sur le sous‑domaine d'un tenant
        if ($tenant) {
            // Lier l'utilisateur au tenant
            $user->tenants()->attach($tenant->id);

            // Créer automatiquement un profil client
            Client::firstOrCreate(
                [
                    'user_id' => $user->id,
                    'tenant_id' => $tenant->id,
                ],
                [
                    'email' => $user->email,
                    'nom' => $request->name,
                    'type' => Client::TYPE_PARTICULIER,
                    'statut' => Client::STATUT_ACTIF,
                    'source' => Client::SOURCE_DIRECT,
                    'date_derniere_connexion' => now(),
                ]
            );

            // Définir le tenant dans la session
            session(['tenant_id' => $tenant->id]);
        }

        event(new Registered($user));

        Auth::login($user);

        // Redirection contextuelle
        return redirect($this->redirectAfterRegistration($tenant));
    }

    /**
     * Détermine où rediriger après inscription.
     */
    private function redirectAfterRegistration(?Tenant $tenant): string
    {
        if ($tenant) {
            // Sur une boutique spécifique → dashboard de la boutique
            return $this->getTenantHomeUrl($tenant);
        }

        // Sur la plateforme générale → page de choix de boutique
        return route('home');
    }

    private function getTenantHomeUrl(Tenant $tenant): string
    {
        return 'https://'.$tenant->slug.'.'.config('app.domain');
    }
}
