<?php

namespace App\Modules\Review\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ReviewRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'comment' => ['nullable', 'string'],
            'rating' => ['required', 'integer', 'between:1,5'],
            'product_id' => ['required', 'exists:products,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'Oups ! N\'oubliez pas de donner un titre à votre avis.',
            'title.string' => 'Hmm, le titre doit être du texte.',
            'title.max' => 'Désolé, le titre est trop long (255 caractères maximum).',

            'comment.string' => 'Hmm, le commentaire doit être du texte.',

            'rating.required' => 'Oups ! Veuillez donner une note au produit.',
            'rating.integer' => 'Hmm, la note doit être un nombre entier.',
            'rating.between' => 'La note doit être entre 1 et 5 étoiles.',

            'product_id.required' => 'Oups ! L\'identifiant du produit est requis.',
            'product_id.exists' => 'Désolé, ce produit est introuvable.',
        ];
    }
}
