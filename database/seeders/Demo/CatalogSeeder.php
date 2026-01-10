<?php

namespace Database\Seeders\Demo;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CatalogSeeder extends Seeder
{
    /**
     * Seed demo brands, categories, and products.
     */
    public function run(): void
    {
        $this->seedBrands();
        $this->seedCategoriesWithProducts();
    }

    protected function seedBrands(): void
    {
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
    }

    protected function seedCategoriesWithProducts(): void
    {
        $catalog = [
            'Femme' => [
                'Hauts',
                'Pantalons',
                'Robes & Jupes',
                'Vestes & Manteaux Femme',
                'Lingerie',
                'Chaussures Femme',
            ],
            'Homme' => [
                'T-shirts & Polos',
                'Pantalons & Jeans',
                'Chemises',
                'Sweats & Hoodies',
                'Vestes & Manteaux Homme',
                'Chaussures Homme',
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

        $allBrands = Brand::all();

        foreach ($catalog as $parentName => $subcategories) {
            $parent = Category::factory()->create([
                'name' => $parentName,
                'slug' => Str::slug($parentName),
            ]);

            foreach ($subcategories as $subcategoryName) {
                $category = Category::factory()->create([
                    'name' => $subcategoryName,
                    'slug' => Str::slug($subcategoryName),
                    'parent_id' => $parent->id,
                ]);

                $numberOfProducts = rand(5, 10);

                for ($i = 0; $i < $numberOfProducts; $i++) {
                    Product::factory()->create([
                        'brand_id' => $allBrands->random()->id,
                        'category_id' => $category->id,
                    ]);
                }
            }
        }
    }
}
