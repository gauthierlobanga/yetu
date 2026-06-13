<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureTenantSubscription
{
    /**
     * Handle incoming request.
     * Ensures tenant has an active or valid subscription.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $tenant = tenant();

        if (! $tenant) {
            return $next($request);
        }

        $subscription = $tenant->subscription;

        // No subscription found
        if (! $subscription) {
            if (! $tenant->isTrialExpired()) {
                return $next($request);
            }

            return redirect()->route('tenant.subscription.none')
                ->with('error', 'Votre période d\'essai a expiré. Veuillez choisir un plan.');
        }

        // Subscription is active (paid or free plan)
        if ($subscription->isActive()) {
            return $next($request);
        }

        // Trial has expired, no payment made, and no grace period - show "Required" page
        if (
            $subscription->trial_ends_at &&
            now() > $subscription->trial_ends_at &&
            $subscription->stripe_status !== 'active' &&
            ! $subscription->isGracePeriodActive()
        ) {
            return redirect()->route('tenant.subscription.required')
                ->with('error', 'Votre période d\'essai a expiré. Veuillez choisir un plan.');
        }

        // Subscription is within grace period (after trial ends or after cancellation)
        if ($subscription->isGracePeriodActive()) {
            // Warn the user but allow access
            $request->session()->flash('warning',
                'Votre subscription a expiré. Vous avez accès jusqu\'au '.
                $subscription->grace_period_ends_at->format('d/m/Y')
            );

            return $next($request);
        }

        // Subscription is expired and grace period is over - block access
        return redirect()->route('tenant.subscription.required')
            ->with('error', 'Votre subscription a expiré. Votre accès a été bloqué.');
    }
}
