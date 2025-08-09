<?php

use App\Models\Collection;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Inertia\Testing\AssertableInertia as Assert;

test('not admin user cannot access collections pages', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('admin.collections.index'))
        ->assertForbidden();
});

test('admin user can access collections pages', function () {
    $user = User::factory()->create();
    Role::create(['name' => 'admin']);
    $user->assignRole('admin');

    $this->actingAs($user)
        ->get(route('admin.collections.index'))
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/collections')
        );
});

test('admin user can access collection list pages with collections & breadcrumbs', function () {
    $user = User::factory()->create();
    Role::create(['name' => 'admin']);
    $user->assignRole('admin');

    Collection::factory()->count(5)->create();

    $this->actingAs($user)
        ->get(route('admin.collections.index'))
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/collections')
            ->has('breadcrumbs', 2)
            ->has('breadcrumbs.0', fn (Assert $page) => $page
                ->where('title', 'Admin')
                ->where('href', route('admin.dashboard'))
            )
            ->has('breadcrumbs.1', fn (Assert $page) => $page
                ->where('title', 'Collections')
                ->where('href', route('admin.collections.index'))
            )
            ->has('collections', 5)
        );
});

test('admin user can create new collection', function () {
    $user = User::factory()->create();
    Role::create(['name' => 'admin']);
    $user->assignRole('admin');

    $collectionData = [
        'title' => 'Test Collection',
        'slug' => 'test-collection',
    ];

    $this->actingAs($user)
        ->post(route('admin.collections.store'), $collectionData);

    $this->assertDatabaseHas('collections', [
        'title' => 'Test Collection',
        'slug' => 'test-collection',
    ]);
});

test('admin user can update a collection', function () {
    $user = User::factory()->create();
    Role::create(['name' => 'admin']);
    $user->assignRole('admin');

    $collection = Collection::create([
        'title' => 'Test Collection',
        'slug' => 'test-collection',
    ]);

    $this->assertDatabaseHas('collections', [
        'title' => 'Test Collection',
        'slug' => 'test-collection',
    ]);

    $this->actingAs($user)
        ->put(route('admin.collections.update', $collection), [
            'title' => 'Updated Collection',
            'slug' => 'updated-collection',
        ]);

    $this->assertDatabaseHas('collections', [
        'title' => 'Updated Collection',
        'slug' => 'updated-collection',
    ]);
});

test('admin user can delete a collection', function () {
    $user = User::factory()->create();
    Role::create(['name' => 'admin']);
    $user->assignRole('admin');

    $collection = Collection::create([
        'title' => 'Test Collection',
        'slug' => 'test-collection',
    ]);

    $this->actingAs($user)
        ->delete(route('admin.collections.destroy', $collection), [
            'name' => 'Test Collection'
        ]);

    $this->assertDatabaseMissing('collections', [
        'title' => 'Test Collection',
        'slug' => 'test-collection',
    ]);
});

test('product collection_id null on collection delete', function () {
    $user = User::factory()->create();
    Role::create(['name' => 'admin']);
    $user->assignRole('admin');

    $collection = Collection::create([
        'title' => 'Test Collection',
        'slug' => 'test-collection',
    ]);

    $product = \App\Models\Product::factory()->create(['collection_id' => $collection->id]);

    $this->actingAs($user)
        ->delete(route('admin.collections.destroy', $collection), [
            'name' => 'Test Collection'
        ]);

    $product->refresh();
    $this->assertNull($product->collection_id);
});
