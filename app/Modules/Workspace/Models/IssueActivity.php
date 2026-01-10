<?php

namespace App\Modules\Workspace\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class IssueActivity extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected static function newFactory()
    {
        return \App\Modules\Workspace\database\factories\IssueActivityFactory::new();
    }

    public const TYPE_STATUS_CHANGED = 'status_changed';

    public const TYPE_PRIORITY_CHANGED = 'priority_changed';

    public const TYPE_ASSIGNEE_CHANGED = 'assignee_changed';

    public const TYPE_LABELS_CHANGED = 'labels_changed';

    public const TYPE_DUE_DATE_CHANGED = 'due_date_changed';

    public const TYPE_TITLE_CHANGED = 'title_changed';

    public const TYPE_DESCRIPTION_CHANGED = 'description_changed';

    public const TYPE_CREATED = 'created';

    protected $fillable = [
        'issue_id',
        'user_id',
        'type',
        'old_value',
        'new_value',
        'created_at',
    ];

    protected $casts = [
        'old_value' => 'array',
        'new_value' => 'array',
        'created_at' => 'datetime',
    ];

    public function issue(): BelongsTo
    {
        return $this->belongsTo(Issue::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function scopeWithFullRelations(Builder $query): Builder
    {
        return $query->with(['user']);
    }

    public static function getActivityTypes(): array
    {
        return [
            self::TYPE_STATUS_CHANGED,
            self::TYPE_PRIORITY_CHANGED,
            self::TYPE_ASSIGNEE_CHANGED,
            self::TYPE_LABELS_CHANGED,
            self::TYPE_DUE_DATE_CHANGED,
            self::TYPE_TITLE_CHANGED,
            self::TYPE_DESCRIPTION_CHANGED,
            self::TYPE_CREATED,
        ];
    }
}
