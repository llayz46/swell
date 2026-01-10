<?php

use App\Models\User;
use App\Modules\Workspace\Enums\WorkspaceRole;
use App\Modules\Workspace\Models\IssuePriority;
use App\Modules\Workspace\Models\IssueStatus;
use App\Modules\Workspace\Models\Team;
use App\Modules\Workspace\Policies\TeamPolicy;
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

    $this->policy = new TeamPolicy;
});

describe('TeamPolicy::viewAny', function () {
    test('workspace admin can view any teams', function () {
        $admin = User::factory()->create();
        $admin->assignRole('workspace-admin');

        expect($this->policy->viewAny($admin))->toBeTrue();
    });

    test('team member can view any teams', function () {
        $team = Team::factory()->create();
        $user = User::factory()->create();
        $team->addMember($user);

        expect($this->policy->viewAny($user))->toBeTrue();
    });

    test('non-workspace user cannot view teams', function () {
        $user = User::factory()->create();

        expect($this->policy->viewAny($user))->toBeFalse();
    });
});

describe('TeamPolicy::view', function () {
    test('workspace admin can view any team', function () {
        $admin = User::factory()->create();
        $admin->assignRole('workspace-admin');
        $team = Team::factory()->create();

        expect($this->policy->view($admin, $team))->toBeTrue();
    });

    test('team member can view their team', function () {
        $team = Team::factory()->create();
        $user = User::factory()->create();
        $team->addMember($user);

        expect($this->policy->view($user, $team))->toBeTrue();
    });

    test('team lead can view their team', function () {
        $team = Team::factory()->create();
        $lead = User::factory()->create();
        $team->addMember($lead, WorkspaceRole::TeamLead->value);

        expect($this->policy->view($lead, $team))->toBeTrue();
    });

    test('non-member cannot view team', function () {
        $team = Team::factory()->create();
        $user = User::factory()->create();

        expect($this->policy->view($user, $team))->toBeFalse();
    });
});

describe('TeamPolicy::create', function () {
    test('workspace admin can create teams', function () {
        $admin = User::factory()->create();
        $admin->assignRole('workspace-admin');

        expect($this->policy->create($admin))->toBeTrue();
    });

    test('team lead cannot create teams', function () {
        $team = Team::factory()->create();
        $lead = User::factory()->create();
        $team->addMember($lead, WorkspaceRole::TeamLead->value);

        expect($this->policy->create($lead))->toBeFalse();
    });

    test('team member cannot create teams', function () {
        $team = Team::factory()->create();
        $member = User::factory()->create();
        $team->addMember($member);

        expect($this->policy->create($member))->toBeFalse();
    });

    test('non-workspace user cannot create teams', function () {
        $user = User::factory()->create();

        expect($this->policy->create($user))->toBeFalse();
    });
});

describe('TeamPolicy::update', function () {
    test('workspace admin can update any team', function () {
        $admin = User::factory()->create();
        $admin->assignRole('workspace-admin');
        $team = Team::factory()->create();

        expect($this->policy->update($admin, $team))->toBeTrue();
    });

    test('team lead can update their team', function () {
        $team = Team::factory()->create();
        $lead = User::factory()->create();
        $team->addMember($lead, WorkspaceRole::TeamLead->value);

        expect($this->policy->update($lead, $team))->toBeTrue();
    });

    test('team member cannot update team', function () {
        $team = Team::factory()->create();
        $member = User::factory()->create();
        $team->addMember($member);

        expect($this->policy->update($member, $team))->toBeFalse();
    });

    test('non-member cannot update team', function () {
        $team = Team::factory()->create();
        $user = User::factory()->create();

        expect($this->policy->update($user, $team))->toBeFalse();
    });
});

describe('TeamPolicy::delete', function () {
    test('workspace admin can delete any team', function () {
        $admin = User::factory()->create();
        $admin->assignRole('workspace-admin');
        $team = Team::factory()->create();

        expect($this->policy->delete($admin, $team))->toBeTrue();
    });

    test('team lead cannot delete team', function () {
        $team = Team::factory()->create();
        $lead = User::factory()->create();
        $team->addMember($lead, WorkspaceRole::TeamLead->value);

        expect($this->policy->delete($lead, $team))->toBeFalse();
    });

    test('team member cannot delete team', function () {
        $team = Team::factory()->create();
        $member = User::factory()->create();
        $team->addMember($member);

        expect($this->policy->delete($member, $team))->toBeFalse();
    });
});

describe('TeamPolicy::manageMembers', function () {
    test('workspace admin can manage members of any team', function () {
        $admin = User::factory()->create();
        $admin->assignRole('workspace-admin');
        $team = Team::factory()->create();

        expect($this->policy->manageMembers($admin, $team))->toBeTrue();
    });

    test('team lead can manage members of their team', function () {
        $team = Team::factory()->create();
        $lead = User::factory()->create();
        $team->addMember($lead, WorkspaceRole::TeamLead->value);

        expect($this->policy->manageMembers($lead, $team))->toBeTrue();
    });

    test('team member cannot manage members', function () {
        $team = Team::factory()->create();
        $member = User::factory()->create();
        $team->addMember($member);

        expect($this->policy->manageMembers($member, $team))->toBeFalse();
    });

    test('lead of another team cannot manage members', function () {
        $team1 = Team::factory()->create();
        $team2 = Team::factory()->create();
        $lead = User::factory()->create();
        $team1->addMember($lead, WorkspaceRole::TeamLead->value);

        expect($this->policy->manageMembers($lead, $team2))->toBeFalse();
    });
});

describe('TeamPolicy::leave', function () {
    test('team member can leave their team', function () {
        $team = Team::factory()->create();
        $member = User::factory()->create();
        $team->addMember($member);

        expect($this->policy->leave($member, $team))->toBeTrue();
    });

    test('team lead can leave their team', function () {
        $team = Team::factory()->create();
        $lead = User::factory()->create();
        $team->addMember($lead, WorkspaceRole::TeamLead->value);

        expect($this->policy->leave($lead, $team))->toBeTrue();
    });

    test('non-member cannot leave team', function () {
        $team = Team::factory()->create();
        $user = User::factory()->create();

        expect($this->policy->leave($user, $team))->toBeFalse();
    });
});
