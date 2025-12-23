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
            'title.required' => 'Oups ! N\'oubliez pas de donner un nom à la collection.',
            'title.string' => 'Hmm, le nom doit être du texte.',
            'title.max' => 'Désolé, le nom est trop long (255 caractères maximum).',

            'slug.required' => 'Oups ! Le slug est requis.',
            'slug.string' => 'Hmm, le slug doit être du texte.',
            'slug.max' => 'Désolé, le slug est trop long (255 caractères maximum).',
            'slug.unique' => 'Oups ! Ce slug est déjà utilisé par une autre collection.',

            'description.string' => 'Hmm, la description doit être du texte.',
            'description.max' => 'Désolé, la description est trop longue (1000 caractères maximum).',

            'is_active.boolean' => 'Hmm, le statut actif doit être vrai ou faux.',
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