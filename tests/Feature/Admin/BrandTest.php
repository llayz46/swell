<?php

use App\Models\User;
use Spatie\Permission\Models\Role;

it('admin user can access brands pages', function () {
    $user = User::factory()->create();
    Role::create(['name' => 'admin']);
    $user->assignRole('admin');

    $this->actingAs($user)
        ->get(route('admin.brands.index'))
        ->assertComponent('admin/brands')
        ->assertOk();
});

it('has breadcrumbs on brands page', function () {
    $user = User::factory()->create();
    Role::create(['name' => 'admin']);
    $user->assignRole('admin');

    $this->actingAs($user)
        ->get(route('admin.brands.index'))
        ->assertSeeInOrder(['Admin', 'Marques']);
});
