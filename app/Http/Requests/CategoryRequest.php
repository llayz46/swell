<?php

namespace App\Http\Requests;

use App\Enums\CategoryStatus;
use App\Models\Category;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class CategoryRequest extends FormRequest
{
    protected function prepareForValidation()
    {
        $this->merge([
            'slug' => Str::slug($this->name),
        ]);
    }

    public function rules(): array
    {
        $categoryId = $this->route('category')?->id;

        return [
            'name' => ['required', 'min:3', 'max:255', 'string'],

            'slug' => ['required', 'min:3', 'max:255', 'string', Rule::unique(Category::class)->ignore($categoryId)],

            'description' => ['nullable', 'string', 'min:10', 'max:500'],

            'parent_id' => ['nullable', 'exists:categories,id'],

            'status' => ['required', Rule::enum(CategoryStatus::class)],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Le nom est obligatoire.',
            'name.min' => 'Le nom doit contenir au moins 3 caractères.',
            'name.max' => 'Le nom ne peut pas dépasser 255 caractères.',
            'name.string' => 'Le nom doit être une chaîne de caractères.',

            'slug.required' => 'Le slug est obligatoire.',
            'slug.min' => 'Le slug doit contenir au moins 3 caractères.',
            'slug.max' => 'Le slug ne peut pas dépasser 255 caractères.',
            'slug.unique' => 'Ce slug est déjà utilisé.',
            'slug.string' => 'Le slug doit être une chaîne de caractères.',

            'description.string' => 'La description doit être une chaîne de caractères.',
            'description.min' => 'La description doit contenir au moins 10 caractères.',
            'description.max' => 'La description ne peut pas dépasser 500 caractères.',

            'status.required' => 'Le statut est obligatoire.',
            'status.enum' => 'Le statut sélectionné est invalide.',
        ];
    }
}
