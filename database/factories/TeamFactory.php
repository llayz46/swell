<?php

namespace Database\Factories;

use App\Modules\Workspace\Models\Team;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Modules\Workspace\Models\Team>
 */
class TeamFactory extends Factory
{
    protected $model = Team::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        static $counter = 0;
        $counter++;

        $emojis = ['🚀', '💻', '⚡', '🎨', '🔥', '✨', '🎯', '🌟', '💡', '🛠️'];
        $colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

        return [
            'identifier' => 'TEAM-' . str_pad($counter, 3, '0', STR_PAD_LEFT),
            'name' => $this->faker->catchPhrase(),
            'icon' => $this->faker->randomElement($emojis),
            'color' => $this->faker->randomElement($colors),
            'description' => $this->faker->optional()->sentence(),
        ];
    }
}
