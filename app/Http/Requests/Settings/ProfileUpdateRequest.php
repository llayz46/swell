<?php

namespace App\Http\Requests\Settings;

use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProfileUpdateRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'avatar' => ['nullable', 'image', 'max:5048', 'mimes:jpg,jpeg,png,webp,svg'],

            'name' => ['required', 'string', 'max:255'],

            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                Rule::unique(User::class)->ignore($this->user()->id),
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'avatar.image' => "L'avatar doit être un fichier image.",
            'avatar.max' => "L'avatar ne doit pas dépasser 5 Mo.",
            'avatar.mimes' => "L'avatar doit être un fichier de type : jpg, jpeg, png, webp, svg.",
            'name.required' => 'Le champ nom est obligatoire.',
            'name.string' => 'Le nom doit être une chaîne de caractères.',
            'name.max' => 'Le nom ne doit pas dépasser 255 caractères.',
            'email.required' => "Le champ e-mail est obligatoire.",
            'email.string' => "L'e-mail doit être une chaîne de caractères.",
            'email.lowercase' => "L'e-mail doit être en minuscules.",
            'email.email' => "L'e-mail doit être une adresse e-mail valide.",
            'email.max' => "L'e-mail ne doit pas dépasser 255 caractères.",
            'email.unique' => 'Cette adresse e-mail est déjà utilisée.',
        ];
    }
}
