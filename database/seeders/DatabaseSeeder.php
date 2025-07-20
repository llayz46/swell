<?php

namespace Database\Seeders;

use App\Models\BannerMessage;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $menus = [
            'Périphériques' => [
                'Souris',
                'Tapis de Souris',
                'Claviers',
                'Casques'
            ],
            'PC & Écrans' => [
                'PC Gamers',
                'Écrans',
            ],
            'Sièges & Bureaux' => [
                'Sièges Gamers',
                'Bureaux',
                'Sièges Ergonomiques',
                'Bureaux Assis Debout',
            ],
        ];

        $brands = [
            'Logitech',
            'Corsair',
            'Asus',
            'Razer',
            'MSI',
            'SteelSeries',
            'AOC',
            'Samsung',
            'Secretlab',
            'Herman Miller',
            'Pulsar'
        ];

        $user = User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@test.fr',
            'password' => bcrypt('testtest'),
        ]);

        Role::create(['name' => 'admin']);
        $user->assignRole('admin');

        foreach ($brands as $brand) {
            $brand = Brand::factory()->create([
                'name' => $brand,
                'slug' => Str::slug($brand),
            ]);
        }

        foreach ($menus as $menu => $menuItems) {
            $menu = Category::factory()->create([
                'name' => $menu,
                'slug' => Str::slug($menu),
            ]);

            foreach ($menuItems as $menuItem) {
                $category = Category::factory()->create([
                    'name' => $menuItem,
                    'slug' => Str::slug($menuItem),
                    'parent_id' => $menu,
                ]);

                $product = Product::factory()->create([
                    'brand_id' => $brand->id
                ]);
                $product->categories()->attach($category);

                ProductImage::factory()
                    ->count(rand(1, 5))
                    ->create([
                        'product_id' => $product->id,
                    ]);
            }
        }

        Category::factory()->create([
            'name' => $dfs = 'gdfsoinjfdgsnijdsgfj',
            'slug' => Str::slug($dfs),
            'status' => 'inactive',
        ]);

        $bannerMessages = [
            'Expédition le jour même',
            'Livraison offerte sur +1000 produits',
            'Découvre nos +4000 avis clients',
            '100% Gaming & Esport'
        ];

        foreach ($bannerMessages as $index => $message) {
            BannerMessage::create([
                'message' => $message,
                'is_active' => true,
                'order' => $index + 1,
            ]);
        }

        $this->call(ProductSeeder::class);
    }
}
