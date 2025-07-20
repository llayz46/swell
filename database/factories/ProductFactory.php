<?php

namespace Database\Factories;

use App\Models\Brand;
use App\Models\ProductGroup;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $name = $this->faker->words(3, true),
            'slug' => Str::slug($name),
            'sku' => 'LO-' . Str::between(Str::slug($name), 0, 6) . '-' . Str::upper(Str::random(4)),
            'description' => $this->faker->paragraph(),
            'short_description' => $this->faker->sentences(4, true),
            'price' => $this->faker->randomFloat(2, 10, 1000),
            'discount_price' => $this->faker->optional()->randomFloat(2, 5, 500),
            'cost_price' => $this->faker->randomFloat(2, 5, 500),
            'stock' => $this->faker->numberBetween(0, 100),
            'reorder_level' => $this->faker->numberBetween(1, 20),
            'status' => true,
            'meta_title' => $name,
            'meta_description' => $this->faker->sentence(),
            'meta_keywords' => $this->faker->words(3, true),
            'brand_id' => Brand::factory(),
            'product_group_id' => null,
            'created_at' => now()->subDays(rand(1, 123)),
        ];
    }
}
