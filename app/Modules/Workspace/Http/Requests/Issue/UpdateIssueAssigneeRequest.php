<?php

namespace App\Modules\Workspace\Http\Requests\Issue;

class UpdateIssueAssigneeRequest extends BaseIssueRequest
{
    public function rules(): array
    {
        return [
            'assignee_id' => ['nullable', 'integer', 'exists:users,id'],
        ];
    }
}
