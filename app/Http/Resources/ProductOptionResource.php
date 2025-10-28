<?php

namespace App\Http\Resources;

use App\Models\ProductOption;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin ProductOption */
class ProductOptionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'product_id' => $this->product_id,
            'product' => ProductResource::make($this->whenLoaded('product')),
            'values' => ProductOptionValueResource::collection($this->whenLoaded('values')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
