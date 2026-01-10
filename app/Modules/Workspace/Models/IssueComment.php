<?php

namespace App\Modules\Workspace\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class IssueComment extends Model
{
    use HasFactory;

    protected static function newFactory()
    {
        return \App\Modules\Workspace\database\factories\IssueCommentFactory::new();
    }

    protected $fillable = [
        'issue_id',
        'user_id',
        'parent_id',
        'content',
        'edited_at',
    ];

    protected $casts = [
        'edited_at' => 'datetime',
    ];

    public function issue(): BelongsTo
    {
        return $this->belongsTo(Issue::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(IssueComment::class, 'parent_id');
    }

    public function replies(): HasMany
    {
        return $this->hasMany(IssueComment::class, 'parent_id')->orderBy('created_at');
    }

    public function scopeRootComments(Builder $query): Builder
    {
        return $query->whereNull('parent_id');
    }

    public function scopeWithReplies(Builder $query): Builder
    {
        return $query->with(['replies.user', 'replies.replies.user']);
    }

    public function scopeWithFullRelations(Builder $query): Builder
    {
        return $query->with([
            'user',
            'replies' => fn ($q) => $q->with('user')->orderBy('created_at'),
        ]);
    }

    public function isEdited(): bool
    {
        return $this->edited_at !== null;
    }

    public function markAsEdited(): void
    {
        $this->update(['edited_at' => now()]);
    }

    public function isOwnedBy(User $user): bool
    {
        return $this->user_id === $user->id;
    }
}
