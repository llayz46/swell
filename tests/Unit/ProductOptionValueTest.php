<?php

use App\Models\ProductOptionValue;
use App\Models\ProductVariant;

it('can create a product option value', function () {
    $productOptionValue = ProductOptionValue::factory()->create();

    expect($productOptionValue)->toBeInstanceOf(ProductOptionValue::class);
});

it('can retrieve a product option value by its ID', function () {
    $productOptionValue = ProductOptionValue::factory()->create();

    $retrievedOptionValue = ProductOptionValue::find($productOptionValue->id);

    expect($retrievedOptionValue)->toBeInstanceOf(ProductOptionValue::class)
        ->and($retrievedOptionValue->id)->toBe($productOptionValue->id);
});

it('can delete a product option value', function () {
    $productOptionValue = ProductOptionValue::factory()->create();

    $productOptionValue->delete();

    expect(ProductOptionValue::find($productOptionValue->id))->toBeNull();
});

it('belongs to a product option', function () {
    $productOptionValue = ProductOptionValue::factory()->create();
    $productOption = $productOptionValue->option;

    expect($productOptionValue)->toBeInstanceOf(ProductOptionValue::class)
        ->and($productOption->id)->toBe($productOptionValue->product_option_id);
});
