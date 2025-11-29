<?php

use App\Models\Order;
use App\Models\User;
use App\Modules\Loyalty\Enums\TransactionType;
use App\Modules\Loyalty\Models\LoyaltyAccount;
use App\Modules\Loyalty\Models\LoyaltyTransaction;
use App\Modules\Loyalty\Services\LoyaltyService;
use Spatie\Permission\Models\Role;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    config(['swell.loyalty.enabled' => true]);
    config(['swell.loyalty.points_per_euro' => 10]);
    config(['swell.loyalty.points_expiration_days' => 365]);

    $this->user = User::factory()->create();
    $this->loyaltyService = app(LoyaltyService::class);
});

test('loyalty account is created automatically for user', function () {
    $account = $this->loyaltyService->getOrCreateAccount($this->user);

    expect($account)
        ->toBeInstanceOf(LoyaltyAccount::class)
        ->and($account->user_id)->toBe($this->user->id)
        ->and($account->points)->toBe(0)
        ->and($account->lifetime_points)->toBe(0);
});

test('can award points to user', function () {
    $transaction = $this->loyaltyService->awardPoints(
        $this->user,
        100,
        'Test points',
    );

    expect($transaction)
        ->toBeInstanceOf(LoyaltyTransaction::class)
        ->and($transaction->type)->toBe(TransactionType::EARNED)
        ->and($transaction->points)->toBe(100)
        ->and($transaction->balance_after)->toBe(100);

    $account = $this->user->fresh()->loyaltyAccount ?? $this->loyaltyService->getOrCreateAccount($this->user);
    expect($account->points)->toBe(100)
        ->and($account->lifetime_points)->toBe(100);
});

test('can spend points', function () {
    $this->loyaltyService->awardPoints($this->user, 200, 'Test points');

    $transaction = $this->loyaltyService->spendPoints($this->user, 50, 'Test redemption');

    expect($transaction)
        ->toBeInstanceOf(LoyaltyTransaction::class)
        ->and($transaction->type)->toBe(TransactionType::SPENT)
        ->and($transaction->points)->toBe(-50)
        ->and($transaction->balance_after)->toBe(150);

    $account = LoyaltyAccount::where('user_id', $this->user->id)->first();
    expect($account->points)->toBe(150);
});

test('cannot spend more points than available', function () {
    $this->loyaltyService->awardPoints($this->user, 50, 'Test points');

    expect(fn () => $this->loyaltyService->spendPoints($this->user, 100, 'Test redemption'))
        ->toThrow(\Exception::class);
});

test('calculates points from order correctly', function () {
    $order = Order::factory()->create([
        'user_id' => $this->user->id,
        'amount_total' => 10000, // 100€ (100,00)
    ]);

    $points = $this->loyaltyService->calculatePointsFromOrder($order);

    expect($points)->toBe(1000); // 100 * 10 points/€
});

test('admin can adjust points', function () {
    $account = $this->loyaltyService->getOrCreateAccount($this->user);

    $transaction = $this->loyaltyService->adminAdjustment($this->user, 50, 'Bonus');
    expect($transaction->type)->toBe(TransactionType::ADMIN_ADJUSTMENT)
        ->and($transaction->points)->toBe(50);

    $account->refresh();
    expect($account->points)->toBe(50);

    $transaction = $this->loyaltyService->adminAdjustment($this->user, -20, 'Correction');
    expect($transaction->points)->toBe(-20);

    $account->refresh();
    expect($account->points)->toBe(30);
});

test('points can have expiration date', function () {
    $expiresAt = now()->addDays(30);

    $transaction = $this->loyaltyService->awardPoints(
        $this->user,
        100,
        'Test points',
        null,
        $expiresAt
    );

    expect($transaction->expires_at)
        ->not->toBeNull()
        ->and($transaction->expires_at->format('Y-m-d'))->toBe($expiresAt->format('Y-m-d'));
});

test('can refund points from order', function () {
    $order = Order::factory()->create([
        'user_id' => $this->user->id,
        'amount_total' => 10000,
    ]);

    $this->loyaltyService->awardPoints($this->user, 100, 'Order points', $order);

    $account = LoyaltyAccount::where('user_id', $this->user->id)->first();
    expect($account->points)->toBe(100);

    $refundTransaction = $this->loyaltyService->refundPoints($order);

    expect($refundTransaction)
        ->not->toBeNull()
        ->and($refundTransaction->type)->toBe(TransactionType::REFUNDED)
        ->and($refundTransaction->points)->toBe(-100);

    $account->refresh();
    expect($account->points)->toBe(0);
});

test('user can view loyalty page', function () {
    $this->loyaltyService->awardPoints($this->user, 100, 'Test points');

    $this->actingAs($this->user)
        ->get(route('loyalty.index'))
        ->assertStatus(200)
        ->assertInertia(fn (Assert $page) => $page
            ->component('loyalty/index')
            ->has('account')
            ->has('transactions')
        );
});

test('admin can view loyalty dashboard', function () {
     Role::create(['name' => 'admin']);

    $admin = User::factory()->create()->assignRole('admin');

    $response = $this->actingAs($admin)->get(route('admin.loyalty.index'));

    $response->assertStatus(200)
        ->assertInertia(fn ($page) => $page
            ->component('admin/loyalty/index')
            ->has('accounts')
            ->has('stats')
        );
});
