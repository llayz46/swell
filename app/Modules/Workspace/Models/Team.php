<?php

namespace App\Modules\Workspace\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Team extends Model
{
    use HasFactory;

    protected static function newFactory()
    {
        return \App\Modules\Workspace\database\factories\TeamFactory::new();
    }

    protected $fillable = [
        'identifier',
        'name',
        'icon',
        'color',
        'description',
    ];

    public function members(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'team_user')
            ->withPivot('role', 'joined_at');
    }

    public function leads(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'team_user')
            ->wherePivot('role', 'team-lead')
            ->withPivot('role', 'joined_at');
    }

    public function issues(): HasMany
    {
        return $this->hasMany(Issue::class);
    }

    public function addMember(User $user, string $role = 'team-member'): void
    {
        $this->members()->attach($user->id, [
            'role' => $role,
            'joined_at' => now(),
        ]);
    }

    public function removeMember(User $user): void
    {
        app(\App\Modules\Workspace\Actions\RemoveTeamMember::class)->handle($this, $user);
    }

    public function isLead(User $user): bool
    {
        return $this->members()
            ->where('users.id', $user->id)
            ->wherePivot('role', 'team-lead')
            ->exists();
    }

    public function isMember(User $user): bool
    {
        return $this->members()
            ->where('users.id', $user->id)
            ->exists();
    }

    public function getRoleForUser(User $user): ?string
    {
        return $this->members()
            ->where('users.id', $user->id)
            ->value('team_user.role');
    }

    /**
     * Transférer le rôle de lead d'un utilisateur à un autre
     * Utilisé par un team lead pour transférer son rôle
     */
    public function transferLead(User $fromUser, User $toUser): void
    {
        // Vérifier que fromUser est bien lead
        if (! $this->isLead($fromUser)) {
            throw new \Exception("L'utilisateur source n'est pas lead de cette team");
        }

        // Vérifier que toUser est membre
        if (! $this->isMember($toUser)) {
            throw new \Exception("L'utilisateur cible n'est pas membre de cette team");
        }

        // Rétrograder le lead actuel en membre
        $this->members()->updateExistingPivot($fromUser->id, [
            'role' => 'team-member',
        ]);

        // Promouvoir le nouveau lead
        $this->members()->updateExistingPivot($toUser->id, [
            'role' => 'team-lead',
        ]);
    }

    /**
     * Promouvoir un membre en lead (utilisé par workspace-admin)
     */
    public function promoteMember(User $user): void
    {
        if (! $this->isMember($user)) {
            throw new \Exception("L'utilisateur n'est pas membre de cette team");
        }

        $this->members()->updateExistingPivot($user->id, [
            'role' => 'team-lead',
        ]);
    }

    /**
     * Rétrograder un lead en membre (utilisé par workspace-admin)
     */
    public function demoteLead(User $user): void
    {
        if (! $this->isLead($user)) {
            throw new \Exception("L'utilisateur n'est pas lead de cette team");
        }

        $this->members()->updateExistingPivot($user->id, [
            'role' => 'team-member',
        ]);
    }
}
