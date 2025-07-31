<?php

use App\Models\User;
use App\Modules\Banner\Models\BannerMessage;
use Spatie\Permission\Models\Role;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    if (!config('swell.banner.enabled')) {
        $this->markTestSkipped('La fonctionnalité banner est désactivée.');
    }
});

test('not admin user cannot access banners pages', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('admin.banners.index'))
        ->assertForbidden();
});

test('admin user can access banners pages', function () {
    $user = User::factory()->create();
    Role::create(['name' => 'admin']);
    $user->assignRole('admin');

    $this->actingAs($user)
        ->get(route('admin.banners.index'))
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/banners')
        );
});

test('admin user can access banners list pages with breadcrumbs', function () {
    $user = User::factory()->create();
    Role::create(['name' => 'admin']);
    $user->assignRole('admin');

    $this->actingAs($user)
        ->get(route('admin.banners.index'))
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/banners')
            ->has('breadcrumbs', 2)
            ->has('breadcrumbs.0', fn (Assert $page) => $page
                ->where('title', 'Admin')
                ->where('href', route('admin.dashboard'))
            )
            ->has('breadcrumbs.1', fn (Assert $page) => $page
                ->where('title', 'Bannières')
                ->where('href', route('admin.banners.index'))
            )
        );
});

test('admin user can create new banner', function () {
    $user = User::factory()->create();
    Role::create(['name' => 'admin']);
    $user->assignRole('admin');

    $bannerData = [
        'message' => 'Test Banner Message',
        'is_active' => true,
        'order' => 1,
    ];

    $this->actingAs($user)
        ->post(route('admin.banners.store'), $bannerData);

    $this->assertDatabaseHas('banner_messages', [
        'message' => 'Test Banner Message',
        'is_active' => true,
        'order' => 1,
    ]);
});

test('admin user can update a banner', function () {
    $user = User::factory()->create();
    Role::create(['name' => 'admin']);
    $user->assignRole('admin');

    $banner = BannerMessage::create([
        'message' => 'Test Banner Message',
        'is_active' => true,
        'order' => 1,
    ]);

    $this->assertDatabaseHas('banner_messages', [
        'message' => 'Test Banner Message',
        'is_active' => true,
        'order' => 1,
    ]);

    $this->actingAs($user)
        ->put(route('admin.banners.update', $banner), [
            'message' => 'Updated Banner Message',
            'is_active' => false,
            'order' => 2,
        ]);

    $this->assertDatabaseHas('banner_messages', [
        'message' => 'Updated Banner Message',
        'is_active' => false,
        'order' => 2,
    ]);
});

test('admin user can delete a banner', function () {
    $user = User::factory()->create();
    Role::create(['name' => 'admin']);
    $user->assignRole('admin');

    $banner = BannerMessage::create([
        'message' => 'Test Banner Message',
        'is_active' => true,
        'order' => 1,
    ]);

    $this->actingAs($user)
        ->delete(route('admin.banners.destroy', $banner));

    $this->assertDatabaseMissing('banner_messages', [
        'id' => $banner->id,
    ]);
});
