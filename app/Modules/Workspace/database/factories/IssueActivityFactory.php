<?php

namespace App\Modules\Workspace\database\factories;

use App\Models\User;
use App\Modules\Workspace\Models\Issue;
use App\Modules\Workspace\Models\IssueActivity;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Modules\Workspace\Models\IssueActivity>
 */
class IssueActivityFactory extends Factory
{
    protected $model = IssueActivity::class;

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
            'type' => $this->faker->randomElement(IssueActivity::getActivityTypes()),
            'old_value' => null,
            'new_value' => null,
            'created_at' => now(),
        ];
    }

    public function statusChanged(?array $old = null, ?array $new = null): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => IssueActivity::TYPE_STATUS_CHANGED,
            'old_value' => $old,
            'new_value' => $new,
        ]);
    }

    public function priorityChanged(?array $old = null, ?array $new = null): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => IssueActivity::TYPE_PRIORITY_CHANGED,
            'old_value' => $old,
            'new_value' => $new,
        ]);
    }

    public function assigneeChanged(?array $old = null, ?array $new = null): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => IssueActivity::TYPE_ASSIGNEE_CHANGED,
            'old_value' => $old,
            'new_value' => $new,
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
