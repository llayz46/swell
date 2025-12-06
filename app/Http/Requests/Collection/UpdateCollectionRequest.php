<?php

namespace App\Http\Requests\Collection;

use App\Models\Collection;
use Illuminate\Validation\Rule;

class UpdateCollectionRequest extends BaseCollectionRequest
{
    public function rules(): array
    {
        return array_merge($this->baseRules(), [
            'slug' => ['required', 'string', 'max:255', Rule::unique(Collection::class)->ignore($this->route('collection')->id)],
        ]);
    }
}