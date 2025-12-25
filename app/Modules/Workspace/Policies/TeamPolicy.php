<?php

namespace App\Modules\Workspace\Policies;

use App\Models\User;
use App\Modules\Workspace\Models\Team;

class TeamPolicy
{
    /**
     * Determine whether the user can view any teams.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('workspace.teams.view');
    }

    /**
     * Determine whether the user can view the team.
     */
    public function view(User $user, Team $team): bool
    {
        if (! $user->hasPermissionTo('workspace.teams.view')) {
            return false;
        }

        return $this->userBelongsToTeam($user, $team);
    }

    /**
     * Determine whether the user can create teams.
     */
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('workspace.teams.create');
    }

    /**
     * Determine whether the user can update the team.
     */
    public function update(User $user, Team $team): bool
    {
        if (! $user->hasPermissionTo('workspace.teams.update')) {
            return false;
        }

        // Only workspace admins or team leads can update
        if ($user->hasPermissionTo('workspace.teams.manage-all')) {
            return true;
        }

        return $team->isLead($user);
    }

    /**
     * Determine whether the user can delete the team.
     */
    public function delete(User $user, Team $team): bool
    {
        if (! $user->hasPermissionTo('workspace.teams.delete')) {
            return false;
        }

        // Only workspace admins can delete teams
        return $user->hasPermissionTo('workspace.teams.manage-all');
    }

    /**
     * Determine whether the user can manage members of the team.
     */
    public function manageMembers(User $user, Team $team): bool
    {
        if (! $user->hasPermissionTo('workspace.teams.manage-members')) {
            return false;
        }

        // Workspace admins can manage all teams
        if ($user->hasPermissionTo('workspace.teams.manage-all')) {
            return true;
        }

        // Team leads can manage their own team
        return $team->isLead($user);
    }

    /**
     * Determine whether the user can leave the team.
     */
    public function leave(User $user, Team $team): bool
    {
        // User must be a member to leave
        return $team->isMember($user);
    }

    /**
     * Check if user belongs to the team or is workspace admin.
     */
    private function userBelongsToTeam(User $user, Team $team): bool
    {
        // Workspace admins have access to all teams
        if ($user->hasPermissionTo('workspace.teams.manage-all')) {
            return true;
        }

        // Check if user is a member or lead of the team
        return $team->isMember($user);
    }
}
