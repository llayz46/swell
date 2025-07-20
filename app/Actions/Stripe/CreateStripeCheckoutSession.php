<?php

namespace App\Actions\Stripe;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Database\Eloquent\Collection;
use Laravel\Cashier\Checkout;
use Stripe\Checkout\Session;

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
     * Create a Stripe Checkout session for a single product.
     *
     * @param Product $product
     */
    public function createSessionFromSingleItem(Product $product)
    {
        return auth()->user()
            ->allowPromotionCodes()
            ->checkout(
                [
                    [
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
                        'quantity' => 1,
                    ]
                ],
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
}
