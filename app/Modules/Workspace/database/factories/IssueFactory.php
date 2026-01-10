<?php

namespace App\Modules\Workspace\database\factories;

use App\Modules\Workspace\Models\Issue;
use App\Modules\Workspace\Models\IssueStatus;
use App\Modules\Workspace\Models\IssuePriority;
use App\Modules\Workspace\Models\Team;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Modules\Workspace\Models\Issue>
 */
class IssueFactory extends Factory
{
    protected $model = Issue::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        static $counter = 0;
        $counter++;

        $prefix = config('swell.workspace.identifier_prefix', 'WS');

        return [
            'identifier' => sprintf('%s-%d', $prefix, $counter),
            'title' => $this->faker->sentence(),
            'description' => $this->faker->optional(0.8)->paragraph(),
            'status_id' => IssueStatus::inRandomOrder()->first()?->id ?? IssueStatus::factory(),
            'priority_id' => IssuePriority::inRandomOrder()->first()?->id ?? IssuePriority::factory(),
            'assignee_id' => $this->faker->optional(0.7)->randomElement(User::pluck('id')->toArray()),
            'creator_id' => User::inRandomOrder()->first()?->id ?? User::factory(),
            'team_id' => Team::inRandomOrder()->first()?->id ?? Team::factory(),
            'due_date' => $this->faker->optional(0.5)->dateTimeBetween('now', '+3 months'),
            'rank' => $this->generateLexoRank(),
        ];
    }

    /**
     * Generate a simple LexoRank-like string
     */
    private function generateLexoRank(): string
    {
        return '0|' . str_pad(dechex(rand(0, 16777215)), 6, '0', STR_PAD_LEFT) . ':';
    }
}
