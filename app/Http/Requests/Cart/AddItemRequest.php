<?php

namespace App\Http\Requests\Cart;

class AddItemRequest extends BaseCartRequest
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
            'quantity' => 'integer|min:1',
            'options' => 'array|nullable',
            'options.*.option_id' => 'required_with:options|integer',
            'options.*.option_value_id' => 'required_with:options|integer',
        ];
    }
}
