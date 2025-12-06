<?php

namespace App\Http\Requests\Brand;

class DeleteBrandRequest extends BaseBrandRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $brand = $this->route('brand');

        return [
            'name' => ['required', 'in:' . $brand->name],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Le nom de la marque est requis.',
            'name.in' => 'Le nom saisi ne correspond pas au nom de la marque à supprimer.',
        ];
    }
}
