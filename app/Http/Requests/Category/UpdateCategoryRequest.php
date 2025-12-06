<?php

namespace App\Http\Requests\Category;

use App\Models\Category;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class UpdateCategoryRequest extends FormRequest
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

    public function rules(): array
    {
        $categoryId = $this->route('category')->id;

        return [
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', Rule::unique(Category::class)->ignore($categoryId)],
            'description' => ['nullable', 'string', 'max:1000'],
            'parent_id' => [
                'nullable',
                'exists:categories,id',
                // Empêcher qu'une catégorie soit son propre parent
                Rule::notIn([$categoryId]),
            ],
            'image_url' => ['nullable', 'image', 'max:2048', 'mimes:jpg,jpeg,png,svg,gif,webp'],
            'is_active' => ['boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Le nom de la catégorie est obligatoire.',
            'name.string' => 'Le nom de la catégorie doit être une chaîne de caractères.',
            'name.max' => 'Le nom de la catégorie ne peut pas dépasser 255 caractères.',

            'slug.required' => 'Le slug de la catégorie est obligatoire.',
            'slug.string' => 'Le slug de la catégorie doit être une chaîne de caractères.',
            'slug.max' => 'Le slug de la catégorie ne peut pas dépasser 255 caractères.',
            'slug.unique' => 'Ce slug est déjà utilisé par une autre catégorie.',

            'description.string' => 'La description doit être une chaîne de caractères.',
            'description.max' => 'La description ne peut pas dépasser 1000 caractères.',

            'parent_id.exists' => 'La catégorie parente sélectionnée n\'existe pas.',
            'parent_id.not_in' => 'Une catégorie ne peut pas être son propre parent.',

            'image_url.image' => 'L\'image doit être un fichier image valide.',
            'image_url.max' => 'L\'image ne peut pas dépasser 2 Mo.',
            'image_url.mimes' => 'L\'image doit être au format jpg, jpeg, png, svg, gif ou webp.',

            'is_active.boolean' => 'Le statut actif doit être vrai ou faux.',
        ];
    }
}