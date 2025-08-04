<?php

namespace Database\Factories;

use App\Models\ProductComment;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

class ProductCommentFactory extends Factory
{
    protected $model = ProductComment::class;

    public function definition(): array
    {
        return [
            'title' => $this->faker->sentence(),
            'comment' => $this->faker->paragraph(),
            'rating' => $this->faker->numberBetween(0, 5),
            'user_id' => User::factory(),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ];
    }
}
