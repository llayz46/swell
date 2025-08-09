<?php

namespace App\Http\Requests;

use App\Models\Brand;
use App\Models\Collection;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class CollectionRequest extends FormRequest
{
    protected function prepareForValidation()
    {
        $this->merge([
            'slug' => Str::slug($this->title),
        ]);
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],

            'slug' => ['required', 'string', 'max:255', Rule::unique(Collection::class)->ignore($this->route('collection')?->id)],
        ];
    }

    public function messages()
    {
        return [
            'title.required' => 'Le nom de la collection est obligatoire.',
            'title.string' => 'Le nom de la collection doit être une chaîne de caractères.',
            'title.max' => 'Le nom de la collection ne peut pas dépasser 255 caractères.',

            'slug.required' => 'Le slug de la collection est obligatoire.',
            'slug.string' => 'Le slug de la collection doit être une chaîne de caractères.',
            'slug.max' => 'Le slug de la collection ne peut pas dépasser 255 caractères.',
            'slug.unique' => 'Ce slug est déjà utilisé par une autre collection.',
        ];
    }
}
