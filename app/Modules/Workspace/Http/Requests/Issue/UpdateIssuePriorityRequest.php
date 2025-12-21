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
            'priority_id.required' => 'La priorité est requise.',
            'priority_id.integer' => 'La priorité doit être un entier.',
            'priority_id.exists' => 'La priorité spécifiée n\'existe pas.',
        ];
    }
}