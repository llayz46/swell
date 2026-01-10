<?php

namespace App\Modules\Workspace\Http\Requests\Issue;

class UpdateIssueDueDateRequest extends BaseIssueRequest
{
    public function rules(): array
    {
        return [
            'due_date' => ['nullable', 'date', 'after_or_equal:today', 'date_format:Y-m-d'],
        ];
    }
}
