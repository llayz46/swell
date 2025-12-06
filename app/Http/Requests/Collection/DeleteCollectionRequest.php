<?php

namespace App\Http\Requests\Collection;

use Illuminate\Foundation\Http\FormRequest;

class DeleteCollectionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $collection = $this->route('collection');

        return [
            'name' => ['required', 'in:' . $collection->title],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Le nom de la collection est requis.',
            'name.in' => 'Le nom saisi ne correspond pas au nom de la collection à supprimer.',
        ];
    }
}