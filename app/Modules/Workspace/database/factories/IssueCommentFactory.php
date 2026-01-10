<?php

namespace App\Modules\Workspace\database\factories;

use App\Models\User;
use App\Modules\Workspace\Models\Issue;
use App\Modules\Workspace\Models\IssueComment;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Modules\Workspace\Models\IssueComment>
 */
class IssueCommentFactory extends Factory
{
    protected $model = IssueComment::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'issue_id' => Issue::inRandomOrder()->first()?->id ?? Issue::factory(),
            'user_id' => User::inRandomOrder()->first()?->id ?? User::factory(),
            'parent_id' => null,
            'content' => $this->faker->paragraph(),
            'edited_at' => null,
        ];
    }

    public function reply(IssueComment $parent): static
    {
        return $this->state(fn (array $attributes) => [
            'issue_id' => $parent->issue_id,
            'parent_id' => $parent->id,
        ]);
    }

    public function edited(): static
    {
        return $this->state(fn (array $attributes) => [
            'edited_at' => now(),
        ]);
    }

    public function forIssue(Issue $issue): static
    {
        return $this->state(fn (array $attributes) => [
            'issue_id' => $issue->id,
        ]);
    }

    public function byUser(User $user): static
    {
        return $this->state(fn (array $attributes) => [
            'user_id' => $user->id,
        ]);
    }
}
