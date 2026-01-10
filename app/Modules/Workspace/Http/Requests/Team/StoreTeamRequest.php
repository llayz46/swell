<?php

namespace App\Modules\Workspace\Http\Requests\Team;

use App\Modules\Workspace\Models\Team;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class StoreTeamRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        if (! $this->identifier || empty(trim($this->identifier))) {
            $this->merge([
                'identifier' => strtoupper(Str::slug($this->name)),
            ]);
        } else {
            $this->merge([
                'identifier' => strtoupper(Str::slug($this->identifier)),
            ]);
        }
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'min:2', 'max:255'],
            'identifier' => ['required', 'string', 'max:255', Rule::unique(Team::class)],
            'icon' => ['nullable', 'string', 'max:10'],
            'color' => ['nullable', 'string', 'max:7', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'description' => ['nullable', 'string', 'max:500'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Oups ! Le nom de l\'équipe est obligatoire.',
            'name.string' => 'Hmm, quelque chose ne va pas avec le nom de l\'équipe.',
            'name.min' => 'Le nom de l\'équipe doit contenir au moins 2 caractères.',
            'name.max' => 'Le nom de l\'équipe ne peut pas dépasser 255 caractères.',

            'identifier.required' => 'L\'identifiant de l\'équipe est obligatoire.',
            'identifier.string' => 'Hmm, quelque chose ne va pas avec l\'identifiant.',
            'identifier.max' => 'L\'identifiant ne peut pas dépasser 255 caractères.',
            'identifier.unique' => 'Cet identifiant est déjà utilisé par une autre équipe.',

            'icon.string' => 'Hmm, quelque chose ne va pas avec l\'icône.',
            'icon.max' => 'L\'icône ne peut pas dépasser 10 caractères.',

            'color.string' => 'Hmm, quelque chose ne va pas avec la couleur.',
            'color.max' => 'Le code couleur ne peut pas dépasser 7 caractères.',
            'color.regex' => 'Le code couleur doit être au format hexadécimal (ex: #FF5733).',

            'description.string' => 'Hmm, quelque chose ne va pas avec la description.',
            'description.max' => 'La description est un peu trop longue. Essayez de la raccourcir (500 caractères max).',
        ];
    }
}
