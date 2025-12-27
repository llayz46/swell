<?php

namespace App\Modules\Workspace\Http\Requests\Team;

use App\Models\User;
use App\Modules\Workspace\Enums\WorkspaceRole;
use Closure;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class InviteTeamMemberRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function prepareForValidation(): void
    {
        if (! $this->has('role')) {
            $this->merge([
                'role' => WorkspaceRole::TeamMember->value,
            ]);
        }
    }

    public function rules(): array
    {
        return [
            'user_id' => [
                'required',
                'integer',
                'exists:users,id',
                function (string $attribute, mixed $value, Closure $fail) {
                    $team = $this->route('team');

                    $user = User::find($value);

                    if ($team->isMember($user)) {
                        $fail('Cet utilisateur est déjà membre de cette équipe.');

                        return;
                    }

                    $existingInvitation = $team->invitations()
                        ->where('user_id', $value)
                        ->pending()
                        ->notExpired()
                        ->exists();

                    if ($existingInvitation) {
                        $fail('Une invitation est déjà en attente pour cet utilisateur.');
                    }
                },
            ],
            'role' => [
                'required',
                'string',
                Rule::in(WorkspaceRole::values()),
            ],
            'message' => [
                'nullable',
                'string',
                'max:500',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'user_id.required' => 'Oups ! Veuillez sélectionner un utilisateur à inviter.',
            'user_id.integer' => 'Hmm, quelque chose ne va pas avec l\'utilisateur sélectionné.',
            'user_id.exists' => 'Désolé, cet utilisateur est introuvable.',

            'role.required' => 'Oups ! Veuillez sélectionner un rôle pour ce membre.',
            'role.string' => 'Hmm, quelque chose ne va pas avec le rôle sélectionné.',
            'role.in' => 'Le rôle sélectionné n\'est pas valide.',

            'message.string' => 'Hmm, quelque chose ne va pas avec le message.',
            'message.max' => 'Le message est un peu trop long. Essayez de le raccourcir (500 caractères max).',
        ];
    }
}
