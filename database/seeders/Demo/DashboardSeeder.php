<?php

namespace Database\Seeders\Demo;

use App\Models\Order;
use App\Models\User;
use Illuminate\Database\Seeder;

class DashboardSeeder extends Seeder
{
    /**
     * Seed demo users and orders for the admin dashboard.
     *
     * Creates realistic revenue data over the last 6 months.
     */
    public function run(): void
    {
        $users = $this->createBaseUsers();
        $this->createOrdersWithRevenue($users);
    }

    protected function createBaseUsers(): \Illuminate\Support\Collection
    {
        $users = collect();

        for ($i = 0; $i < 30; $i++) {
            $users->push(
                User::factory()->create([
                    'created_at' => now()->subMonths(rand(0, 6))->subDays(rand(0, 30)),
                ])
            );
        }

        return $users;
    }

    protected function createOrdersWithRevenue(\Illuminate\Support\Collection $users): void
    {
        // Revenue targets per month (randomized ranges for realistic data)
        $monthlyTargets = [
            5 => rand(15000, 25000),  // 5 months ago
            4 => rand(25000, 35000),  // 4 months ago
            3 => rand(20000, 30000),  // 3 months ago
            2 => rand(5000, 15000),   // 2 months ago
            1 => rand(18000, 28000),  // 1 month ago
            0 => rand(19000, 29000),  // Current month
        ];

        foreach ($monthlyTargets as $monthsAgo => $targetRevenue) {
            $this->createOrdersForMonth($users, $monthsAgo, $targetRevenue);
        }
    }

    protected function createOrdersForMonth(
        \Illuminate\Support\Collection $users,
        int $monthsAgo,
        int $targetRevenue
    ): void {
        $numberOfOrders = rand(25, 80);
        $totalGenerated = 0;

        for ($i = 0; $i < $numberOfOrders; $i++) {
            $amount = $this->calculateOrderAmount(
                $i,
                $numberOfOrders,
                $targetRevenue,
                $totalGenerated
            );

            $date = now()
                ->subMonths($monthsAgo)
                ->startOfMonth()
                ->addDays(rand(0, 27))
                ->addHours(rand(0, 23))
                ->addMinutes(rand(0, 59));

            $userId = $this->getOrCreateUserId($users);

            Order::factory()->create([
                'amount_total' => $amount,
                'amount_subtotal' => $amount,
                'amount_discount' => 0,
                'created_at' => $date,
                'updated_at' => $date,
                'user_id' => $userId,
            ]);

            $totalGenerated += $amount;
        }
    }

    protected function calculateOrderAmount(
        int $index,
        int $totalOrders,
        int $targetRevenue,
        int $currentTotal
    ): int {
        if ($index === $totalOrders - 1) {
            return max(100, $targetRevenue - $currentTotal);
        }

        $remaining = $targetRevenue - $currentTotal;
        $remainingOrders = $totalOrders - $index;
        $average = $remaining / $remainingOrders;

        return max(100, (int) ($average * rand(50, 150) / 100));
    }

    protected function getOrCreateUserId(\Illuminate\Support\Collection $users): int
    {
        // 70% chance to reuse existing user
        if (rand(1, 100) <= 70 && $users->isNotEmpty()) {
            return $users->random()->id;
        }

        $newUser = User::factory()->create([
            'created_at' => now()->subMonths(rand(0, 6))->subDays(rand(0, 30)),
        ]);
        $users->push($newUser);

        return $newUser->id;
    }
}
