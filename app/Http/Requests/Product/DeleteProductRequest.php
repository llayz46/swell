<?php

namespace App\Http\Requests\Product;

use Illuminate\Foundation\Http\FormRequest;

class DeleteProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $product = $this->route('product');

        return [
            'name' => ['required', 'in:' . $product->name],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Le nom du produit est requis.',
            'name.in' => 'Le nom saisi ne correspond pas au nom du produit à supprimer.',
        ];
    }
}