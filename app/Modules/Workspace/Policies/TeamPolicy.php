<?php

namespace App\Modules\Workspace\Policies;

use App\Models\User;
use App\Modules\Workspace\Models\Team;

/**
 * Team Policy - Option A Architecture
 *
 * Permissions are now based on:
 * - workspace-admin (Spatie role) → Has all permissions
 * - team-lead (pivot role) → Can manage their team
 * - team-member (pivot role) → Can view/participate in their team
 */
class TeamPolicy
{
    /**
     * Determine whether the user can view any teams.
     */
    public function viewAny(User $user): bool
    {
        // All workspace users can view teams
        return $user->isWorkspaceUser();
    }

    /**
     * Determine whether the user can view the team.
     */
    public function view(User $user, Team $team): bool
    {
        return $this->userBelongsToTeam($user, $team);
    }

    /**
     * Determine whether the user can create teams.
     */
    public function create(User $user): bool
    {
        // Only workspace admins can create teams
        return $user->isWorkspaceAdmin();
    }

    /**
     * Determine whether the user can update the team.
     */
    public function update(User $user, Team $team): bool
    {
        // Workspace admins can update any team
        if ($user->isWorkspaceAdmin()) {
            return true;
        }

        // Team leads can update their own team
        return $team->isLead($user);
    }

    /**
     * Determine whether the user can delete the team.
     */
    public function delete(User $user, Team $team): bool
    {
        // Only workspace admins can delete teams
        return $user->isWorkspaceAdmin();
    }

    /**
     * Determine whether the user can manage members of the team.
     */
    public function manageMembers(User $user, Team $team): bool
    {
        // Workspace admins can manage all teams
        if ($user->isWorkspaceAdmin()) {
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
        if ($user->isWorkspaceAdmin()) {
            return true;
        }

        // Check if user is a member or lead of the team
        return $team->isMember($user);
    }
}
