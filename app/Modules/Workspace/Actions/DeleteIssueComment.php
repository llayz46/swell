<?php

namespace App\Modules\Workspace\Actions;

use App\Modules\Workspace\Models\IssueComment;

class DeleteIssueComment
{
    /**
     * Delete a comment and all its replies.
     */
    public function handle(IssueComment $comment): bool
    {
        return $comment->delete();
    }
}
