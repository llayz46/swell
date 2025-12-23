<?php

namespace App\Http\Requests\Brand;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;

abstract class BaseBrandRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'slug' => Str::slug($this->name),
        ]);
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Oups ! N\'oubliez pas de donner un nom à la marque.',
            'name.string' => 'Hmm, le nom doit être du texte.',
            'name.max' => 'Désolé, le nom est trop long (255 caractères maximum).',

            'slug.required' => 'Oups ! Le slug est requis.',
            'slug.string' => 'Hmm, le slug doit être du texte.',
            'slug.max' => 'Désolé, le slug est trop long (255 caractères maximum).',
            'slug.unique' => 'Oups ! Ce slug est déjà utilisé par une autre marque.',

            'logo_url.image' => 'Oups ! Le fichier doit être une image.',
            'logo_url.max' => 'Hmm, le logo est trop lourd ! Il ne doit pas dépasser 2 Mo.',
            'logo_url.mimes' => 'Désolé, seuls les formats jpg, jpeg, png, svg, gif et webp sont acceptés.',
        ];
    }

    protected function baseRules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'logo_url' => ['nullable', 'image', 'max:2048', 'mimes:jpg,jpeg,png,svg,gif,webp'],
        ];
    }
}
