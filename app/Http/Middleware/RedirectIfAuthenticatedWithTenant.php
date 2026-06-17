<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class RedirectIfAuthenticatedWithTenant
{
    public function handle(Request $request, Closure $next, ...$guards)
    {
        if (Auth::check()) {
            $user = Auth::user();

            if (function_exists('tenancy') && tenancy()->initialized) {
                if ($user && ($user->hasRole('super_admin') || $this->userOwnsCurrentTenant($user->id))) {
                    return redirect()->to('/vendor/dashboard');
                }

                return redirect()->route('acheteur.dashboard');
            }

            if ($user && $user->hasRole('super_admin')) {
                return redirect()->route('filament.admin.pages.dashboard');
            }

            if ($user && $user->tenants()->wherePivot('is_owner', true)->exists()) {
                return redirect()->route('central.account-selection.index');
            }

            return redirect()->route('plan.index');
        }

        return $next($request);
    }

    protected function userOwnsCurrentTenant(string $userId): bool
    {
        $tenant = tenant();

        if (! $tenant) {
            return false;
        }

        return DB::connection(config('tenancy.database.central_connection', 'central'))
            ->table('user_tenant')
            ->where('tenant_id', $tenant->id)
            ->where('user_id', $userId)
            ->where('is_owner', true)
            ->exists();
    }
}
