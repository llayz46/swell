<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProductCommentRequest extends FormRequest
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
            'title.required' => 'Le titre est obligatoire.',
            'title.string' => 'Le titre doit être une chaîne de caractères.',
            'title.max' => 'Le titre ne doit pas dépasser 255 caractères.',

            'comment.string' => 'Le commentaire doit être une chaîne de caractères.',

            'rating.required' => 'La note est obligatoire.',
            'rating.integer' => 'La note doit être un entier.',
            'rating.between' => 'La note doit être comprise entre 1 et 5.',

            'product_id.required' => 'L\'ID du produit est obligatoire.',
            'product_id.exists' => 'Le produit sélectionné n\'existe pas.',
        ];
    }
}
