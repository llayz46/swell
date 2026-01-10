<?php

use App\Models\User;
use App\Modules\Workspace\Actions\CreateIssueComment;
use App\Modules\Workspace\Enums\WorkspaceRole;
use App\Modules\Workspace\Models\InboxItem;
use App\Modules\Workspace\Models\Issue;
use App\Modules\Workspace\Models\IssueComment;
use App\Modules\Workspace\Models\IssuePriority;
use App\Modules\Workspace\Models\IssueStatus;
use App\Modules\Workspace\Models\IssueSubscription;
use App\Modules\Workspace\Models\Team;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;

uses(RefreshDatabase::class);

beforeEach(function () {
    if (!config('swell.workspace.enabled')) {
        $this->markTestSkipped('La fonctionnalité workspace est désactivée.');
        return;
    }
    
    $this->seed(\Database\Seeders\RoleSeeder::class);
    Role::firstOrCreate(['name' => 'workspace-admin']);
    IssueStatus::factory()->todo()->create();
    IssuePriority::factory()->medium()->create();
});

describe('IssueComment Model', function () {
    test('comment belongs to an issue', function () {
        $team = Team::factory()->create();
        $issue = Issue::factory()->for($team)->create();
        $user = User::factory()->create();

        $comment = IssueComment::factory()
            ->for($issue)
            ->for($user)
            ->create();

        expect($comment->issue->id)->toBe($issue->id);
    });

    test('comment belongs to a user', function () {
        $team = Team::factory()->create();
        $issue = Issue::factory()->for($team)->create();
        $user = User::factory()->create();

        $comment = IssueComment::factory()
            ->for($issue)
            ->for($user)
            ->create();

        expect($comment->user->id)->toBe($user->id);
    });

    test('comment can have replies', function () {
        $team = Team::factory()->create();
        $issue = Issue::factory()->for($team)->create();
        $user = User::factory()->create();

        $parentComment = IssueComment::factory()
            ->for($issue)
            ->for($user)
            ->create();

        $reply1 = IssueComment::factory()
            ->for($issue)
            ->for($user)
            ->reply($parentComment)
            ->create();

        $reply2 = IssueComment::factory()
            ->for($issue)
            ->for($user)
            ->reply($parentComment)
            ->create();

        expect($parentComment->replies)->toHaveCount(2)
            ->and($parentComment->replies->pluck('id')->toArray())
            ->toContain($reply1->id, $reply2->id);
    });

    test('reply belongs to parent comment', function () {
        $team = Team::factory()->create();
        $issue = Issue::factory()->for($team)->create();
        $user = User::factory()->create();

        $parentComment = IssueComment::factory()
            ->for($issue)
            ->for($user)
            ->create();

        $reply = IssueComment::factory()
            ->for($issue)
            ->for($user)
            ->reply($parentComment)
            ->create();

        expect($reply->parent->id)->toBe($parentComment->id)
            ->and($reply->parent_id)->toBe($parentComment->id);
    });

    test('isEdited returns false for new comments', function () {
        $comment = IssueComment::factory()->create();

        expect($comment->isEdited())->toBeFalse()
            ->and($comment->edited_at)->toBeNull();
    });

    test('isEdited returns true for edited comments', function () {
        $comment = IssueComment::factory()->edited()->create();

        expect($comment->isEdited())->toBeTrue()
            ->and($comment->edited_at)->not->toBeNull();
    });

    test('markAsEdited sets edited_at timestamp', function () {
        $comment = IssueComment::factory()->create();

        expect($comment->isEdited())->toBeFalse();

        $comment->markAsEdited();

        expect($comment->fresh()->isEdited())->toBeTrue()
            ->and($comment->fresh()->edited_at)->not->toBeNull();
    });

    test('isOwnedBy returns true for comment author', function () {
        $user = User::factory()->create();
        $comment = IssueComment::factory()
            ->for($user)
            ->create();

        expect($comment->isOwnedBy($user))->toBeTrue();
    });

    test('isOwnedBy returns false for other users', function () {
        $author = User::factory()->create();
        $otherUser = User::factory()->create();

        $comment = IssueComment::factory()
            ->for($author)
            ->create();

        expect($comment->isOwnedBy($otherUser))->toBeFalse();
    });

    test('rootComments scope excludes replies', function () {
        $team = Team::factory()->create();
        $issue = Issue::factory()->for($team)->create();
        $user = User::factory()->create();

        $rootComment1 = IssueComment::factory()
            ->for($issue)
            ->for($user)
            ->create();

        $rootComment2 = IssueComment::factory()
            ->for($issue)
            ->for($user)
            ->create();

        $reply = IssueComment::factory()
            ->for($issue)
            ->for($user)
            ->reply($rootComment1)
            ->create();

        expect(IssueComment::rootComments()->count())->toBe(2)
            ->and(IssueComment::rootComments()->pluck('id')->toArray())
            ->toContain($rootComment1->id, $rootComment2->id)
            ->not->toContain($reply->id);
    });

    test('withFullRelations scope loads user and replies', function () {
        $team = Team::factory()->create();
        $issue = Issue::factory()->for($team)->create();
        $user = User::factory()->create();

        $comment = IssueComment::factory()
            ->for($issue)
            ->for($user)
            ->create();

        IssueComment::factory()
            ->for($issue)
            ->for($user)
            ->reply($comment)
            ->create();

        $loadedComment = IssueComment::withFullRelations()->find($comment->id);

        expect($loadedComment->relationLoaded('user'))->toBeTrue()
            ->and($loadedComment->relationLoaded('replies'))->toBeTrue();
    });
});

describe('IssueComment Controller', function () {
    test('team member can create a comment', function () {
        $team = Team::factory()->create();
        $user = User::factory()->create();
        $team->addMember($user);

        $issue = Issue::factory()->for($team)->create();

        $response = $this->actingAs($user)->post(route('workspace.issues.comments.store', $issue), [
            'content' => 'This is a test comment',
        ]);

        $response->assertRedirect();

        $this->assertDatabaseHas('issue_comments', [
            'issue_id' => $issue->id,
            'user_id' => $user->id,
            'content' => 'This is a test comment',
        ]);
    });

    test('team member can reply to a comment', function () {
        $team = Team::factory()->create();
        $user = User::factory()->create();
        $team->addMember($user);

        $issue = Issue::factory()->for($team)->create();
        $parentComment = IssueComment::factory()
            ->for($issue)
            ->for($user)
            ->create();

        $response = $this->actingAs($user)->post(route('workspace.issues.comments.store', $issue), [
            'content' => 'This is a reply',
            'parent_id' => $parentComment->id,
        ]);

        $response->assertRedirect();

        $this->assertDatabaseHas('issue_comments', [
            'issue_id' => $issue->id,
            'user_id' => $user->id,
            'parent_id' => $parentComment->id,
            'content' => 'This is a reply',
        ]);
    });

    test('comment requires content', function () {
        $team = Team::factory()->create();
        $user = User::factory()->create();
        $team->addMember($user);

        $issue = Issue::factory()->for($team)->create();

        $response = $this->actingAs($user)->post(route('workspace.issues.comments.store', $issue), [
            'content' => '',
        ]);

        $response->assertSessionHasErrors('content');
    });

    test('non-team member cannot create comment', function () {
        $team = Team::factory()->create();
        $user = User::factory()->create();
        // User is NOT added to team

        $issue = Issue::factory()->for($team)->create();

        $response = $this->actingAs($user)->post(route('workspace.issues.comments.store', $issue), [
            'content' => 'Unauthorized comment',
        ]);

        $response->assertForbidden();
    });

    test('comment author can update their comment', function () {
        $team = Team::factory()->create();
        $user = User::factory()->create();
        $team->addMember($user);

        $issue = Issue::factory()->for($team)->create();
        $comment = IssueComment::factory()
            ->for($issue)
            ->for($user)
            ->create(['content' => 'Original content']);

        $response = $this->actingAs($user)->patch(
            route('workspace.issues.comments.update', [$issue, $comment]),
            ['content' => 'Updated content']
        );

        $response->assertRedirect();
        expect($comment->fresh()->content)->toBe('Updated content')
            ->and($comment->fresh()->isEdited())->toBeTrue();
    });

    test('other user cannot update someone elses comment', function () {
        $team = Team::factory()->create();
        $author = User::factory()->create();
        $otherUser = User::factory()->create();
        $team->addMember($author);
        $team->addMember($otherUser);

        $issue = Issue::factory()->for($team)->create();
        $comment = IssueComment::factory()
            ->for($issue)
            ->for($author)
            ->create();

        $response = $this->actingAs($otherUser)->patch(
            route('workspace.issues.comments.update', [$issue, $comment]),
            ['content' => 'Unauthorized update']
        );

        $response->assertForbidden();
    });

    test('workspace admin can update any comment', function () {
        $team = Team::factory()->create();
        $author = User::factory()->create();
        $admin = User::factory()->create();
        $admin->assignRole('workspace-admin');
        $team->addMember($author);

        $issue = Issue::factory()->for($team)->create();
        $comment = IssueComment::factory()
            ->for($issue)
            ->for($author)
            ->create(['content' => 'Original content']);

        $response = $this->actingAs($admin)->patch(
            route('workspace.issues.comments.update', [$issue, $comment]),
            ['content' => 'Admin updated content']
        );

        $response->assertRedirect();
        expect($comment->fresh()->content)->toBe('Admin updated content');
    });

    test('comment author can delete their comment', function () {
        $team = Team::factory()->create();
        $user = User::factory()->create();
        $team->addMember($user);

        $issue = Issue::factory()->for($team)->create();
        $comment = IssueComment::factory()
            ->for($issue)
            ->for($user)
            ->create();
        $commentId = $comment->id;

        $response = $this->actingAs($user)->delete(
            route('workspace.issues.comments.destroy', [$issue, $comment])
        );

        $response->assertRedirect();
        expect(IssueComment::find($commentId))->toBeNull();
    });

    test('team lead can delete any comment in their team', function () {
        $team = Team::factory()->create();
        $lead = User::factory()->create();
        $author = User::factory()->create();
        $team->addMember($lead, WorkspaceRole::TeamLead->value);
        $team->addMember($author);

        $issue = Issue::factory()->for($team)->create();
        $comment = IssueComment::factory()
            ->for($issue)
            ->for($author)
            ->create();
        $commentId = $comment->id;

        $response = $this->actingAs($lead)->delete(
            route('workspace.issues.comments.destroy', [$issue, $comment])
        );

        $response->assertRedirect();
        expect(IssueComment::find($commentId))->toBeNull();
    });

    test('regular member cannot delete other users comment', function () {
        $team = Team::factory()->create();
        $author = User::factory()->create();
        $otherMember = User::factory()->create();
        $team->addMember($author);
        $team->addMember($otherMember);

        $issue = Issue::factory()->for($team)->create();
        $comment = IssueComment::factory()
            ->for($issue)
            ->for($author)
            ->create();

        $response = $this->actingAs($otherMember)->delete(
            route('workspace.issues.comments.destroy', [$issue, $comment])
        );

        $response->assertForbidden();
    });
});

describe('CreateIssueComment Action', function () {
    test('action creates comment and subscribes author', function () {
        $team = Team::factory()->create();
        $user = User::factory()->create();
        $team->addMember($user);

        $issue = Issue::factory()->for($team)->create();

        $action = app(CreateIssueComment::class);
        $comment = $action->handle($issue, $user, [
            'content' => 'Test comment via action',
        ]);

        expect($comment)->toBeInstanceOf(IssueComment::class)
            ->and($comment->content)->toBe('Test comment via action')
            ->and($issue->isSubscribed($user))->toBeTrue();
    });

    test('action creates reply to parent comment', function () {
        $team = Team::factory()->create();
        $user = User::factory()->create();
        $team->addMember($user);

        $issue = Issue::factory()->for($team)->create();
        $parentComment = IssueComment::factory()
            ->for($issue)
            ->for($user)
            ->create();

        $action = app(CreateIssueComment::class);
        $reply = $action->handle($issue, $user, [
            'content' => 'Reply content',
            'parent_id' => $parentComment->id,
        ]);

        expect($reply->parent_id)->toBe($parentComment->id);
    });

    test('action notifies subscribers about new comment', function () {
        $team = Team::factory()->create();
        $author = User::factory()->create();
        $subscriber = User::factory()->create();
        $team->addMember($author);
        $team->addMember($subscriber);

        $issue = Issue::factory()->for($team)->create();

        // Subscribe user to issue
        IssueSubscription::create([
            'issue_id' => $issue->id,
            'user_id' => $subscriber->id,
            'created_at' => now(),
        ]);

        $action = app(CreateIssueComment::class);
        $action->handle($issue, $author, [
            'content' => 'Comment for subscribers',
        ]);

        expect(InboxItem::where('user_id', $subscriber->id)->where('type', 'comment')->count())->toBe(1);
    });

    test('action does not notify comment author', function () {
        $team = Team::factory()->create();
        $user = User::factory()->create();
        $team->addMember($user);

        $issue = Issue::factory()->for($team)->create();

        // Subscribe user to issue
        IssueSubscription::create([
            'issue_id' => $issue->id,
            'user_id' => $user->id,
            'created_at' => now(),
        ]);

        $action = app(CreateIssueComment::class);
        $action->handle($issue, $user, [
            'content' => 'Self comment',
        ]);

        expect(InboxItem::where('user_id', $user->id)->count())->toBe(0);
    });

    test('action notifies mentioned users', function () {
        $team = Team::factory()->create();
        $author = User::factory()->create(['name' => 'Author User']);
        $mentionedUser = User::factory()->create(['name' => 'John Doe', 'email' => 'john@example.com']);
        $team->addMember($author);
        $team->addMember($mentionedUser);

        $issue = Issue::factory()->for($team)->create();

        $action = app(CreateIssueComment::class);
        $action->handle($issue, $author, [
            'content' => 'Hey @john, check this out!',
        ]);

        expect(InboxItem::where('user_id', $mentionedUser->id)->where('type', 'mention')->count())->toBe(1);
    });

    test('action subscribes mentioned users to issue', function () {
        $team = Team::factory()->create();
        $author = User::factory()->create();
        $mentionedUser = User::factory()->create(['name' => 'Jane Doe', 'email' => 'jane@example.com']);
        $team->addMember($author);
        $team->addMember($mentionedUser);

        $issue = Issue::factory()->for($team)->create();

        expect($issue->isSubscribed($mentionedUser))->toBeFalse();

        $action = app(CreateIssueComment::class);
        $action->handle($issue, $author, [
            'content' => 'Mentioning @jane here',
        ]);

        expect($issue->isSubscribed($mentionedUser))->toBeTrue();
    });
});
