<?php

use App\Http\Controllers\Admin\AdminOrderController;
use App\Http\Controllers\Auth\SocialiteController;
use App\Http\Controllers\Blog\BlogController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\Dashboard\DashboardController;
use App\Http\Controllers\Home\HomeController;
use App\Http\Controllers\Main\LocationController;
use App\Http\Controllers\Main\PaymentController as MainPaymentController;
use App\Http\Controllers\Main\VendorRegistrationController;
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
use App\Http\Controllers\Shop\PaymentController;
use App\Http\Controllers\Shop\ProductController;
use App\Http\Controllers\Shop\PromotionController;
use App\Http\Controllers\Shop\ReturnController;
use App\Http\Controllers\Shop\ReviewController;
use App\Http\Controllers\Shop\WishlistController;
use App\Http\Controllers\Vendor\VendorDashboardController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Routes authentifiées (dashboard général)
|--------------------------------------------------------------------------
*/
foreach (config('tenancy.central_domains') as $domain) {
    Route::domain($domain)->group(function () {
        Route::get('/', [HomeController::class, 'homeIndex'])->name('home');

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

        Route::middleware('auth:sanctum')->group(function () {
            Route::get('/countries', [LocationController::class, 'countries'])->name('addresses.countries');
            Route::get('/countries/{country}/cities', [LocationController::class, 'cities'])->name('addresses.cities');
        });

        // Webhook Stripe (pas de middleware auth)
        Route::post('/stripe/webhook', [MainPaymentController::class, 'webhook'])
            ->name('stripe.webhook');
        /*
        |--------------------------------------------------------------------------
        | ROUTES PAGES STATIQUES (aide, conditions, politique de confidentialité, etc.)
        |--------------------------------------------------------------------------
        */
        Route::prefix('search')->name('search.')->group(function () {
            Route::get('/api/search', [SearchController::class, 'shopSearch'])->name('search');
            Route::get('/search', [SearchController::class, 'shopApi'])->name('api');
        });

        Route::prefix('page')->name('page.')->group(function () {
            Route::get('/contact', [ContactController::class, 'contactIndex'])->name('contact');
            Route::post('/contact', [ContactController::class, 'contactStore'])->name('contact.store');

            Route::get('/help', [PageController::class, 'pageHelp'])->name('help');
            Route::get('/about', [PageController::class, 'pageAbout'])->name('about');
            Route::get('/terms', [PageController::class, 'pageTerms'])->name('terms');
            Route::get('/privacy', [PageController::class, 'pagePrivacy'])->name('privacy');
            Route::get('/cookies', [PageController::class, 'pageCookies'])->name('cookies');
            Route::get('/support', [PageController::class, 'pageSupport'])->name('support');
            Route::get('/faq', [PageController::class, 'pageFaq'])->name('faq');
            Route::get('/testimonials', [PageController::class, 'pageTestimonials'])->name('testimonials');
        });
        /*
        |--------------------------------------------------------------------------
        | ROUTES BLOG PUBLIQUES
        |--------------------------------------------------------------------------
        */
        Route::prefix('blog')->name('blog.')->group(function () {
            Route::get('/', [BlogController::class, 'blogIndex'])->name('index');
            Route::get('/category/{category:slug}', [BlogController::class, 'blogByCategory'])->name('category');
            Route::get('/{post:slug}', [BlogController::class, 'blogShow'])->name('show');
            Route::post('/{post}/comment', [BlogController::class, 'blogComment'])->middleware('auth')->name('comment');
            Route::post('/{post}/like', [BlogController::class, 'blogLike'])->middleware('auth')->name('like');
        });

        /*
        |--------------------------------------------------------------------------
        | ROUTES GESTION BLOG ADMIN
        |--------------------------------------------------------------------------
        */
        Route::middleware(['auth', 'verified'])->group(function () {

            Route::prefix('dashboard')->name('dashboard.')->group(function () {
                Route::get('/', [DashboardController::class, 'adminDashboardIndex'])->name('index');
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
        Route::prefix('product/category')->name('product.category.')->group(function () {
            Route::get('/', [CategoryController::class, 'categoriesIndex'])->name('index');
            Route::get('/{category:slug}', [CategoryController::class, 'categoriesShow'])->name('show');
        });

        // =====================
        // PRODUITS
        // =====================
        Route::prefix('product')->name('product.')->group(function () {
            Route::get('/', [ProductController::class, 'productsIndex'])->name('index');
            Route::get('/quick-view/{produit:slug}', [ProductController::class, 'productsQuickView'])->name('quick-view');
            Route::get('/{produit:slug}', [ProductController::class, 'productsShow'])->name('show');
            Route::post('/search/by-image', [ProductController::class, 'searchByImage'])->name('search.by-image');
            Route::get('/{produit:slug}/reviews', [ReviewController::class, 'productsReviewsIndex'])->name('reviews.index');
        });

        // Marques
        Route::get('/brands', [BrandController::class, 'brandsIndex'])->name('brands.index');
        Route::get('brands/{brand:slug}', [BrandController::class, 'brandsShow'])->name('brands.show');

        // Promotions
        Route::get('/promotions', [PromotionController::class, 'promotionsIndex'])->name('promotions.index');

        // Panier
        Route::prefix('cart')->name('cart.')->group(function () {
            Route::get('/', [CartController::class, 'cartIndex'])->name('index');
            Route::post('/add/{produit}', [CartController::class, 'cartAdd'])->name('add');
            Route::patch('/update/{item}', [CartController::class, 'cartUpdate'])->name('update');
            Route::delete('/remove/{item}', [CartController::class, 'cartRemove'])->name('remove');
            Route::post('/clear', [CartController::class, 'cartClear'])->name('clear');
            Route::post('/apply-coupon', [CartController::class, 'cartApplyCoupon'])->name('apply-coupon');
            Route::delete('/remove-coupon', [CartController::class, 'cartRemoveCoupon'])->name('remove-coupon');
            Route::post('/calculate', [CartController::class, 'cartCalculate'])->name('calculate');
        });

        // Wishlist
        Route::prefix('wishlist')->name('wishlist.')->group(function () {
            Route::get('/', [WishlistController::class, 'wishlistIndex'])->name('index');
            Route::post('/toggle/{produit}', [WishlistController::class, 'wishlistToggle'])->name('toggle');
            Route::delete('/remove/{produit}', [WishlistController::class, 'wishlistRemove'])->name('remove');
        });

        /*
        |--------------------------------------------------------------------------
        | ROUTES E-COMMERCE CLIENT (nécessite authentification)
        |--------------------------------------------------------------------------
        */
        Route::middleware(['auth', 'verified'])->group(function () {

            Route::get('/account', [AccountDashboardController::class, 'AccountDashboardIndex'])->name('account.dashboard.index');

            // Checkout et commandes
            Route::prefix('checkout')->name('checkout.')->group(function () {
                Route::get('/', [CheckoutController::class, 'checkoutIndex'])->name('index');
                Route::post('/process', [CheckoutController::class, 'checkoutProcess'])->name('process');
                Route::get('/success/{commande}', [CheckoutController::class, 'checkoutSuccess'])->name('success');
                Route::get('/cancel', [CheckoutController::class, 'checkoutCancel'])->name('cancel');
            });

            // Commandes client
            Route::prefix('orders')->name('orders.')->group(function () {
                Route::get('/', [OrderController::class, 'ordersIndex'])->name('index');
                Route::get('/{commande}', [OrderController::class, 'ordersShow'])->name('show');
                Route::post('/{commande}/cancel', [OrderController::class, 'ordersCancel'])->name('cancel');
                Route::get('/{commande}/invoice', [OrderController::class, 'ordersInvoice'])->name('invoice');
                Route::get('/admin/{commande}/invoice', [AdminOrderController::class, 'adminOrdersInvoice'])->name('admin.invoice');
            });

            // Retours et remboursements
            Route::prefix('return')->name('return.')->group(function () {
                Route::get('/', [ReturnController::class, 'returnsIndex'])->name('index');
                Route::get('/{commande}/request', [ReturnController::class, 'returnsCreate'])->name('create');
                Route::post('/', [ReturnController::class, 'returnsStore'])->name('store');
                Route::get('/{retour}', [ReturnController::class, 'returnsShow'])->name('show');
            });

            // Adresses
            Route::prefix('addresses')->group(function () {
                Route::resource('addresses', AddressController::class)->except(['edit', 'create']);
                Route::post('/{address}/default', [AddressController::class, 'addressesSetDefault'])->name('addresses.default');
            });
            // Paiements

            Route::prefix('payment')->name('payment.')->group(function () {
                Route::post('/{commande}/pay', [PaymentController::class, 'paymentPay'])->name('pay');
                Route::get('/callback', [PaymentController::class, 'PaymentCallback'])->name('callback');
            });
            // Avis produits (écriture)

            Route::prefix('product')->name('products.')->group(function () {
                Route::post('/{produit}/review', [ReviewController::class, 'productsReviewsStore'])->name('reviews.store');
                Route::put('/review/{avis}', [ReviewController::class, 'productsReviewsUpdate'])->name('reviews.update');
                Route::delete('/review/{avis}', [ReviewController::class, 'productsReviewsDestroy'])->name('reviews.destroy');
            });

            // Programme de fidélité
            Route::prefix('loyalty')->name('loyalty.')->group(function () {
                Route::get('/', [LoyaltyController::class, 'loyaltyIndex'])->name('index');
                Route::post('/redeem', [LoyaltyController::class, 'loyaltyRedeem'])->name('redeem');
            });
            // Newsletter

            Route::prefix('newsletter')->name('newsletter.')->group(function () {
                Route::post('/subscribe', [NewsletterController::class, 'newsletterSubscribe'])->name('subscribe');
                Route::post('/unsubscribe', [NewsletterController::class, 'newsletterUnsubscribe'])->name('unsubscribe');
            });
        });

    });
}

/*
|--------------------------------------------------------------------------
| Inclure les routes settings (fichier externe)
|--------------------------------------------------------------------------
*/
require __DIR__.'/settings.php';
