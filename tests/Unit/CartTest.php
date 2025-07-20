<?php

use App\Models\Cart;
use App\Models\Product;
use App\Models\User;

it('can be instantiated', function () {
    $cart = User::factory()->create()->cart()->create();

    expect($cart)->toBeInstanceOf(Cart::class);
});

it('belongs to an user', function () {
    $user = User::factory()->create();

    $cart = $user->cart()->create();

    expect($cart->user)->toBeInstanceOf(User::class)
        ->and($cart->user->id)->toBe($user->id);
});

it('belongs to an session id', function () {
    $sessionId = session()->getId();

    $cart = Cart::firstOrCreate(['session_id' => $sessionId]);

    expect($cart->session_id)->toBe($sessionId);
});

it('can have product', function () {
    $cart = User::factory()->create()->cart()->create();

    $product = Product::factory()->create();

    $cartItem = $cart->items()->create([
        'product_id' => $product->id,
        'quantity' => 1,
    ]);

    expect($cart->items)->toHaveCount(1)
        ->and($cart->items->first()->id)->toBe($cartItem->id);
});

it('has many items', function () {
    $cart = User::factory()->create()->cart()->create();

    $product1 = Product::factory()->create();
    $product2 = Product::factory()->create();

    $cartItem = $cart->items()->createMany([
        ['product_id' => $product1->id, 'quantity' => 1],
        ['product_id' => $product2->id, 'quantity' => 2],
    ]);

    expect($cart->items)->toHaveCount(2)
        ->and($cart->items->first()->id)->toBe($cartItem->first()->id)
        ->and($cart->items->last()->id)->toBe($cartItem->last()->id);
});
