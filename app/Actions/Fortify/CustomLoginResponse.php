<?php

namespace App\Actions\Fortify;

use App\Models\Tenant;
use App\Services\VendorRegistrationService;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Contracts\LoginResponse;

class CustomLoginResponse implements LoginResponse
{
    public function toResponse($request)
    {
        $user = $request->user();

        if ($this->isCentralDomain($request->getHost())) {
            if ($user && $tenant = $this->getUserTenant($user)) {
                return redirect()->away(app(VendorRegistrationService::class)->getVendeurUrl($tenant));
            }

            if ($user?->hasRole('super_admin') && Route::has('filament.admin.pages.dashboard')) {
                return redirect()->intended(route('filament.admin.pages.dashboard'));
            }

            return redirect()->intended(route('vendor.register'));
        }

        if ($user && $this->canUseTenantDashboard($user)) {
            return redirect()->intended('/vendeur');
        }

        return redirect()->intended('/account');
    }

    private function isCentralDomain(string $host): bool
    {
        return in_array($host, config('tenancy.central_domains', []), true);
    }

    private function getUserTenant($user): ?Tenant
    {
        return $user->tenants()
            ->where('statut', Tenant::STATUT_ACTIF)
            ->where('is_active', true)
            ->orderByDesc('user_tenant.is_owner')
            ->first();
    }

    private function canUseTenantDashboard($user): bool
    {
        if ($user->hasRole(['super_admin', 'Manager', 'owner', 'manager'])) {
            return true;
        }

        if (! function_exists('tenant') || ! tenant()) {
            return false;
        }

        try {
            return $user->canAccessTenant(tenant());
        } catch (\Throwable) {
            return false;
        }
    }
}
