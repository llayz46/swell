<?php

namespace App\Modules\Workspace\database\factories;

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
            'icon_type' => $this->faker->word(),
            'order' => $this->faker->numberBetween(1, 100),
        ];
    }

    public function urgent(): static
    {
        return $this->state(fn (array $attributes) => [
            'slug' => 'urgent',
            'name' => 'Urgent',
            'color' => '#dc2626',
            'icon_type' => 'UrgentPriorityIcon',
            'order' => 4,
        ]);
    }

    public function high(): static
    {
        return $this->state(fn (array $attributes) => [
            'slug' => 'high',
            'name' => 'Haute',
            'color' => '#f97316',
            'icon_type' => 'HighPriorityIcon',
            'order' => 3,
        ]);
    }

    public function medium(): static
    {
        return $this->state(fn (array $attributes) => [
            'slug' => 'medium',
            'name' => 'Moyenne',
            'color' => '#eab308',
            'icon_type' => 'MediumPriorityIcon',
            'order' => 2,
        ]);
    }

    public function low(): static
    {
        return $this->state(fn (array $attributes) => [
            'slug' => 'low',
            'name' => 'Faible',
            'color' => '#64748b',
            'icon_type' => 'LowPriorityIcon',
            'order' => 1,
        ]);
    }
    
    public function none(): static
    {
        return $this->state(fn (array $attributes) => [
            'slug' => 'none',
            'name' => 'Pas prioritaire',
            'color' => '#94a3b8',
            'icon_type' => 'NoPriorityIcon',
            'order' => 0,
        ]);
    }
}
