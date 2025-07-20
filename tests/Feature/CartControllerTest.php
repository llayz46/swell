<?php

use App\Factories\CartFactory;
use App\Models\Cart;
use App\Models\Product;
use App\Models\User;

test('users can add products to cart', function () {
    $user = User::factory()->create();
    $user->cart()->create();

    $product = Product::factory()->create();

    $this->actingAs($user)->post(route('cart.add'), [
        'product_id' => $product->id,
        'quantity' => 3,
    ]);

    $this->assertDatabaseHas('cart_items', [
        'cart_id' => $user->cart->id,
        'product_id' => $product->id,
        'quantity' => 3,
    ]);
});

test('users can clear their cart', function () {
    $user = User::factory()->create();
    $cart = $user->cart()->create();

    $product1 = Product::factory()->create();
    $product2 = Product::factory()->create();

    $cart->items()->createMany([
        ['product_id' => $product1->id, 'quantity' => 1],
        ['product_id' => $product2->id, 'quantity' => 3],
    ]);

    $this->assertDatabaseHas('cart_items', [
        'cart_id' => $cart->id,
        'product_id' => $product1->id,
    ]);

    $this->assertDatabaseHas('cart_items', [
        'cart_id' => $cart->id,
        'product_id' => $product2->id,
    ]);

    $this->actingAs($user)->post(route('cart.clear', [$cart]));

    $this->assertDatabaseMissing('cart_items', [
        'cart_id' => $cart->id,
        'product_id' => $product1->id,
    ]);

    $this->assertDatabaseMissing('cart_items', [
        'cart_id' => $cart->id,
        'product_id' => $product2->id,
    ]);
});

test('guest can add products to cart', function () {
    $product = Product::factory()->create();

    $this->post(route('cart.add'), [
        'product_id' => $product->id,
        'quantity' => 2,
    ]);

    $cart = Cart::firstOrCreate(['session_id' => session()->getId()]);

    $this->assertDatabaseHas('carts', [
        'session_id' => $cart->session_id,
    ]);

    $this->assertDatabaseHas('cart_items', [
        'cart_id' => $cart->id,
        'product_id' => $product->id,
        'quantity' => 2,
    ]);
});

test('guest can clear cart', function () {
    $this->startSession();

    $cart = CartFactory::make();

    $product1 = Product::factory()->create();
    $product2 = Product::factory()->create();

    $cart->items()->createMany([
        ['product_id' => $product1->id, 'quantity' => 1],
        ['product_id' => $product2->id, 'quantity' => 3],
    ]);

    $this->assertDatabaseHas('cart_items', [
        'cart_id' => $cart->id,
        'product_id' => $product1->id,
    ]);

    $this->assertDatabaseHas('cart_items', [
        'cart_id' => $cart->id,
        'product_id' => $product2->id,
    ]);

    $this->post(route('cart.clear', $cart->id));

    $updatedCart = Cart::where('session_id', session()->getId())->first();

    $this->assertDatabaseMissing('cart_items', [
        'cart_id' => $updatedCart->id,
        'product_id' => $product1->id
    ]);

    $this->assertDatabaseMissing('cart_items', [
        'cart_id' => $updatedCart->id,
        'product_id' => $product2->id
    ]);
});

test('users can remove items from cart', function () {
    $user = User::factory()->create();
    $cart = $user->cart()->create();

    $product = Product::factory()->create();
    $cart->items()->create(['product_id' => $product->id, 'quantity' => 2]);

    $this->actingAs($user)->post(route('cart.remove'), [
        'product_id' => $product->id,
    ]);

    $this->assertDatabaseMissing('cart_items', [
        'cart_id' => $cart->id,
        'product_id' => $product->id,
    ]);
});

test('guest can remove items from cart', function () {
    $this->startSession();

    $cart = CartFactory::make();
    $product = Product::factory()->create();
    $cart->items()->create(['product_id' => $product->id, 'quantity' => 2]);

    $this->post(route('cart.remove'), [
        'product_id' => $product->id,
    ]);

    $updatedCart = Cart::where('session_id', session()->getId())->first();

    $this->assertDatabaseMissing('cart_items', [
        'cart_id' => $updatedCart->id,
        'product_id' => $product->id,
    ]);
});

test('guest cart items is migrated to user cart on login', function () {
    $this->startSession();

    $sessionCart = CartFactory::make();
    $product1 = Product::factory()->create();
    $product2 = Product::factory()->create();

    $sessionCart->items()->createMany([
        ['product_id' => $product1->id, 'quantity' => 1],
        ['product_id' => $product2->id, 'quantity' => 2],
    ]);

    $this->assertDatabaseHas('cart_items', [
        'cart_id' => $sessionCart->id,
        'product_id' => $product1->id,
        'quantity' => 1,
    ]);

    $this->assertDatabaseHas('cart_items', [
        'cart_id' => $sessionCart->id,
        'product_id' => $product2->id,
        'quantity' => 2,
    ]);

    $user = User::factory()->create();
    $user->cart()->create();

    $this->actingAs($user);

    (new \App\Actions\Cart\MigrateSessionCart)->migrate($sessionCart, $user->cart);

    $this->assertDatabaseHas('cart_items', [
        'cart_id' => $user->cart->id,
        'product_id' => $product1->id,
        'quantity' => 1,
    ]);

    $this->assertDatabaseHas('cart_items', [
        'cart_id' => $user->cart->id,
        'product_id' => $product2->id,
        'quantity' => 2,
    ]);

    $this->assertDatabaseMissing('cart_items', [
        'cart_id' => $sessionCart->id,
        'product_id' => $product1->id,
    ]);

    $this->assertDatabaseMissing('cart_items', [
        'cart_id' => $sessionCart->id,
        'product_id' => $product2->id,
    ]);
});
