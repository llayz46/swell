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
            'name.required' => 'Oups ! Veuillez saisir le nom du produit pour confirmer.',
            'name.in' => 'Hmm, le nom saisi ne correspond pas. Veuillez réessayer.',
        ];
    }
}