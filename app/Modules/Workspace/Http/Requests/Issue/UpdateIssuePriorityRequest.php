<?php

namespace App\Modules\Workspace\Http\Requests\Issue;

use Illuminate\Foundation\Http\FormRequest;

class UpdateIssuePriorityRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'priority_id' => ['required', 'integer', 'exists:issue_priorities,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'priority_id.required' => 'Oups ! Veuillez sélectionner une priorité.',
            'priority_id.integer' => 'Hmm, quelque chose ne va pas avec la priorité sélectionnée.',
            'priority_id.exists' => 'Désolé, cette priorité est introuvable. Veuillez en choisir une autre.',
        ];
    }
}