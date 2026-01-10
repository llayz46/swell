<?php

namespace App\Modules\Workspace\Http\Requests\Issue;

class StoreIssueRequest extends BaseIssueRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return $this->baseRules();
    }
}
