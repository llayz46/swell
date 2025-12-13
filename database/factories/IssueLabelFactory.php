<?php

namespace Database\Factories;

use App\Modules\Workspace\Models\IssueLabel;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Modules\Workspace\Models\IssueLabel>
 */
class IssueLabelFactory extends Factory
{
    protected $model = IssueLabel::class;

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
        ];
    }

    public function ui(): static
    {
        return $this->state(fn (array $attributes) => [
            'slug' => 'ui',
            'name' => 'UI',
            'color' => '#3b82f6',
        ]);
    }

    public function bug(): static
    {
        return $this->state(fn (array $attributes) => [
            'slug' => 'bug',
            'name' => 'Bug',
            'color' => '#ef4444',
        ]);
    }

    public function feature(): static
    {
        return $this->state(fn (array $attributes) => [
            'slug' => 'feature',
            'name' => 'Feature',
            'color' => '#10b981',
        ]);
    }

    public function documentation(): static
    {
        return $this->state(fn (array $attributes) => [
            'slug' => 'documentation',
            'name' => 'Documentation',
            'color' => '#8b5cf6',
        ]);
    }

    public function refactor(): static
    {
        return $this->state(fn (array $attributes) => [
            'slug' => 'refactor',
            'name' => 'Refactor',
            'color' => '#f59e0b',
        ]);
    }

    public function performance(): static
    {
        return $this->state(fn (array $attributes) => [
            'slug' => 'performance',
            'name' => 'Performance',
            'color' => '#06b6d4',
        ]);
    }

    public function design(): static
    {
        return $this->state(fn (array $attributes) => [
            'slug' => 'design',
            'name' => 'Design',
            'color' => '#ec4899',
        ]);
    }

    public function security(): static
    {
        return $this->state(fn (array $attributes) => [
            'slug' => 'security',
            'name' => 'Security',
            'color' => '#dc2626',
        ]);
    }

    public function accessibility(): static
    {
        return $this->state(fn (array $attributes) => [
            'slug' => 'accessibility',
            'name' => 'Accessibility',
            'color' => '#84cc16',
        ]);
    }

    public function testing(): static
    {
        return $this->state(fn (array $attributes) => [
            'slug' => 'testing',
            'name' => 'Testing',
            'color' => '#6366f1',
        ]);
    }

    public function internationalization(): static
    {
        return $this->state(fn (array $attributes) => [
            'slug' => 'internationalization',
            'name' => 'Internationalization',
            'color' => '#14b8a6',
        ]);
    }
}
