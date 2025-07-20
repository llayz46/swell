<?php

namespace Database\Factories;

use App\Models\Order;
use Illuminate\Database\Eloquent\Factories\Factory;

class OrderFactory extends Factory
{
    public function definition(): array
    {
        return [
            'order_number' => 'LE-' . date('Y') . '-' . $this->faker->unique()->numerify('########'),
            'stripe_checkout_session_id' => $this->faker->uuid,
            'amount_discount' => $this->faker->numberBetween(0, 1000),
            'amount_total' => $this->faker->numberBetween(10000, 50000),
            'billing_address' => [
                'name' => $this->faker->name,
                'email' => $this->faker->email,
                'city' => $this->faker->city,
                'country' => $this->faker->country,
                'line1' => $this->faker->streetAddress,
                'line2' => $this->faker->secondaryAddress,
                'postal_code' => $this->faker->postcode,
                'state' => $this->faker->state,
            ],
            'shipping_address' => [
                'name' => $this->faker->name,
                'city' => $this->faker->city,
                'country' => $this->faker->country,
                'line1' => $this->faker->streetAddress,
                'line2' => $this->faker->secondaryAddress,
                'postal_code' => $this->faker->postcode,
                'state' => $this->faker->state,
            ],
        ];
    }
}
