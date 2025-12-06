<?php

namespace App\Http\Requests\Product;

use App\Models\Product;
use Illuminate\Validation\Rule;

class UpdateProductRequest extends BaseProductRequest
{
    public function rules(): array
    {
        $productId = $this->route('product')->id;

        return array_merge($this->baseRules(), [
            'sku' => ['nullable', 'string', 'max:100', Rule::unique(Product::class)->ignore($productId)],
            'slug' => ['required', 'string', 'max:255', Rule::unique(Product::class)->ignore($productId)],
        ]);
    }
}