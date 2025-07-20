<?php

namespace App\Actions\Cart;

use App\Models\Cart;
use Illuminate\Support\Facades\DB;

class MigrateSessionCart
{
    public function migrate(Cart $sessionCart, Cart $userCart)
    {
        DB::transaction(function() use ($sessionCart, $userCart) {
            $sessionItems = $sessionCart->items()->with('product')->get();

            foreach ($sessionItems as $item) {
                $existingItem = $userCart->items()->where('product_id', $item->product_id)->first();

                if ($existingItem) {
                    $existingItem->increment('quantity', $item->quantity);
                } else {
                    $userCart->items()->create([
                        'product_id' => $item->product_id,
                        'quantity' => $item->quantity
                    ]);
                }
            }

            $sessionCart->items()->delete();
            $sessionCart->delete();
        });
    }
}
