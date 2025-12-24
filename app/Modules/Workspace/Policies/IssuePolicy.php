<?php

namespace App\Modules\Workspace\Policies;

use App\Models\User;
use App\Modules\Workspace\Models\Issue;

class IssuePolicy
{
    /**
     * Determine whether the user can view any issues.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('workspace.issues.view');
    }

    /**
     * Determine whether the user can view the issue.
     */
    public function view(User $user, Issue $issue): bool
    {
        return $user->hasPermissionTo('workspace.issues.view');
    }

    /**
     * Determine whether the user can create issues.
     */
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('workspace.issues.create');
    }

    /**
     * Determine whether the user can update the issue.
     */
    public function update(User $user, Issue $issue): bool
    {
        return $user->hasPermissionTo('workspace.issues.update');
    }

    /**
     * Determine whether the user can delete the issue.
     */
    public function delete(User $user, Issue $issue): bool
    {
        return $user->hasPermissionTo('workspace.issues.delete');
    }

    /**
     * Determine whether the user can restore the issue.
     */
    public function restore(User $user, Issue $issue): bool
    {
        return $user->hasPermissionTo('workspace.issues.delete');
    }

    /**
     * Determine whether the user can assign the issue to someone.
     */
    public function assign(User $user, Issue $issue): bool
    {
        return $user->hasPermissionTo('workspace.issues.assign');
    }
}
