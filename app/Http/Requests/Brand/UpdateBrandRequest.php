<?php

namespace App\Http\Requests\Brand;

use Illuminate\Foundation\Http\FormRequest;

class UpdateBrandRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return false;
    }
    
    protected function prepareForValidation(): void
    {
        $this->merge([
            'slug' => Str::slug($this->name),
        ]);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', Rule::unique(Brand::class)->ignore($this->route('brand')->id)],
            'logo_url' => ['nullable', 'image', 'max:2048', 'mimes:jpg,jpeg,png,svg,gif,webp'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Le nom de la marque est obligatoire.',
            'name.string' => 'Le nom de la marque doit être une chaîne de caractères.',
            'name.max' => 'Le nom de la marque ne peut pas dépasser 255 caractères.',

            'slug.required' => 'Le slug de la marque est obligatoire.',
            'slug.string' => 'Le slug de la marque doit être une chaîne de caractères.',
            'slug.max' => 'Le slug de la marque ne peut pas dépasser 255 caractères.',
            'slug.unique' => 'Ce slug est déjà utilisé par une autre marque.',

            'logo_url.image' => 'Le logo doit être une image.',
            'logo_url.max' => 'Le logo ne peut pas dépasser 2 Mo.',
            'logo_url.mimes' => 'Le logo doit être au format jpg, jpeg, png, svg, gif ou webp.',
        ];
    }

}
