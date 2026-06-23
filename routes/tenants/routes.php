<?php

declare(strict_types=1);

use App\Http\Controllers\Admin\AdminOrderController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\SubscriptionController as AdminSubscriptionController;
use App\Http\Controllers\Admin\VisitorAnalyticsController;
use App\Http\Controllers\Auth\SocialiteController;
use App\Http\Controllers\Auth\TenantSsoLoginController;
use App\Http\Controllers\Others\SearchController;
use App\Http\Controllers\Others\UserPreferenceController;
use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\Settings\SecurityController;
use App\Http\Controllers\Vendor\Acheteurs\AccountDashboardController;
use App\Http\Controllers\Vendor\Boutique\Ecommerce\Adresse\AddressController;
use App\Http\Controllers\Vendor\Boutique\Ecommerce\Brand\BrandController;
use App\Http\Controllers\Vendor\Boutique\Ecommerce\Cart\CartController;
use App\Http\Controllers\Vendor\Boutique\Ecommerce\Category\CategoryController;
use App\Http\Controllers\Vendor\Boutique\Ecommerce\Checkout\CheckoutController;
use App\Http\Controllers\Vendor\Boutique\Ecommerce\Commande\OrderController;
use App\Http\Controllers\Vendor\Boutique\Ecommerce\Home\HomeController;
use App\Http\Controllers\Vendor\Boutique\Ecommerce\Loyalty\LoyaltyController;
use App\Http\Controllers\Vendor\Boutique\Ecommerce\Newsletter\NewsletterCampaignController;
use App\Http\Controllers\Vendor\Boutique\Ecommerce\Newsletter\NewsletterController;
use App\Http\Controllers\Vendor\Boutique\Ecommerce\Newsletter\NewsletterSubscriberController;
use App\Http\Controllers\Vendor\Boutique\Ecommerce\Newsletter\NewsletterTrackingController;
use App\Http\Controllers\Vendor\Boutique\Ecommerce\Payment\PaymentController;
use App\Http\Controllers\Vendor\Boutique\Ecommerce\Product\ProductController;
use App\Http\Controllers\Vendor\Boutique\Ecommerce\Product\ReviewController;
use App\Http\Controllers\Vendor\Boutique\Ecommerce\Promotion\PromotionController;
use App\Http\Controllers\Vendor\Boutique\Ecommerce\Return\ReturnController;
use App\Http\Controllers\Vendor\Boutique\Ecommerce\SitemapController;
use App\Http\Controllers\Vendor\Boutique\Ecommerce\WishList\WishlistController;
use App\Http\Controllers\Vendor\Boutique\Pages\About\AboutController;
use App\Http\Controllers\Vendor\Boutique\Pages\Blog\BlogBoutiqueController;
use App\Http\Controllers\Vendor\Boutique\Pages\Comments\CommentController;
use App\Http\Controllers\Vendor\Boutique\Pages\Contact\ContactBoutiqueController;
use App\Http\Controllers\Vendor\Boutique\Pages\Cookie\CookieController;
use App\Http\Controllers\Vendor\Boutique\Pages\Faq\FaqController;
use App\Http\Controllers\Vendor\Boutique\Pages\Help\HelpController;
use App\Http\Controllers\Vendor\Boutique\Pages\Privacy\PrivacyController;
use App\Http\Controllers\Vendor\Boutique\Pages\Support\SupportController;
use App\Http\Controllers\Vendor\Boutique\Pages\Term\TermController;
use App\Http\Controllers\Vendor\Boutique\Pages\Testimonials\TestimonialsController;
use App\Http\Controllers\Vendor\Config\LocationController;
use App\Http\Controllers\Vendor\Settings\ParametresController;
use App\Http\Controllers\Vendor\Settings\ParametresSecurityController;
use App\Http\Controllers\Vendor\Vendeurs\AnalyticsController;
use App\Http\Controllers\Vendor\Vendeurs\ShopThemeController;
use App\Http\Controllers\Vendor\Vendeurs\StatsBlogController;
use App\Http\Controllers\Vendor\Vendeurs\SubscriptionController;
use App\Http\Controllers\Vendor\Vendeurs\TenantAiController;
use App\Http\Controllers\Vendor\Vendeurs\TenantDashboardNotificationController;
use App\Http\Controllers\Vendor\Vendeurs\TenantOrderController;
use App\Http\Controllers\Vendor\Vendeurs\TenantPaymentController;
use App\Http\Controllers\Vendor\Vendeurs\TenantProductController;
use App\Http\Controllers\Vendor\Vendeurs\VendorDashboardController;
use App\Http\Controllers\Vendor\Vendeurs\VendorSettingsController;
use App\Http\Controllers\Vendor\Vendeurs\VendorStatisticsController;
use App\Http\Controllers\Vendor\Vendeurs\VisitorStatsController;
use App\Http\Middleware\EnsureTenantSubscription;
use App\Models\Visit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Stancl\Tenancy\Middleware\InitializeTenancyByDomain;
use Stancl\Tenancy\Middleware\PreventAccessFromCentralDomains;

/*
|--------------------------------------------------------------------------
| Tenant Routes
|--------------------------------------------------------------------------
|
| Here you can register the tenant routes for your application.
| These routes are loaded by the TenantRouteServiceProvider.
|
| Feel free to customize them however you want. Good luck!
|
*/

Route::middleware([
    'web',
    InitializeTenancyByDomain::class,
    PreventAccessFromCentralDomains::class,
])->group(function () {

    /*
      |--------------------------------------------------------------------------
      | ROUTES PUBLICS TENANT
      |--------------------------------------------------------------------------
      */
    // Protection: page d'accueil requiert un abonnement actif
    // Les clients sans abonnement sont redirigés vers /subscription/none
    Route::middleware(EnsureTenantSubscription::class)
        ->get('/', [HomeController::class, 'homeIndex'])
        ->name('tenant.home');

    Route::get('/sitemap.xml', [SitemapController::class, 'index'])->name('tenant.sitemap');

    Route::post('/preferences', [UserPreferenceController::class, 'update'])->name('tenant.preferences.update');

    Route::get('/tenant-sso-login', [TenantSsoLoginController::class, '__invoke'])
        ->name('tenant.sso.login');

    /*
      |--------------------------------------------------------------------------
      | ROUTES AUTHENTIFICATION TENANT (acheteurs)
      |--------------------------------------------------------------------------
      */
    Route::middleware('guest')
        ->group(function () {

            Route::get('/login', function () {
                return inertia('auth/login', [
                    'canResetPassword' => true,
                    'canRegister' => true,
                ]);
            })->name('tenant.login');

            Route::get('/register', function () {
                return inertia('auth/register');
            })->name('tenant.register');

            Route::get('/forgot-password', function () {
                return inertia('auth/forgot-password');
            })->name('tenant.password.request');

            Route::get('/reset-password/{token}', function (Request $request, $token) {
                return inertia('auth/reset-password', [
                    'email' => $request->email,
                    'token' => $token,
                ]);
            })->name('tenant.password.reset');
        });

    /*
      |--------------------------------------------------------------------------
      | ROUTES PUBLICS TENANT
      |--------------------------------------------------------------------------
      */
    Route::middleware(['auth', 'verified'])->group(function () {

        Route::prefix('admin')->group(function () {
            Route::get('/dashboard', [DashboardController::class, 'adminDashboardIndex'])->name('dashboard');

            Route::prefix('subscriptions')->name('admin.subscriptions.')->group(function () {
                Route::get('/', [AdminSubscriptionController::class, 'index'])->name('index');
                Route::get('/{subscription}', [AdminSubscriptionController::class, 'show'])->name('show');
                Route::post('/{subscription}/block', [AdminSubscriptionController::class, 'block'])->name('block');
                Route::post('/{subscription}/unblock', [AdminSubscriptionController::class, 'unblock'])->name('unblock');
                Route::post('/{subscription}/renew', [AdminSubscriptionController::class, 'renew'])->name('renew');
                Route::post('/{subscription}/add-grace-period', [AdminSubscriptionController::class, 'addGracePeriod'])->name('add-grace-period');
                Route::post('/batch/expired-to-block', [AdminSubscriptionController::class, 'expiredToBlock'])->name('expired-to-block');
                Route::post('/batch/notify-expiring', [AdminSubscriptionController::class, 'notifyExpiring'])->name('notify-expiring');
                Route::post('/batch/sync-stripe', [AdminSubscriptionController::class, 'syncWithStripe'])->name('sync-stripe');
            });
        });

        Route::prefix('acheteur')->name('acheteur.')->group(function () {
            Route::get('/account', [AccountDashboardController::class, 'AccountDashboardIndex'])->name('dashboard');

            Route::prefix('settings')->group(function () {
                Route::redirect('/', '/acheteur/settings/profile');
                Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
                Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
                Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

                Route::get('/security', [SecurityController::class, 'edit'])->name('security.edit');
                Route::put('/password', [SecurityController::class, 'update'])->name('password.update');

                Route::inertia('/appearance', 'settings/appearance')->name('appearance.edit');
            });
        });

        Route::get('/vendor/dashboard', [VendorDashboardController::class, 'index'])
            ->name('vendor.dashboard');

        // Newsletter Vendor Admin Routes
        Route::prefix('vendor/newsletters')->name('vendor.newsletters.')->group(function () {
            Route::get('/subscribers', [NewsletterSubscriberController::class, 'index'])->name('subscribers.index');
            Route::delete('/subscribers/{id}', [NewsletterSubscriberController::class, 'destroy'])->name('subscribers.destroy');

            Route::get('/campaigns', [NewsletterCampaignController::class, 'index'])->name('campaigns.index');
            Route::get('/campaigns/create', [NewsletterCampaignController::class, 'create'])->name('campaigns.create');
            Route::post('/campaigns', [NewsletterCampaignController::class, 'store'])->name('campaigns.store');
            Route::get('/campaigns/{id}', [NewsletterCampaignController::class, 'show'])->name('campaigns.show');
            Route::get('/campaigns/{id}/edit', [NewsletterCampaignController::class, 'edit'])->name('campaigns.edit');
            Route::put('/campaigns/{id}', [NewsletterCampaignController::class, 'update'])->name('campaigns.update');
            Route::delete('/campaigns/{id}', [NewsletterCampaignController::class, 'destroy'])->name('campaigns.destroy');
            Route::post('/campaigns/{id}/send-test', [NewsletterCampaignController::class, 'sendTest'])->name('campaigns.send-test');
        });

        Route::prefix('subscription')->name('subscription.')->group(function () {
            Route::get('/', [SubscriptionController::class, 'show'])->name('show');
            Route::get('/portal', [SubscriptionController::class, 'portal'])->name('portal');
            Route::post('/upgrade', [SubscriptionController::class, 'upgrade'])->name('upgrade');
            Route::post('/downgrade', [SubscriptionController::class, 'downgrade'])->name('downgrade');
            Route::post('/cancel', [SubscriptionController::class, 'cancel'])->name('cancel');
            Route::post('/pause', [SubscriptionController::class, 'pause'])->name('pause');
            Route::post('/resume', [SubscriptionController::class, 'resume'])->name('resume');
            Route::get('/invoices', [SubscriptionController::class, 'invoices'])->name('invoices');
        });

        Route::prefix('notifications')->name('tenant.notifications.')->group(function () {
            Route::post('/{id}/mark-as-read', [TenantDashboardNotificationController::class, 'markAsRead'])
                ->name('mark-as-read');
            Route::post('/mark-all-as-read', [TenantDashboardNotificationController::class, 'markAllAsRead'])
                ->name('mark-all-as-read');
        });

    });

    /*
    |--------------------------------------------------------------------------
    | ROUTES PUBLICS TENANT
    |--------------------------------------------------------------------------
    */
    Route::prefix('tenant')->middleware(['auth'])->group(function () {
        Route::redirect('settings', 'Vendor/settings/profile');
        Route::get('settings/profile', [ParametresController::class, 'edit'])->name('tenant.profile.edit');
        Route::patch('settings/profile', [ParametresController::class, 'update'])->name('tenant.profile.update');
    });

    Route::middleware(['auth', 'verified'])->group(function () {
        Route::delete('tenant/settings/profile', [ParametresController::class, 'destroy'])->name('tenant.profile.destroy');

        Route::get('tenant/settings/security', [ParametresSecurityController::class, 'edit'])->name('tenant.security.edit');

        Route::put('tenant/settings/password', [ParametresSecurityController::class, 'update'])
            ->middleware('throttle:6,1')
            ->name('tenant.user-password.update');

        Route::inertia('tenant/settings/appearance', 'Vendor/settings/appearance')
            ->name('tenant.appearance.edit');

        Route::get('/parametres', [VendorSettingsController::class, 'edit'])
            ->name('vendor.settings');

        Route::put('/parametres', [VendorSettingsController::class, 'update'])
            ->name('vendor.settings.update');

        Route::get('/statistiques', [VendorStatisticsController::class, 'index'])
            ->name('vendor.statistics');

        Route::prefix('api/theme')->name('shop.theme.')->group(function () {
            Route::get('/', [ShopThemeController::class, 'show'])->name('show');
            Route::post('/', [ShopThemeController::class, 'update'])->name('update');
            Route::post('/preset/{preset}', [ShopThemeController::class, 'applyPreset'])->name('preset');
            Route::post('/revert/{version}', [ShopThemeController::class, 'revert'])->name('revert');
            Route::get('/export', [ShopThemeController::class, 'export'])->name('export');
            Route::post('/import', [ShopThemeController::class, 'import'])->name('import');
            Route::post('/compare', [ShopThemeController::class, 'compare'])->name('compare');
            Route::get('/history', [ShopThemeController::class, 'history'])->name('history');
            Route::post('/reset', [ShopThemeController::class, 'reset'])->name('reset');
        });

        Route::get('/products', [TenantProductController::class, 'index'])->name('dashboard.products.index');

        Route::get('/vendor/stats/visitors', [VisitorStatsController::class, 'index'])->name('vendor.stats.visitors');
        Route::get('/blog/stats', [StatsBlogController::class, 'stats'])->name('blog.stats');
    });

    Route::middleware(['auth', 'verified'])->prefix('analytics')->name('tenant.analytics.')->group(function () {
        Route::get('/', [VisitorAnalyticsController::class, 'dashboard'])->name('dashboard');
        Route::get('/visitors', [VisitorAnalyticsController::class, 'visitorsList'])->name('visitors');
        Route::get('/visitor/{id}', [VisitorAnalyticsController::class, 'visitorDetail'])->name('visitor.show');
        Route::get('/events/recent', [VisitorAnalyticsController::class, 'recentEvents'])->name('events.recent');
        Route::get('/vendor/stats/visitors', [VisitorStatsController::class, 'index'])->name('vendor.stats.visitors');
        Route::get('/vendor/analytics', [AnalyticsController::class, 'index'])->name('avance');
    });

    Route::middleware(['auth', 'verified'])->prefix('ai')->name('ai.')->group(function () {
        Route::post('/toggle', [TenantAiController::class, 'toggle'])
            ->name('toggle');
        Route::post('/chat', [TenantAiController::class, 'chat'])->name('chat');
        Route::get('/recommendations', [TenantAiController::class, 'recommendations'])->name('recommendations');
        Route::post('/generate-product', [TenantAiController::class, 'generateProduct'])->name('generate-product');
    });
    /*
    |--------------------------------------------------------------------------
    | ROUTES PUBLICS E-COMMERCE (blog, produits, panier, wishlist, etc.)
    |--------------------------------------------------------------------------
    | Groupe de routes publiques avec protection d'abonnement.
    | Les tenants sans abonnement actif sont redirigés vers /subscription/none
    */
    Route::name('tenant.')->middleware(EnsureTenantSubscription::class)->group(function () {

        Route::middleware('auth:sanctum')->group(function () {
            Route::get('/countries', [LocationController::class, 'countries'])->name('addresses.countries');
            Route::get('/countries/{country}/cities', [LocationController::class, 'cities'])->name('addresses.cities');
        });

        /*
        |--------------------------------------------------------------------------
        | ROUTES PAGES STATIQUES (aide, conditions, politique de confidentialité, etc.)
        |--------------------------------------------------------------------------
        */
        Route::get('/api/search', [SearchController::class, 'shopSearch'])->name('search');
        Route::get('/search', [SearchController::class, 'shopApi'])->name('api');

        // Route::prefix('page')->group(function () {
        Route::get('/contact', [ContactBoutiqueController::class, 'contactIndex'])->name('page.contact');
        Route::post('/contact', [ContactBoutiqueController::class, 'contactStore'])->name('page.contact.store');

        Route::get('/help', [HelpController::class, 'help'])->name('page.help');
        Route::get('/about', [AboutController::class, 'about'])->name('page.about');
        Route::get('/terms', [TermController::class, 'terms'])->name('page.terms');
        Route::get('/privacy', [PrivacyController::class, 'privacy'])->name('page.privacy');
        Route::get('/cookies', [CookieController::class, 'cookies'])->name('page.cookies');
        Route::get('/support', [SupportController::class, 'support'])->name('page.support');
        Route::get('/faq', [FaqController::class, 'faq'])->name('page.faq');
        Route::get('/testimonials', [TestimonialsController::class, 'testimonials'])->name('page.testimonials');
        // });
        /*
        |--------------------------------------------------------------------------
        | ROUTES BLOG PUBLIQUES
        |--------------------------------------------------------------------------
        */
        Route::prefix('blog')->group(function () {
            Route::get('/', [BlogBoutiqueController::class, 'blogIndex'])->name('blog.index');
            Route::get('/category/{category:slug}', [BlogBoutiqueController::class, 'blogByCategory'])->name('blog.category');
            Route::get('/{post:slug}', [BlogBoutiqueController::class, 'blogShow'])->name('blog.show');
            Route::post('/{post}/comment', [BlogBoutiqueController::class, 'blogComment'])->middleware('auth')->name('blog.comment');
            Route::post('/{post}/like', [BlogBoutiqueController::class, 'blogLike'])->middleware('auth')->name('blog.like');
            Route::post('/{post}/bookmark', [BlogBoutiqueController::class, 'blogBookmark'])->middleware('auth')->name('blog.bookmark');
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

        /*
        |--------------------------------------------------------------------------
        | ROUTES GESTION BLOG ADMIN
        |--------------------------------------------------------------------------
        */
        Route::name('socialitie.')->middleware('guest')->group(function () {
            Route::get('/auth/{provider}/redirect', [SocialiteController::class, 'socialiteShopRedirect'])->name('redirect');
            Route::get('/auth/{provider}/callback', [SocialiteController::class, 'socialiteShopCallback'])->name('callback');
        });
        /*
        |--------------------------------------------------------------------------
        | ROUTES AUTHENTIFIÉES (commentaires, avis, wishlist)
        |--------------------------------------------------------------------------
        */
        Route::middleware('auth')->prefix('comments')->name('comments.')->group(function () {
            Route::get('/', [CommentController::class, 'commentsIndex'])->name('index');
            Route::post('/', [CommentController::class, 'commentsStore'])->name('store');
            Route::post('/{comment}/like', [CommentController::class, 'commentsLike'])->name('like');
            Route::post('/{comment}/report', [CommentController::class, 'commentsReport'])->name('report');
        });

        /*
        |--------------------------------------------------------------------------
        | ROUTES E-COMMERCE PUBLIQUES
        |--------------------------------------------------------------------------
        */
        // =====================
        // CATÉGORIES
        // =====================
        Route::prefix('product/category')->group(function () {
            Route::get('/', [CategoryController::class, 'categoriesIndex'])->name('product.category.index');
            Route::get('/{category:slug}', [CategoryController::class, 'categoriesShow'])->name('product.category.show');
        });

        // =====================
        // PRODUITS
        // =====================
        Route::prefix('product')->group(function () {
            Route::get('/', [ProductController::class, 'productsIndex'])->name('product.index');
            Route::get('/quick-view/{produit:slug}', [ProductController::class, 'productsQuickView'])->name('product.quick-view');
            Route::get('/{produit:slug}', [ProductController::class, 'productsShow'])->name('product.show');
            Route::post('/search/by-image', [ProductController::class, 'searchByImage'])->name('product.search.by-image');
            Route::get('/{produit:slug}/reviews', [ReviewController::class, 'productsReviewsIndex'])->name('product.reviews.index');
        });

        // Marques
        Route::get('/brands', [BrandController::class, 'brandsIndex'])->name('brands.index');
        Route::get('brands/{brand:slug}', [BrandController::class, 'brandsShow'])->name('brands.show');

        // Promotions
        Route::get('/promotions', [PromotionController::class, 'promotionsIndex'])->name('promotions.index');

        // Panier
        Route::prefix('cart')->group(function () {
            Route::get('/', [CartController::class, 'cartIndex'])->name('cart.index');
            Route::post('/add/{produit}', [CartController::class, 'cartAdd'])->name('cart.add');
            Route::patch('/update/{item}', [CartController::class, 'cartUpdate'])->name('cart.update');
            Route::delete('/remove/{item}', [CartController::class, 'cartRemove'])->name('cart.remove');
            Route::post('/clear', [CartController::class, 'cartClear'])->name('cart.clear');
            Route::post('/apply-coupon', [CartController::class, 'cartApplyCoupon'])->name('cart.apply-coupon');
            Route::delete('/remove-coupon', [CartController::class, 'cartRemoveCoupon'])->name('cart.remove-coupon');
            Route::post('/calculate', [CartController::class, 'cartCalculate'])->name('cart.calculate');
            Route::get('/recover/{relance}', [CartController::class, 'cartRecover'])->name('cart.recover');
        });

        // Wishlist
        Route::prefix('wishlist')->group(function () {
            Route::get('/', [WishlistController::class, 'wishlistIndex'])->name('wishlist.index');
            Route::post('/toggle/{produit}', [WishlistController::class, 'wishlistToggle'])->name('wishlist.toggle');
            Route::delete('/remove/{produit}', [WishlistController::class, 'wishlistRemove'])->name('wishlist.remove');
        });

        /*
        |--------------------------------------------------------------------------
        | ROUTES E-COMMERCE CLIENT (nécessite authentification)
        |--------------------------------------------------------------------------
        */
        Route::middleware(['auth', 'verified'])->group(function () {

            // Checkout et commandes
            Route::prefix('checkout')->group(function () {
                Route::get('/', [CheckoutController::class, 'checkoutIndex'])->name('checkout.index');
                Route::post('/process', [CheckoutController::class, 'checkoutProcess'])->name('checkout.process');
                Route::get('/success/{commande}', [CheckoutController::class, 'checkoutSuccess'])->name('checkout.success');
                Route::get('/cancel', [CheckoutController::class, 'checkoutCancel'])->name('checkout.cancel');
            });

            // Commandes client
            Route::prefix('orders')->group(function () {
                Route::get('/', [OrderController::class, 'ordersIndex'])->name('orders.index');
                Route::get('/{commande}', [OrderController::class, 'ordersShow'])->name('orders.show');
                Route::post('/{commande}/cancel', [OrderController::class, 'ordersCancel'])->name('orders.cancel');
                Route::get('/{commande}/invoice', [OrderController::class, 'ordersInvoice'])->name('orders.invoice');
                Route::get('/admin/{commande}/invoice', [AdminOrderController::class, 'adminOrdersInvoice'])->name('admin.orders.invoice');
            });

            // Retours et remboursements
            Route::prefix('return')->group(function () {
                Route::get('/', [ReturnController::class, 'returnsIndex'])->name('return.index');
                Route::get('/{commande}/request', [ReturnController::class, 'returnsCreate'])->name('return.create');
                Route::post('/', [ReturnController::class, 'returnsStore'])->name('return.store');
                Route::get('/{retour}', [ReturnController::class, 'returnsShow'])->name('return.show');
            });

            // Adresses
            Route::prefix('addresses')->group(function () {
                Route::resource('addresses', AddressController::class)->except(['edit', 'create']);
                Route::post('/{address}/default', [AddressController::class, 'addressesSetDefault'])->name('addresses.default');
            });
            // Paiements

            Route::prefix('payment')->group(function () {
                Route::post('/{commande}/pay', [PaymentController::class, 'paymentPay'])->name('payment.pay');
                Route::get('/callback', [PaymentController::class, 'PaymentCallback'])->name('payment.callback');
            });
            // Avis produits (écriture)

            Route::prefix('product')->group(function () {
                Route::post('/{produit}/review', [ReviewController::class, 'productsReviewsStore'])->name('products.reviews.store');
                Route::put('/review/{avis}', [ReviewController::class, 'productsReviewsUpdate'])->name('products.reviews.update');
                Route::delete('/review/{avis}', [ReviewController::class, 'productsReviewsDestroy'])->name('products.reviews.destroy');
            });

            // Programme de fidélité
            Route::prefix('loyalty')->group(function () {
                Route::get('/', [LoyaltyController::class, 'loyaltyIndex'])->name('loyalty.index');
                Route::post('/redeem', [LoyaltyController::class, 'loyaltyRedeem'])->name('loyalty.redeem');
            });
            // Newsletter

            Route::prefix('newsletter')->group(function () {
                Route::post('/subscribe', [NewsletterController::class, 'newsletterSubscribe'])->name('newsletter.subscribe');
                Route::post('/unsubscribe', [NewsletterController::class, 'newsletterUnsubscribe'])->name('newsletter.unsubscribe');
            });

            Route::get('/vendor/orders', [TenantOrderController::class, 'index'])
                ->name('vendor.orders.index');
            Route::get('/vendor/orders/{commande}', [TenantOrderController::class, 'show'])
                ->name('vendor.orders.show');
            Route::get('/vendor/payments', [TenantPaymentController::class, 'index'])
                ->name('vendor.payments.index');
        });
    });

    Route::get('/subscription/required', function () {
        return inertia('Subscription/Required');
    })->name('tenant.subscription.required');

    // Newsletter Tracking (Public)
    Route::get('/newsletter/track/open/{send_id}', [NewsletterTrackingController::class, 'trackOpen'])->name('tenant.newsletter.track.open');
    Route::get('/newsletter/track/click/{send_id}', [NewsletterTrackingController::class, 'trackClick'])->name('tenant.newsletter.track.click');

    Route::get('/required', function () {
        return inertia('Subscription/None');
    })->name('tenant.subscription.none');

    Route::post('/flash/clear', function () {
        session()->forget(['success', 'error']);

        return response()->noContent();
    })->name('flash.clear');

    Route::post('/track-duration', function (Request $request) {
        $sessionId = session()->getId();
        $lastVisit = Visit::where('session_id', $sessionId)
            ->orderBy('visited_at', 'desc')
            ->first();
        if ($lastVisit && $lastVisit->duration == 0) {
            $lastVisit->update(['duration' => $request->input('duration')]);
        }

        return response()->noContent();
    })->name('track.duration')->middleware('web');

});
