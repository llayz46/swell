<?php

namespace Database\Seeders;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\User;
use App\Modules\Banner\Models\BannerMessage;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Spatie\Permission\Models\Role;

class LocalDashboardAdminSeeder extends Seeder
{
    public function run(): void
    {
        $users = collect();
        for ($i = 0; $i < 30; $i++) {
            $users->push(
                User::factory()->create([
                    'created_at' => now()->subMonths(rand(0, 6))->subDays(rand(0, 30))
                ])
            );
        }

        $monthlyRevenues = [
            5 => ['month' => 'June', 'revenue' => 18600],
            4 => ['month' => 'July', 'revenue' => 30500],
            3 => ['month' => 'August', 'revenue' => 23700],
            2 => ['month' => 'September', 'revenue' => 7300],
            1 => ['month' => 'October', 'revenue' => 20900],
            0 => ['month' => 'November', 'revenue' => 21400],
        ];

        foreach ($monthlyRevenues as $monthsAgo => $data) {
            $targetRevenue = $data['revenue'];
            $numberOfOrders = rand(25, 80);
            $totalGenerated = 0;

            for ($i = 0; $i < $numberOfOrders; $i++) {
                if ($i === $numberOfOrders - 1) {
                    $amount = $targetRevenue - $totalGenerated;
                } else {
                    $remaining = $targetRevenue - $totalGenerated;
                    $remainingOrders = $numberOfOrders - $i;
                    $average = $remaining / $remainingOrders;
                    $amount = (int) ($average * rand(50, 150) / 100);
                }

                $amount = max(100, $amount);

                $date = now()
                    ->subMonths($monthsAgo)
                    ->startOfMonth()
                    ->addDays(rand(0, 27))
                    ->addHours(rand(0, 23))
                    ->addMinutes(rand(0, 59));

                if (rand(1, 100) <= 70 && $users->isNotEmpty()) {
                    $userId = $users->random()->id;
                } else {
                    $newUser = User::factory()->create([
                        'created_at' => now()->subMonths(rand(0, 6))->subDays(rand(0, 30))
                    ]);
                    $users->push($newUser);
                    $userId = $newUser->id;
                }

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
    }
}
