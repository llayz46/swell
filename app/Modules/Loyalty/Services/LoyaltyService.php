<?php

namespace App\Modules\Loyalty\Services;

use App\Models\Order;
use App\Models\User;
use App\Modules\Loyalty\Enums\TransactionType;
use App\Modules\Loyalty\Models\LoyaltyAccount;
use App\Modules\Loyalty\Models\LoyaltyTransaction;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class LoyaltyService
{
    /**
     * Get or create loyalty account for user
     */
    public function getOrCreateAccount(User $user): LoyaltyAccount
    {
        return LoyaltyAccount::firstOrCreate(
            ['user_id' => $user->id],
            ['points' => 0, 'lifetime_points' => 0]
        );
    }

    /**
     * Clear loyalty account cache for user
     */
    protected function clearAccountCache(User $user): void
    {
        Cache::forget("loyalty-account-{$user->id}");
    }

    /**
     * Award points to user
     */
    public function awardPoints(
        User $user,
        int $points,
        string $description,
        ?Order $order = null,
        ?\DateTime $expiresAt = null
    ): LoyaltyTransaction {
        $transaction = DB::transaction(function () use ($user, $points, $description, $order, $expiresAt) {
            $account = $this->getOrCreateAccount($user);

            // Update account points
            $account->increment('points', $points);
            $account->increment('lifetime_points', $points);
            $account->refresh();

            // Create transaction
            return LoyaltyTransaction::create([
                'loyalty_account_id' => $account->id,
                'type' => TransactionType::EARNED,
                'points' => $points,
                'balance_after' => $account->points,
                'description' => $description,
                'order_id' => $order?->id,
                'expires_at' => $expiresAt,
            ]);
        });

        $this->clearAccountCache($user);

        return $transaction;
    }

    /**
     * Spend points (deduct from user account)
     */
    public function spendPoints(
        User $user,
        int $points,
        string $description,
        ?Order $order = null
    ): LoyaltyTransaction {
        $transaction = DB::transaction(function () use ($user, $points, $description, $order) {
            $account = $this->getOrCreateAccount($user);

            // Check if user has enough points
            if ($account->points < $points) {
                throw new \Exception("Insufficient points. Available: {$account->points}, Required: {$points}");
            }

            // Deduct points
            $account->decrement('points', $points);
            $account->refresh();

            // Create transaction (negative points)
            return LoyaltyTransaction::create([
                'loyalty_account_id' => $account->id,
                'type' => TransactionType::SPENT,
                'points' => -$points,
                'balance_after' => $account->points,
                'description' => $description,
                'order_id' => $order?->id,
            ]);
        });

        $this->clearAccountCache($user);

        return $transaction;
    }

    /**
     * Calculate points to award based on order amount
     */
    public function calculatePointsFromOrder(Order $order): int
    {
        $pointsPerEuro = config('swell.loyalty.points_per_euro', 10);
        $orderAmount = $order->amount_total / 100; // Convert cents to euros

        return (int) floor($orderAmount * $pointsPerEuro);
    }

    /**
     * Calculate discount amount from points
     */
    public function calculateDiscountFromPoints(int $points): float
    {
        $pointsPerEuro = config('swell.loyalty.points_per_euro', 10);

        return $points / $pointsPerEuro;
    }

    /**
     * Admin adjustment (can be positive or negative)
     */
    public function adminAdjustment(
        User $user,
        int $points,
        string $reason
    ): LoyaltyTransaction {
        $transaction = DB::transaction(function () use ($user, $points, $reason) {
            $account = $this->getOrCreateAccount($user);

            // Update points (can be negative)
            if ($points > 0) {
                $account->increment('points', $points);
            } else {
                $account->decrement('points', abs($points));
            }
            $account->refresh();

            return LoyaltyTransaction::create([
                'loyalty_account_id' => $account->id,
                'type' => TransactionType::ADMIN_ADJUSTMENT,
                'points' => $points,
                'balance_after' => $account->points,
                'description' => "Ajustement admin: $reason",
            ]);
        });

        $this->clearAccountCache($user);

        return $transaction;
    }

    /**
     * Expire old points
     */
    public function expirePoints(): int
    {
        $expiredCount = 0;

        $expiredTransactions = LoyaltyTransaction::where('type', TransactionType::EARNED)
            ->where('expires_at', '<=', now())
            ->whereDoesntHave('loyaltyAccount.transactions', function ($query) {
                $query->where('type', TransactionType::EXPIRED);
            })
            ->get();

        foreach ($expiredTransactions as $transaction) {
            DB::transaction(function () use ($transaction, &$expiredCount) {
                $account = $transaction->loyaltyAccount;

                // Deduct expired points
                $account->decrement('points', $transaction->points);
                $account->refresh();

                // Create expiration transaction
                LoyaltyTransaction::create([
                    'loyalty_account_id' => $account->id,
                    'type' => TransactionType::EXPIRED,
                    'points' => -$transaction->points,
                    'balance_after' => $account->points,
                    'description' => 'Points expirés',
                ]);

                $expiredCount++;
            });

            // Clear cache for this account's user
            $this->clearAccountCache($transaction->loyaltyAccount->user);
        }

        return $expiredCount;
    }

    /**
     * Refund points (e.g., when order is refunded)
     */
    public function refundPoints(Order $order): ?LoyaltyTransaction
    {
        // Find the original transaction
        $originalTransaction = LoyaltyTransaction::where('order_id', $order->id)
            ->where('type', TransactionType::EARNED)
            ->first();

        if (!$originalTransaction) {
            return null;
        }

        $transaction = DB::transaction(function () use ($originalTransaction, $order) {
            $account = $originalTransaction->loyaltyAccount;

            // Deduct the refunded points
            $account->decrement('points', $originalTransaction->points);
            $account->refresh();

            return LoyaltyTransaction::create([
                'loyalty_account_id' => $account->id,
                'type' => TransactionType::REFUNDED,
                'points' => -$originalTransaction->points,
                'balance_after' => $account->points,
                'description' => "Remboursement commande #{$order->order_number}",
                'order_id' => $order->id,
            ]);
        });

        $this->clearAccountCache($originalTransaction->loyaltyAccount->user);

        return $transaction;
    }

    /**
     * Get user's transaction history
     */
    public function getTransactionHistory(User $user, int $limit = 50)
    {
        $account = $this->getOrCreateAccount($user);

        return $account->transactions()
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get();
    }
}
