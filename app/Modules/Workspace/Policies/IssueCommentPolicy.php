<?php

namespace App\Modules\Workspace\Policies;

use App\Models\User;
use App\Modules\Workspace\Models\Issue;
use App\Modules\Workspace\Models\IssueComment;

/**
 * IssueComment Policy
 *
 * Permissions:
 * - workspace-admin → Has all permissions
 * - team-lead → Can delete any comment in their team
 * - team-member → Can view/create comments, edit/delete only their own
 */
class IssueCommentPolicy
{
    /**
     * Determine whether the user can view comments on an issue.
     */
    public function viewAny(User $user, Issue $issue): bool
    {
        return $this->userBelongsToIssueTeam($user, $issue);
    }

    /**
     * Determine whether the user can view a specific comment.
     */
    public function view(User $user, IssueComment $comment): bool
    {
        return $this->userBelongsToIssueTeam($user, $comment->issue);
    }

    /**
     * Determine whether the user can create comments on an issue.
     */
    public function create(User $user, Issue $issue): bool
    {
        return $this->userBelongsToIssueTeam($user, $issue);
    }

    /**
     * Determine whether the user can update the comment.
     */
    public function update(User $user, IssueComment $comment): bool
    {
        if ($user->isWorkspaceAdmin()) {
            return true;
        }

        return $comment->user_id === $user->id;
    }

    /**
     * Determine whether the user can delete the comment.
     */
    public function delete(User $user, IssueComment $comment): bool
    {
        if ($user->isWorkspaceAdmin()) {
            return true;
        }

        if ($comment->user_id === $user->id) {
            return true;
        }

        $issue = $comment->issue;
        $team = $issue->team;

        return $team && $team->isLead($user);
    }

    /**
     * Check if user belongs to the issue's team or is workspace admin.
     */
    private function userBelongsToIssueTeam(User $user, Issue $issue): bool
    {
        if ($user->isWorkspaceAdmin()) {
            return true;
        }

        return $user->teams()->where('teams.id', $issue->team_id)->exists();
    }
}
