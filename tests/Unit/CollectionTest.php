<?php

use App\Models\Product;
use App\Models\Collection;

it('can create a collection', function () {
    $collection = Collection::factory()->create([
        'title' => 'Electronics',
        'slug' => 'electronics',
    ]);

    expect($collection)->toBeInstanceOf(Collection::class)
        ->and($collection->title)->toBe('Electronics')
        ->and($collection->slug)->toBe('electronics');
});

it('can retrieve a collection by its slug', function () {
    $collection = Collection::factory()->create([
        'title' => 'Home Appliances',
        'slug' => 'home-appliances',
    ]);

    $retrievedCollection = Collection::where('slug', $collection->slug)->first();

    expect($retrievedCollection)->toBeInstanceOf(Collection::class)
        ->and($retrievedCollection->id)->toBe($collection->id);
});

it('can delete a collection', function () {
    $collection = Collection::factory()->create();

    $collection->delete();

    expect(Collection::find($collection->id))->toBeNull();
});

it('sets collection_id to null for associated products when deleted', function () {
    $collection = Collection::factory()->create();
    $product = Product::factory()->create(['collection_id' => $collection->id]);

    $collection->delete();

    $product->refresh();

    expect($product)->toBeInstanceOf(Product::class)
        ->and($product->collection_id)->toBeNull();
});

it('can have products associated with it', function () {
    $collection = Collection::factory()->create();
    $product1 = Product::factory()->create(['collection_id' => $collection->id]);
    $product2 = Product::factory()->create(['collection_id' => $collection->id]);

    expect($collection->products)
        ->toBeInstanceOf(\Illuminate\Database\Eloquent\Collection::class)
        ->and($collection->products->count())->toBe(2)
        ->and($collection->products->contains($product1))->toBeTrue()
        ->and($collection->products->contains($product2))->toBeTrue()
        ->and($product1->collection->id)->toBe($collection->id);
});

it('can retrieve products associated with it', function () {
    $collection = Collection::factory()->create();
    $product1 = Product::factory()->create(['collection_id' => $collection->id]);
    $product2 = Product::factory()->create(['collection_id' => $collection->id]);

    $products = $collection->products;

    expect($products)->toBeInstanceOf(\Illuminate\Database\Eloquent\Collection::class)
        ->and($products->count())->toBe(2)
        ->and($products->contains($product1))->toBeTrue()
        ->and($products->contains($product2))->toBeTrue();
});
