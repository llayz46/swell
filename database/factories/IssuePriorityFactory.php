<?php

namespace Database\Factories;

use App\Modules\Workspace\Models\IssuePriority;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Modules\Workspace\Models\IssuePriority>
 */
class IssuePriorityFactory extends Factory
{
    protected $model = IssuePriority::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'slug' => $this->faker->unique()->slug(),
            'name' => $this->faker->word(),
            'color' => $this->faker->hexColor(),
            'order' => $this->faker->numberBetween(1, 100),
        ];
    }

    public function urgent(): static
    {
        return $this->state(fn (array $attributes) => [
            'slug' => 'urgent',
            'name' => 'Urgent',
            'color' => '#dc2626',
            'order' => 1,
        ]);
    }

    public function high(): static
    {
        return $this->state(fn (array $attributes) => [
            'slug' => 'high',
            'name' => 'High',
            'color' => '#f97316',
            'order' => 2,
        ]);
    }

    public function medium(): static
    {
        return $this->state(fn (array $attributes) => [
            'slug' => 'medium',
            'name' => 'Medium',
            'color' => '#eab308',
            'order' => 3,
        ]);
    }

    public function low(): static
    {
        return $this->state(fn (array $attributes) => [
            'slug' => 'low',
            'name' => 'Low',
            'color' => '#64748b',
            'order' => 4,
        ]);
    }
}
