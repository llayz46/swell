<?php

namespace App\Modules\Workspace\Http\Requests\Issue;

use Illuminate\Foundation\Http\FormRequest;

class UpdateIssueAssigneeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'assignee_id' => ['nullable', 'integer', 'exists:users,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'assignee_id.integer' => "Hmm, quelque chose ne va pas avec l'utilisateur sélectionné.",
            'assignee_id.exists' => "Désolé, cet utilisateur est introuvable. Veuillez en choisir un autre.",
        ];
    }
}