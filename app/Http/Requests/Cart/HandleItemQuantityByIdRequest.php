<?php

namespace App\Http\Requests\Cart;

class HandleItemQuantityByIdRequest extends BaseCartRequest
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
}
