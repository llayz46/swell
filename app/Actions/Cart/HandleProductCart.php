<?php

namespace App\Actions\Cart;

use App\Factories\CartFactory;
use App\Models\Product;

class HandleProductCart
{
    protected function optionsKey(?array $options): string
    {
        if (!$options) return '';
        $pairs = collect($options)
            ->map(fn ($o) => [$o['option_id'] ?? null, $o['option_value_id'] ?? null])
            ->filter(fn ($p) => $p[0] !== null && $p[1] !== null)
            ->sortBy(fn ($p) => $p[0])
            ->map(fn ($p) => $p[0] . ':' . $p[1])
            ->implode('|');
        return $pairs;
    }

    public function add($productId, $quantity = 1, $cart = null, ?array $options = null)
    {
        $product = Product::findOrFail($productId);

        if ($product->isOutOfStock()) {
            throw new \Exception('Produit en rupture de stock.');
        }

        $cart = $cart ?: CartFactory::make();

        $incomingKey = $this->optionsKey($options);

        $item = $cart->items->first(function ($cartItem) use ($productId, $incomingKey) {
            $sameProduct = $cartItem->product_id === $productId;
            $sameKey = $this->optionsKey($cartItem->options) === $incomingKey;
            return $sameProduct && $sameKey;
        });

        if ($item) {
            $item->increment('quantity', $quantity);
        } else {
            $cart->items()->create([
                'product_id' => $productId,
                'quantity' => $quantity,
                'options' => $options,
            ]);
        }

        CartCache::forget();
    }

    public function remove($productId, $cart = null)
    {
        $cart = $cart ?: CartFactory::make();

        $item = $cart->items->first(function ($cartItem) use ($productId) {
            return $cartItem->product_id === $productId;
        });

        $item?->delete();

        CartCache::forget();
    }

    public function clear($cart = null)
    {
        ($cart ?: CartFactory::make())->items()->delete();

        CartCache::forget();
    }

    public function increase($productId, $cart = null)
    {
        $item = ($cart ?: CartFactory::make())->items->first(function ($cartItem) use ($productId) {
            return $cartItem->product_id === $productId;
        });

        $item?->increment('quantity');

        CartCache::forget();
    }

    public function decrease($productId, $cart = null)
    {
        $item = ($cart ?: CartFactory::make())->items->first(function ($cartItem) use ($productId) {
            return $cartItem->product_id === $productId;
        });

        if ($item && $item->quantity > 1) {
            $item->decrement('quantity');
        } else {
            $item?->delete();
        }

        CartCache::forget();
    }

    public function removeByItemId($itemId, $cart = null)
    {
        $cart = $cart ?: CartFactory::make();
        $item = $cart->items->firstWhere('id', $itemId);
        $item?->delete();
        CartCache::forget();
    }

    public function increaseByItemId($itemId, $cart = null)
    {
        $cart = $cart ?: CartFactory::make();
        $item = $cart->items->firstWhere('id', $itemId);
        $item?->increment('quantity');
        CartCache::forget();
    }

    public function decreaseByItemId($itemId, $cart = null)
    {
        $cart = $cart ?: CartFactory::make();
        $item = $cart->items->firstWhere('id', $itemId);
        if ($item && $item->quantity > 1) {
            $item->decrement('quantity');
        } else {
            $item?->delete();
        }
        CartCache::forget();
    }
}
