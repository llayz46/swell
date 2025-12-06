<?php

namespace App\Http\Requests\Cart;

use Illuminate\Foundation\Http\FormRequest;

class HandleItemQuantityByIdRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'item_id' => 'required|integer',
            'action' => 'required|in:increase,decrease',
        ];
    }
    
    public function messages(): array
    {
        return [
            'item_id.required' => "L'identifiant de l'élément est requis",
            'item_id.integer' => "L'identifiant de l'élément doit être un nombre entier",
            'action.required' => "L'action est requise",
            'action.in' => "L'action doit être 'increase' ou 'decrease'",
        ];
    }
}
