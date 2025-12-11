<?php

namespace App\Actions\Cart;

use App\Models\Cart;
use App\Actions\Cart\CartCache;

class RemoveItemFromCart
{
    /**
     * Remove an item from the cart by cart item ID.
     *
     * @param Cart $cart
     * @param int $cartItemId
     * @return void
     */
    public function execute(Cart $cart, int $cartItemId): void
    {
        $item = $cart->items->firstWhere('id', $cartItemId);

        if ($item) {
            $item->delete();
            CartCache::forget();
        }
    }

    /**
     * Remove all items of a specific product from the cart.
     *
     * @param Cart $cart
     * @param int $productId
     * @return void
     */
    public function removeByProductId(Cart $cart, int $productId): void
    {
        $cart->items()
            ->where('product_id', $productId)
            ->delete();

        CartCache::forget();
    }

    /**
     * Remove all items from the cart (clear).
     *
     * @param Cart $cart
     * @return void
     */
    public function clear(Cart $cart): void
    {
        $cart->items()->delete();
        CartCache::forget();
    }
}
