<?php

namespace App\Modules\Workspace\Http\Requests\Issue;

class UpdateIssueStatusRequest extends BaseIssueRequest
{
    public function rules(): array
    {
        return [
            'status_id' => ['required', 'integer', 'exists:issue_statuses,id'],
        ];
    }
}
