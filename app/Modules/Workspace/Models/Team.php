<?php

namespace App\Modules\Workspace\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Team extends Model
{
    /** @use HasFactory<\Database\Factories\TeamFactory> */
    use HasFactory;
    
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
            ->wherePivot('role', 'lead')
            ->withPivot('role', 'joined_at');
    }

    public function issues(): HasMany
    {
        return $this->hasMany(Issue::class);
    }

    public function addMember(User $user, string $role = 'member'): void
    {
        $this->members()->attach($user->id, [
            'role' => $role,
            'joined_at' => now(),
        ]);
    }

    public function removeMember(User $user): void
    {
        $this->members()->detach($user->id);
    }

    public function isLead(User $user): bool
    {
        return $this->members()
            ->wherePivot('user_id', $user->id)
            ->wherePivot('role', 'lead')
            ->exists();
    }

    public function isMember(User $user): bool
    {
        return $this->members()
            ->wherePivot('user_id', $user->id)
            ->exists();
    }
}
