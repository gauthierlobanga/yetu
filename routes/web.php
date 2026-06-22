<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\VisitorStatsController;
use App\Http\Controllers\Api\VendorRequestStatusController;
use App\Http\Controllers\Auth\TenantAccountController;
use App\Http\Controllers\Auth\TenantSsoLoginController;
use App\Http\Controllers\Central\Pages\About\AboutController;
use App\Http\Controllers\Central\Pages\Blog\BlogCentralController;
use App\Http\Controllers\Central\Pages\Contact\ContactCentralController;
use App\Http\Controllers\Central\Pages\Cookie\CookieController;
use App\Http\Controllers\Central\Pages\Entreprises\EntrepriseController;
use App\Http\Controllers\Central\Pages\Faq\FaqController;
use App\Http\Controllers\Central\Pages\Help\HelpController;
use App\Http\Controllers\Central\Pages\Home\HeroCentralController;
use App\Http\Controllers\Central\Pages\Privacy\PrivacyController;
use App\Http\Controllers\Central\Pages\Support\SupportController;
use App\Http\Controllers\Central\Pages\Term\TermController;
use App\Http\Controllers\Central\Pages\Testimonials\TestimonialsController;
use App\Http\Controllers\Central\SitemapController;
use App\Http\Controllers\TenantFaviconController;
use App\Http\Controllers\Vendor\Config\PaymentController;
use App\Http\Controllers\Vendor\Config\VendorRegistrationController;
use Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\Request;
use Illuminate\Session\Middleware\StartSession;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

/*
|--------------------------------------------------------------------------
| Routes authentifiées (dashboard général)
|--------------------------------------------------------------------------
*/

Route::get('/sitemap.xml', [SitemapController::class, 'index'])->name('sitemap');
Route::get('/', [HeroCentralController::class, 'Index'])->name('home');

// Tenant favicon (returns tenant logo or falls back to public/favicon.ico)
Route::get('/tenant/{tenant:slug}/favicon', [TenantFaviconController::class, 'show'])
    ->name('tenant.favicon')
    ->withoutMiddleware([
        StartSession::class,
        AddQueuedCookiesToResponse::class,
    ]);

Route::middleware('guest')->group(function () {
    Route::get('/login', fn (Request $request) => Inertia::render('auth/login', [
        'canResetPassword' => Features::enabled(Features::resetPasswords()),
        'canRegister' => Features::enabled(Features::registration()),
        'status' => $request->session()->get('status'),
    ]))->name('central.login');

    Route::get('/register', fn () => Inertia::render('auth/register'))
        ->name('central.register');

    Route::get('/forgot-password', fn (Request $request) => Inertia::render('auth/forgot-password', [
        'status' => $request->session()->get('status'),
    ]))->name('central.password.request');

    Route::get('/reset-password/{token}', fn (Request $request, string $token) => Inertia::render('auth/reset-password', [
        'email' => $request->email,
        'token' => $token,
    ]))->name('central.password.reset');

    Route::get('/email/verify', function () {
        return Inertia::render('auth/verify-email', [
            'status' => session('status'),
        ]);
    })->middleware('auth')->name('central.verification.notice');

    Route::get('/email/verify/{id}/{hash}', function (EmailVerificationRequest $request) {
        $request->fulfill();

        return redirect()->intended(route('plan.index'));
    })->middleware(['auth', 'signed'])->name('central.verification.verify');

    // Note: Fortify handles POST /login, but we ensure it redirects correctly for central domain
    // The CustomLoginResponse handles the redirect logic based on domain and user status

});

/*
       |--------------------------------------------------------------------------
       | ROUTES GESTION BLOG ADMIN
       |--------------------------------------------------------------------------
       */
Route::middleware(['auth', 'verified'])->group(function () {
    Route::prefix('dashboard')->group(function () {
        Route::post('/posts/reorder', [DashboardController::class, 'postsReorder'])->name('posts.reorder');
    });
});

Route::middleware(['auth', 'admin'])->prefix('admin')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'adminDashboardIndex'])->name('admin.dashboard');

    // Route::prefix('subscriptions')->name('admin.subscriptions.')->group(function () {
    //     Route::get('/', [AdminSubscriptionController::class, 'index'])->name('index');
    //     Route::get('/{subscription}', [AdminSubscriptionController::class, 'show'])->name('show');
    //     Route::post('/{subscription}/block', [AdminSubscriptionController::class, 'block'])->name('block');
    //     Route::post('/{subscription}/unblock', [AdminSubscriptionController::class, 'unblock'])->name('unblock');
    //     Route::post('/{subscription}/renew', [AdminSubscriptionController::class, 'renew'])->name('renew');
    //     Route::post('/{subscription}/add-grace-period', [AdminSubscriptionController::class, 'addGracePeriod'])->name('add-grace-period');
    //     Route::post('/batch/expired-to-block', [AdminSubscriptionController::class, 'expiredToBlock'])->name('expired-to-block');
    //     Route::post('/batch/notify-expiring', [AdminSubscriptionController::class, 'notifyExpiring'])->name('notify-expiring');
    //     Route::post('/batch/sync-stripe', [AdminSubscriptionController::class, 'syncWithStripe'])->name('sync-stripe');
    // });
});

Route::get('/auth/tenant-sso', [TenantSsoLoginController::class, '__invoke'])
    ->name('tenant.sso.central');

Route::middleware('auth')->prefix('selection-compte')->name('central.account-selection.')->group(function () {
    Route::get('/', [TenantAccountController::class, 'index'])->name('index');
    Route::get('/ajouter', [TenantAccountController::class, 'addAccount'])->name('add-account');
    Route::get('/{tenant:slug}/continuer', [TenantAccountController::class, 'select'])->name('select');
});

/*
|--------------------------------------------------------------------------
| ROUTES BLOG PUBLIQUES
|--------------------------------------------------------------------------
*/
Route::prefix('blog')->group(function () {
    Route::get('/', [BlogCentralController::class, 'blogIndex'])->name('blog.index');
    Route::get('/category/{category:slug}', [BlogCentralController::class, 'blogByCategory'])->name('blog.category');
    Route::get('/{post:slug}', [BlogCentralController::class, 'blogShow'])->name('blog.show');
    Route::post('/{post}/comment', [BlogCentralController::class, 'blogComment'])->middleware('auth')->name('blog.comment');
    Route::post('/{post}/like', [BlogCentralController::class, 'blogLike'])->middleware('auth')->name('blog.like');
});

Route::get('/contact', [ContactCentralController::class, 'contactIndex'])->name('contact');
Route::post('/contact', [ContactCentralController::class, 'contactStore'])->name('contact.store');
Route::get('/help', [HelpController::class, 'help'])->name('help');
Route::get('/about', [AboutController::class, 'about'])->name('about');
Route::get('/terms', [TermController::class, 'terms'])->name('terms');
Route::get('/privacy', [PrivacyController::class, 'privacy'])->name('privacy');
Route::get('/cookies', [CookieController::class, 'cookie'])->name('cookies');
Route::get('/support', [SupportController::class, 'support'])->name('support');
Route::get('/faq', [FaqController::class, 'faq'])->name('faq');
Route::get('/testimonials', [TestimonialsController::class, 'testimonials'])->name('testimonials');

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

        // Status de la demande
        Route::get('/status/{id}', [VendorRequestStatusController::class, '__invoke'])
            ->name('status');

        // Paiement
        Route::get('/paiement', [PaymentController::class, 'index'])
            ->name('payment');
        Route::get('/paiement/checkout', [PaymentController::class, 'checkout'])
            ->name('payment.checkout');
        Route::get('/paiement/succes', [PaymentController::class, 'success'])
            ->name('payment.success');
        Route::get('/paiement/annulation', [PaymentController::class, 'cancel'])
            ->name('payment.cancel');
    });

});

/*
|--------------------------------------------------------------------------
| Routes Webhook Stripe
|--------------------------------------------------------------------------
*/
Route::post('/stripe/webhook', [PaymentController::class, 'webhook'])
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
Route::get('/plans', [VendorRegistrationController::class, 'vendeurIndex'])
    ->middleware('auth')
    ->name('plan.index');

Route::middleware(['auth', 'admin'])->prefix('admin')->group(function () {
    Route::get('/stats/visitors', [VisitorStatsController::class, 'index'])->name('admin.stats.visitors');
});

// Route::post('/track-duration', function (Request $request) {
//     $sessionId = session()->getId();
//     $lastVisit = Visit::where('session_id', $sessionId)
//         ->orderBy('visited_at', 'desc')
//         ->first();
//     if ($lastVisit && $lastVisit->duration == 0) {
//         $lastVisit->update(['duration' => $request->input('duration')]);
//     }

//     return response()->noContent();
// })->name('track.duration')->middleware('web');
