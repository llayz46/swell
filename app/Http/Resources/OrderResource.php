<?php

namespace App\Http\Resources;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Order */
class OrderResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'order_number' => $this->order_number,
//            'stripe_checkout_session_id' => $this->stripe_checkout_session_id,
            'amount_discount' => $this->amount_discount,
            'items' => $this->whenLoaded('items'),
            'amount_total' => $this->amount_total,
            'amount_subtotal' => $this->amount_subtotal,
//            'billing_address' => $this->billing_address,
//            'shipping_address' => $this->shipping_address,
            'user_id' => $this->user_id,
            'user' => UserResource::make($this->whenLoaded('user')),
            'updated_at' => $this->updated_at?->locale('fr')->isoFormat('D MMMM Y à HH:mm:ss'),
            'created_at' => $this->created_at?->locale('fr')->isoFormat('D MMMM Y à HH:mm:ss'),
        ];
    }
}
