<?php

namespace App\Http\Requests\Cart;

use Illuminate\Foundation\Http\FormRequest;

abstract class BaseCartRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function messages(): array
    {
        return [
            'product_id.required' => 'Oups ! L\'identifiant du produit est requis.',
            'product_id.exists' => 'Désolé, ce produit est introuvable.',

            'item_id.required' => 'Oups ! L\'identifiant de l\'article est requis.',
            'item_id.integer' => 'Hmm, l\'identifiant doit être un nombre entier.',

            'quantity.integer' => 'Hmm, la quantité doit être un nombre entier.',
            'quantity.min' => 'La quantité doit être d\'au moins 1.',

            'options.array' => 'Hmm, les options doivent être un tableau.',
            'options.*.option_id.required_with' => 'Oups ! L\'identifiant de l\'option est requis.',
            'options.*.option_id.integer' => 'Hmm, l\'identifiant de l\'option doit être un nombre entier.',
            'options.*.option_value_id.required_with' => 'Oups ! L\'identifiant de la valeur de l\'option est requis.',
            'options.*.option_value_id.integer' => 'Hmm, l\'identifiant de la valeur doit être un nombre entier.',

            'action.required' => 'Oups ! L\'action est requise.',
            'action.in' => 'Hmm, l\'action doit être "increase" ou "decrease".',
        ];
    }
}
