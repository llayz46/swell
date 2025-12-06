<?php

namespace App\Http\Requests\Cart;

use Illuminate\Foundation\Http\FormRequest;

class AddItemRequest extends FormRequest
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
            'quantity' => 'integer|min:1',
            'options' => 'array|nullable',
            'options.*.option_id' => 'required_with:options|integer',
            'options.*.option_value_id' => 'required_with:options|integer',
        ];
    }
    
    public function messages(): array
    {
        return [
            'product_id.required' => "Le produit est requis",
            'quantity.integer' => "La quantité doit être un nombre entier",
            'quantity.min' => "La quantité doit être au moins 1",
            'options.array' => "Les options doivent être un tableau",
            'options.*.option_id.required_with' => "L'identifiant de l'option est requis",
            'options.*.option_id.integer' => "L'identifiant de l'option doit être un nombre entier",
            'options.*.option_value_id.required_with' => "L'identifiant de la valeur de l'option est requis",
            'options.*.option_value_id.integer' => "L'identifiant de la valeur de l'option doit être un nombre entier",
        ];
    }
}
