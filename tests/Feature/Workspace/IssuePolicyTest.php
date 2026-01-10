<?php

use App\Models\User;
use App\Modules\Workspace\Enums\WorkspaceRole;
use App\Modules\Workspace\Models\Issue;
use App\Modules\Workspace\Models\IssueComment;
use App\Modules\Workspace\Models\IssuePriority;
use App\Modules\Workspace\Models\IssueStatus;
use App\Modules\Workspace\Models\Team;
use App\Modules\Workspace\Policies\IssueCommentPolicy;
use App\Modules\Workspace\Policies\IssuePolicy;
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

    $this->issuePolicy = new IssuePolicy;
    $this->commentPolicy = new IssueCommentPolicy;
});

describe('IssuePolicy::viewAny', function () {
    test('workspace admin can view any issues', function () {
        $admin = User::factory()->create();
        $admin->assignRole('workspace-admin');

        expect($this->issuePolicy->viewAny($admin))->toBeTrue();
    });

    test('team member can view issues', function () {
        $team = Team::factory()->create();
        $user = User::factory()->create();
        $team->addMember($user);

        expect($this->issuePolicy->viewAny($user))->toBeTrue();
    });

    test('non-workspace user cannot view issues', function () {
        $user = User::factory()->create();

        expect($this->issuePolicy->viewAny($user))->toBeFalse();
    });
});

describe('IssuePolicy::view', function () {
    test('workspace admin can view any issue', function () {
        $admin = User::factory()->create();
        $admin->assignRole('workspace-admin');
        $team = Team::factory()->create();
        $issue = Issue::factory()->for($team)->create();

        expect($this->issuePolicy->view($admin, $issue))->toBeTrue();
    });

    test('team member can view their team issues', function () {
        $team = Team::factory()->create();
        $user = User::factory()->create();
        $team->addMember($user);
        $issue = Issue::factory()->for($team)->create();

        expect($this->issuePolicy->view($user, $issue))->toBeTrue();
    });

    test('member of another team cannot view issue', function () {
        $team1 = Team::factory()->create();
        $team2 = Team::factory()->create();
        $user = User::factory()->create();
        $team1->addMember($user);
        $issue = Issue::factory()->for($team2)->create();

        expect($this->issuePolicy->view($user, $issue))->toBeFalse();
    });
});

describe('IssuePolicy::create', function () {
    test('workspace admin can create issues', function () {
        $admin = User::factory()->create();
        $admin->assignRole('workspace-admin');

        expect($this->issuePolicy->create($admin))->toBeTrue();
    });

    test('team member can create issues', function () {
        $team = Team::factory()->create();
        $user = User::factory()->create();
        $team->addMember($user);

        expect($this->issuePolicy->create($user))->toBeTrue();
    });

    test('non-workspace user cannot create issues', function () {
        $user = User::factory()->create();

        expect($this->issuePolicy->create($user))->toBeFalse();
    });
});

describe('IssuePolicy::update', function () {
    test('workspace admin can update any issue', function () {
        $admin = User::factory()->create();
        $admin->assignRole('workspace-admin');
        $team = Team::factory()->create();
        $issue = Issue::factory()->for($team)->create();

        expect($this->issuePolicy->update($admin, $issue))->toBeTrue();
    });

    test('team member can update their team issues', function () {
        $team = Team::factory()->create();
        $user = User::factory()->create();
        $team->addMember($user);
        $issue = Issue::factory()->for($team)->create();

        expect($this->issuePolicy->update($user, $issue))->toBeTrue();
    });

    test('team lead can update their team issues', function () {
        $team = Team::factory()->create();
        $lead = User::factory()->create();
        $team->addMember($lead, WorkspaceRole::TeamLead->value);
        $issue = Issue::factory()->for($team)->create();

        expect($this->issuePolicy->update($lead, $issue))->toBeTrue();
    });

    test('member of another team cannot update issue', function () {
        $team1 = Team::factory()->create();
        $team2 = Team::factory()->create();
        $user = User::factory()->create();
        $team1->addMember($user);
        $issue = Issue::factory()->for($team2)->create();

        expect($this->issuePolicy->update($user, $issue))->toBeFalse();
    });
});

describe('IssuePolicy::delete', function () {
    test('workspace admin can delete any issue', function () {
        $admin = User::factory()->create();
        $admin->assignRole('workspace-admin');
        $team = Team::factory()->create();
        $issue = Issue::factory()->for($team)->create();

        expect($this->issuePolicy->delete($admin, $issue))->toBeTrue();
    });

    test('team lead can delete their team issues', function () {
        $team = Team::factory()->create();
        $lead = User::factory()->create();
        $team->addMember($lead, WorkspaceRole::TeamLead->value);
        $issue = Issue::factory()->for($team)->create();

        expect($this->issuePolicy->delete($lead, $issue))->toBeTrue();
    });

    test('team member cannot delete issues', function () {
        $team = Team::factory()->create();
        $member = User::factory()->create();
        $team->addMember($member);
        $issue = Issue::factory()->for($team)->create();

        expect($this->issuePolicy->delete($member, $issue))->toBeFalse();
    });

    test('lead of another team cannot delete issue', function () {
        $team1 = Team::factory()->create();
        $team2 = Team::factory()->create();
        $lead = User::factory()->create();
        $team1->addMember($lead, WorkspaceRole::TeamLead->value);
        $issue = Issue::factory()->for($team2)->create();

        expect($this->issuePolicy->delete($lead, $issue))->toBeFalse();
    });
});

describe('IssuePolicy::assign', function () {
    test('workspace admin can assign any issue', function () {
        $admin = User::factory()->create();
        $admin->assignRole('workspace-admin');
        $team = Team::factory()->create();
        $issue = Issue::factory()->for($team)->create();

        expect($this->issuePolicy->assign($admin, $issue))->toBeTrue();
    });

    test('team member can assign their team issues', function () {
        $team = Team::factory()->create();
        $user = User::factory()->create();
        $team->addMember($user);
        $issue = Issue::factory()->for($team)->create();

        expect($this->issuePolicy->assign($user, $issue))->toBeTrue();
    });

    test('member of another team cannot assign issue', function () {
        $team1 = Team::factory()->create();
        $team2 = Team::factory()->create();
        $user = User::factory()->create();
        $team1->addMember($user);
        $issue = Issue::factory()->for($team2)->create();

        expect($this->issuePolicy->assign($user, $issue))->toBeFalse();
    });
});

describe('IssueCommentPolicy::viewAny', function () {
    test('workspace admin can view comments on any issue', function () {
        $admin = User::factory()->create();
        $admin->assignRole('workspace-admin');
        $team = Team::factory()->create();
        $issue = Issue::factory()->for($team)->create();

        expect($this->commentPolicy->viewAny($admin, $issue))->toBeTrue();
    });

    test('team member can view comments on their team issues', function () {
        $team = Team::factory()->create();
        $user = User::factory()->create();
        $team->addMember($user);
        $issue = Issue::factory()->for($team)->create();

        expect($this->commentPolicy->viewAny($user, $issue))->toBeTrue();
    });

    test('non-team member cannot view comments', function () {
        $team = Team::factory()->create();
        $user = User::factory()->create();
        $issue = Issue::factory()->for($team)->create();

        expect($this->commentPolicy->viewAny($user, $issue))->toBeFalse();
    });
});

describe('IssueCommentPolicy::create', function () {
    test('team member can create comments on their team issues', function () {
        $team = Team::factory()->create();
        $user = User::factory()->create();
        $team->addMember($user);
        $issue = Issue::factory()->for($team)->create();

        expect($this->commentPolicy->create($user, $issue))->toBeTrue();
    });

    test('non-team member cannot create comments', function () {
        $team = Team::factory()->create();
        $user = User::factory()->create();
        $issue = Issue::factory()->for($team)->create();

        expect($this->commentPolicy->create($user, $issue))->toBeFalse();
    });
});

describe('IssueCommentPolicy::update', function () {
    test('workspace admin can update any comment', function () {
        $admin = User::factory()->create();
        $admin->assignRole('workspace-admin');
        $team = Team::factory()->create();
        $author = User::factory()->create();
        $team->addMember($author);
        $issue = Issue::factory()->for($team)->create();
        $comment = IssueComment::factory()->for($issue)->for($author)->create();

        expect($this->commentPolicy->update($admin, $comment))->toBeTrue();
    });

    test('comment author can update their own comment', function () {
        $team = Team::factory()->create();
        $author = User::factory()->create();
        $team->addMember($author);
        $issue = Issue::factory()->for($team)->create();
        $comment = IssueComment::factory()->for($issue)->for($author)->create();

        expect($this->commentPolicy->update($author, $comment))->toBeTrue();
    });

    test('other team member cannot update comment', function () {
        $team = Team::factory()->create();
        $author = User::factory()->create();
        $otherMember = User::factory()->create();
        $team->addMember($author);
        $team->addMember($otherMember);
        $issue = Issue::factory()->for($team)->create();
        $comment = IssueComment::factory()->for($issue)->for($author)->create();

        expect($this->commentPolicy->update($otherMember, $comment))->toBeFalse();
    });
});

describe('IssueCommentPolicy::delete', function () {
    test('workspace admin can delete any comment', function () {
        $admin = User::factory()->create();
        $admin->assignRole('workspace-admin');
        $team = Team::factory()->create();
        $author = User::factory()->create();
        $team->addMember($author);
        $issue = Issue::factory()->for($team)->create();
        $comment = IssueComment::factory()->for($issue)->for($author)->create();

        expect($this->commentPolicy->delete($admin, $comment))->toBeTrue();
    });

    test('comment author can delete their own comment', function () {
        $team = Team::factory()->create();
        $author = User::factory()->create();
        $team->addMember($author);
        $issue = Issue::factory()->for($team)->create();
        $comment = IssueComment::factory()->for($issue)->for($author)->create();

        expect($this->commentPolicy->delete($author, $comment))->toBeTrue();
    });

    test('team lead can delete any comment in their team', function () {
        $team = Team::factory()->create();
        $lead = User::factory()->create();
        $author = User::factory()->create();
        $team->addMember($lead, WorkspaceRole::TeamLead->value);
        $team->addMember($author);
        $issue = Issue::factory()->for($team)->create();
        $comment = IssueComment::factory()->for($issue)->for($author)->create();

        expect($this->commentPolicy->delete($lead, $comment))->toBeTrue();
    });

    test('regular team member cannot delete other users comment', function () {
        $team = Team::factory()->create();
        $author = User::factory()->create();
        $otherMember = User::factory()->create();
        $team->addMember($author);
        $team->addMember($otherMember);
        $issue = Issue::factory()->for($team)->create();
        $comment = IssueComment::factory()->for($issue)->for($author)->create();

        expect($this->commentPolicy->delete($otherMember, $comment))->toBeFalse();
    });
});
