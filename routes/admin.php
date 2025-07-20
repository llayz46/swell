<?php

use App\Http\Controllers\Admin\BannerController;
use App\Http\Controllers\Admin\BrandController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\ProductGroupController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\Admin\CategoryController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', AdminController::class)->name('dashboard');

    Route::resource('categories', CategoryController::class)
        ->only(['index', 'store', 'update', 'destroy']);

    Route::resource('brands', BrandController::class)->only(['index', 'store', 'destroy']);
    Route::post('brands/{brand}', [BrandController::class, 'update'])->name('brands.update');

    Route::resource('products', ProductController::class)
        ->only(['index', 'show', 'create', 'edit', 'store', 'destroy'])->scoped([
            'product' => 'slug',
        ]);
    Route::post('products/{product}', [ProductController::class, 'update'])
        ->name('products.update');

    Route::post('groups', ProductGroupController::class)->name('groups.store');

    Route::get('/banners', [BannerController::class, 'index'])->name('banners.index');
    Route::put('/banners/ordering', [BannerController::class, 'ordering'])->name('banners.ordering');
    Route::put('/banners/{bannerMessage}', [BannerController::class, 'update'])->name('banners.update');
    Route::post('/banners', [BannerController::class, 'store'])->name('banners.store');
    Route::delete('/banners/{banner}', [BannerController::class, 'destroy'])->name('banners.destroy');
});
