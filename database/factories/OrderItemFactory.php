<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

class OrderItemFactory extends Factory
{
    protected $model = OrderItem::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->name(),
            'description' => $this->faker->text(),
            'price' => $this->faker->randomFloat(2, 1, 1000),
            'quantity' => $this->faker->numberBetween(1, 10),
            'amount_discount' => $this->faker->randomFloat(2, 0, 100),
            'amount_total' => $this->faker->randomFloat(2, 1, 1000),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),

            'order_id' => Order::factory(),
            'product_id' => Product::factory(),
        ];
    }
}
