<?php

use App\Http\Controllers\BrandController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductCommentController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\PromotionController;
use App\Http\Controllers\WishlistController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', HomeController::class)->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard/dashboard');
    })->name('dashboard');

    Route::prefix('wishlist')->group(function () {
        Route::get('/', [WishlistController::class, 'index'])->name('wishlist.index');
        Route::post('/add', [WishlistController::class, 'store'])->name('wishlist.add');
        Route::post('/remove', [WishlistController::class, 'update'])->name('wishlist.remove');
        Route::post('/clear', [WishlistController::class, 'destroy'])->name('wishlist.clear');
    });

    Route::prefix('checkout')->group(function () {
        Route::get('/', [CartController::class, 'checkout'])->name('cart.checkout');
        Route::get('/success', [CartController::class, 'success'])->name('checkout.success');
        Route::get('/{product}', [CartController::class, 'buy'])->name('cart.buy');
    });

    Route::get('/orders', [OrderController::class, 'index'])->name('orders.index');

    Route::post('/comments', [ProductCommentController::class, 'store'])->name('comments.store');
    Route::put('/comments/{productComment}', [ProductCommentController::class, 'update'])->name('comments.update');
});

Route::prefix('categories')->group(function () {
    Route::get('/{category:slug}', CategoryController::class)->name('category.show');
});

Route::prefix('cart')->group(function () {
    Route::get('/', [CartController::class, 'index'])->name('cart.index');
    Route::post('/add', [CartController::class, 'addItem'])->name('cart.add');
    Route::post('/remove', [CartController::class, 'removeItem'])->name('cart.remove');
    Route::post('/clear/{cart}', [CartController::class, 'clear'])->name('cart.clear');
    Route::put('/update', [CartController::class, 'handleItemQuantity'])->name('cart.update');
});

Route::get('/brands', [BrandController::class, 'index'])->name('brand.index');
Route::get('/brands/{brand:slug}', [BrandController::class, 'show'])->name('brand.show');

Route::get('/promotions', PromotionController::class)->name('promotions');
Route::get('/news', NewsController::class)->name('news');

Route::get('/products', [ProductController::class, 'index'])->name('product.index');
Route::get('/products/{product:slug}', [ProductController::class, 'show'])->name('product.show');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/admin.php';
