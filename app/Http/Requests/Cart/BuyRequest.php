<?php

namespace App\Http\Requests\Cart;

class BuyRequest extends BaseCartRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'products' => 'required|array|min:1',
            'products.*.id' => 'required|exists:products,id',
            'products.*.quantity' => 'required|integer|min:1',
            'products.*.options' => 'array|nullable',
            'products.*.options.*.option_id' => 'required_with:products.*.options|integer',
            'products.*.options.*.option_value_id' => 'required_with:products.*.options|integer',
        ];
    }

    /**
     * Custom messages for validation.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return array_merge(parent::messages(), [
            'products.required' => 'Oups ! Veuillez sélectionner au moins un produit.',
            'products.array' => 'Hmm, les produits doivent être un tableau.',
            'products.min' => 'Oups ! Vous devez sélectionner au moins un produit.',

            'products.*.id.required' => 'Oups ! L\'identifiant du produit est requis.',
            'products.*.id.exists' => 'Désolé, ce produit est introuvable.',

            'products.*.quantity.required' => 'Oups ! La quantité est requise.',
            'products.*.quantity.integer' => 'Hmm, la quantité doit être un nombre entier.',
            'products.*.quantity.min' => 'La quantité doit être d\'au moins 1.',

            'products.*.options.array' => 'Hmm, les options doivent être un tableau.',
        ]);
    }

    /**
     * Get the validated products data.
     *
     * @return array
     */
    public function getProducts(): array
    {
        return $this->validated('products');
    }
}
