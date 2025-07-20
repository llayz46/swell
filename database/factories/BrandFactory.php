<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Brand>
 */
class BrandFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $name = $this->faker->company(),
            'slug' => \Illuminate\Support\Str::slug($name),
            'logo_url' => $this->faker->imageUrl(640, 480, 'business', true, $name, true)
        ];
    }
}
