<?php

declare(strict_types=1);

use App\Http\Controllers\Admin\AdminOrderController;
use App\Http\Controllers\Auth\SocialiteController;
use App\Http\Controllers\Blog\BlogController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\Dashboard\DashboardController;
use App\Http\Controllers\Home\HomeController;
use App\Http\Controllers\Main\LocationController;
use App\Http\Controllers\Pages\PageController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\Settings\SecurityController;
use App\Http\Controllers\Shop\AccountDashboardController;
use App\Http\Controllers\Shop\AddressController;
use App\Http\Controllers\Shop\BrandController;
use App\Http\Controllers\Shop\CartController;
use App\Http\Controllers\Shop\CategoryController;
use App\Http\Controllers\Shop\CheckoutController;
use App\Http\Controllers\Shop\LoyaltyController;
use App\Http\Controllers\Shop\NewsletterController;
use App\Http\Controllers\Shop\OrderController;
use App\Http\Controllers\Shop\PaymentController;
use App\Http\Controllers\Shop\ProductController;
use App\Http\Controllers\Shop\PromotionController;
use App\Http\Controllers\Shop\ReturnController;
use App\Http\Controllers\Shop\ReviewController;
use App\Http\Controllers\Shop\WishlistController;
use App\Http\Controllers\Vendor\VendorDashboardController;
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
    Route::get('/', [HomeController::class, 'homeIndex'])->name('tenant.home');

    /*
      |--------------------------------------------------------------------------
      | ROUTES AUTHENTIFICATION TENANT (acheteurs)
      |--------------------------------------------------------------------------
      */
    Route::middleware('guest')->name('tenant.')->group(function () {
        Route::get('/login', function () {
            return inertia('auth/login', [
                'canResetPassword' => true,
                'canRegister' => true,
            ]);
        })->name('login');

        Route::get('/register', function () {
            return inertia('auth/register');
        })->name('register');

        Route::get('/forgot-password', function () {
            return inertia('auth/forgot-password');
        })->name('password.request');

        Route::get('/reset-password/{token}', function (Request $request, $token) {
            return inertia('auth/reset-password', [
                'email' => $request->email,
                'token' => $token,
            ]);
        })->name('password.reset');
    });

    /*
      |--------------------------------------------------------------------------
      | ROUTES PUBLICS TENANT
      |--------------------------------------------------------------------------
      */
    Route::middleware(['auth'])->group(function () {

        Route::prefix('admin')->group(function () {
            Route::get('/dashboard', [DashboardController::class, 'adminDashboardIndex'])->name('dashboard');
        });

        Route::get('/vendor/dashboard', [VendorDashboardController::class, 'index'])
            ->name('vendor.dashboard');

        Route::redirect('settings', '/settings/profile');

        Route::get('settings/profile', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::patch('settings/profile', [ProfileController::class, 'update'])->name('profile.update');
    });

    /*
    |--------------------------------------------------------------------------
    | ROUTES PUBLICS TENANT
    |--------------------------------------------------------------------------
    */
    Route::middleware(['auth', 'verified'])->group(function () {
        Route::delete('settings/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

        Route::get('settings/security', [SecurityController::class, 'edit'])->name('security.edit');

        Route::put('settings/password', [SecurityController::class, 'update'])
            ->middleware('throttle:6,1')
            ->name('user-password.update');

        Route::inertia('settings/appearance', 'settings/appearance')->name('appearance.edit');
    });
    /*
    |--------------------------------------------------------------------------
    | ROUTES PUBLICS TENANT
    |--------------------------------------------------------------------------
    */
    Route::name('tenant.')->group(function () {

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

        Route::prefix('page')->group(function () {
            Route::get('/contact', [ContactController::class, 'contactIndex'])->name('page.contact');
            Route::post('/contact', [ContactController::class, 'contactStore'])->name('page.contact.store');

            Route::get('/help', [PageController::class, 'pageHelp'])->name('page.help');
            Route::get('/about', [PageController::class, 'pageAbout'])->name('page.about');
            Route::get('/terms', [PageController::class, 'pageTerms'])->name('page.terms');
            Route::get('/privacy', [PageController::class, 'pagePrivacy'])->name('page.privacy');
            Route::get('/cookies', [PageController::class, 'pageCookies'])->name('page.cookies');
            Route::get('/support', [PageController::class, 'pageSupport'])->name('page.support');
            Route::get('/faq', [PageController::class, 'pageFaq'])->name('page.faq');
            Route::get('/testimonials', [PageController::class, 'pageTestimonials'])->name('page.testimonials');
        });
        /*
        |--------------------------------------------------------------------------
        | ROUTES BLOG PUBLIQUES
        |--------------------------------------------------------------------------
        */
        Route::prefix('blog')->group(function () {
            Route::get('/', [BlogController::class, 'blogIndex'])->name('blog.index');
            Route::get('/category/{category:slug}', [BlogController::class, 'blogByCategory'])->name('blog.category');
            Route::get('/{post:slug}', [BlogController::class, 'blogShow'])->name('blog.show');
            Route::post('/{post}/comment', [BlogController::class, 'blogComment'])->middleware('auth')->name('blog.comment');
            Route::post('/{post}/like', [BlogController::class, 'blogLike'])->middleware('auth')->name('blog.like');
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
        Route::middleware('auth:sanctum')->prefix('comments')->name('comments.')->group(function () {
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

            Route::get('/account', [AccountDashboardController::class, 'AccountDashboardIndex'])->name('account.dashboard.index');

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
        });
    });

    Route::get('/subscription/required', function () {
        return inertia('Subscription/Required');
    })->name('tenant.subscription.required');

});
