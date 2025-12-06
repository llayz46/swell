<?php

namespace App\Http\Requests\Product;

use App\Models\Product;
use Illuminate\Validation\Rule;

class StoreProductRequest extends BaseProductRequest
{
    public function rules(): array
    {
        return array_merge($this->baseRules(), [
            'sku' => ['nullable', 'string', 'max:100', Rule::unique(Product::class)],
            'slug' => ['required', 'string', 'max:255', Rule::unique(Product::class)],
        ]);
    }
}