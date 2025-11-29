<?php

namespace App\Modules\Loyalty\Models;

use App\Models\Order;
use App\Modules\Loyalty\Enums\TransactionType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LoyaltyTransaction extends Model
{
    protected $fillable = [
        'loyalty_account_id',
        'type',
        'points',
        'balance_after',
        'description',
        'order_id',
        'expires_at',
    ];

    protected $casts = [
        'type' => TransactionType::class,
        'points' => 'integer',
        'balance_after' => 'integer',
        'expires_at' => 'datetime',
    ];

    public function loyaltyAccount(): BelongsTo
    {
        return $this->belongsTo(LoyaltyAccount::class);
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    /**
     * Check if points have expired
     */
    public function isExpired(): bool
    {
        return $this->expires_at?->isPast();
    }

    /**
     * Check if points are expiring soon (within 30 days)
     */
    public function isExpiringSoon(): bool
    {
        return $this->expires_at?->isFuture()
            && $this->expires_at?->lte(\now()->addDays(30));
    }
}
