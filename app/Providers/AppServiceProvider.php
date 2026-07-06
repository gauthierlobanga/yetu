<?php

namespace App\Providers;

use App\Jobs\GenerateProductEmbedding;
use App\Listeners\RedirectVendorAfterLogin;
use App\Models\Client;
use App\Models\Commande;
use App\Models\ItemPanier;
use App\Models\MouvementStock;
use App\Models\Paiement;
use App\Models\Panier;
use App\Models\Post;
use App\Models\Produit;
use App\Models\Promotion;
use App\Models\Retour;
use App\Models\User;
use App\Observers\TenantRealtimeActivityObserver;
use App\Observers\UserObserver;
use App\Policies\MediaPolicy;
use Carbon\CarbonImmutable;
use Illuminate\Auth\Events\Login;
use Illuminate\Auth\Middleware\Authenticate;
use Illuminate\Auth\Middleware\RedirectIfAuthenticated;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\View;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

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
        $this->configureAuthenticationRedirects();
        $this->registerTenantRealtimeObservers();
        View::addNamespace('layouts', resource_path('views/layouts'));

        if (! app()->runningInConsole() && ! tenancy()->initialized) {
            User::observe(UserObserver::class);
        }

        Event::listen(Login::class, RedirectVendorAfterLogin::class);

        Authenticate::redirectUsing(function ($request) {
            if (! $request->expectsJson()) {
                return route('central.login');
            }
        });

        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
        });

        Gate::policy(Media::class, MediaPolicy::class);

        Model::retrieved(function ($model) {
            if ($model instanceof Post) {
                // Force la normalisation immédiate
                $model->setAttribute('content', $model->content);
                $model->setAttribute('excerpt', $model->excerpt);
            }
        });

        Media::saved(function (Media $media) {
            $model = $media->model;

            if (
                $model instanceof Produit
                && in_array($media->collection_name, ['image_principale', 'images'])
                && Schema::hasColumn($model->getTable(), 'search_embedding_synced_at')
            ) {
                $model->forceFill([
                    'search_embedding_synced_at' => null,
                ])->saveQuietly();

                GenerateProductEmbedding::dispatch($model);
            }
        });
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

        Model::preventLazyLoading(! app()->isProduction());

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

    /**
     * Enregistre les observers de temps réel pour les modèles du tenant.
     *
     * Ces observers déclenchent des événements de diffusion en temps réel
     * (via Echo/Reverb) pour mettre à jour le dashboard du vendeur.
     */
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

    /**
     * Configure les redirections d'authentification (Fortify/Sanctum).
     *
     * Définit où rediriger les utilisateurs non-authentifiés (vers le login)
     * et les utilisateurs déjà authentifiés (vers leur dashboard respectif).
     */
    protected function configureAuthenticationRedirects(): void
    {
        // Redirection quand l'utilisateur N'EST PAS connecté
        Authenticate::redirectUsing(function ($request) {
            if ($request->expectsJson()) {
                return null;
            }

            // Si on est dans un contexte tenant, rediriger vers le login tenant
            if (function_exists('tenancy') && tenancy()->initialized) {
                return route('tenant.login');
            }

            return route('central.login');
        });

        // Redirection quand l'utilisateur EST DÉJÀ connecté
        RedirectIfAuthenticated::redirectUsing(function (Request $request): string {
            $user = $request->user();

            if (function_exists('tenancy') && tenancy()->initialized) {
                if ($user && ($user->hasRole('super_admin') || $this->userOwnsCurrentTenant($user->id))) {
                    return '/vendor/dashboard';
                }

                return route('acheteur.dashboard');
            }

            if ($user && $user->hasRole('super_admin')) {
                return route('filament.admin.pages.dashboard');
            }

            if ($user && $user->tenants()->wherePivot('is_owner', true)->exists()) {
                return route('central.account-selection.index');
            }

            return route('plan.index');
        });
    }

    /**
     * Vérifie si un utilisateur est propriétaire du tenant actuellement initialisé.
     *
     * Interroge la connexion centrale pour vérifier la relation user_tenant
     * avec le flag `is_owner`.
     *
     * @param  string  $userId  L'identifiant de l'utilisateur à vérifier
     * @return bool True si l'utilisateur est propriétaire du tenant courant
     */
    protected function userOwnsCurrentTenant(string $userId): bool
    {
        $tenant = tenant();

        if (! $tenant) {
            return false;
        }

        return DB::connection(config('tenancy.database.central_connection', config('database.default')))
            ->table('user_tenant')
            ->where('tenant_id', $tenant->id)
            ->where('user_id', $userId)
            ->where('is_owner', true)
            ->exists();
    }
}
