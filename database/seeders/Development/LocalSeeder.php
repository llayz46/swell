<?php

namespace Database\Seeders\Development;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\User;
use App\Modules\Banner\Models\BannerMessage;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Spatie\Permission\Models\Role;

class LocalSeeder extends Seeder
{
    public function run(): void
    {
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

        $user = User::factory()->create([
            'name' => 'John Doe',
            'email' => 'john@doe.com',
            'password' => bcrypt('password'),
        ]);
        Role::firstOrCreate(['name' => 'admin']);
        $user->assignRole('admin');

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

        $this->call(LocalProductSeeder::class);
    }
}
