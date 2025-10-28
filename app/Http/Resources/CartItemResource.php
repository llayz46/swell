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
            'options' => $this->options,
            'product' => [
                'id' => $this->product->id,
                'name' => $this->product->name,
                'price' => $this->product->getPrice,
                'image' => new ProductImageResource(
                    $this->product->images->firstWhere('is_featured', true)
                ),
                'brand' => BrandResource::make($this->product->brand),
                'options' => $this->product->options->map(fn($opt) => [
                    'id' => $opt->id,
                    'name' => $opt->name,
                    'values' => $opt->values->map(fn($val) => [
                        'id' => $val->id,
                        'value' => $val->value,
                    ]),
                ]),
            ],
        ];
    }
}
