<?php

namespace App\Providers;

use App\Models\Client;
use App\Models\Commande;
use App\Models\ItemPanier;
use App\Models\MouvementStock;
use App\Models\Paiement;
use App\Models\Panier;
use App\Models\Produit;
use App\Models\Promotion;
use App\Models\Retour;
use App\Models\VendorRequest;
use App\Observers\TenantRealtimeActivityObserver;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\View;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;
use Stancl\Tenancy\Events\TenancyInitialized;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureDefaults();
        $this->registerTenantRealtimeObservers();
        View::addNamespace('layouts', resource_path('views/layouts'));

        // Event::listen(TenancyInitialized::class, function ($event) {
        //     $tenant = $event->tenancy->tenant;
        //     Log::info('TenancyInitialized', [
        //         'tenant_id' => optional($tenant)->id,
        //         'slug' => optional($tenant)->slug,
        //         'is_active' => optional($tenant)->is_active,
        //         'statut' => optional($tenant)->statut,
        //         'vendor_approved' => optional($tenant)->vendorRequest()?->where('status', VendorRequest::STATUS_APPROVED)->exists(),
        //     ]);
        //     if ($tenant && ! $tenant->isAccessible()) {
        //         abort(404);
        //     }
        // });

    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null,
        );
    }

    protected function registerTenantRealtimeObservers(): void
    {
        $observer = TenantRealtimeActivityObserver::class;

        Commande::observe($observer);
        Paiement::observe($observer);
        Produit::observe($observer);
        Promotion::observe($observer);
        Client::observe($observer);
        Panier::observe($observer);
        ItemPanier::observe($observer);
        Retour::observe($observer);
        MouvementStock::observe($observer);
    }
}
