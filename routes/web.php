<?php

use App\Http\Controllers\BrandController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\PromotionController;
use App\Modules\Loyalty\Http\Controllers\LoyaltyController;
use App\Modules\Review\Http\Controllers\ReviewController;
use App\Modules\Wishlist\Http\Controllers\WishlistController;
use App\Modules\Workspace\Http\Controllers\WorkspaceDashboardController;
use App\Modules\Workspace\Http\Controllers\WorkspaceIssueController;
use App\Modules\Workspace\Http\Controllers\WorkspaceMembersController;
use App\Modules\Workspace\Http\Controllers\WorkspaceTeamController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', HomeController::class)->name('home');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard/dashboard');
    })->name('dashboard');

    Route::get('/orders', [OrderController::class, 'index'])->name('orders.index');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::prefix('checkout')->group(function () {
        Route::get('/', [CartController::class, 'checkout'])->name('cart.checkout');
        Route::get('/success', [CartController::class, 'success'])->name('checkout.success');
        Route::post('/', [CartController::class, 'buy'])->name('cart.buy');
    });

    Route::middleware('feature:wishlist')->prefix('wishlist')->group(function () {
        Route::get('/', [WishlistController::class, 'index'])->name('wishlist.index');
        Route::post('/add', [WishlistController::class, 'store'])->name('wishlist.add');
        Route::post('/remove', [WishlistController::class, 'update'])->name('wishlist.remove');
        Route::post('/clear', [WishlistController::class, 'destroy'])->name('wishlist.clear');
    });

    Route::middleware('feature:review')->prefix('reviews')->group(function () {
        Route::post('/', [ReviewController::class, 'store'])->name('reviews.store');
        Route::put('/{Review}', [ReviewController::class, 'update'])->name('reviews.update');
    });

    Route::middleware('feature:loyalty')->prefix('loyalty')->group(function () {
        Route::get('/', [LoyaltyController::class, 'index'])->name('loyalty.index');
    });

    Route::middleware(['role:workspace-admin|team-lead|team-member', 'feature:workspace'])
        ->prefix('workspace')->name('workspace.')->group(function () {
            Route::get('/', WorkspaceDashboardController::class)->name('index');

            //     Route::prefix('inbox')->name('inbox.')->group(function () {
            //         Route::get('/', [WorkspaceInboxController::class, 'index'])->name('index');
            //         Route::put('/{inboxItem}', [WorkspaceInboxController::class, 'markAsRead'])->name('read');
            //         Route::post('/read-all', [WorkspaceInboxController::class, 'markAllAsRead'])->name('read-all');
            //     });

            //     Route::get('/my-issues', WorkspaceMyIssuesController::class)->name('my-issues');

            Route::get('/members', WorkspaceMembersController::class)->name('members');

            Route::prefix('teams')->name('teams.')->group(function () {
                Route::get('/', [WorkspaceTeamController::class, 'index'])->name('index');
                //         Route::post('/', [WorkspaceTeamController::class, 'store'])
                //             ->middleware('permission:workspace.teams.create')
                //             ->name('store');

                Route::get('/{team:identifier}/issues', [WorkspaceTeamController::class, 'issues'])->name('issues');
                Route::get('/{team:identifier}/members', [WorkspaceTeamController::class, 'members'])->name('members');
                //         Route::put('/{team}', [WorkspaceTeamController::class, 'update'])->name('update');
                //         Route::delete('/{team}', [WorkspaceTeamController::class, 'destroy'])->name('destroy');
                //         Route::post('/{team}/invite', [WorkspaceTeamController::class, 'invite'])->name('invite');
                //         Route::post('/{team}/leave', [WorkspaceTeamController::class, 'leave'])->name('leave');
                //         Route::delete('/{team}/remove/{user}', [WorkspaceTeamController::class, 'removeMember'])->name('remove-member');
                //         Route::post('/{team}/join', [WorkspaceTeamController::class, 'join'])->name('join');

                //         // Transfert de lead (team-lead uniquement)
                //         Route::post('/{team}/transfer-lead', [WorkspaceTeamController::class, 'transferLead'])
                //             ->middleware('permission:workspace.teams.transfer-lead')
                //             ->name('transfer-lead');

                //         // Routes admin uniquement (workspace-admin)
                //         Route::middleware('role:workspace-admin')->group(function () {
                //             Route::post('/{team}/promote/{user}', [WorkspaceTeamController::class, 'promoteMember'])
                //                 ->name('promote-member');
                //             Route::post('/{team}/demote/{user}', [WorkspaceTeamController::class, 'demoteMember'])
                //                 ->name('demote-member');
                //             Route::post('/{team}/add-member', [WorkspaceTeamController::class, 'addMemberAsAdmin'])
                //                 ->name('add-member-admin');
                //         });
            });

            Route::prefix('issues')->name('issues.')->group(function () {
                Route::patch('/{issue}/priority', [WorkspaceIssueController::class, 'updatePriority'])
                    ->name('update-priority');
                Route::patch('/{issue}/status', [WorkspaceIssueController::class, 'updateStatus'])
                    ->name('update-status');
                Route::patch('/{issue}/assignee', [WorkspaceIssueController::class, 'updateAssignee'])
                    ->name('update-assignee');
                Route::patch('/{issue}/label', [WorkspaceIssueController::class, 'updateLabel'])
                    ->name('update-label');
                Route::patch('/{issue}/due-date', [WorkspaceIssueController::class, 'updateDueDate'])
                    ->name('update-due-date');
                Route::post('/', [WorkspaceIssueController::class, 'store'])
                    ->name('store');
            });
        });
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
    Route::post('/item/remove', [CartController::class, 'removeItemById'])->name('cart.item.remove');
    Route::put('/item/update', [CartController::class, 'handleItemQuantityById'])->name('cart.item.update');
});

Route::get('/brands', [BrandController::class, 'index'])->name('brand.index');
Route::get('/brands/{brand:slug}', [BrandController::class, 'show'])->name('brand.show');

Route::get('/promotions', PromotionController::class)->name('promotions');

Route::get('/products', [ProductController::class, 'index'])->name('product.index');
Route::get('/products/{product:slug}', [ProductController::class, 'show'])->name('product.show');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/admin.php';
