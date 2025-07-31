<?php

use App\Models\User;
use App\Models\Category;
use Spatie\Permission\Models\Role;
use Inertia\Testing\AssertableInertia as Assert;

test('not admin user cannot access categories pages', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('admin.categories.index'))
        ->assertForbidden();
});

test('admin user can access categories pages', function () {
    $user = User::factory()->create();
    Role::create(['name' => 'admin']);
    $user->assignRole('admin');

    $this->actingAs($user)
        ->get(route('admin.categories.index'))
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/categories')
        );
});

test('admin user can access category list pages with categories & breadcrumbs', function () {
    $user = User::factory()->create();
    Role::create(['name' => 'admin']);
    $user->assignRole('admin');

    Category::factory()->count(5)->create();

    $this->actingAs($user)
        ->get(route('admin.categories.index'))
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/categories')
            ->has('breadcrumbs', 2)
            ->has('breadcrumbs.0', fn (Assert $page) => $page
                ->where('title', 'Admin')
                ->where('href', route('admin.dashboard'))
            )
            ->has('breadcrumbs.1', fn (Assert $page) => $page
                ->where('title', 'Catégories')
                ->where('href', route('admin.categories.index'))
            )
            ->has('categories', 5)
        );
});

test('admin user can create new category', function () {
    $user = User::factory()->create();
    Role::create(['name' => 'admin']);
    $user->assignRole('admin');

    $categoryData = [
        'name' => 'Test Category',
        'slug' => 'test-category',
        'description' => 'This is a test category.',
        'parent_id' => null,
        'status' => true,
    ];

    $this->actingAs($user)
        ->post(route('admin.categories.store'), $categoryData);

    $this->assertDatabaseHas('categories', [
        'name' => 'Test Category',
        'slug' => 'test-category',
        'description' => 'This is a test category.',
        'parent_id' => null,
        'status' => true,
    ]);
});

test('admin user can update existing category', function () {
    $user = User::factory()->create();
    Role::create(['name' => 'admin']);
    $user->assignRole('admin');

    $category = Category::factory()->create();

    $updatedData = [
        'name' => 'Updated Category',
        'slug' => 'updated-category',
        'description' => 'This is an updated category.',
        'parent_id' => null,
        'status' => false,
    ];

    $this->actingAs($user)
        ->put(route('admin.categories.update', $category), $updatedData);

    $this->assertDatabaseHas('categories', [
        'id' => $category->id,
        'name' => 'Updated Category',
        'slug' => 'updated-category',
        'description' => 'This is an updated category.',
        'parent_id' => null,
        'status' => false,
    ]);
});

test('admin user can delete category', function () {
    $user = User::factory()->create();
    Role::create(['name' => 'admin']);
    $user->assignRole('admin');

    $category = Category::create([
        'name' => 'Test Category',
        'slug' => 'test-category',
        'description' => 'This is a test category.',
        'parent_id' => null,
        'status' => true,
    ]);

    $this->actingAs($user)
        ->delete(route('admin.categories.destroy', $category), [
            'name' => 'Test Category'
        ]);

    $this->assertDatabaseMissing('categories', [
        'id' => $category->id,
    ]);
});
