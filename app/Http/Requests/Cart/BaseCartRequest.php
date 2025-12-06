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
            'product_id.required' => "L'identifiant du produit est requis",
            'product_id.exists' => "Le produit n'existe pas",

            'item_id.required' => "L'identifiant de l'élément est requis",
            'item_id.integer' => "L'identifiant de l'élément doit être un nombre entier",

            'quantity.integer' => "La quantité doit être un nombre entier",
            'quantity.min' => "La quantité doit être au moins 1",

            'options.array' => "Les options doivent être un tableau",
            'options.*.option_id.required_with' => "L'identifiant de l'option est requis",
            'options.*.option_id.integer' => "L'identifiant de l'option doit être un nombre entier",
            'options.*.option_value_id.required_with' => "L'identifiant de la valeur de l'option est requis",
            'options.*.option_value_id.integer' => "L'identifiant de la valeur de l'option doit être un nombre entier",

            'action.required' => "L'action est requise",
            'action.in' => "L'action doit être 'increase' ou 'decrease'",
        ];
    }
}
