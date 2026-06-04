<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Tenant;
use App\Services\VendorRegistrationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TenantSsoLoginController extends Controller
{
    public function __invoke(Request $request, VendorRegistrationService $service)
    {
        // Déterminer le tenant : soit par sous-domaine, soit par paramètre tenant_id
        $tenant = tenant();
        if (! $tenant && $request->has('tenant_id')) {
            $tenant = Tenant::find($request->query('tenant_id'));
            if ($tenant && ! tenancy()->initialized) {
                tenancy()->initialize($tenant);
            }
        }
        abort_unless($tenant, 404);

        $token = $request->query('token');
        abort_unless($token, 403);

        $user = $service->handleSsoLogin($token, $tenant);
        abort_unless($user, 403);

        // Vérification d'abonnement: évite les accès 403 pour les tenants sans abonnement
        // En les redirigeant plutôt vers une page d'information professionnelle
        $subscription = $tenant->subscription;
        if (! $subscription || ! $subscription->isActive()) {
            // Rediriger vers la page d'absence d'abonnement au lieu de 403
            return redirect()->route('tenant.subscription.none');
        }

        Auth::login($user);
        $request->session()->regenerate();

        return redirect()->to($service->getVendeurDashboardUrl($tenant));
    }
}
