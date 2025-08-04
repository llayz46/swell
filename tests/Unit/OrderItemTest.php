<?php

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;

it('can create an order item', function () {
    $order = Order::factory()->create();
    $product = Product::factory()->create();

    $orderItem = OrderItem::factory()->create([
        'order_id' => $order->id,
        'product_id' => $product->id,
        'name' => 'Test Product',
        'description' => 'This is a test product description.',
        'price' => 100.00,
        'quantity' => 2,
        'amount_discount' => 10.00,
        'amount_total' => 190.00,
    ]);

    expect($orderItem)->toBeInstanceOf(OrderItem::class)
        ->and($orderItem->order_id)->toBe($order->id)
        ->and($orderItem->product_id)->toBe($product->id)
        ->and($orderItem->name)->toBe('Test Product')
        ->and($orderItem->description)->toBe('This is a test product description.')
        ->and($orderItem->price)->toBe(100.00)
        ->and($orderItem->quantity)->toBe(2)
        ->and($orderItem->amount_discount)->toBe(10.00)
        ->and($orderItem->amount_total)->toBe(190.00);
});

it('can retrieve an order item by its ID', function () {
    $order = Order::factory()->create();
    $product = Product::factory()->create();

    $orderItem = OrderItem::factory()->create([
        'order_id' => $order->id,
        'product_id' => $product->id,
    ]);

    $retrievedItem = OrderItem::find($orderItem->id);

    expect($retrievedItem)->toBeInstanceOf(OrderItem::class)
        ->and($retrievedItem->id)->toBe($orderItem->id);
});

it('can delete an order item', function () {
    $orderItem = OrderItem::factory()->create();

    $orderItem->delete();

    expect(OrderItem::find($orderItem->id))->toBeNull();
});

it('can associate an order item with an order and a product', function () {
    $order = Order::factory()->create();
    $product = Product::factory()->create();

    $orderItem = OrderItem::factory()->create([
        'order_id' => $order->id,
        'product_id' => $product->id,
    ]);

    expect($orderItem->order)->toBeInstanceOf(Order::class)
        ->and($orderItem->product)->toBeInstanceOf(Product::class)
        ->and($orderItem->order->id)->toBe($order->id)
        ->and($orderItem->product->id)->toBe($product->id);
});

it('can retrieve the order associated with an order item', function () {
    $order = Order::factory()->create();
    $product = Product::factory()->create();

    $orderItem = OrderItem::factory()->create([
        'order_id' => $order->id,
        'product_id' => $product->id,
    ]);

    expect($orderItem->order)->toBeInstanceOf(Order::class)
        ->and($orderItem->order->id)->toBe($order->id);
});

it('can retrieve the product associated with an order item', function () {
    $order = Order::factory()->create();
    $product = Product::factory()->create();

    $orderItem = OrderItem::factory()->create([
        'order_id' => $order->id,
        'product_id' => $product->id,
    ]);

    expect($orderItem->product)->toBeInstanceOf(Product::class)
        ->and($orderItem->product->id)->toBe($product->id);
});
