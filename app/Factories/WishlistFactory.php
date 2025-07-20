<?php

namespace App\Factories;

use App\Models\Wishlist;

class WishlistFactory
{
    public static function make(): Wishlist
    {
        return auth()->user()->wishlist ?: auth()->user()->wishlist()->create();
    }
}
