<?php

namespace App\Http\Requests\Cart;

use Illuminate\Foundation\Http\FormRequest;

class RemoveItemRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'product_id' => 'required|exists:products,id',
        ];
    }
    
    public function messages(): array
    {
        return [
            'product_id.required' => "L'identifiant du produit est requis",
            'product_id.exists' => "Le produit n'existe pas",
        ];
    }
}
