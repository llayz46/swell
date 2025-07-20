<?php

namespace App\Actions\Cart;

use Illuminate\Support\Facades\Cache;

class CartCache
{
    public static function key(): string
    {
        return "cart-" . (auth()->check() ? 'user-' . auth()->id() : 'session-' . session()->getId());
    }

    public static function forget(): void
    {
        Cache::forget(self::key());
    }
}
