<?php

namespace App\Modules\Workspace\database\factories;

use App\Modules\Workspace\Models\InboxItem;
use App\Modules\Workspace\Models\Issue;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Modules\Workspace\Models\InboxItem>
 */
class InboxItemFactory extends Factory
{
    protected $model = InboxItem::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $types = ['comment', 'mention', 'assignment', 'status', 'reopened', 'closed', 'edited', 'created'];
        $isRead = $this->faker->boolean(30);

        return [
            'user_id' => User::inRandomOrder()->first()?->id ?? User::factory(),
            'issue_id' => Issue::inRandomOrder()->first()?->id ?? Issue::factory(),
            'type' => $this->faker->randomElement($types),
            'content' => $this->faker->optional(0.7)->sentence(),
            'actor_id' => User::inRandomOrder()->first()?->id ?? User::factory(),
            'read' => $isRead,
            'read_at' => $isRead ? $this->faker->dateTimeBetween('-7 days', 'now') : null,
        ];
    }

    public function unread(): static
    {
        return $this->state(fn (array $attributes) => [
            'read' => false,
            'read_at' => null,
        ]);
    }

    public function read(): static
    {
        return $this->state(fn (array $attributes) => [
            'read' => true,
            'read_at' => $this->faker->dateTimeBetween('-7 days', 'now'),
        ]);
    }
}
