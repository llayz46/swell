<?php

namespace App\Actions\Wishlist;

class HandleProductWishlist
{
    public function add($productId, $wishlist)
    {
        $wishlist->products()->syncWithoutDetaching([$productId]);
    }

    public function remove($productId, $wishlist)
    {
        $wishlist->products()->detach($productId);
    }

    public function clear($wishlist)
    {
        $wishlist->products()->detach();
    }
}
