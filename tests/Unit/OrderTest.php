<?php

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;

it('can create an order belongs to an user', function () {
    $user = User::factory()->create();

    $order = $user->orders()->create(Order::factory()->make()->toArray());

    expect($order->user_id)->toBe($user->id);
});

it('can retrieve orders by user', function () {
    $user = User::factory()->create();
    $order1 = $user->orders()->create(Order::factory()->make()->toArray());
    $order2 = $user->orders()->create(Order::factory()->make()->toArray());

    $orders = $user->orders;

    expect($orders)->toBeInstanceOf(\Illuminate\Database\Eloquent\Collection::class)
        ->and($orders->count())->toBe(2)
        ->and($orders->contains($order1))->toBeTrue()
        ->and($orders->contains($order2))->toBeTrue();
});

it('can delete an order', function () {
    $user = User::factory()->create();
    $order = $user->orders()->create(Order::factory()->make()->toArray());

    $order->delete();

    expect(Order::find($order->id))->toBeNull();
});

it('can get the total amount of an order', function () {
    $user = User::factory()->create();
    $order = $user->orders()->create(Order::factory()->make()->toArray());

    OrderItem::factory()->create([
        'order_id' => $order->id,
        'amount_total' => 100.00,
    ]);

    OrderItem::factory()->create([
        'order_id' => $order->id,
        'amount_total' => 33.00,
    ]);

    expect($order->total())->toBe(133.00);
});

it('belongs to a user', function () {
    $user = User::factory()->create();
    $order = $user->orders()->create(Order::factory()->make()->toArray());

    expect($order->user)->toBeInstanceOf(User::class)
        ->and($order->user_id)->toBe($user->id);
});
