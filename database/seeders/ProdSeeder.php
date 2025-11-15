<?php

namespace Database\Seeders;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\User;
use App\Modules\Banner\Models\BannerMessage;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Spatie\Permission\Models\Role;

class ProdSeeder extends Seeder
{
    public function run(): void
    {
        $bannerMessages = [
            'Livraison gratuite dès 50€',
            'Retours gratuits sous 30 jours',
            'Nouvelle collection disponible',
            'Jusqu\'à -50% sur une sélection d\'articles'
        ];

        foreach ($bannerMessages as $index => $message) {
            BannerMessage::create([
                'message' => $message,
                'is_active' => true,
                'order' => $index + 1,
            ]);
        }

        User::factory()->create([
            'name' => 'John Doe',
            'email' => 'john@doe.com',
            'password' => bcrypt('password'),
        ])->assignRole('admin');

        $menus = [
            'Femme' => [
                'Hauts',
                'Pantalons',
                'Robes & Jupes',
                'Vestes & Manteaux Femme',
                'Lingerie',
                'Chaussures',
            ],
            'Homme' => [
                'T-shirts & Polos',
                'Pantalons & Jeans',
                'Chemises',
                'Sweats & Hoodies',
                'Vestes & Manteaux Homme',
                'Chaussures',
            ],
            'Accessoires' => [
                'Sacs & Bagages',
                'Ceintures',
                'Écharpes & Bonnets',
                'Bijoux',
                'Lunettes',
            ],
            'Sport' => [
                'Vêtements de Sport',
                'Chaussures de Sport',
                'Leggings & Brassières',
                'Équipement Fitness',
            ],
        ];

        $brands = [
            'Zara',
            'H&M',
            'Nike',
            'Adidas',
            'Levi\'s',
            'Mango',
            'Pull & Bear',
            'Bershka',
            'Uniqlo',
            'Ralph Lauren',
            'Tommy Hilfiger',
            'Calvin Klein',
        ];

        foreach ($brands as $brand) {
            Brand::factory()->create([
                'name' => $brand,
                'slug' => Str::slug($brand),
            ]);
        }

        $allBrands = Brand::all();

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

                $numberOfProducts = rand(5, 10);

                for ($i = 0; $i < $numberOfProducts; $i++) {
                    $randomBrand = $allBrands->random();

                    Product::factory()->create([
                        'brand_id' => $randomBrand->id,
                        'category_id' => $category->id,
                    ]);
                }

            }
        }

        $this->call(ProdDashboardAdminSeeder::class);
    }
}
