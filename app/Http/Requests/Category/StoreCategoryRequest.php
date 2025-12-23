<?php

namespace App\Http\Requests\Category;

use App\Models\Category;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class StoreCategoryRequest extends FormRequest
{
    protected function prepareForValidation(): void
    {
        $this->merge([
            'slug' => Str::slug($this->name),
        ]);
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', Rule::unique(Category::class)],
            'description' => ['nullable', 'string', 'max:1000'],
            'parent_id' => ['nullable', 'exists:categories,id'],
            'image_url' => ['nullable', 'image', 'max:2048', 'mimes:jpg,jpeg,png,svg,gif,webp'],
            'status' => ['boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Oups ! N\'oubliez pas de donner un nom à la catégorie.',
            'name.string' => 'Hmm, le nom doit être du texte.',
            'name.max' => 'Désolé, le nom est trop long (255 caractères maximum).',

            'slug.required' => 'Oups ! Le slug est requis.',
            'slug.string' => 'Hmm, le slug doit être du texte.',
            'slug.max' => 'Désolé, le slug est trop long (255 caractères maximum).',
            'slug.unique' => 'Oups ! Ce slug est déjà utilisé par une autre catégorie.',

            'description.string' => 'Hmm, la description doit être du texte.',
            'description.max' => 'Désolé, la description est trop longue (1000 caractères maximum).',

            'parent_id.exists' => 'Désolé, la catégorie parente sélectionnée est introuvable.',

            'image_url.image' => 'Oups ! Le fichier doit être une image.',
            'image_url.max' => 'Hmm, l\'image est trop lourde ! Elle ne doit pas dépasser 2 Mo.',
            'image_url.mimes' => 'Désolé, seuls les formats jpg, jpeg, png, svg, gif et webp sont acceptés.',

            'status.boolean' => 'Hmm, le statut doit être vrai ou faux.',
        ];
    }
}