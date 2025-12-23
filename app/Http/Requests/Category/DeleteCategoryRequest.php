<?php

namespace App\Http\Requests\Category;

use Illuminate\Foundation\Http\FormRequest;

class DeleteCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $category = $this->route('category');

        return [
            'name' => ['required', 'in:' . $category->name],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Oups ! Veuillez saisir le nom de la catégorie pour confirmer.',
            'name.in' => 'Hmm, le nom saisi ne correspond pas. Veuillez réessayer.',
        ];
    }
}