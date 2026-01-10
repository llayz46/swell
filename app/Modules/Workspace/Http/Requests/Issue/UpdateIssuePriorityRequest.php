<?php

namespace App\Modules\Workspace\Http\Requests\Issue;

class UpdateIssuePriorityRequest extends BaseIssueRequest
{
    public function rules(): array
    {
        return [
            'priority_id' => ['required', 'integer', 'exists:issue_priorities,id'],
        ];
    }
}
