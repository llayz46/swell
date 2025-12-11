<?php

namespace App\Actions\Cart;

use App\Models\Cart;
use App\Models\CartItem;
use App\Actions\Cart\CartCache;

class UpdateCartItemQuantity
{
    /**
     * Update the quantity of a cart item.
     * If quantity is 0 or less, the item will be removed.
     *
     * @param Cart $cart
     * @param int $cartItemId
     * @param int $quantity
     * @return void
     */
    public function execute(Cart $cart, int $cartItemId, int $quantity): void
    {
        $item = $cart->items->firstWhere('id', $cartItemId);

        if (!$item) {
            return;
        }

        if ($quantity <= 0) {
            $item->delete();
        } else {
            $item->update(['quantity' => $quantity]);
        }

        CartCache::forget();
    }

    /**
     * Increment the quantity of a cart item by a given amount.
     *
     * @param Cart $cart
     * @param int $cartItemId
     * @param int $amount
     * @return void
     */
    public function increment(Cart $cart, int $cartItemId, int $amount = 1): void
    {
        $item = $cart->items->firstWhere('id', $cartItemId);

        if ($item) {
            $item->increment('quantity', $amount);
            CartCache::forget();
        }
    }

    /**
     * Decrement the quantity of a cart item by a given amount.
     * If the resulting quantity is 0 or less, the item will be removed.
     *
     * @param Cart $cart
     * @param int $cartItemId
     * @param int $amount
     * @return void
     */
    public function decrement(Cart $cart, int $cartItemId, int $amount = 1): void
    {
        $item = $cart->items->firstWhere('id', $cartItemId);

        if (!$item) {
            return;
        }

        if ($item->quantity - $amount <= 0) {
            $item->delete();
        } else {
            $item->decrement('quantity', $amount);
        }

        CartCache::forget();
    }
}
