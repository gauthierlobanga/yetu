<?php

use App\Http\Controllers\Central\HeroCentralController;
use App\Http\Controllers\Main\PaymentController as MainPaymentController;
use App\Http\Controllers\Main\VendorRegistrationController;
use App\Http\Controllers\Pages\EntrepriseController;
use App\Http\Controllers\Vendor\VendorDashboardController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Http\Controllers\AuthenticatedSessionController;
use Laravel\Fortify\Http\Controllers\NewPasswordController;
use Laravel\Fortify\Http\Controllers\PasswordResetLinkController;
use Laravel\Fortify\Http\Controllers\RegisteredUserController;

/*
|--------------------------------------------------------------------------
| Routes authentifiées (dashboard général)
|--------------------------------------------------------------------------
*/
foreach (config('tenancy.central_domains') as $domain) {
    Route::domain($domain)->group(function () {
        Route::get('/', [HeroCentralController::class, 'Index'])->name('home');

        // Authentification central (vendeurs)
        Route::get('/login', [AuthenticatedSessionController::class, 'create'])
            ->middleware('guest:web')
            ->name('central.login');
        Route::post('/login', [AuthenticatedSessionController::class, 'store'])
            ->middleware('guest:web')
            ->name('central.login.store');
        Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])
            ->middleware('auth:web')
            ->name('central.logout');

        // Inscription vendeur (actif uniquement sur central)
        Route::get('/register', [RegisteredUserController::class, 'create'])
            ->middleware('guest:web')
            ->name('central.register');
        Route::post('/register', [RegisteredUserController::class, 'store'])
            ->middleware('guest:web')
            ->name('central.register.store');

        // Réinitialisation de mot de passe
        Route::get('/forgot-password', [PasswordResetLinkController::class, 'create'])
            ->middleware('guest:web')
            ->name('central.password.request');
        Route::post('/forgot-password', [PasswordResetLinkController::class, 'store'])
            ->middleware('guest:web')
            ->name('central.password.email');
        Route::get('/reset-password/{token}', [NewPasswordController::class, 'create'])
            ->middleware('guest:web')
            ->name('central.password.reset');
        Route::post('/reset-password', [NewPasswordController::class, 'store'])
            ->middleware('guest:web')
            ->name('central.password.update');

        Route::middleware(['auth', 'verified'])->group(function () {

            // Devenir vendeur
            Route::prefix('devenir-vendeur')->name('vendor.')->group(function () {
                Route::get('/', [VendorRegistrationController::class, 'vendeurIndex'])
                    ->name('register');
                Route::get('/configurer', [VendorRegistrationController::class, 'vendeurConfigure'])
                    ->name('configure');
                Route::post('/store', [VendorRegistrationController::class, 'vendeurStore'])
                    ->name('store');

                // Page de succès
                Route::get('/succes/{tenant:slug}', [VendorRegistrationController::class, 'vendeurSuccess'])
                    ->name('success');

                // Vérification de domaine (retourne JSON)
                Route::post('/check-domain', [VendorRegistrationController::class, 'checkDomain'])
                    ->name('check-domain');

                // Suggestions de domaine
                Route::post('/suggest-domain', [VendorRegistrationController::class, 'suggestDomain'])
                    ->name('suggest-domain');

                // Paiement
                Route::get('/paiement', [MainPaymentController::class, 'index'])
                    ->name('payment');
                Route::get('/paiement/checkout', [MainPaymentController::class, 'checkout'])
                    ->name('payment.checkout');
                Route::get('/paiement/succes', [MainPaymentController::class, 'success'])
                    ->name('payment.success');
                Route::get('/paiement/annulation', [MainPaymentController::class, 'cancel'])
                    ->name('payment.cancel');
            });

            Route::get('/vendor/dashboard', [VendorDashboardController::class, 'index'])
                ->name('vendor.dashboard');
        });

        /*
        |--------------------------------------------------------------------------
        | Routes Webhook Stripe
        |--------------------------------------------------------------------------
        */
        Route::post('/stripe/webhook', [MainPaymentController::class, 'webhook'])
            ->name('stripe.webhook');

        /*
        |--------------------------------------------------------------------------
        | Routes pour la pqge entreprise
        |--------------------------------------------------------------------------
        */
        Route::get('/entreprise', [EntrepriseController::class, 'entrepriseIndex'])
            ->name('entreprise.index');

        /*
        |--------------------------------------------------------------------------
        | Routes pour voir les plan d'abonnement
        |--------------------------------------------------------------------------
        */
        Route::get('/plans', [VendorRegistrationController::class, 'vendeurConfigure'])
            ->name('plan.index');

    });
}

/*
|--------------------------------------------------------------------------
| Inclure les routes settings (fichier externe)
|--------------------------------------------------------------------------
*/
// require __DIR__.'/settings.php';
