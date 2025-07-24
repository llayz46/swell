<?php

namespace App\Modules\Wishlist\Factories;

use App\Modules\Wishlist\Models\Wishlist;

class WishlistFactory
{
    public static function make(): Wishlist
    {
        return auth()->user()->wishlist ?: auth()->user()->wishlist()->create();
    }
}
