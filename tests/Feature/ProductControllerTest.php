<?php

use App\Models\Category;
use App\Models\Product;
use Inertia\Testing\AssertableInertia as Assert;

it('can visit product index page', function () {
    $this->get(route('product.index'))
        ->assertInertia(fn (Assert $page) => $page
            ->component('products/index')
            ->has('data')
            ->has('stock')
        );
});

it('can visit product show page', function () {
    $category = Category::factory()->create();

    $product = Product::factory()->create(['category_id' => $category->id]);

    Product::factory(3)->create(['category_id' => $category->id]);

    $this->get(route('product.show', $product))
        ->assertInertia(fn (Assert $page) => $page
            ->component('products/show')
            ->has('product')
            ->has('reviews')
            ->has('similarProducts')
        );
});

it('can visit product index page with search', function () {
    Product::factory()->create(['name' => 'Test Product']);

    $this->get(route('product.index', ['search' => 'Test']))
        ->assertInertia(fn (Assert $page) => $page
            ->component('products/index')
            ->has('data')
        );
});
