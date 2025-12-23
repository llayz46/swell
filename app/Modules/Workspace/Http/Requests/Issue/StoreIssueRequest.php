<?php

namespace App\Modules\Workspace\Http\Requests\Issue;

use Illuminate\Foundation\Http\FormRequest;

class StoreIssueRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => 'required|string|min:3|max:255',
            'description' => 'nullable|string|min:5|max:1000',
            'status_id' => 'required|exists:issue_statuses,id',
            'priority_id' => 'required|exists:issue_priorities,id',
            'assignee_id' => 'nullable|exists:users,id',
            'label_ids' => 'nullable|array',
            'label_ids.*' => 'exists:issue_labels,id',
            'team_id' => 'required|exists:teams,id',
            'due_date' => 'nullable|date|after_or_equal:today',
        ];
    }
}