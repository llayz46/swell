<?php

namespace App\Actions\Stripe;

use App\Models\Cart;
use App\Models\OrderItem;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Laravel\Cashier\Cashier;
use Stripe\LineItem;

class HandleCheckoutSessionCompleted
{
    public function handle($sessionId)
    {
        DB::transaction(function () use ($sessionId) {
            $session = Cashier::stripe()->checkout->sessions->retrieve($sessionId);
            $user = User::find($session->metadata->user_id);
            $cart = Cart::find($session->metadata->cart_id);

            $order = $user->orders()->create([
                'stripe_checkout_session_id' => $session->id,
                'amount_discount' => $session->total_details->amount_discount,
                'amount_subtotal' => $session->amount_subtotal,
                'amount_total' => $session->amount_total,
                'billing_address' => [
                    'name' => $session->customer_details?->name,
                    'email' => $session->customer_details?->email,
                    'city' => $session->customer_details?->address->city,
                    'country' => $session->customer_details?->address->country,
                    'line1' => $session->customer_details?->address->line1,
                    'line2' => $session->customer_details?->address->line2,
                    'postal_code' => $session->customer_details?->address->postal_code,
                    'state' => $session->customer_details?->address->state,
                ],
                'shipping_address' => [
                    'name' => $session->shipping_details?->name,
                    'city' => $session->shipping_details?->address->city,
                    'country' => $session->shipping_details?->address->country,
                    'line1' => $session->shipping_details?->address->line1,
                    'line2' => $session->shipping_details?->address->line2,
                    'postal_code' => $session->shipping_details?->address->postal_code,
                    'state' => $session->shipping_details?->address->state,
                ],
            ]);

            $lineItems = Cashier::stripe()->checkout->sessions->allLineItems($session->id);

            $orderItems = collect($lineItems->all())->map(function (LineItem $line) use ($order) {
                $product = Cashier::stripe()->products->retrieve($line->price->product);

                return new OrderItem([
                    'product_id' => $product->metadata->product_id,
                    'order_id' => $order->id,
                    'name' => $product->name,
                    'description' => $product->description,
                    'price' => $line->price->unit_amount,
                    'quantity' => $line->quantity,
                    'amount_discount' => $line->amount_discount,
                    'amount_total' => $line->amount_total,
                ]);
            });

            $order->items()->saveMany($orderItems);

            if ($cart) {
                $cart->items()->delete();
                $cart->delete();
            }
        });
    }
}
