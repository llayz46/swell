<?php

use App\Actions\Product\HandleProduct;
use App\Models\Brand;
use App\Models\Category;
use App\Models\ProductGroup;
use App\Models\ProductImage;
use App\Models\User;
use App\Models\Product;
use Illuminate\Http\UploadedFile;
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

it('can delete product from handleProduct', function () {
    $product = Product::factory()->create();

    $handleProduct = new HandleProduct();

    $handleProduct->delete($product);

    $this->assertDatabaseMissing('products', [
        'id' => $product->id,
    ]);
});

it('create a product with images', function () {
    Storage::fake('public');
    $handleProduct = new HandleProduct();

    $data = [
        'name' => 'Produit test',
        'slug' => 'produit-test',
        'description' => 'Ceci est un produit de test.',
        'short_description' => 'Description courte du produit de test.',
        'meta_title' => 'Titre Meta du Produit Test',
        'meta_description' => 'Description Meta du Produit Test',
        'meta_keywords' => 'test, produit, exemple',
        'brand_id' => Brand::factory()->create()->id,
        'category_id' => Category::factory()->create()->id,
        'price' => 100,
        'cost_price' => 80,
        'stock' => 10,
        'reorder_level' => 2,
        'status' => true,
        'images' => [
            [
                'image_file' => UploadedFile::fake()->image('photo1.jpg'),
                'alt_text' => 'Image 1',
                'is_featured' => true,
                'order' => 1,
            ]
        ]
    ];

    $product = $handleProduct->create($data);

    expect($product->images)->toHaveCount(1);
    Storage::disk('public')->assertExists($product->images->first()->image_url);
    expect($product->images->first()->alt_text)->toBe('Image 1')
        ->and($product->images->first()->is_featured)->toBe(1);
});

it('update images of product', function () {
    Storage::fake('public');
    $handleProduct = new HandleProduct();

    $product = Product::factory()->create();
    $img1 = $product->images()->create([
        'image_url' => 'img1.jpg',
        'alt_text' => 'Image 1',
        'is_featured' => false,
        'order' => 1,
    ]);
    $img2 = $product->images()->create([
        'image_url' => 'img2.jpg',
        'alt_text' => 'Image 2',
        'is_featured' => false,
        'order' => 2,
    ]);
    Storage::disk('public')->put('img1.jpg', 'fake');
    Storage::disk('public')->put('img2.jpg', 'fake');

    $images = [
        [
            'id' => $img2->id,
            'image_file' => UploadedFile::fake()->image('new2.jpg'),
            'alt_text' => 'Image 222',
        ]
    ];

    $handleProduct->update($product, [
        'images' => $images,
        'name' => 'Produit test',
        'slug' => 'produit-test',
        'description' => 'Ceci est un produit de test.',
        'short_description' => 'Description courte du produit de test.',
        'meta_title' => 'Titre Meta du Produit Test',
        'meta_description' => 'Description Meta du Produit Test',
        'meta_keywords' => 'test, produit, exemple',
        'brand_id' => Brand::factory()->create()->id,
        'category_id' => Category::factory()->create()->id,
        'price' => 100,
        'cost_price' => 80,
        'stock' => 10,
        'reorder_level' => 2,
        'status' => true,
    ]);

    Storage::disk('public')->assertMissing('img1.jpg');
    Storage::disk('public')->assertMissing('img2.jpg');
    $this->assertDatabaseMissing('product_images', [
        'id' => $img1->id,
    ]);

    $this->assertDatabaseHas('product_images', [
        'id' => $img2->id,
        'alt_text' => 'Image 222',
    ]);

    $firstImage = ProductImage::where('product_id', $product->id)
        ->orderBy('order', 'asc')
        ->first();

    $this->expect($firstImage->is_featured)->toBe(1);
});
