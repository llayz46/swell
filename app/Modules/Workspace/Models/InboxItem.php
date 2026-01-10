<?php

namespace App\Modules\Workspace\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InboxItem extends Model
{
    use HasFactory;

    protected static function newFactory()
    {
        return \App\Modules\Workspace\database\factories\InboxItemFactory::new();
    }

    protected $fillable = [
        'user_id',
        'issue_id',
        'type',
        'content',
        'actor_id',
        'read',
        'read_at',
        'snoozed_until',
    ];

    protected $casts = [
        'read' => 'boolean',
        'read_at' => 'datetime',
        'snoozed_until' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function issue(): BelongsTo
    {
        return $this->belongsTo(Issue::class);
    }

    public function actor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'actor_id');
    }

    public function markAsRead(): void
    {
        $this->update([
            'read' => true,
            'read_at' => now(),
        ]);
    }

    public function markAsUnread(): void
    {
        $this->update([
            'read' => false,
            'read_at' => null,
        ]);
    }

    public function snooze(\DateTimeInterface $until): void
    {
        $this->update([
            'snoozed_until' => $until,
        ]);
    }

    public function unsnooze(): void
    {
        $this->update([
            'snoozed_until' => null,
        ]);
    }

    public function isSnoozed(): bool
    {
        return $this->snoozed_until !== null && $this->snoozed_until->isFuture();
    }

    public function scopeForUser($query, int $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeUnread($query)
    {
        return $query->where('read', false);
    }

    public function scopeNotSnoozed($query)
    {
        return $query->where(function ($q) {
            $q->whereNull('snoozed_until')
                ->orWhere('snoozed_until', '<=', now());
        });
    }

    public function scopeWithFullRelations($query)
    {
        return $query->with([
            'issue.status',
            'issue.priority',
            'issue.assignee',
            'issue.creator',
            'issue.team',
            'issue.labels',
            'actor',
        ]);
    }
}
