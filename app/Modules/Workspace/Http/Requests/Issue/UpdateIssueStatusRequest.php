<?php

namespace App\Modules\Workspace\Http\Requests\Issue;

use Illuminate\Foundation\Http\FormRequest;

class UpdateIssueStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'status_id' => ['required', 'integer', 'exists:issue_statuses,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'status_id.required' => 'Oups ! Veuillez sélectionner un statut.',
            'status_id.integer' => 'Hmm, quelque chose ne va pas avec le statut sélectionné.',
            'status_id.exists' => 'Désolé, ce statut est introuvable. Veuillez en choisir un autre.',
        ];
    }
}