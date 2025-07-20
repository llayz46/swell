<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Order extends Model
{
    use \Illuminate\Database\Eloquent\Factories\HasFactory;

    protected $fillable = [
        'order_number',
        'stripe_checkout_session_id',
        'amount_discount',
        'amount_total',
        'amount_subtotal',
        'billing_address',
        'shipping_address',
        'user_id',
    ];

    protected $casts = [
        'billing_address' => 'collection',
        'shipping_address' => 'collection',
    ];

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function total(): float
    {
        return $this->items->sum('amount_total');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    protected static function booted()
    {
        static::creating(function ($order) {
            $year = date('Y');
            $order->order_number = 'LE-' . $year . '-' . Str::upper(Str::random(8));
        });
    }
}
