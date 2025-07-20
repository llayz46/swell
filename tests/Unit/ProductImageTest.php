<?php

use App\Models\Product;
use App\Models\ProductImage;

it('belongs to a product', function () {
    $productImage = ProductImage::factory()->create();

    expect($productImage->product)->toBeInstanceOf(Product::class);
});

it('can be deleted', function () {
    $productImage = ProductImage::factory()->create();

    $productImage->delete();

    expect(ProductImage::find($productImage->id))->toBeNull();
});
