<?php

namespace App\Http\Requests\Brand;

use App\Models\Brand;
use Illuminate\Validation\Rule;

class UpdateBrandRequest extends BaseBrandRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return array_merge($this->baseRules(), [
            'slug' => ['required', 'string', 'max:255', Rule::unique(Brand::class)->ignore($this->route('brand')->id)],
        ]);
    }
}
