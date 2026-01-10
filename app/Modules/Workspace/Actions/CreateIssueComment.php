<?php

namespace App\Modules\Workspace\Actions;

use App\Models\User;
use App\Modules\Workspace\Models\InboxItem;
use App\Modules\Workspace\Models\Issue;
use App\Modules\Workspace\Models\IssueComment;
use App\Modules\Workspace\Models\IssueSubscription;

class CreateIssueComment
{
    /**
     * Create a new comment on an issue.
     *
     * @param  array{content: string, parent_id?: int|null}  $data
     */
    public function handle(Issue $issue, User $author, array $data): IssueComment
    {
        $comment = IssueComment::create([
            'issue_id' => $issue->id,
            'user_id' => $author->id,
            'parent_id' => $data['parent_id'] ?? null,
            'content' => $data['content'],
        ]);

        $this->subscribeUser($issue, $author);

        $mentionedUsers = $this->parseMentions($data['content'], $issue);

        foreach ($mentionedUsers as $mentionedUser) {
            if ($mentionedUser->id !== $author->id) {
                $this->createNotification($issue, $comment, $mentionedUser, $author, 'mention');
                $this->subscribeUser($issue, $mentionedUser);
            }
        }

        $mentionedUserIds = $mentionedUsers->pluck('id')->toArray();
        $this->notifySubscribers($issue, $comment, $author, $mentionedUserIds);

        if ($comment->parent_id) {
            $parentComment = IssueComment::find($comment->parent_id);
            if ($parentComment && $parentComment->user_id !== $author->id && ! in_array($parentComment->user_id, $mentionedUserIds)) {
                $this->createNotification($issue, $comment, $parentComment->user, $author, 'comment');
            }
        }

        return $comment->load('user');
    }

    /**
     * Parse @mentions from content and return matched users.
     *
     * @return \Illuminate\Support\Collection<int, User>
     */
    protected function parseMentions(string $content, Issue $issue): \Illuminate\Support\Collection
    {
        preg_match_all('/@([a-zA-Z0-9_]+)/', $content, $matches);

        if (empty($matches[1])) {
            return collect();
        }

        $teamMemberIds = $issue->team->members()->pluck('users.id');

        return User::where(function ($query) use ($matches) {
            foreach ($matches[1] as $mention) {
                $query->orWhere('name', 'like', "%{$mention}%")
                    ->orWhere('email', 'like', "{$mention}%");
            }
        })
            ->whereIn('id', $teamMemberIds)
            ->get();
    }

    protected function subscribeUser(Issue $issue, User $user): void
    {
        IssueSubscription::firstOrCreate([
            'issue_id' => $issue->id,
            'user_id' => $user->id,
        ], [
            'created_at' => now(),
        ]);
    }

    protected function notifySubscribers(Issue $issue, IssueComment $comment, User $author, array $excludeUserIds): void
    {
        $subscribers = $issue->subscribers()
            ->whereNotIn('users.id', array_merge([$author->id], $excludeUserIds))
            ->get();

        foreach ($subscribers as $subscriber) {
            $this->createNotification($issue, $comment, $subscriber, $author, 'comment');
        }
    }

    protected function createNotification(Issue $issue, IssueComment $comment, User $recipient, User $actor, string $type): void
    {
        InboxItem::create([
            'user_id' => $recipient->id,
            'issue_id' => $issue->id,
            'type' => $type,
            'content' => mb_substr($comment->content, 0, 200),
            'actor_id' => $actor->id,
            'read' => false,
        ]);
    }
}
