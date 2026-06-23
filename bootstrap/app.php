<?php

use App\Http\Middleware\ApplyUserPreferences;
use App\Http\Middleware\EnsurePaymentSession;
use App\Http\Middleware\EnsureUserIsSuperAdmin;
use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\RedirectIfAuthenticatedWithTenant;
use App\Http\Middleware\SecurityHeaders;
use App\Http\Middleware\TrackVisitor;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Illuminate\Support\Facades\Route;
use Stancl\Tenancy\Middleware\InitializeTenancyByDomain;
use Stancl\Tenancy\Middleware\PreventAccessFromCentralDomains;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console/routes.php',
        channels: __DIR__.'/../routes/channels.php',
        health: '/up',
        using: function () {
            $centralDomains = config('tenancy.central_domains');
            foreach ($centralDomains as $domain) {
                Route::middleware('web')
                    ->domain($domain)
                    ->group(base_path('routes/web.php'));
            }

            // Routes tenant avec middleware de tenancy pour initialiser le contexte
            Route::middleware([
                'web',
                InitializeTenancyByDomain::class,
                PreventAccessFromCentralDomains::class,
            ])
                ->group(base_path('routes/tenants/routes.php'));

            Route::middleware(['web', InitializeTenancyByDomain::class])
                ->group(base_path('routes/tenant.php'));
        }
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->validateCsrfTokens(except: [
            '/stripe/webhook',
        ]);

        $middleware->encryptCookies(except: ['appearance', 'sidebar_state']);

        $middleware->group('universal', []);

        $middleware->web(append: [
            HandleAppearance::class,
            ApplyUserPreferences::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
            TrackVisitor::class,
            SecurityHeaders::class,
        ]);

        $middleware->alias([
            'payment.session' => EnsurePaymentSession::class,
            'guest.tenant' => RedirectIfAuthenticatedWithTenant::class,
            'admin' => EnsureUserIsSuperAdmin::class,

        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
