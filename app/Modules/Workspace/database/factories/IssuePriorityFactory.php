<?php

namespace App\Modules\Workspace\database\factories;

use App\Modules\Workspace\Enums\PriorityIconType;
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
            'icon_type' => $this->faker->randomElement(PriorityIconType::cases()),
            'order' => $this->faker->numberBetween(1, 100),
        ];
    }

    public function urgent(): static
    {
        return $this->state(fn (array $attributes) => [
            'slug' => 'urgent',
            'name' => 'Urgent',
            'icon_type' => PriorityIconType::Urgent,
            'order' => 4,
        ]);
    }

    public function high(): static
    {
        return $this->state(fn (array $attributes) => [
            'slug' => 'high',
            'name' => 'Haute',
            'icon_type' => PriorityIconType::High,
            'order' => 3,
        ]);
    }

    public function medium(): static
    {
        return $this->state(fn (array $attributes) => [
            'slug' => 'medium',
            'name' => 'Moyenne',
            'icon_type' => PriorityIconType::Medium,
            'order' => 2,
        ]);
    }

    public function low(): static
    {
        return $this->state(fn (array $attributes) => [
            'slug' => 'low',
            'name' => 'Faible',
            'icon_type' => PriorityIconType::Low,
            'order' => 1,
        ]);
    }

    public function none(): static
    {
        return $this->state(fn (array $attributes) => [
            'slug' => 'none',
            'name' => 'Pas prioritaire',
            'icon_type' => PriorityIconType::NoPriority,
            'order' => 0,
        ]);
    }
}
