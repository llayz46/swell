<?php

namespace Database\Seeders;

use Database\Seeders\Demo\AdminUserSeeder;
use Database\Seeders\Demo\BannerSeeder;
use Database\Seeders\Demo\CatalogSeeder;
use Database\Seeders\Demo\DashboardSeeder;
use Illuminate\Database\Seeder;

/**
 * Demo data seeder for testing and demonstration purposes.
 *
 * This seeder creates a complete demo environment with:
 * - Roles (via RoleSeeder - required for app functionality)
 * - Admin user (john@doe.com / password)
 * - Banner messages
 * - Brands, categories, and products (fashion theme)
 * - Dashboard data (users and orders for analytics)
 * - Workspace data (if module enabled)
 *
 * Usage:
 *   php artisan db:seed --class=DemoSeeder
 *   php artisan migrate:fresh --seed --seeder=DemoSeeder
 */
class DemoSeeder extends Seeder
{
    public function run(): void
    {
        // Required for app functionality
        $this->call(RoleSeeder::class);

        // Demo data
        $this->call([
            AdminUserSeeder::class,
            BannerSeeder::class,
            CatalogSeeder::class,
            DashboardSeeder::class,
        ]);

        // Module-specific seeders
        $this->seedModules();
    }

    protected function seedModules(): void
    {
        if (config('swell.workspace.enabled', false)) {
            $this->call(\App\Modules\Workspace\database\seeders\WorkspaceModuleSeeder::class);
        }
    }
}
