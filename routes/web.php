<?php

use App\Http\Controllers\Admin\AdminOrderController;
use App\Http\Controllers\Auth\SocialiteController;
use App\Http\Controllers\Blog\BlogController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\Dashboard\DashboardController;
use App\Http\Controllers\Home\HomeController;
use App\Http\Controllers\Pages\PageController;
use App\Http\Controllers\Posts\MediaController;
use App\Http\Controllers\Posts\PostController;
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
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Routes authentifiées (dashboard général)
|--------------------------------------------------------------------------
*/
foreach (config('tenancy.central_domains') as $domain) {
    Route::domain($domain)->group(function () {
        Route::get('/', [HomeController::class, 'index']);
    });
}
/*
|--------------------------------------------------------------------------
| ROUTES PUBLICS (contact, recherche, etc.)
|--------------------------------------------------------------------------
*/
Route::get('/contact', [ContactController::class, 'index'])->name('contact.index');
Route::post('/contact', [ContactController::class, 'store'])->name('contact.store');
Route::get('/api/search', [SearchController::class, 'api'])->name('search.api');
Route::get('/search', [SearchController::class, 'search'])->name('search');

/*
|--------------------------------------------------------------------------
| ROUTES PAGES STATIQUES (aide, conditions, politique de confidentialité, etc.)
|--------------------------------------------------------------------------
*/
Route::prefix('nmarket')->name('nmarket.')->group(function () {
    Route::get('/help', [PageController::class, 'help'])->name('help');
    Route::get('/about', [PageController::class, 'about'])->name('about');
    Route::get('/terms', [PageController::class, 'terms'])->name('terms');
    Route::get('/privacy', [PageController::class, 'privacy'])->name('privacy');
    Route::get('/cookies', [PageController::class, 'cookies'])->name('cookies');
    Route::get('/support', [PageController::class, 'support'])->name('support');
    Route::get('/faq', [PageController::class, 'faq'])->name('faq');
    Route::get('/testimonials', [PageController::class, 'testimonials'])->name('list');
});

/*
|--------------------------------------------------------------------------
| ROUTES BLOG PUBLIQUES
|--------------------------------------------------------------------------
*/
Route::prefix('blog')->name('blog.')->group(function () {
    Route::get('/', [BlogController::class, 'index'])->name('index');
    Route::get('/category/{category:slug}', [BlogController::class, 'byCategory'])->name('category');
    Route::get('/{post:slug}', [BlogController::class, 'show'])->name('show');
    Route::post('/{post}/comment', [BlogController::class, 'comment'])->name('comment')->middleware('auth');
    Route::post('/{post}/like', [BlogController::class, 'like'])->name('like')->middleware('auth');
});

Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::post('/posts/reorder', [DashboardController::class, 'reorder'])->name('posts.reorder');

    /** Gestion des posts */
    Route::prefix('posts')->name('post.')->group(function () {
        Route::get('/', [PostController::class, 'index'])->name('list');
        Route::get('/create', [PostController::class, 'create'])->name('create');
        Route::post('/', [PostController::class, 'store'])->name('store');
        Route::get('/{post:slug}', [PostController::class, 'show'])->name('show');
        Route::get('/{post:slug}/edit', [PostController::class, 'edit'])->name('edit');
        Route::put('/{post}', [PostController::class, 'update'])->name('update');
        Route::delete('/{post}', [PostController::class, 'destroy'])->name('destroy');
        Route::post('/bulk-delete', [PostController::class, 'bulkDelete'])->name('bulk-delete');
        Route::post('/bulk-status', [PostController::class, 'bulkStatus'])->name('bulk-status');
        Route::post('/{post}/toggle-pin', [PostController::class, 'togglePin'])->name('toggle-pin');
        Route::post('/{post}/duplicate', [PostController::class, 'duplicate'])->name('duplicate');
    });

    /** Gestion des media */
    Route::post('/media/upload', [MediaController::class, 'upload'])->name('media.upload');
    Route::delete('/media/{media}', [MediaController::class, 'destroy'])->name('media.destroy');

    Route::prefix('categories')->name('category.')->group(function () {
        Route::get('category/{category}', [PostController::class, 'show'])->name('show');
    });
});

Route::middleware('guest')->group(function () {
    Route::get('/auth/{provider}/redirect', [SocialiteController::class, 'redirect'])
        ->name('socialite.redirect');
    Route::get('/auth/{provider}/callback', [SocialiteController::class, 'callback'])
        ->name('socialite.callback');
});

/*
|--------------------------------------------------------------------------
| ROUTES AUTHENTIFIÉES (commentaires, avis, wishlist)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/comments', [CommentController::class, 'index']);
    Route::post('/comments', [CommentController::class, 'store']);
    Route::post('/comments/{comment}/like', [CommentController::class, 'like']);
    Route::post('/comments/{comment}/report', [CommentController::class, 'report']);
});

/*
|--------------------------------------------------------------------------
| ROUTES E-COMMERCE PUBLIQUES
|--------------------------------------------------------------------------
*/
Route::prefix('shop')->name('shop.')->group(function () {

    Route::post('/search/by-image', [ProductController::class, 'searchByImage'])->name('search.by-image');
    // Catalogue produits
    Route::get('/products', [ProductController::class, 'index'])->name('products.index');
    Route::get('/product/{produit:slug}', [ProductController::class, 'show'])->name('products.show');
    Route::get('/quick-view/{produit:slug}', [ProductController::class, 'quickView'])->name('products.quick-view');

    // Catégories
    Route::get('/categories', [CategoryController::class, 'index'])->name('categories.index');
    Route::get('/category/{category:slug}', [CategoryController::class, 'show'])->name('categories.show');

    // Marques
    Route::get('/brands', [BrandController::class, 'index'])->name('brands.index');
    Route::get('/brand/{brand:slug}', [BrandController::class, 'show'])->name('brands.show');

    // Promotions
    Route::get('/promotions', [PromotionController::class, 'index'])->name('promotions.index');

    // Panier
    Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
    Route::post('/cart/add/{produit}', [CartController::class, 'add'])->name('cart.add');
    Route::patch('/cart/update/{item}', [CartController::class, 'update'])->name('cart.update');
    Route::delete('/cart/remove/{item}', [CartController::class, 'remove'])->name('cart.remove');
    Route::post('/cart/clear', [CartController::class, 'clear'])->name('cart.clear');
    Route::post('/cart/apply-coupon', [CartController::class, 'applyCoupon'])->name('cart.coupon.apply');
    Route::delete('/cart/remove-coupon', [CartController::class, 'removeCoupon'])->name('cart.coupon.remove');
    Route::post('/cart/calculate', [CartController::class, 'calculate'])->name('cart.calculate');
    // Wishlist
    Route::get('/wishlist', [WishlistController::class, 'index'])->name('wishlist.index');
    Route::post('/wishlist/toggle/{produit}', [WishlistController::class, 'toggle'])->name('wishlist.toggle');
    Route::delete('/wishlist/remove/{produit}', [WishlistController::class, 'remove'])->name('wishlist.remove');

    // Avis produits (lecture)
    Route::get('/product/{produit:slug}/reviews', [ReviewController::class, 'index'])->name('products.reviews.index');
});

/*
|--------------------------------------------------------------------------
| ROUTES E-COMMERCE CLIENT (nécessite authentification)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified'])->prefix('shop')->name('shop.')->group(function () {
    Route::get('/account', [AccountDashboardController::class, 'index'])->name('dashboard');

    // Checkout et commandes
    Route::get('/checkout', [CheckoutController::class, 'index'])->name('checkout.index');
    Route::post('/checkout/process', [CheckoutController::class, 'process'])->name('checkout.process');
    Route::get('/checkout/success/{commande}', [CheckoutController::class, 'success'])->name('checkout.success');
    Route::get('/checkout/cancel', [CheckoutController::class, 'cancel'])->name('checkout.cancel');

    // Commandes client
    Route::get('/orders', [OrderController::class, 'index'])->name('orders.index');
    Route::get('/order/{commande}', [OrderController::class, 'show'])->name('orders.show');
    Route::post('/order/{commande}/cancel', [OrderController::class, 'cancel'])->name('orders.cancel');
    Route::get('/order/{commande}/invoice', [OrderController::class, 'invoice'])->name('orders.invoice');
    Route::get('/admin/orders/{commande}/invoice', [AdminOrderController::class, 'invoice'])->name('admin.orders.invoice');
    // Retours et remboursements
    Route::get('/returns', [ReturnController::class, 'index'])->name('returns.index');
    Route::get('/return/{commande}/request', [ReturnController::class, 'create'])->name('returns.create');
    Route::post('/return', [ReturnController::class, 'store'])->name('returns.store');
    Route::get('/return/{retour}', [ReturnController::class, 'show'])->name('returns.show');

    // Adresses
    Route::resource('addresses', AddressController::class)->except(['edit', 'create']);
    Route::post('/addresses/{address}/default', [AddressController::class, 'setDefault'])->name('addresses.default');

    // Paiements
    Route::post('/payment/{commande}/pay', [PaymentController::class, 'pay'])->name('payment.pay');
    Route::get('/payment/callback', [PaymentController::class, 'callback'])->name('payment.callback');

    // Avis produits (écriture)
    Route::post('/product/{produit}/review', [ReviewController::class, 'store'])->name('products.reviews.store');
    Route::put('/review/{avis}', [ReviewController::class, 'update'])->name('products.reviews.update');

    // Programme de fidélité
    Route::get('/loyalty', [LoyaltyController::class, 'index'])->name('loyalty.index');
    Route::post('/loyalty/redeem', [LoyaltyController::class, 'redeem'])->name('loyalty.redeem');

    // Newsletter
    Route::post('/newsletter/subscribe', [NewsletterController::class, 'subscribe'])->name('newsletter.subscribe');
    Route::post('/newsletter/unsubscribe', [NewsletterController::class, 'unsubscribe'])->name('newsletter.unsubscribe');
});

/*
|--------------------------------------------------------------------------
| Routes publiques (pages statiques, blog, contact)
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| ROUTES ADMIN E-COMMERCE (dashboard d'administration)
|--------------------------------------------------------------------------
*/
// Route::middleware(['auth', 'verified', 'can:access-admin'])->prefix('admin')->name('admin.')->group(function () {

//     // Tableau de bord admin
//     Route::get('/', [App\Http\Controllers\Admin\DashboardController::class, 'index'])->name('dashboard');

//     // Gestion des produits
//     Route::resource('products', App\Http\Controllers\Admin\ProductController::class);
//     Route::post('products/bulk-delete', [App\Http\Controllers\Admin\ProductController::class, 'bulkDelete'])->name('products.bulk-delete');
//     Route::post('products/bulk-status', [App\Http\Controllers\Admin\ProductController::class, 'bulkStatus'])->name('products.bulk-status');
//     Route::post('products/{produit}/duplicate', [App\Http\Controllers\Admin\ProductController::class, 'duplicate'])->name('products.duplicate');
//     Route::post('products/{produit}/media/upload', [App\Http\Controllers\Admin\ProductController::class, 'uploadMedia'])->name('products.media.upload');
//     Route::delete('products/media/{media}', [App\Http\Controllers\Admin\ProductController::class, 'deleteMedia'])->name('products.media.delete');

//     // Gestion des variantes
//     Route::resource('products.variants', App\Http\Controllers\Admin\ProductVariantController::class)->shallow();
//     Route::post('variants/bulk-update', [App\Http\Controllers\Admin\ProductVariantController::class, 'bulkUpdate'])->name('variants.bulk-update');

//     // Gestion des catégories
//     Route::resource('categories', App\Http\Controllers\Admin\CategoryController::class);
//     Route::post('categories/reorder', [App\Http\Controllers\Admin\CategoryController::class, 'reorder'])->name('categories.reorder');

//     // Gestion des marques
//     Route::resource('brands', App\Http\Controllers\Admin\BrandController::class);

//     // Gestion des commandes
//     Route::resource('orders', App\Http\Controllers\Admin\OrderController::class);
//     Route::post('orders/{commande}/status', [App\Http\Controllers\Admin\OrderController::class, 'updateStatus'])->name('orders.status');
//     Route::post('orders/{commande}/tracking', [App\Http\Controllers\Admin\OrderController::class, 'addTracking'])->name('orders.tracking');
//     Route::get('orders/{commande}/invoice', [App\Http\Controllers\Admin\OrderController::class, 'invoice'])->name('orders.invoice');
//     Route::post('orders/{commande}/cancel', [App\Http\Controllers\Admin\OrderController::class, 'cancel'])->name('orders.cancel');

//     // Gestion des clients
//     Route::resource('customers', App\Http\Controllers\Admin\CustomerController::class);
//     Route::post('customers/{client}/impersonate', [App\Http\Controllers\Admin\CustomerController::class, 'impersonate'])->name('customers.impersonate');
//     Route::get('customers/{client}/orders', [App\Http\Controllers\Admin\CustomerController::class, 'orders'])->name('customers.orders');

//     // Gestion des promotions et coupons
//     Route::resource('promotions', App\Http\Controllers\Admin\PromotionController::class);
//     Route::resource('coupons', App\Http\Controllers\Admin\CouponController::class);
//     Route::post('coupons/generate', [App\Http\Controllers\Admin\CouponController::class, 'generate'])->name('coupons.generate');

//     // Gestion des retours/remboursements
//     Route::resource('returns', App\Http\Controllers\Admin\ReturnController::class)->only(['index', 'show', 'update']);
//     Route::post('returns/{retour}/approve', [App\Http\Controllers\Admin\ReturnController::class, 'approve'])->name('returns.approve');
//     Route::post('returns/{retour}/reject', [App\Http\Controllers\Admin\ReturnController::class, 'reject'])->name('returns.reject');
//     Route::post('returns/{retour}/refund', [App\Http\Controllers\Admin\ReturnController::class, 'refund'])->name('returns.refund');

//     // Gestion du stock et inventaire
//     Route::get('inventory', [App\Http\Controllers\Admin\InventoryController::class, 'index'])->name('inventory.index');
//     Route::post('inventory/adjust', [App\Http\Controllers\Admin\InventoryController::class, 'adjust'])->name('inventory.adjust');
//     Route::get('inventory/movements', [App\Http\Controllers\Admin\InventoryController::class, 'movements'])->name('inventory.movements');
//     Route::resource('warehouses', App\Http\Controllers\Admin\WarehouseController::class);

//     // Gestion des fournisseurs
//     Route::resource('suppliers', App\Http\Controllers\Admin\SupplierController::class);
//     Route::post('suppliers/{fournisseur}/products', [App\Http\Controllers\Admin\SupplierController::class, 'attachProducts'])->name('suppliers.products.attach');

//     // Gestion des achats (commandes fournisseurs)
//     Route::resource('purchases', App\Http\Controllers\Admin\PurchaseOrderController::class);
//     Route::post('purchases/{commandeAchat}/receive', [App\Http\Controllers\Admin\PurchaseOrderController::class, 'receive'])->name('purchases.receive');

//     // Avis clients
//     Route::resource('reviews', App\Http\Controllers\Admin\ReviewController::class)->only(['index', 'show', 'update', 'destroy']);
//     Route::post('reviews/{avis}/approve', [App\Http\Controllers\Admin\ReviewController::class, 'approve'])->name('reviews.approve');
//     Route::post('reviews/{avis}/reject', [App\Http\Controllers\Admin\ReviewController::class, 'reject'])->name('reviews.reject');

//     // Gestion des taxes
//     Route::resource('taxes', App\Http\Controllers\Admin\TaxController::class);

//     // Gestion des devises
//     Route::resource('currencies', App\Http\Controllers\Admin\CurrencyController::class)->except(['show']);

//     // Gestion des paniers abandonnés
//     Route::get('abandoned-carts', [App\Http\Controllers\Admin\AbandonedCartController::class, 'index'])->name('abandoned-carts.index');
//     Route::post('abandoned-carts/{panier}/send-reminder', [App\Http\Controllers\Admin\AbandonedCartController::class, 'sendReminder'])->name('abandoned-carts.remind');

//     // Newsletter
//     Route::resource('newsletter', App\Http\Controllers\Admin\NewsletterController::class)->only(['index', 'create', 'store', 'show']);
//     Route::post('newsletter/send', [App\Http\Controllers\Admin\NewsletterController::class, 'send'])->name('newsletter.send');
//     Route::resource('newsletter-subscribers', App\Http\Controllers\Admin\NewsletterSubscriberController::class)->only(['index', 'destroy']);

//     // Rapports
//     Route::get('reports/sales', [App\Http\Controllers\Admin\ReportController::class, 'sales'])->name('reports.sales');
//     Route::get('reports/products', [App\Http\Controllers\Admin\ReportController::class, 'products'])->name('reports.products');
//     Route::get('reports/customers', [App\Http\Controllers\Admin\ReportController::class, 'customers'])->name('reports.customers');

//     // Configuration e-commerce
//     Route::get('settings/shop', [App\Http\Controllers\Admin\SettingController::class, 'shop'])->name('settings.shop');
//     Route::put('settings/shop', [App\Http\Controllers\Admin\SettingController::class, 'updateShop'])->name('settings.shop.update');
// });

/*
|--------------------------------------------------------------------------
| Inclure les routes settings (fichier externe)
|--------------------------------------------------------------------------
*/
require __DIR__.'/settings.php';
