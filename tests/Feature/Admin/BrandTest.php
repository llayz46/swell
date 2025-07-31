<?php

use App\Models\Brand;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Inertia\Testing\AssertableInertia as Assert;

test('not admin user cannot access brands pages', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('admin.brands.index'))
        ->assertForbidden();
});

test('admin user can access brands pages', function () {
    $user = User::factory()->create();
    Role::create(['name' => 'admin']);
    $user->assignRole('admin');

    $this->actingAs($user)
        ->get(route('admin.brands.index'))
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/brands')
        );
});

test('admin user can access brand list pages with brands & breadcrumbs', function () {
    $user = User::factory()->create();
    Role::create(['name' => 'admin']);
    $user->assignRole('admin');

    Brand::factory()->count(5)->create();

    $this->actingAs($user)
        ->get(route('admin.brands.index'))
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/brands')
            ->has('breadcrumbs', 2)
            ->has('breadcrumbs.0', fn (Assert $page) => $page
                ->where('title', 'Admin')
                ->where('href', route('admin.dashboard'))
            )
            ->has('breadcrumbs.1', fn (Assert $page) => $page
                ->where('title', 'Marques')
                ->where('href', route('admin.brands.index'))
            )
            ->has('brands', 5)
        );
});

test('admin user can create new brand', function () {
    $user = User::factory()->create();
    Role::create(['name' => 'admin']);
    $user->assignRole('admin');

    $brandData = [
        'name' => 'Test Brand',
        'slug' => 'test-brand',
        'logo_url' => \Illuminate\Http\UploadedFile::fake()->image('brand-logo.jpg'),
    ];

    $this->actingAs($user)
        ->post(route('admin.brands.store'), $brandData);

    $this->assertDatabaseHas('brands', [
        'name' => 'Test Brand',
        'slug' => 'test-brand',
    ]);

    $brand = Brand::where('slug', 'test-brand')->first();
    Storage::disk('public')->assertExists($brand->logo_url);
});

test('admin user can update a brand', function () {
    $user = User::factory()->create();
    Role::create(['name' => 'admin']);
    $user->assignRole('admin');

    $brand = Brand::create([
        'name' => 'Test Brand',
        'slug' => 'test-brand',
        'logo_url' => \Illuminate\Http\UploadedFile::fake()->image('brand-logo.jpg'),
    ]);

    $this->assertDatabaseHas('brands', [
        'name' => 'Test Brand',
        'slug' => 'test-brand',
    ]);

    $this->actingAs($user)
        ->post(route('admin.brands.update', $brand), [
            'name' => 'Updated Brand',
            'slug' => 'updated-brand',
            'logo_url' => \Illuminate\Http\UploadedFile::fake()->image('updated-logo.jpg'),
        ]);

    $this->assertDatabaseHas('brands', [
        'name' => 'Updated Brand',
        'slug' => 'updated-brand',
    ]);

    $brandUpdated = Brand::where('slug', 'updated-brand')->first();
    Storage::disk('public')->assertExists($brandUpdated->logo_url);
});

test('admin user can delete a brand', function () {
    $user = User::factory()->create();
    Role::create(['name' => 'admin']);
    $user->assignRole('admin');

    $brand = Brand::create([
        'name' => 'Test Brand',
        'slug' => 'test-brand',
        'logo_url' => \Illuminate\Http\UploadedFile::fake()->image('brand-logo.jpg'),
    ]);

    $this->actingAs($user)
        ->delete(route('admin.brands.destroy', $brand), [
            'name' => 'Test Brand'
        ]);

    $this->assertDatabaseMissing('brands', [
        'name' => 'Test Brand',
        'slug' => 'test-brand',
    ]);
});
