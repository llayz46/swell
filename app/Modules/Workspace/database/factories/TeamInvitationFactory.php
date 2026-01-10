<?php

namespace App\Modules\Workspace\database\factories;

use App\Models\User;
use App\Modules\Workspace\Enums\WorkspaceRole;
use App\Modules\Workspace\Models\Team;
use App\Modules\Workspace\Models\TeamInvitation;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Modules\Workspace\Models\TeamInvitation>
 */
class TeamInvitationFactory extends Factory
{
    protected $model = TeamInvitation::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'team_id' => Team::factory(),
            'user_id' => User::factory(),
            'invited_by' => User::factory(),
            'role' => $this->faker->randomElement(WorkspaceRole::teamRoles()),
            'message' => $this->faker->optional(0.7)->sentence(),
            'status' => 'pending',
            'expires_at' => $this->faker->optional(0.3)->dateTimeBetween('now', '+30 days'),
        ];
    }

    /**
     * Indicate that the invitation is for a lead role.
     */
    public function asLead(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => WorkspaceRole::TeamLead->value,
        ]);
    }

    /**
     * Indicate that the invitation is for a member role.
     */
    public function asMember(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => WorkspaceRole::TeamMember->value,
        ]);
    }

    /**
     * Indicate that the invitation is accepted.
     */
    public function accepted(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'accepted',
        ]);
    }

    /**
     * Indicate that the invitation is declined.
     */
    public function declined(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'declined',
        ]);
    }

    /**
     * Indicate that the invitation is pending.
     */
    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'pending',
        ]);
    }

    /**
     * Indicate that the invitation has expired.
     */
    public function expired(): static
    {
        return $this->state(fn (array $attributes) => [
            'expires_at' => now()->subDay(),
        ]);
    }

    /**
     * Indicate that the invitation never expires.
     */
    public function neverExpires(): static
    {
        return $this->state(fn (array $attributes) => [
            'expires_at' => null,
        ]);
    }
}
