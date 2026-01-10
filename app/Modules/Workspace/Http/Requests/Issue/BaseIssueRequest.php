<?php

namespace App\Modules\Workspace\Http\Requests\Issue;

use App\Models\User;
use App\Modules\Workspace\Models\Team;
use Closure;
use Illuminate\Foundation\Http\FormRequest;

abstract class BaseIssueRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function messages(): array
    {
        return [
            'title.required' => 'Oups ! N\'oubliez pas de donner un titre à votre issue.',
            'title.string' => 'Hmm, quelque chose ne va pas avec le titre. Assurez-vous qu\'il s\'agit bien d\'un texte.',
            'title.min' => 'Le titre est un peu trop court. Il doit comporter au moins 3 caractères.',
            'title.max' => 'Oups ! Le titre est un peu trop long. Essayez de le raccourcir (255 caractères max).',

            'description.string' => 'Hmm, quelque chose ne va pas avec la description. Assurez-vous qu\'il s\'agit bien d\'un texte.',
            'description.min' => 'La description est un peu courte. Elle doit comporter au moins 5 caractères.',
            'description.max' => 'La description est un peu trop longue. Essayez de la raccourcir (1000 caractères max).',

            'status_id.required' => 'Oups ! Veuillez sélectionner un statut.',
            'status_id.integer' => 'Hmm, quelque chose ne va pas avec le statut sélectionné.',
            'status_id.exists' => 'Désolé, ce statut est introuvable. Veuillez en choisir un autre.',

            'priority_id.required' => 'Oups ! Veuillez sélectionner une priorité.',
            'priority_id.integer' => 'Hmm, quelque chose ne va pas avec la priorité sélectionnée.',
            'priority_id.exists' => 'Désolé, cette priorité est introuvable. Veuillez en choisir une autre.',

            'assignee_id.integer' => 'Hmm, quelque chose ne va pas avec l\'utilisateur sélectionné.',
            'assignee_id.exists' => 'Désolé, cet utilisateur est introuvable. Veuillez en choisir un autre.',

            'team_id.required' => 'Oups ! N\'oubliez pas de sélectionner une équipe.',
            'team_id.integer' => 'Hmm, quelque chose ne va pas avec l\'équipe sélectionnée.',
            'team_id.exists' => 'Désolé, cette équipe est introuvable. Veuillez en choisir une autre.',

            'label_ids.array' => 'Hmm, quelque chose ne va pas avec les labels sélectionnés.',
            'label_ids.*.exists' => 'Désolé, un des labels sélectionnés est introuvable.',

            'label_id.required' => 'Oups ! Veuillez sélectionner une étiquette.',
            'label_id.integer' => 'Hmm, quelque chose ne va pas avec l\'étiquette sélectionnée.',
            'label_id.exists' => 'Désolé, cette étiquette est introuvable. Veuillez en choisir une autre.',

            'due_date.date' => 'Hmm, la date d\'échéance ne semble pas valide. Vérifiez le format.',
            'due_date.after_or_equal' => 'La date d\'échéance doit être aujourd\'hui ou dans le futur.',
        ];
    }

    protected function baseRules(): array
    {
        return [
            'title' => ['required', 'string', 'min:3', 'max:255'],
            'description' => ['nullable', 'string', 'min:5', 'max:1000'],
            'status_id' => ['required', 'integer', 'exists:issue_statuses,id'],
            'priority_id' => ['required', 'integer', 'exists:issue_priorities,id'],
            'assignee_id' => [
                'nullable',
                'integer',
                'exists:users,id',
                function (string $attribute, mixed $value, Closure $fail) {
                    if ($value && $this->team_id) {
                        $team = Team::find($this->team_id);
                        $user = User::find($value);

                        if ($team && $user && ! $team->isMember($user)) {
                            $fail('Désolé, cet utilisateur n\'est pas membre de l\'équipe sélectionnée.');
                        }
                    }
                },
            ],
            'team_id' => ['required', 'integer', 'exists:teams,id'],
            'label_ids' => ['nullable', 'array'],
            'label_ids.*' => ['exists:issue_labels,id'],
            'due_date' => ['nullable', 'date', 'after_or_equal:today'],
        ];
    }
}
