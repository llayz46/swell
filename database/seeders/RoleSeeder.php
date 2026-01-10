<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

/**
 * Creates the base roles required for the application.
 *
 * This seeder is idempotent - safe to run multiple times.
 */
class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $roles = ['admin', 'customer', 'visitor'];

        foreach ($roles as $role) {
            Role::firstOrCreate(['name' => $role]);
        }
    }
}
