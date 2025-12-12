<?php

namespace App\Modules\Workspace\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Issue extends Model
{
    /** @use HasFactory<\Database\Factories\IssueFactory> */
    use HasFactory;
    
    protected $fillable = [
        'identifier',
        'title',
        'description',
        'status_id',
        'priority_id',
        'assignee_id',
        'creator_id',
        'team_id',
        'due_date',
        'rank',
    ];
    
    protected $casts = [
        'due_date' => 'datetime',
    ];
    
    public function status(): BelongsTo
    {
        return $this->belongsTo(IssueStatus::class, 'status_id');
    }

    public function priority(): BelongsTo
    {
        return $this->belongsTo(IssuePriority::class, 'priority_id');
    }

    public function assignee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assignee_id');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'creator_id');
    }

    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class, 'team_id');
    }

    public function labels(): BelongsToMany
    {
        return $this->belongsToMany(IssueLabel::class, 'issue_label');
    }

    public function assignments(): HasMany
    {
        return $this->hasMany(IssueAssignment::class);
    }

    public function inboxItems(): HasMany
    {
        return $this->hasMany(InboxItem::class);
    }
    
    public static function generateIdentifier(): string
    {
        $prefix = config('swell.workspace.identifier_prefix', 'WS');
        $lastIssue = self::latest('id')->first();
        $number = $lastIssue ? $lastIssue->id + 1 : 1;

        return sprintf('%s-%d', $prefix, $number);
    }
}
