<?php

use App\Models\Product;
use App\Models\User;

beforeEach(function () {
    if (!config('swell.wishlist.enabled')) {
        $this->markTestSkipped('La fonctionnalité wishlist est désactivée.');
    }
});

test('users can add products to wishlist', function () {
    $user = User::factory()->create();
    $user->wishlist()->create();

    $product = Product::factory()->create();

    $user->wishlist->products()->syncWithoutDetaching([$product->id]);

    $this->assertDatabaseHas('wishlist_items', [
        'wishlist_id' => $user->wishlist->id,
        'product_id' => $product->id,
    ]);
});

test('users can remove products from wishlist', function () {
    $user = User::factory()->create();
    $wishlist = $user->wishlist()->create();

    $product = Product::factory()->create();

    $wishlist->products()->attach($product->id);

    $this->assertDatabaseHas('wishlist_items', [
        'wishlist_id' => $wishlist->id,
        'product_id' => $product->id,
    ]);

    $wishlist->products()->detach($product->id);

    $this->assertDatabaseMissing('wishlist_items', [
        'wishlist_id' => $wishlist->id,
        'product_id' => $product->id,
    ]);
});

test('users has one wishlist', function () {
    $user = User::factory()->create();
    $wishlist = $user->wishlist()->create();

    $this->assertInstanceOf(\App\Models\Wishlist::class, $wishlist);
    $this->assertEquals($user->id, $wishlist->user_id);
});

test('products can belongs to wishlist', function () {
    $user = User::factory()->create();
    $wishlist = $user->wishlist()->create();

    $product = Product::factory()->create();

    $wishlist->products()->attach($product->id);

    $this->assertTrue($wishlist->products->contains($product));
});
