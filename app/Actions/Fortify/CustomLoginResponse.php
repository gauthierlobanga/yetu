<?php

namespace App\Actions\Fortify;

use App\Models\Client;
use App\Models\Tenant;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Contracts\LoginResponse;

class CustomLoginResponse implements LoginResponse
{
    public function toResponse($request)
    {
        $user = $request->user();

        // Domaine central
        if ($this->isCentralDomain($request->getHost())) {
            // Si l'utilisateur a au moins un tenant, rediriger vers la sélection de compte
            if ($user && $this->getUserTenant($user)) {
                return redirect()->route('central.account-selection.index');
            }

            // Si c'est un super admin, rediriger vers le tableau de bord admin
            if ($user?->hasRole('super_admin') && Route::has('filament.admin.pages.dashboard')) {
                return redirect()->route('filament.admin.pages.dashboard');
            }

            // Sinon, rediriger vers l'inscription vendeur
            return redirect()->route('vendor.register');
        }

        // Domaine tenant - vérifier si l'utilisateur peut accéder au dashboard vendeur
        if ($user && $this->canUseTenantDashboard($user)) {
            return redirect()->to('/vendor/dashboard');
        }

        // Créer un client tenant si nécessaire
        $this->ensureTenantClient($user);

        // Rediriger vers le tableau de bord acheteur
        return redirect()->route('acheteur.dashboard');
    }

    private function isCentralDomain(string $host): bool
    {
        return in_array($host, config('tenancy.central_domains', []), true);
    }

    private function getUserTenant($user): ?Tenant
    {
        return $user->tenants()
            ->where('tenants.statut', Tenant::STATUT_ACTIF)
            ->where('tenants.is_active', true)
            ->orderByDesc('user_tenant.is_owner')
            ->first();
    }

    private function canUseTenantDashboard($user): bool
    {
        // Vérifier que le contexte tenant est initialisé
        if (! function_exists('tenant') || ! tenant()) {
            return false;
        }

        // Les super admins peuvent accéder au dashboard
        if ($user->hasRole('super_admin')) {
            return true;
        }

        // Vérifier si l'utilisateur est propriétaire du tenant actuel
        // Utiliser la connection centrale pour la table pivot
        $centralConnection = config('tenancy.database.central_connection', config('database.default'));

        return DB::connection($centralConnection)
            ->table('user_tenant')
            ->where('user_id', $user->id)
            ->where('tenant_id', tenant()->id)
            ->where('is_owner', true)
            ->exists();
    }

    private function ensureTenantClient($user): void
    {
        // Ne créer un client que si le contexte tenant est initialisé
        if (! $user || ! function_exists('tenancy') || ! tenancy()->initialized) {
            return;
        }

        Client::firstOrCreate(
            ['user_id' => $user->id],
            [
                'nom' => $user->name,
                'email' => $user->email,
                'statut' => Client::STATUT_ACTIF,
                'source' => 'connexion',
            ]
        );
    }
}
