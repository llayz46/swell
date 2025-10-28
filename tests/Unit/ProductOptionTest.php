<?php

use App\Models\ProductOption;

it('can create a product option', function () {
    $productOption = ProductOption::factory()->create();

    expect($productOption)->toBeInstanceOf(ProductOption::class)
        ->and($productOption->exists)->toBeTrue();
});

it('can retrieve a product option by its ID', function () {
    $productOption = ProductOption::factory()->create();

    $retrievedOption = ProductOption::find($productOption->id);

    expect($retrievedOption)->toBeInstanceOf(ProductOption::class)
        ->and($retrievedOption->id)->toBe($productOption->id);
});

it('can delete a product option', function () {
    $productOption = ProductOption::factory()->create();

    $productOption->delete();

    expect(ProductOption::find($productOption->id))->toBeNull();
});

it('belongs to a product', function () {
    $productOption = ProductOption::factory()->create();
    $product = $productOption->product;

    expect($productOption)->toBeInstanceOf(ProductOption::class)
        ->and($product->id)->toBe($productOption->product_id);
});

it('automatically deleted when the product is deleted', function () {
    $productOption = ProductOption::factory()->create();
    $productId = $productOption->product_id;

    $productOption->product->delete();

    expect(ProductOption::find($productOption->id))->toBeNull()
        ->and(ProductOption::where('product_id', $productId)->count())->toBe(0);
});

it('can have multiple values', function () {
    $productOption = ProductOption::factory()->create();
    $values = ['Red', 'Blue', 'Green'];

    foreach ($values as $value) {
        $productOption->values()->create(['value' => $value]);
    }

    expect($productOption->values)->toHaveCount(3)
        ->and($productOption->values->pluck('value')->toArray())->toBe($values);
});

it('can retrieve its values', function () {
    $productOption = ProductOption::factory()->create();
    $value1 = $productOption->values()->create(['value' => 'Red']);
    $value2 = $productOption->values()->create(['value' => 'Blue']);

    expect($productOption->values)->toHaveCount(2)
        ->and($productOption->values->contains($value1))->toBeTrue()
        ->and($productOption->values->contains($value2))->toBeTrue();
});

it('can delete its values', function () {
    $productOption = ProductOption::factory()->create();
    $value = $productOption->values()->create(['value' => 'Red']);

    $value->delete();

    expect($productOption->values)->toHaveCount(0)
        ->and(ProductOption::find($productOption->id)->values->contains($value))->toBeFalse();
});
