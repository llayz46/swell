<?php

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductGroup;
use App\Models\ProductImage;

it('can be created', function () {
    $product = Product::factory()->create();

    expect($product)->toBeInstanceOf(Product::class);
});

it('can be retrieved by its slug', function () {
    $product = Product::factory()->create();

    $retrievedProduct = Product::where('slug', $product->slug)->first();

    expect($retrievedProduct)->toBeInstanceOf(Product::class)
        ->and($retrievedProduct->id)->toBe($product->id);
});

it('can be deleted', function () {
    $product = Product::factory()->create();

    $product->delete();

    expect(Product::find($product->id))->toBeNull();
});

it('can belong to a category', function () {
    $product = Product::factory()->create();
    $category = Category::factory()->create();

    $product->categories()->attach($category);

    expect($product)->toBeInstanceOf(Product::class)
        ->and($product->categories)->contains($category)->toBeTrue();
});

it('can belongs to many categories', function () {
    $product = Product::factory()->create();
    $category1 = Category::factory()->create();
    $category2 = Category::factory()->create();

    $product->categories()->attach([$category1, $category2]);

    expect($product)->toBeInstanceOf(Product::class)
        ->and($product->categories)->toHaveCount(2)
        ->and($product->categories->contains($category1))->toBeTrue()
        ->and($product->categories->contains($category2))->toBeTrue();
});

it('can belong to a brand', function () {
    $product = Product::factory()->create();
    $brand = \App\Models\Brand::factory()->create();

    $product->brand()->associate($brand);

    expect($product)->toBeInstanceOf(Product::class)
        ->and($product->brand_id)->toBe($brand->id);
});

it('can dissociate its category', function () {
    $product = Product::factory()->create();
    $category = Category::factory()->create();

    $product->categories()->attach($category);
    $product->categories()->detach($category);

    expect($product->categories)->toHaveCount(0)
        ->and($product->categories->contains($category))->toBeFalse();
});

it('can dissociate its brand', function () {
    $product = Product::factory()->create();
    $brand = \App\Models\Brand::factory()->create();

    $product->brand()->associate($brand);
    $product->brand()->dissociate();

    expect($product->brand_id)->toBeNull();
});

it('can have multiple images', function () {
    $product = Product::factory()->create();
    $image1 = ProductImage::factory()->create(['product_id' => $product->id]);
    $image2 = ProductImage::factory()->create(['product_id' => $product->id]);

    expect($product->images)->toHaveCount(2)
        ->and($product->images->contains($image1))->toBeTrue()
        ->and($product->images->contains($image2))->toBeTrue();
});

it('can dissociate its images', function () {
    $product = Product::factory()->create();
    $image = ProductImage::factory()->create(['product_id' => $product->id]);

    $image->product()->dissociate();

    expect($image->product_id)->toBeNull();
});

it('can belong to a product group', function () {
    $product = Product::factory()->create();
    $productGroup = ProductGroup::factory()->create();

    $product->group()->associate($productGroup);

    expect($product)->toBeInstanceOf(Product::class)
        ->and($product->product_group_id)->toBe($productGroup->id);
});

it('can retrieve its discount price', function () {
    $product = Product::factory()->create(['price' => 100.00, 'discount_price' => 80.00]);

    expect($product->getPrice)->toBe(80.00);
});

it('can retrieve its regular price if no discount is set', function () {
    $product = Product::factory()->create(['price' => 100.00, 'discount_price' => null]);

    expect($product->getPrice)->toBe(100.00);
});
