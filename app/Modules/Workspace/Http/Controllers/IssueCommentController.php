<?php

namespace App\Modules\Workspace\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Workspace\Actions\CreateIssueComment;
use App\Modules\Workspace\Actions\DeleteIssueComment;
use App\Modules\Workspace\Actions\UpdateIssueComment;
use App\Modules\Workspace\Http\Requests\Comment\StoreIssueCommentRequest;
use App\Modules\Workspace\Http\Requests\Comment\UpdateIssueCommentRequest;
use App\Modules\Workspace\Models\Issue;
use App\Modules\Workspace\Models\IssueComment;
use Illuminate\Http\RedirectResponse;

class IssueCommentController extends Controller
{
    /**
     * Store a newly created comment.
     */
    public function store(
        StoreIssueCommentRequest $request,
        Issue $issue,
        CreateIssueComment $action
    ): RedirectResponse {
        $this->authorize('create', [IssueComment::class, $issue]);

        $action->handle($issue, $request->user(), $request->validated());

        return back();
    }

    /**
     * Update the specified comment.
     */
    public function update(
        UpdateIssueCommentRequest $request,
        Issue $issue,
        IssueComment $comment,
        UpdateIssueComment $action
    ): RedirectResponse {
        $this->authorize('update', $comment);

        $action->handle($comment, $request->validated());

        return back();
    }

    /**
     * Remove the specified comment.
     */
    public function destroy(
        Issue $issue,
        IssueComment $comment,
        DeleteIssueComment $action
    ): RedirectResponse {
        $this->authorize('delete', $comment);

        $action->handle($comment);

        return back();
    }
}
