<?php

namespace App\Modules\Workspace\Actions;

use App\Modules\Workspace\Models\IssueComment;

class UpdateIssueComment
{
    /**
     * Update an existing comment.
     *
     * @param  array{content: string}  $data
     */
    public function handle(IssueComment $comment, array $data): IssueComment
    {
        $comment->update([
            'content' => $data['content'],
            'edited_at' => now(),
        ]);

        return $comment->fresh('user');
    }
}
