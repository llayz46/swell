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
            'assignee_id' => ['required', 'integer', 'exists:users,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'assignee_id.required' => 'L\'assigné est requis.',
            'assignee_id.integer' => 'L\'assigné doit être un entier.',
            'assignee_id.exists' => 'L\'assigné spécifié n\'existe pas.',
        ];
    }
}