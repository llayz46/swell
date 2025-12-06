<?php

namespace App\Http\Requests\Collection;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;

abstract class BaseCollectionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'slug' => Str::slug($this->title),
        ]);
    }

    public function messages(): array
    {
        return [
            'title.required' => 'Le nom de la collection est obligatoire.',
            'title.string' => 'Le nom de la collection doit être une chaîne de caractères.',
            'title.max' => 'Le nom de la collection ne peut pas dépasser 255 caractères.',

            'slug.required' => 'Le slug de la collection est obligatoire.',
            'slug.string' => 'Le slug de la collection doit être une chaîne de caractères.',
            'slug.max' => 'Le slug de la collection ne peut pas dépasser 255 caractères.',
            'slug.unique' => 'Ce slug est déjà utilisé par une autre collection.',

            'description.string' => 'La description doit être une chaîne de caractères.',
            'description.max' => 'La description ne peut pas dépasser 1000 caractères.',

            'is_active.boolean' => 'Le statut actif doit être vrai ou faux.',
        ];
    }

    protected function baseRules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'is_active' => ['boolean'],
        ];
    }
}