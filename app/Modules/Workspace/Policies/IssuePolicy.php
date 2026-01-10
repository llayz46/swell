<?php

namespace App\Modules\Workspace\Policies;

use App\Models\User;
use App\Modules\Workspace\Models\Issue;

/**
 * Issue Policy - Option A Architecture
 *
 * Permissions are now based on:
 * - workspace-admin (Spatie role) → Has all permissions
 * - team-lead (pivot role) → Full access to their team's issues
 * - team-member (pivot role) → Can view/update issues in their team
 */
class IssuePolicy
{
    /**
     * Determine whether the user can view any issues.
     */
    public function viewAny(User $user): bool
    {
        return $user->isWorkspaceUser();
    }

    /**
     * Determine whether the user can view the issue.
     */
    public function view(User $user, Issue $issue): bool
    {
        return $this->userBelongsToIssueTeam($user, $issue);
    }

    /**
     * Determine whether the user can create issues.
     */
    public function create(User $user): bool
    {
        // All workspace users can create issues in their teams
        return $user->isWorkspaceUser();
    }

    /**
     * Determine whether the user can update the issue.
     */
    public function update(User $user, Issue $issue): bool
    {
        return $this->userBelongsToIssueTeam($user, $issue);
    }

    /**
     * Determine whether the user can delete the issue.
     */
    public function delete(User $user, Issue $issue): bool
    {
        // Admins can delete any issue
        if ($user->isWorkspaceAdmin()) {
            return true;
        }

        // Team leads can delete issues in their team
        $team = $issue->team;

        return $team && $team->isLead($user);
    }

    /**
     * Determine whether the user can restore the issue.
     */
    public function restore(User $user, Issue $issue): bool
    {
        return $this->delete($user, $issue);
    }

    /**
     * Determine whether the user can assign the issue to someone.
     */
    public function assign(User $user, Issue $issue): bool
    {
        // All team members can assign issues
        return $this->userBelongsToIssueTeam($user, $issue);
    }

    /**
     * Check if user belongs to the issue's team or is workspace admin.
     */
    private function userBelongsToIssueTeam(User $user, Issue $issue): bool
    {
        // Workspace admins have access to all issues
        if ($user->isWorkspaceAdmin()) {
            return true;
        }

        // Team leads and members need to belong to the issue's team
        return $user->teams()->where('teams.id', $issue->team_id)->exists();
    }
}
