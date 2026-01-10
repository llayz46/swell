<?php

namespace App\Modules\Workspace\Policies;

use App\Models\User;
use App\Modules\Workspace\Models\InboxItem;

class InboxItemPolicy
{
    /**
     * Determine whether the user can view the inbox item.
     */
    public function view(User $user, InboxItem $inboxItem): bool
    {
        return $user->id === $inboxItem->user_id;
    }

    /**
     * Determine whether the user can update the inbox item.
     */
    public function update(User $user, InboxItem $inboxItem): bool
    {
        return $user->id === $inboxItem->user_id;
    }

    /**
     * Determine whether the user can delete the inbox item.
     */
    public function delete(User $user, InboxItem $inboxItem): bool
    {
        return $user->id === $inboxItem->user_id;
    }
}
