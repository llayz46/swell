<?php

namespace App\Modules\Loyalty\Models;

use App\Models\User;
use App\Modules\Loyalty\Enums\TransactionType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class LoyaltyAccount extends Model
{
    protected $fillable = [
        'user_id',
        'points',
        'lifetime_points',
    ];

    protected $casts = [
        'points' => 'integer',
        'lifetime_points' => 'integer',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(LoyaltyTransaction::class);
    }

    /**
     * Get available (non-expired) points
     */
    public function getAvailablePointsAttribute(): int
    {
        return $this->transactions()
            ->where('type', TransactionType::EARNED)
            ->where(function ($query) {
                $query->whereNull('expires_at')
                    ->orWhere('expires_at', '>', now());
            })
            ->sum('points') - $this->getSpentPoints();
    }

    /**
     * Get total spent points
     */
    protected function getSpentPoints(): int
    {
        return abs($this->transactions()
            ->whereIn('type', [TransactionType::SPENT, TransactionType::EXPIRED])
            ->sum('points'));
    }

    /**
     * Get points expiring soon (within 30 days)
     */
    public function getExpiringPointsAttribute(): int
    {
        return $this->transactions()
            ->where('type', TransactionType::EARNED)
            ->whereBetween('expires_at', [now(), now()->addDays(30)])
            ->sum('points');
    }
}
