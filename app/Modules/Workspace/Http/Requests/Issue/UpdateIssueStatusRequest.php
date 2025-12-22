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
            'status_id.required' => 'Le statut est requis.',
            'status_id.integer' => 'Le statut doit être un entier.',
            'status_id.exists' => 'Le statut spécifié n\'existe pas.',
        ];
    }
}