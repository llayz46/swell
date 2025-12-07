<?php

namespace App\Actions\Stripe;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Database\Eloquent\Collection;
use Laravel\Cashier\Checkout;

class CreateStripeCheckoutSession
{
    /**
     * Create a Stripe Checkout session from the given cart.
     *
     * @param Cart $cart
     * @return \Laravel\Cashier\Checkout
     */
    public function createSessionFromCart(Cart $cart): Checkout
    {
        return $cart->user
            ->allowPromotionCodes()
            ->checkout(
                $this->formatCartItems($cart->items),
                [
                    'customer_update' => [
                        'shipping' => 'auto'
                    ],
                    'shipping_address_collection' => [
                        'allowed_countries' => ['FR', 'BE'],
                    ],
                    'success_url' => route('checkout.success') . '?session_id={CHECKOUT_SESSION_ID}',
                    'metadata' => [
                        'user_id' => $cart->user->id,
                        'cart_id' => $cart->id,
                    ],
                ]
            );
    }

    /**
     * Format cart items for Stripe Checkout session.
     *
     * @param Collection $items
     * @return array
     */
    private function formatCartItems(Collection $items)
    {
        return $items->loadMissing('product.brand')->map(function (CartItem $item) {
        // return $items->loadMissing('product.brand', 'product.options')->map(function (CartItem $item) {
            // if($item->product->options) $variant = $this->resolveVariantFromOptions($item);

            return [
                'price_data' => [
                    'currency' => 'EUR',
                    'unit_amount' => (int) ($item->product->getPrice * 100),
                    'product_data' => [
                        'name' => $item->product->brand->name . ' ' . $item->product->name,
                        'description' => $item->product->short_description,
                        'metadata' => [
                            'product_id' => $item->product->id
                        ],
                    ],
                ],
                'quantity' => $item->quantity,
            ];
        })->toArray();
    }

    /**
     * Create a Stripe Checkout session for multiple products.
     *
     * @param \Illuminate\Support\Collection $productsData
     */
    public function createSessionFromItems($productsData)
    {
        $lineItems = $productsData->map(function ($item) {
            $product = $item['product'];
            $quantity = $item['quantity'];
            
            return [
                'price_data' => [
                    'currency' => 'EUR',
                    'unit_amount' => (int) ($product->getPrice * 100),
                    'product_data' => [
                        'name' => $product->brand->name . ' ' . $product->name,
                        'description' => $product->short_description,
                        'metadata' => [
                            'product_id' => $product->id,
                        ],
                    ],
                ],
                'quantity' => $quantity,
            ];
        })->toArray();
    
        return auth()->user()
            ->allowPromotionCodes()
            ->checkout(
                $lineItems,
                [
                    'customer_update' => [
                        'shipping' => 'auto',
                    ],
                    'shipping_address_collection' => [
                        'allowed_countries' => ['FR', 'BE'],
                    ],
                    'success_url' => route('checkout.success') . '?session_id={CHECKOUT_SESSION_ID}',
                    'metadata' => [
                        'user_id' => auth()->user()->id,
                    ],
                ]
            );
    }

    // private function resolveVariantFromOptions(CartItem $item)
    // {
    //     if (!method_exists($item->product, 'options')) {
    //         return null;
    //     }

    //     $optionPairs = collect($item->options ?? [])->map(function ($o) {
    //         if (is_array($o)) {
    //             return [
    //                 $o['option_id'] ?? null,
    //                 $o['option_value_id'] ?? null,
    //             ];
    //         }

    //         return [
    //             $o->option_id ?? null,
    //             $o->option_value_id ?? null,
    //         ];
    //     })->filter(function ($pair) {
    //         return !empty($pair[0]) && !empty($pair[1]);
    //     })->values()->all();

    //     if (empty($optionPairs)) {
    //         return null;
    //     }

    //     $query = $item->product->options();

    //     foreach ($optionPairs as [$optId, $valId]) {
    //         $optId = (int) $optId;
    //         $valId = (int) $valId;

    //         $query->whereHas('values', function ($sq) use ($optId, $valId) {
    //             $sq->where('option_id', $optId)
    //                 ->where('id', $valId);
    //         });
    //     }

    //     return $query->first();
    // }
}
