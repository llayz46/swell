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
            'avatar.image' => "Oups ! L'avatar doit être une image (jpg, jpeg, png, webp, svg).",
            'avatar.max' => "Hmm, votre image est un peu trop lourde ! Elle ne doit pas dépasser 5 Mo.",
            'avatar.mimes' => "Désolé, seuls les formats jpg, jpeg, png, webp et svg sont acceptés.",
            'name.required' => 'Oups ! N\'oubliez pas de renseigner votre nom.',
            'name.string' => 'Hmm, le nom doit être du texte.',
            'name.max' => 'Désolé, votre nom est un peu trop long (255 caractères maximum).',
            'email.required' => 'Oups ! Veuillez saisir votre adresse email.',
            'email.string' => 'Hmm, l\'email doit être du texte.',
            'email.lowercase' => 'Psst ! Votre email doit être en minuscules.',
            'email.email' => 'Hmm, cette adresse email ne semble pas valide.',
            'email.max' => 'Désolé, l\'email est trop long (255 caractères maximum).',
            'email.unique' => 'Oups ! Cette adresse email est déjà utilisée par un autre compte.',
        ];
    }
}
