<?php

namespace App\Modules\Workspace\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TeamInvitation extends Model
{
    use HasFactory;

    protected static function newFactory()
    {
        return \App\Modules\Workspace\database\factories\TeamInvitationFactory::new();
    }

    protected $fillable = [
        'team_id',
        'user_id',
        'invited_by',
        'role',
        'message',
        'status',
        'expires_at',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
    ];

    /**
     * Relations
     */
    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function inviter(): BelongsTo
    {
        return $this->belongsTo(User::class, 'invited_by');
    }

    /**
     * Scopes
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeNotExpired($query)
    {
        return $query->where(function ($q) {
            $q->whereNull('expires_at')
                ->orWhere('expires_at', '>', now());
        });
    }

    public function scopeForUser($query, User $user)
    {
        return $query->where('user_id', $user->id);
    }

    public function scopeForTeam($query, Team $team)
    {
        return $query->where('team_id', $team->id);
    }

    /**
     * Helper methods
     */
    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    public function isExpired(): bool
    {
        return $this->expires_at && $this->expires_at->isPast();
    }

    public function accept(): void
    {
        if ($this->isExpired()) {
            throw new \Exception('Cette invitation a expiré');
        }

        if (! $this->isPending()) {
            throw new \Exception('Cette invitation a déjà été traitée');
        }

        $this->team->addMember($this->user, $this->role);
        $this->update(['status' => 'accepted']);
    }

    public function decline(): void
    {
        if (! $this->isPending()) {
            throw new \Exception('Cette invitation a déjà été traitée');
        }

        $this->update(['status' => 'declined']);
    }
}
