<?php

namespace App\Modules\Workspace\database\factories;

use App\Modules\Workspace\Models\IssueAssignment;
use App\Modules\Workspace\Models\Issue;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Modules\Workspace\Models\IssueAssignment>
 */
class IssueAssignmentFactory extends Factory
{
    protected $model = IssueAssignment::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'issue_id' => Issue::inRandomOrder()->first()?->id ?? Issue::factory(),
            'user_id' => $this->faker->optional(0.9)->randomElement(User::pluck('id')->toArray()),
            'assigned_by' => User::inRandomOrder()->first()?->id ?? User::factory(),
        ];
    }
}
