<?php

use App\Models\Brand;
use App\Models\Category;
use App\Models\ProductGroup;
use App\Models\User;
use App\Models\Product;
use Spatie\Permission\Models\Role;
use Inertia\Testing\AssertableInertia as Assert;

test('not admin user cannot access products pages', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('admin.products.index'))
        ->assertForbidden();
});

test('admin user can access products pages', function () {
    $user = User::factory()->create();
    Role::create(['name' => 'admin']);
    $user->assignRole('admin');

    $this->actingAs($user)
        ->get(route('admin.products.index'))
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/products/index')
        );
});

test('admin user can access product list pages with breadcrumbs', function () {
    $user = User::factory()->create();
    Role::create(['name' => 'admin']);
    $user->assignRole('admin');

    $this->actingAs($user)
        ->get(route('admin.products.index'))
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/products/index')
            ->has('breadcrumbs', 2)
            ->has('breadcrumbs.0', fn (Assert $page) => $page
                ->where('title', 'Admin')
                ->where('href', route('admin.dashboard'))
            )
            ->has('breadcrumbs.1', fn (Assert $page) => $page
                ->where('title', 'Produits')
                ->where('href', route('admin.products.index'))
            )
        );
});

test('admin user can access product show page', function () {
    $user = User::factory()->create();
    Role::create(['name' => 'admin']);
    $user->assignRole('admin');

    $product = Product::factory()->create();

    $this->actingAs($user)
        ->get(route('admin.products.show', $product))
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/products/show')
            ->has('breadcrumbs', 3)
            ->has('product')
            ->where('product.id', $product->id)
        );
});

test('admin user can access create product page with breadcrumbs & brands & groups', function () {
    $user = User::factory()->create();
    Role::create(['name' => 'admin']);
    $user->assignRole('admin');

    Brand::factory(2)->create();
    ProductGroup::factory(3)->create();

    $this->actingAs($user)
        ->get(route('admin.products.create'))
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/products/create')
            ->has('breadcrumbs', 3)
            ->has('breadcrumbs.0', fn (Assert $page) => $page
                ->where('title', 'Admin')
                ->where('href', route('admin.dashboard'))
            )
            ->has('breadcrumbs.1', fn (Assert $page) => $page
                ->where('title', 'Produits')
                ->where('href', route('admin.products.index'))
            )
            ->has('breadcrumbs.2', fn (Assert $page) => $page
                ->where('title', 'Créer un produit')
                ->where('href', route('admin.products.create'))
            )
            ->has('brands', 2)
            ->has('groups', 3)
        );
});

test('admin user can access create product page with duplicating product', function () {
    $user = User::factory()->create();
    Role::create(['name' => 'admin']);
    $user->assignRole('admin');

    $product = Product::factory()->create();

    $this->actingAs($user)
        ->get(route('admin.products.create', ['duplicate' => $product->id]))
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/products/create')
            ->has('breadcrumbs', 3)
            ->has('product')
            ->where('product.id', $product->id)
        );
});

test('admin user can create new product', function () {
    $user = User::factory()->create();
    Role::create(['name' => 'admin']);
    $user->assignRole('admin');

    $productData = [
        'name' => 'Test Product',
        'description' => 'This is a test product.',
        'short_description' => 'Short description of test product.',
        'price' => 100.00,
        'discount_price' => 80.00,
        'cost_price' => 50.00,
        'stock' => 10,
        'reorder_level' => 6,
        'status' => true,
        'meta_title' => 'Test Product Meta Title',
        'meta_description' => 'Test Product Meta Description',
        'meta_keywords' => 'test, product, example',
        'images' => [
            [
                'id' => null,
                'image_file' => \Illuminate\Http\UploadedFile::fake()->image('product-image1.jpg'),
                'alt_text' => 'Image principale du produit',
                'is_featured' => true,
                'order' => 1
            ],
            [
                'id' => null,
                'image_file' => \Illuminate\Http\UploadedFile::fake()->image('product-image2.jpg'),
                'alt_text' => 'Image secondaire du produit',
                'is_featured' => false,
                'order' => 2
            ]
        ],
        'brand_id' => Brand::factory()->create()->id,
        'category_id' => Category::factory()->create()->id,
    ];

    $this->actingAs($user)
        ->post(route('admin.products.store'), $productData);

    $this->assertDatabaseHas('products', [
        'name' => 'Test Product',
        'slug' => 'test-product',
        'description' => 'This is a test product.',
    ]);
});

test('admin user can access edit product page', function () {
    $user = User::factory()->create();
    Role::create(['name' => 'admin']);
    $user->assignRole('admin');

    $product = Product::factory()->create();

    $this->actingAs($user)
        ->get(route('admin.products.edit', $product))
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/products/edit')
            ->has('breadcrumbs', 4)
            ->has('product')
            ->where('product.id', $product->id)
        );
});

test('admin user can update existing product', function () {
    $user = User::factory()->create();
    Role::create(['name' => 'admin']);
    $user->assignRole('admin');

    $product = Product::factory()->create([
        'name' => 'Old Product Name',
        'slug' => 'old-product-name',
    ]);

    $productData = [
        'name' => 'Test Product',
        'description' => 'This is a test product.',
        'short_description' => 'Short description of test product.',
        'price' => 100.00,
        'discount_price' => 80.00,
        'cost_price' => 50.00,
        'stock' => 10,
        'reorder_level' => 6,
        'status' => true,
        'meta_title' => 'Test Product Meta Title',
        'meta_description' => 'Test Product Meta Description',
        'meta_keywords' => 'test, product, example',
        'images' => [
            [
                'id' => null,
                'image_file' => \Illuminate\Http\UploadedFile::fake()->image('product-image1.jpg'),
                'alt_text' => 'Image principale du produit',
                'is_featured' => true,
                'order' => 1
            ],
            [
                'id' => null,
                'image_file' => \Illuminate\Http\UploadedFile::fake()->image('product-image2.jpg'),
                'alt_text' => 'Image secondaire du produit',
                'is_featured' => false,
                'order' => 2
            ]
        ],
        'brand_id' => Brand::factory()->create()->id,
        'category_id' => Category::factory()->create()->id,
    ];

    $this->assertDatabaseHas('products', [
        'id' => $product->id,
    ]);

    $this->actingAs($user)
        ->post(route('admin.products.update', $product), $productData);

    $this->assertDatabaseHas('products', [
        'id' => $product->id,
        'name' => 'Test Product',
        'slug' => 'test-product',
    ]);
});

test('admin user can delete product', function () {
    $user = User::factory()->create();
    Role::create(['name' => 'admin']);
    $user->assignRole('admin');

    $product = Product::factory()->create([
        'name' => 'Test Product',
    ]);

    $this->actingAs($user)
        ->delete(route('admin.products.destroy', $product), [
            'name' => 'Test Product'
        ]);

    $this->assertDatabaseMissing('products', [
        'id' => $product->id,
    ]);
});
