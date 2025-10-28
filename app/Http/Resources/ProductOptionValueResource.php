<?php

namespace App\Http\Resources;

use App\Models\ProductOptionValue;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin ProductOptionValue */
class ProductOptionValueResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'value' => $this->value,
            'product_option_id' => $this->product_option_id,
            'option' => ProductOptionResource::make($this->whenLoaded('option')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
