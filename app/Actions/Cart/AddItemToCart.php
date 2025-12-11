<?php

namespace App\Actions\Cart;

use App\Models\Cart;
use App\Models\Product;
use App\Actions\Cart\CartCache;
use Illuminate\Support\Facades\DB;

class AddItemToCart
{
    /**
     * Add a product to the cart.
     * If the product with the same options already exists, increment quantity.
     *
     * @param Cart $cart
     * @param int $productId
     * @param int $quantity
     * @param array|null $options
     * @return void
     * @throws \Exception
     */
    public function execute(Cart $cart, int $productId, int $quantity = 1, ?array $options = null): void
    {
        $product = Product::findOrFail($productId);

        if ($product->isOutOfStock()) {
            throw new \Exception('Produit en rupture de stock.');
        }

        DB::transaction(function () use ($cart, $productId, $quantity, $options) {
            $incomingKey = $this->generateOptionsKey($options);

            $existingItem = $cart->items->first(function ($cartItem) use ($productId, $incomingKey) {
                $sameProduct = $cartItem->product_id === $productId;
                $sameOptions = $this->generateOptionsKey($cartItem->options) === $incomingKey;
                return $sameProduct && $sameOptions;
            });

            if ($existingItem) {
                $existingItem->increment('quantity', $quantity);
            } else {
                $cart->items()->create([
                    'product_id' => $productId,
                    'quantity' => $quantity,
                    'options' => $options,
                ]);
            }
        });

        CartCache::forget();
    }

    /**
     * Generate a unique key from options array for comparison.
     *
     * @param array|null $options
     * @return string
     */
    private function generateOptionsKey(?array $options): string
    {
        if (!$options) {
            return '';
        }

        return collect($options)
            ->map(fn($option) => [
                $option['option_id'] ?? null,
                $option['option_value_id'] ?? null,
            ])
            ->filter(fn($pair) => $pair[0] !== null && $pair[1] !== null)
            ->sortBy(fn($pair) => $pair[0])
            ->map(fn($pair) => $pair[0] . ':' . $pair[1])
            ->implode('|');
    }
}
