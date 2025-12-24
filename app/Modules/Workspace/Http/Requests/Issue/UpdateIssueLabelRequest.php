<?php

namespace App\Modules\Workspace\Http\Requests\Issue;

class UpdateIssueLabelRequest extends BaseIssueRequest
{
    public function rules(): array
    {
        return [
            'label_id' => 'required|exists:issue_labels,id',
        ];
    }
}
