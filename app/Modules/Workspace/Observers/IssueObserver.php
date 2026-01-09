<?php

namespace App\Modules\Workspace\Observers;

use App\Models\User;
use App\Modules\Workspace\Models\Issue;
use App\Modules\Workspace\Models\IssueActivity;
use App\Modules\Workspace\Models\IssueSubscription;
use Illuminate\Support\Facades\Auth;

class IssueObserver
{
    /**
     * Fields to track for activity logging.
     */
    protected array $trackedFields = [
        'status_id' => IssueActivity::TYPE_STATUS_CHANGED,
        'priority_id' => IssueActivity::TYPE_PRIORITY_CHANGED,
        'assignee_id' => IssueActivity::TYPE_ASSIGNEE_CHANGED,
        'due_date' => IssueActivity::TYPE_DUE_DATE_CHANGED,
        'title' => IssueActivity::TYPE_TITLE_CHANGED,
        'description' => IssueActivity::TYPE_DESCRIPTION_CHANGED,
    ];

    public function created(Issue $issue): void
    {
        $user = Auth::user();
        if (! $user) {
            return;
        }

        IssueActivity::create([
            'issue_id' => $issue->id,
            'user_id' => $user->id,
            'type' => IssueActivity::TYPE_CREATED,
            'old_value' => null,
            'new_value' => [
                'title' => $issue->title,
                'identifier' => $issue->identifier,
            ],
            'created_at' => now(),
        ]);

        $this->subscribeUser($issue, $user);

        if ($issue->assignee_id && $issue->assignee_id !== $user->id) {
            $this->subscribeUser($issue, $issue->assignee);
        }
    }

    public function updating(Issue $issue): void
    {
        $user = Auth::user();
        if (! $user) {
            return;
        }

        foreach ($this->trackedFields as $field => $activityType) {
            if ($issue->isDirty($field)) {
                $this->createActivity($issue, $user, $activityType, $field);
            }
        }

        if ($issue->isDirty('assignee_id') && $issue->assignee_id) {
            $assignee = User::find($issue->assignee_id);
            if ($assignee) {
                $this->subscribeUser($issue, $assignee);
            }
        }
    }

    protected function createActivity(Issue $issue, User $user, string $type, string $field): void
    {
        $oldValue = $this->formatValue($issue->getOriginal($field), $field, $issue);
        $newValue = $this->formatValue($issue->getAttribute($field), $field, $issue);

        IssueActivity::create([
            'issue_id' => $issue->id,
            'user_id' => $user->id,
            'type' => $type,
            'old_value' => $oldValue,
            'new_value' => $newValue,
            'created_at' => now(),
        ]);
    }

    protected function formatValue(mixed $value, string $field, Issue $issue): ?array
    {
        if ($value === null) {
            return null;
        }

        return match ($field) {
            'status_id' => $this->formatRelation($value, 'status', $issue),
            'priority_id' => $this->formatRelation($value, 'priority', $issue),
            'assignee_id' => $this->formatUser($value),
            'due_date' => ['date' => $value instanceof \DateTimeInterface ? $value->format('Y-m-d') : $value],
            default => ['value' => $value],
        };
    }

    protected function formatRelation(int $id, string $relation, Issue $issue): array
    {
        $modelClass = match ($relation) {
            'status' => \App\Modules\Workspace\Models\IssueStatus::class,
            'priority' => \App\Modules\Workspace\Models\IssuePriority::class,
            default => null,
        };

        if ($modelClass) {
            $model = $modelClass::find($id);
            if ($model) {
                return [
                    'id' => $model->id,
                    'name' => $model->name,
                    'slug' => $model->slug,
                ];
            }
        }

        return ['id' => $id];
    }

    protected function formatUser(int $userId): array
    {
        $user = User::find($userId);
        if ($user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ];
        }

        return ['id' => $userId];
    }

    protected function subscribeUser(Issue $issue, User $user): void
    {
        IssueSubscription::firstOrCreate([
            'issue_id' => $issue->id,
            'user_id' => $user->id,
        ], [
            'created_at' => now(),
        ]);
    }
}
