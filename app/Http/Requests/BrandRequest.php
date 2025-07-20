<?php

namespace App\Http\Requests;

use App\Models\Brand;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class BrandRequest extends FormRequest
{
    protected function prepareForValidation()
    {
        $this->merge([
            'slug' => Str::slug($this->name),
        ]);
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],

            'slug' => ['required', 'string', 'max:255', Rule::unique(Brand::class)->ignore($this->route('brand')?->id)],

            'logo_url' => ['nullable', 'max:2048', 'mimes:jpg,jpeg,png,svg,gif,webp'],
        ];
    }

    public function messages()
    {
        return [
            'name.required' => 'Le nom de la marque est obligatoire.',
            'name.string' => 'Le nom de la marque doit être une chaîne de caractères.',
            'name.max' => 'Le nom de la marque ne peut pas dépasser 255 caractères.',

            'slug.required' => 'Le slug de la marque est obligatoire.',
            'slug.string' => 'Le slug de la marque doit être une chaîne de caractères.',
            'slug.max' => 'Le slug de la marque ne peut pas dépasser 255 caractères.',
            'slug.unique' => 'Ce slug est déjà utilisé par une autre marque.',

            'logo_url.max' => 'Le logo ne peut pas dépasser 2 Mo.',
            'logo_url.mimes' => 'Le logo doit être au format jpg, jpeg, png, svg, gif ou webp.',
        ];
    }
}
