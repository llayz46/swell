<?php

namespace App\Modules\Workspace\database\factories;

use App\Modules\Workspace\Models\IssueStatus;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Modules\Workspace\Models\IssueStatus>
 */
class IssueStatusFactory extends Factory
{
    protected $model = IssueStatus::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'slug' => $this->faker->unique()->slug(),
            'name' => $this->faker->words(2, true),
            'color' => $this->faker->hexColor(),
            'icon_type' => $this->faker->randomElement(['circle', 'square', 'triangle', 'check', 'clock', 'pause']),
            'order' => $this->faker->numberBetween(1, 100),
        ];
    }

    public function backlog(): static
    {
        return $this->state(fn (array $attributes) => [
            'slug' => 'backlog',
            'name' => 'Backlog',
            'color' => '#64748b',
            'icon_type' => 'circle',
            'order' => 1,
        ]);
    }

    public function todo(): static
    {
        return $this->state(fn (array $attributes) => [
            'slug' => 'to-do',
            'name' => 'To Do',
            'color' => '#94a3b8',
            'icon_type' => 'circle',
            'order' => 2,
        ]);
    }

    public function inProgress(): static
    {
        return $this->state(fn (array $attributes) => [
            'slug' => 'in-progress',
            'name' => 'En cours',
            'color' => '#f59e0b',
            'icon_type' => 'clock',
            'order' => 3,
        ]);
    }

    public function technicalReview(): static
    {
        return $this->state(fn (array $attributes) => [
            'slug' => 'technical-review',
            'name' => 'Revue Technique',
            'color' => '#8b5cf6',
            'icon_type' => 'square',
            'order' => 4,
        ]);
    }

    public function paused(): static
    {
        return $this->state(fn (array $attributes) => [
            'slug' => 'paused',
            'name' => 'En pause',
            'color' => '#ef4444',
            'icon_type' => 'pause',
            'order' => 5,
        ]);
    }

    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'slug' => 'completed',
            'name' => 'Terminé',
            'color' => '#10b981',
            'icon_type' => 'check',
            'order' => 6,
        ]);
    }
}
