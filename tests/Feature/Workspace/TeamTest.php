<?php

use App\Models\User;
use App\Modules\Workspace\Enums\WorkspaceRole;
use App\Modules\Workspace\Models\Issue;
use App\Modules\Workspace\Models\IssuePriority;
use App\Modules\Workspace\Models\IssueStatus;
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

describe('Team Model', function () {
    test('can add a member to the team', function () {
        $team = Team::factory()->create();
        $user = User::factory()->create();

        $team->addMember($user);

        expect($team->members)->toHaveCount(1)
            ->and($team->isMember($user))->toBeTrue()
            ->and($team->getRoleForUser($user))->toBe(WorkspaceRole::TeamMember->value);
    });

    test('can add a member as team lead', function () {
        $team = Team::factory()->create();
        $user = User::factory()->create();

        $team->addMember($user, WorkspaceRole::TeamLead->value);

        expect($team->isLead($user))->toBeTrue()
            ->and($team->leads)->toHaveCount(1)
            ->and($team->getRoleForUser($user))->toBe(WorkspaceRole::TeamLead->value);
    });

    test('can remove a member from the team', function () {
        $team = Team::factory()->create();
        $user = User::factory()->create();
        $team->addMember($user);

        expect($team->isMember($user))->toBeTrue();

        $team->removeMember($user);

        expect($team->fresh()->isMember($user))->toBeFalse();
    });

    test('isMember returns false for non-members', function () {
        $team = Team::factory()->create();
        $user = User::factory()->create();

        expect($team->isMember($user))->toBeFalse();
    });

    test('isLead returns false for regular members', function () {
        $team = Team::factory()->create();
        $user = User::factory()->create();
        $team->addMember($user);

        expect($team->isLead($user))->toBeFalse();
    });

    test('getRoleForUser returns null for non-members', function () {
        $team = Team::factory()->create();
        $user = User::factory()->create();

        expect($team->getRoleForUser($user))->toBeNull();
    });

    test('can promote a member to lead', function () {
        $team = Team::factory()->create();
        $user = User::factory()->create();
        $team->addMember($user);

        expect($team->isLead($user))->toBeFalse();

        $team->promoteMember($user);

        expect($team->fresh()->isLead($user))->toBeTrue();
    });

    test('promoting non-member throws exception', function () {
        $team = Team::factory()->create();
        $user = User::factory()->create();

        expect(fn () => $team->promoteMember($user))
            ->toThrow(Exception::class, "L'utilisateur n'est pas membre de cette team");
    });

    test('can demote a lead to member', function () {
        $team = Team::factory()->create();
        $user = User::factory()->create();
        $team->addMember($user, WorkspaceRole::TeamLead->value);

        expect($team->isLead($user))->toBeTrue();

        $team->demoteLead($user);

        expect($team->fresh()->isLead($user))->toBeFalse()
            ->and($team->fresh()->isMember($user))->toBeTrue();
    });

    test('demoting non-lead throws exception', function () {
        $team = Team::factory()->create();
        $user = User::factory()->create();
        $team->addMember($user);

        expect(fn () => $team->demoteLead($user))
            ->toThrow(Exception::class, "L'utilisateur n'est pas lead de cette team");
    });

    test('can transfer lead role to another member', function () {
        $team = Team::factory()->create();
        $lead = User::factory()->create();
        $member = User::factory()->create();

        $team->addMember($lead, WorkspaceRole::TeamLead->value);
        $team->addMember($member);

        $team->transferLead($lead, $member);

        expect($team->fresh()->isLead($lead))->toBeFalse()
            ->and($team->fresh()->isLead($member))->toBeTrue()
            ->and($team->fresh()->isMember($lead))->toBeTrue();
    });

    test('transferLead throws exception if fromUser is not lead', function () {
        $team = Team::factory()->create();
        $member1 = User::factory()->create();
        $member2 = User::factory()->create();

        $team->addMember($member1);
        $team->addMember($member2);

        expect(fn () => $team->transferLead($member1, $member2))
            ->toThrow(Exception::class, "L'utilisateur source n'est pas lead de cette team");
    });

    test('transferLead throws exception if toUser is not member', function () {
        $team = Team::factory()->create();
        $lead = User::factory()->create();
        $nonMember = User::factory()->create();

        $team->addMember($lead, WorkspaceRole::TeamLead->value);

        expect(fn () => $team->transferLead($lead, $nonMember))
            ->toThrow(Exception::class, "L'utilisateur cible n'est pas membre de cette team");
    });

    test('team has issues relationship', function () {
        $team = Team::factory()->create();
        Issue::factory()->for($team)->count(3)->create();

        expect($team->issues)->toHaveCount(3);
    });

    test('team has invitations relationship', function () {
        $team = Team::factory()->create();
        $user = User::factory()->create();
        $inviter = User::factory()->create();

        \App\Modules\Workspace\Models\TeamInvitation::factory()
            ->for($team)
            ->for($user)
            ->for($inviter, 'inviter')
            ->count(2)
            ->create();

        expect($team->invitations)->toHaveCount(2);
    });

    test('leads relationship returns only leads', function () {
        $team = Team::factory()->create();
        $lead1 = User::factory()->create();
        $lead2 = User::factory()->create();
        $member = User::factory()->create();

        $team->addMember($lead1, WorkspaceRole::TeamLead->value);
        $team->addMember($lead2, WorkspaceRole::TeamLead->value);
        $team->addMember($member);

        expect($team->leads)->toHaveCount(2)
            ->and($team->leads->pluck('id')->toArray())
            ->toContain($lead1->id, $lead2->id)
            ->not->toContain($member->id);
    });

    test('members relationship includes both leads and members', function () {
        $team = Team::factory()->create();
        $lead = User::factory()->create();
        $member = User::factory()->create();

        $team->addMember($lead, WorkspaceRole::TeamLead->value);
        $team->addMember($member);

        expect($team->members)->toHaveCount(2)
            ->and($team->members->pluck('id')->toArray())
            ->toContain($lead->id, $member->id);
    });
});

describe('Team Factory', function () {
    test('creates team with valid attributes', function () {
        $team = Team::factory()->create();

        expect($team->name)->not->toBeEmpty()
            ->and($team->identifier)->not->toBeEmpty()
            ->and($team->icon)->not->toBeNull()
            ->and($team->color)->not->toBeNull();
    });

    test('factory generates unique identifiers', function () {
        $teams = Team::factory()->count(5)->create();
        $identifiers = $teams->pluck('identifier')->toArray();

        expect(array_unique($identifiers))->toHaveCount(5);
    });
});
