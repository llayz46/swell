<?php

use App\Models\Brand;
use App\Models\Product;

it('can be created', function () {
    $brand = Brand::factory()->create();

    expect($brand)->toBeInstanceOf(Brand::class);
});

it('can be retrieved by its slug', function () {
    $brand = Brand::factory()->create();

    $retrievedBrand = Brand::where('slug', $brand->slug)->first();

    expect($retrievedBrand)->toBeInstanceOf(Brand::class)
        ->and($retrievedBrand->id)->toBe($brand->id);
});

it('can be deleted', function () {
    $brand = Brand::factory()->create();

    $brand->delete();

    expect(Brand::find($brand->id))->toBeNull();
});

it('cannot be deleted if it has products', function () {
    $brand = Brand::factory()->create();
    Product::factory()->create(['brand_id' => $brand->id]);

    expect(fn() => $brand->delete())
        ->toThrow(\Illuminate\Database\QueryException::class);
});

it('can have products', function () {
    $brand = Brand::factory()->create();
    $product = Product::factory()->create();

    $product->brand()->associate($brand);

    expect($product)->toBeInstanceOf(Product::class)
        ->and($product->brand_id)->toBe($brand->id);
});

it('can have multiple products', function () {
    $brand = Brand::factory()->create();
    $product1 = Product::factory()->create(['brand_id' => $brand->id]);
    $product2 = Product::factory()->create(['brand_id' => $brand->id]);

    expect($brand->products)->toHaveCount(2)
        ->and($brand->products->contains($product1))->toBeTrue()
        ->and($brand->products->contains($product2))->toBeTrue();
});

it('can dissociate its products', function () {
    $brand = Brand::factory()->create();
    $product = Product::factory()->create(['brand_id' => $brand->id]);

    $product->brand()->dissociate();

    expect($product->brand_id)->toBeNull();
});
