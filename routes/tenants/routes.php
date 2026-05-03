<?php

declare(strict_types=1);

use App\Http\Controllers\Admin\AdminOrderController;
use App\Http\Controllers\Auth\SocialiteController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\Home\HomeController;
use App\Http\Controllers\Main\PaymentController;
use App\Http\Controllers\Pages\PageController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\Shop\AccountDashboardController;
use App\Http\Controllers\Shop\AddressController;
use App\Http\Controllers\Shop\BrandController;
use App\Http\Controllers\Shop\CartController;
use App\Http\Controllers\Shop\CategoryController;
use App\Http\Controllers\Shop\CheckoutController;
use App\Http\Controllers\Shop\LoyaltyController;
use App\Http\Controllers\Shop\NewsletterController;
use App\Http\Controllers\Shop\OrderController;
use App\Http\Controllers\Shop\ProductController;
use App\Http\Controllers\Shop\PromotionController;
use App\Http\Controllers\Shop\ReturnController;
use App\Http\Controllers\Shop\ReviewController;
use App\Http\Controllers\Shop\WishlistController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Http\Controllers\AuthenticatedSessionController;
use Laravel\Fortify\Http\Controllers\NewPasswordController;
use Laravel\Fortify\Http\Controllers\PasswordResetLinkController;
use Laravel\Fortify\Http\Controllers\RegisteredUserController;
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

    Route::prefix('tenants')->group(function () {
        /**
         * Routes d'authentification pour les locataires
         */
        Route::get('/register', [RegisteredUserController::class, 'create'])
            ->middleware(['guest:web'])
            ->name('tenant.register');
        Route::post('/register', [RegisteredUserController::class, 'store'])
            ->middleware(['guest:web'])
            ->name('tenant.register.store');

        Route::get('/login', [AuthenticatedSessionController::class, 'create'])
            ->middleware(['guest:web'])
            ->name('tenant.login');
        Route::post('/login', [AuthenticatedSessionController::class, 'store'])
            ->middleware(['guest:web'])
            ->name('tenant.login.store');

        Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])
            ->middleware(['auth'])
            ->name('tenant.logout');
        Route::get('/forgot-password', [PasswordResetLinkController::class, 'create'])
            ->middleware(['guest:web'])
            ->name('tenant.password.request');
        Route::post('/forgot-password', [PasswordResetLinkController::class, 'store'])
            ->middleware(['guest:web'])
            ->name('tenant.password.email');
        Route::get('/reset-password/{token}', [NewPasswordController::class, 'create'])
            ->middleware(['guest:web'])
            ->name('tenant.password.reset');
        Route::post('/reset-password', [NewPasswordController::class, 'store'])
            ->middleware(['guest:web'])
            ->name('tenant.password.update');
    });

    /*
    |--------------------------------------------------------------------------
    | ROUTES PUBLICS TENANT
    |--------------------------------------------------------------------------
    */
    Route::name('tenant.')->group(function () {
        // Home
        Route::get('/', [HomeController::class, 'homeIndex'])->name('home');

        // Contact et recherche
        Route::get('/contact', [ContactController::class, 'contactIndex'])->name('contact.index');
        Route::post('/contact', [ContactController::class, 'contactStore'])->name('contact.store');
        Route::get('/api/search', [SearchController::class, 'shopApi'])->name('search.api');
        Route::get('/search', [SearchController::class, 'shopSearch'])->name('search');

        /*
        |--------------------------------------------------------------------------
        | ROUTES PAGES STATIQUES (aide, conditions, politique de confidentialité, etc.)
        |--------------------------------------------------------------------------
        */
        Route::get('/help', [PageController::class, 'pageHelp'])->name('pages.help');
        Route::get('/about', [PageController::class, 'pageAbout'])->name('pages.about');
        Route::get('/terms', [PageController::class, 'pageTerms'])->name('pages.terms');
        Route::get('/privacy', [PageController::class, 'pagePrivacy'])->name('pages.privacy');
        Route::get('/cookies', [PageController::class, 'pageCookies'])->name('pages.cookies');
        Route::get('/support', [PageController::class, 'pageSupport'])->name('pages.support');
        Route::get('/faq', [PageController::class, 'pageFaq'])->name('pages.faq');
        Route::get('/testimonials', [PageController::class, 'pageTestimonials'])->name('pages.testimonials');
    });
    /*
    |--------------------------------------------------------------------------
    | ROUTES PUBLICS (contact, recherche, etc.)
    |--------------------------------------------------------------------------
    */
    Route::middleware('guest')->name('tenant.')->group(function () {
        Route::get('/auth/{provider}/redirect', [SocialiteController::class, 'socialiteShopRedirect'])
            ->name('socialite.redirect');
        Route::get('/auth/{provider}/callback', [SocialiteController::class, 'socialiteShopCallback'])
            ->name('socialite.callback');
    });

    /*
    |--------------------------------------------------------------------------
    | ROUTES E-COMMERCE PUBLIQUES
    |--------------------------------------------------------------------------
    */
    Route::name('tenant.')->group(function () {
        // Recherche par image
        Route::post('/search/by-image', [ProductController::class, 'searchByImage'])->name('search.by-image');

        // Catalogue produits
        Route::get('/products', [ProductController::class, 'productsIndex'])->name('products.index');
        Route::get('/product/{produit:slug}', [ProductController::class, 'productsShow'])->name('product.show');
        Route::get('/quick-view/{produit:slug}', [ProductController::class, 'productsQuickView'])->name('products.quick-view');

        // Catégories
        Route::get('/categories', [CategoryController::class, 'categoriesIndex'])->name('categories.index');
        Route::get('/category/{category:slug}', [CategoryController::class, 'categoriesShow'])->name('categories.show');

        // Marques
        Route::get('/brands', [BrandController::class, 'brandsIndex'])->name('brands.index');
        Route::get('/brand/{brand:slug}', [BrandController::class, 'brandsShow'])->name('brands.show');

        // Promotions
        Route::get('/promotions', [PromotionController::class, 'promotionsIndex'])->name('promotions.index');

        // Panier
        Route::get('/cart', [CartController::class, 'cartIndex'])->name('cart.index');
        Route::post('/cart/add/{produit}', [CartController::class, 'cartAdd'])->name('cart.add');
        Route::patch('/cart/update/{item}', [CartController::class, 'cartUpdate'])->name('cart.update');
        Route::delete('/cart/remove/{item}', [CartController::class, 'cartRemove'])->name('cart.remove');
        Route::post('/cart/clear', [CartController::class, 'cartClear'])->name('cart.clear');
        Route::post('/cart/apply-coupon', [CartController::class, 'cartApplyCoupon'])->name('cart.apply-coupon');
        Route::delete('/cart/remove-coupon', [CartController::class, 'cartRemoveCoupon'])->name('cart.remove-coupon');
        Route::post('/cart/calculate', [CartController::class, 'cartCalculate'])->name('cart.calculate');

        // Wishlist
        Route::get('/wishlist', [WishlistController::class, 'wishlistIndex'])->name('wishlist.index');
        Route::post('/wishlist/toggle/{produit}', [WishlistController::class, 'wishlistToggle'])->name('wishlist.toggle');
        Route::delete('/wishlist/remove/{produit}', [WishlistController::class, 'wishlistRemove'])->name('wishlist.remove');

        // Avis produits (lecture)
        Route::get('/product/{produit:slug}/reviews', [ReviewController::class, 'productsReviewsIndex'])->name('products.reviews.index');
    });

    /*
    |--------------------------------------------------------------------------
    | ROUTES E-COMMERCE CLIENT (nécessite authentification)
    |--------------------------------------------------------------------------
    */
    Route::middleware(['auth', 'verified'])->name('tenant.')->group(function () {
        Route::get('/account', [AccountDashboardController::class, 'AccountDashboardIndex'])->name('dashboard');

        // Checkout et commandes
        Route::get('/checkout', [CheckoutController::class, 'checkoutIndex'])->name('checkout.index');
        Route::post('/checkout/process', [CheckoutController::class, 'checkoutProcess'])->name('checkout.process');
        Route::get('/checkout/success/{commande}', [CheckoutController::class, 'checkoutSuccess'])->name('checkout.success');
        Route::get('/checkout/cancel', [CheckoutController::class, 'checkoutCancel'])->name('checkout.cancel');

        // Commandes client
        Route::get('/orders', [OrderController::class, 'ordersIndex'])->name('orders.index');
        Route::get('/order/{commande}', [OrderController::class, 'ordersShow'])->name('orders.show');
        Route::post('/order/{commande}/cancel', [OrderController::class, 'ordersCancel'])->name('orders.cancel');
        Route::get('/order/{commande}/invoice', [OrderController::class, 'ordersInvoice'])->name('orders.invoice');
        Route::get('/admin/orders/{commande}/invoice', [AdminOrderController::class, 'adminOrdersInvoice'])->name('admin.orders.invoice');
        // Retours et remboursements
        Route::get('/returns', [ReturnController::class, 'returnsIndex'])->name('returns.index');
        Route::get('/return/{commande}/request', [ReturnController::class, 'returnsCreate'])->name('returns.create');
        Route::post('/return', [ReturnController::class, 'returnsStore'])->name('returns.store');
        Route::get('/return/{retour}', [ReturnController::class, 'returnsShow'])->name('returns.show');

        // Adresses
        Route::resource('addresses', AddressController::class)->except(['edit', 'create']);
        Route::post('/addresses/{address}/default', [AddressController::class, 'addressesSetDefault'])->name('addresses.default');

        // Paiements
        Route::post('/payment/{commande}/pay', [PaymentController::class, 'paymentPay'])->name('payment.pay');
        Route::get('/payment/callback', [PaymentController::class, 'PaymentCallback'])->name('payment.callback');

        // Avis produits (écriture)
        Route::post('/product/{produit}/review', [ReviewController::class, 'productsReviewsStore'])->name('products.reviews.store');
        Route::put('/review/{avis}', [ReviewController::class, 'productsReviewsUpdate'])->name('products.reviews.update');

        // Programme de fidélité
        Route::get('/loyalty', [LoyaltyController::class, 'loyaltyIndex'])->name('loyalty.index');
        Route::post('/loyalty/redeem', [LoyaltyController::class, 'loyaltyRedeem'])->name('loyalty.redeem');

        // Newsletter
        Route::post('/newsletter/subscribe', [NewsletterController::class, 'newsletterSubscribe'])->name('newsletter.subscribe');
        Route::post('/newsletter/unsubscribe', [NewsletterController::class, 'newsletterUnsubscribe'])->name('newsletter.unsubscribe');
    });

});
