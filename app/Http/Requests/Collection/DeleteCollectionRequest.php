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
            'name.required' => 'Oups ! Veuillez saisir le nom de la collection pour confirmer.',
            'name.in' => 'Hmm, le nom saisi ne correspond pas. Veuillez réessayer.',
        ];
    }
}