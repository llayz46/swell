<?php

use App\Models\Category;
use App\Models\Product;

it('can be created', function () {
    $category = Category::factory()->create();

    expect($category)->toBeInstanceOf(Category::class);
});

it('can be retrieved by its slug', function () {
    $category = Category::factory()->create();

    $retrievedCategory = Category::where('slug', $category->slug)->first();

    expect($retrievedCategory)->toBeInstanceOf(Category::class)
        ->and($retrievedCategory->id)->toBe($category->id);
});

it('can be deleted', function () {
    $category = Category::factory()->create();

    $category->delete();

    expect(Category::find($category->id))->toBeNull();
});

it('need a unique slug to be created', function () {
    Category::factory()->create(['slug' => 'unique-slug']);

    expect(fn() => Category::factory()->create(['slug' => 'unique-slug']))
        ->toThrow(\Illuminate\Database\QueryException::class);
});

it('cannot be deleted if it has products', function () {
    $category = Category::factory()->create();
    Product::factory()->create()->categories()->attach($category);

    expect(fn() => $category->delete())
        ->toThrow(\Illuminate\Database\QueryException::class);
});

it('can have a parent category', function () {
    $parentCategory = Category::factory()->create();
    $childCategory = Category::factory()->create(['parent_id' => $parentCategory->id]);

    expect($childCategory->parent_id)->toBe($parentCategory->id);
});

it('can retrieve its parent category', function () {
    $parentCategory = Category::factory()->create();
    $childCategory = Category::factory()->create(['parent_id' => $parentCategory->id]);

    expect($childCategory->parent)->toBeInstanceOf(Category::class)
        ->and($childCategory->parent->id)->toBe($parentCategory->id);
});

it('can retrieve its child categories', function () {
    $parentCategory = Category::factory()->create();
    $childCategory1 = Category::factory()->create(['parent_id' => $parentCategory->id]);
    $childCategory2 = Category::factory()->create(['parent_id' => $parentCategory->id]);

    $children = $parentCategory->children;

    expect($children)->toHaveCount(2)
        ->and($children->contains($childCategory1))->toBeTrue()
        ->and($children->contains($childCategory2))->toBeTrue();
});
