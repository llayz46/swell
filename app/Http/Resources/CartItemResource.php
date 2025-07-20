<?php

namespace App\Http\Resources;

use App\Models\CartItem;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin CartItem */
class CartItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'quantity' => $this->quantity,
            'product' => [
                'id' => $this->product->id,
                'name' => $this->product->name,
                'price' => $this->product->getPrice,
                'image' => new ProductImageResource(
                    $this->product->images->firstWhere('is_featured', true)
                ),
                'brand' => BrandResource::make($this->product->brand),
            ],
        ];
    }
}
