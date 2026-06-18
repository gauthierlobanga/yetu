<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Tenant;
use App\Services\VendorRegistrationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

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
        if (! $token) {
            Log::warning('SSO login: no token provided', ['tenant' => $tenant->id]);

            return redirect()->route('tenant.login')
                ->with('error', 'Lien de connexion manquant. Veuillez vous reconnecter.');
        }

        $user = $service->handleSsoLogin($token, $tenant);
        if (! $user) {
            Log::warning('SSO login: invalid or expired token', ['tenant' => $tenant->id]);

            return redirect()->route('tenant.login')
                ->with('error', 'Votre lien de connexion a expiré. Veuillez vous reconnecter.');
        }

        // Vérification d'abonnement: ne bloquer l'absence d'abonnement qu'après l'essai.
        $subscription = $tenant->subscription;
        if (! $subscription && $tenant->isTrialExpired()) {
            return redirect()->route('tenant.subscription.none');
        }

        if ($subscription && ! $subscription->isActive() && ! $subscription->isGracePeriodActive()) {
            return redirect()->route('tenant.subscription.required');
        }

        Auth::login($user);
        $request->session()->regenerate();

        return redirect()->to($service->getVendeurDashboardUrl($tenant));
    }
}
