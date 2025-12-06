<?php

namespace App\Http\Requests\Cart;

use Illuminate\Foundation\Http\FormRequest;

class HandleItemQuantityRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'product_id' => 'required|exists:products,id',
            'action' => 'required|in:increase,decrease',
        ];
    }
    
    public function messages(): array
    {
        return [
            'product_id.required' => "L'identifiant du produit est requis",
            'product_id.integer' => "L'identifiant du produit doit être un nombre entier",
            'action.required' => "L'action est requise",
            'action.in' => "L'action doit être 'increase' ou 'decrease'",
        ];
    }
}
