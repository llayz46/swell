<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

/**
 * Default database seeder - creates only essential data for app functionality.
 *
 * This seeder creates the minimum required data:
 * - Roles (admin, customer, visitor)
 *
 * For demo/test data, use DemoSeeder instead:
 *   php artisan db:seed --class=DemoSeeder
 *
 * @see DemoSeeder for complete demo data (users, products, orders, etc.)
 */
class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call(RoleSeeder::class);
    }
}
