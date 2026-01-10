<?php

use App\Models\User;
use App\Modules\Workspace\Actions\DeleteIssueComment;
use App\Modules\Workspace\Actions\InviteTeamMember;
use App\Modules\Workspace\Actions\RemoveTeamMember;
use App\Modules\Workspace\Actions\UpdateIssueComment;
use App\Modules\Workspace\Enums\WorkspaceRole;
use App\Modules\Workspace\Models\Issue;
use App\Modules\Workspace\Models\IssueComment;
use App\Modules\Workspace\Models\IssuePriority;
use App\Modules\Workspace\Models\IssueStatus;
use App\Modules\Workspace\Models\Team;
use App\Modules\Workspace\Models\TeamInvitation;
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

describe('InviteTeamMember Action', function () {
    test('creates a pending invitation', function () {
        $team = Team::factory()->create();
        $inviter = User::factory()->create();
        $invitee = User::factory()->create();
        $team->addMember($inviter, WorkspaceRole::TeamLead->value);

        $action = app(InviteTeamMember::class);
        $invitation = $action->handle($team, [
            'user_id' => $invitee->id,
            'role' => WorkspaceRole::TeamMember->value,
            'message' => 'Welcome to the team!',
        ], $inviter);

        expect($invitation)->toBeInstanceOf(TeamInvitation::class)
            ->and($invitation->team_id)->toBe($team->id)
            ->and($invitation->user_id)->toBe($invitee->id)
            ->and($invitation->invited_by)->toBe($inviter->id)
            ->and($invitation->role)->toBe(WorkspaceRole::TeamMember->value)
            ->and($invitation->status)->toBe('pending')
            ->and($invitation->message)->toBe('Welcome to the team!')
            ->and($invitation->expires_at)->not->toBeNull();
    });

    test('invitation expires in 7 days', function () {
        $team = Team::factory()->create();
        $inviter = User::factory()->create();
        $invitee = User::factory()->create();
        $team->addMember($inviter, WorkspaceRole::TeamLead->value);

        $action = app(InviteTeamMember::class);
        $invitation = $action->handle($team, [
            'user_id' => $invitee->id,
            'role' => WorkspaceRole::TeamMember->value,
        ], $inviter);

        // Check expiration is approximately 7 days from now
        $expectedExpiration = now()->addDays(7);
        expect($invitation->expires_at->diffInDays($expectedExpiration))->toBeLessThan(1);
    });

    test('can invite as team lead', function () {
        $team = Team::factory()->create();
        $inviter = User::factory()->create();
        $invitee = User::factory()->create();
        $team->addMember($inviter, WorkspaceRole::TeamLead->value);

        $action = app(InviteTeamMember::class);
        $invitation = $action->handle($team, [
            'user_id' => $invitee->id,
            'role' => WorkspaceRole::TeamLead->value,
        ], $inviter);

        expect($invitation->role)->toBe(WorkspaceRole::TeamLead->value);
    });
});

describe('RemoveTeamMember Action', function () {
    test('removes member from team', function () {
        $team = Team::factory()->create();
        $member = User::factory()->create();
        $team->addMember($member);

        expect($team->isMember($member))->toBeTrue();

        $action = app(RemoveTeamMember::class);
        $action->handle($team, $member);

        expect($team->fresh()->isMember($member))->toBeFalse();
    });

    test('unassigns all issues from removed member', function () {
        $team = Team::factory()->create();
        $member = User::factory()->create();
        $team->addMember($member);

        $issue1 = Issue::factory()->for($team)->create(['assignee_id' => $member->id]);
        $issue2 = Issue::factory()->for($team)->create(['assignee_id' => $member->id]);

        expect($issue1->assignee_id)->toBe($member->id)
            ->and($issue2->assignee_id)->toBe($member->id);

        $action = app(RemoveTeamMember::class);
        $action->handle($team, $member);

        expect($issue1->fresh()->assignee_id)->toBeNull()
            ->and($issue2->fresh()->assignee_id)->toBeNull();
    });

    test('does not affect issues assigned to other members', function () {
        $team = Team::factory()->create();
        $member1 = User::factory()->create();
        $member2 = User::factory()->create();
        $team->addMember($member1);
        $team->addMember($member2);

        $issue1 = Issue::factory()->for($team)->create(['assignee_id' => $member1->id]);
        $issue2 = Issue::factory()->for($team)->create(['assignee_id' => $member2->id]);

        $action = app(RemoveTeamMember::class);
        $action->handle($team, $member1);

        expect($issue1->fresh()->assignee_id)->toBeNull()
            ->and($issue2->fresh()->assignee_id)->toBe($member2->id);
    });
});

describe('UpdateIssueComment Action', function () {
    test('updates comment content', function () {
        $team = Team::factory()->create();
        $user = User::factory()->create();
        $team->addMember($user);
        $issue = Issue::factory()->for($team)->create();
        $comment = IssueComment::factory()
            ->for($issue)
            ->for($user)
            ->create(['content' => 'Original content']);

        $action = app(UpdateIssueComment::class);
        $action->handle($comment, ['content' => 'Updated content']);

        expect($comment->fresh()->content)->toBe('Updated content');
    });

    test('marks comment as edited', function () {
        $team = Team::factory()->create();
        $user = User::factory()->create();
        $team->addMember($user);
        $issue = Issue::factory()->for($team)->create();
        $comment = IssueComment::factory()
            ->for($issue)
            ->for($user)
            ->create();

        expect($comment->isEdited())->toBeFalse();

        $action = app(UpdateIssueComment::class);
        $action->handle($comment, ['content' => 'Updated content']);

        expect($comment->fresh()->isEdited())->toBeTrue()
            ->and($comment->fresh()->edited_at)->not->toBeNull();
    });
});

describe('DeleteIssueComment Action', function () {
    test('deletes a comment', function () {
        $team = Team::factory()->create();
        $user = User::factory()->create();
        $team->addMember($user);
        $issue = Issue::factory()->for($team)->create();
        $comment = IssueComment::factory()
            ->for($issue)
            ->for($user)
            ->create();
        $commentId = $comment->id;

        $action = app(DeleteIssueComment::class);
        $action->handle($comment);

        expect(IssueComment::find($commentId))->toBeNull();
    });

    test('deleting a reply does not affect parent comment', function () {
        $team = Team::factory()->create();
        $user = User::factory()->create();
        $team->addMember($user);
        $issue = Issue::factory()->for($team)->create();

        $parentComment = IssueComment::factory()
            ->for($issue)
            ->for($user)
            ->create();

        $reply = IssueComment::factory()
            ->for($issue)
            ->for($user)
            ->reply($parentComment)
            ->create();

        $parentId = $parentComment->id;

        $action = app(DeleteIssueComment::class);
        $action->handle($reply);

        // Parent still exists
        expect(IssueComment::find($parentId))->not->toBeNull();
    });
});
