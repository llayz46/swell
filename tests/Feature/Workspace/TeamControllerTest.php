<?php

use App\Models\User;
use App\Modules\Workspace\Enums\WorkspaceRole;
use App\Modules\Workspace\Models\Issue;
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

describe('Team Index', function () {
    test('workspace admin can view teams list', function () {
        $admin = User::factory()->create();
        $admin->assignRole('workspace-admin');

        Team::factory()->count(3)->create();

        $response = $this->actingAs($admin)->get(route('workspace.teams.index'));

        $response->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('workspace/teams/index')
                ->has('teams', 3)
            );
    });

    test('team member can view teams list', function () {
        $team = Team::factory()->create();
        $user = User::factory()->create();
        $team->addMember($user);

        $response = $this->actingAs($user)->get(route('workspace.teams.index'));

        $response->assertOk();
    });

    test('non-workspace user cannot view teams', function () {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get(route('workspace.teams.index'));

        $response->assertForbidden();
    });

    test('teams list includes pending invitations for user', function () {
        $team = Team::factory()->create();
        $user = User::factory()->create();
        $inviter = User::factory()->create();
        $team->addMember($inviter, WorkspaceRole::TeamLead->value);
        $team->addMember($user);

        TeamInvitation::factory()
            ->for($team)
            ->for($user)
            ->for($inviter, 'inviter')
            ->pending()
            ->neverExpires()
            ->create();

        $response = $this->actingAs($user)->get(route('workspace.teams.index'));

        $response->assertOk()
            ->assertInertia(fn ($page) => $page
                ->has('pendingInvitations', 1)
            );
    });
});

describe('Team Store', function () {
    test('workspace admin can create a team', function () {
        $admin = User::factory()->create();
        $admin->assignRole('workspace-admin');

        $response = $this->actingAs($admin)->post(route('workspace.teams.store'), [
            'name' => 'New Team',
            'identifier' => 'NEW-TEAM',
            'icon' => '🚀',
            'color' => '#3b82f6',
            'description' => 'A new team description',
        ]);

        $response->assertRedirect();

        $this->assertDatabaseHas('teams', [
            'name' => 'New Team',
            'identifier' => 'NEW-TEAM',
        ]);

        // Creator becomes team lead
        $team = Team::where('name', 'New Team')->first();
        expect($team->isLead($admin))->toBeTrue();
    });

    test('identifier is auto-generated from name', function () {
        $admin = User::factory()->create();
        $admin->assignRole('workspace-admin');

        $response = $this->actingAs($admin)->post(route('workspace.teams.store'), [
            'name' => 'My Awesome Team',
            'icon' => '🚀',
            'color' => '#3b82f6',
        ]);

        $response->assertRedirect();

        $this->assertDatabaseHas('teams', [
            'name' => 'My Awesome Team',
            'identifier' => 'MY-AWESOME-TEAM',
        ]);
    });

    test('team member cannot create a team', function () {
        $team = Team::factory()->create();
        $member = User::factory()->create();
        $team->addMember($member);

        $response = $this->actingAs($member)->post(route('workspace.teams.store'), [
            'name' => 'New Team',
        ]);

        $response->assertForbidden();
    });

    test('team creation requires name', function () {
        $admin = User::factory()->create();
        $admin->assignRole('workspace-admin');

        $response = $this->actingAs($admin)->post(route('workspace.teams.store'), [
            'identifier' => 'NEW-TEAM',
        ]);

        $response->assertSessionHasErrors('name');
    });

    test('team identifier must be unique', function () {
        $admin = User::factory()->create();
        $admin->assignRole('workspace-admin');

        Team::factory()->create(['identifier' => 'EXISTING']);

        $response = $this->actingAs($admin)->post(route('workspace.teams.store'), [
            'name' => 'New Team',
            'identifier' => 'EXISTING',
        ]);

        $response->assertSessionHasErrors('identifier');
    });

    test('color must be valid hex format', function () {
        $admin = User::factory()->create();
        $admin->assignRole('workspace-admin');

        $response = $this->actingAs($admin)->post(route('workspace.teams.store'), [
            'name' => 'New Team',
            'color' => 'invalid',
        ]);

        $response->assertSessionHasErrors('color');
    });
});

describe('Team Update', function () {
    test('workspace admin can update any team', function () {
        $admin = User::factory()->create();
        $admin->assignRole('workspace-admin');
        $team = Team::factory()->create(['name' => 'Original Name']);

        $response = $this->actingAs($admin)->put(route('workspace.teams.update', $team), [
            'name' => 'Updated Name',
            'description' => 'Updated description',
        ]);

        $response->assertRedirect();
        expect($team->fresh()->name)->toBe('Updated Name')
            ->and($team->fresh()->description)->toBe('Updated description');
    });

    test('team lead can update their team', function () {
        $team = Team::factory()->create(['name' => 'Original Name']);
        $lead = User::factory()->create();
        $team->addMember($lead, WorkspaceRole::TeamLead->value);

        $response = $this->actingAs($lead)->put(route('workspace.teams.update', $team), [
            'name' => 'Lead Updated Name',
        ]);

        $response->assertRedirect();
        expect($team->fresh()->name)->toBe('Lead Updated Name');
    });

    test('team member cannot update team', function () {
        $team = Team::factory()->create();
        $member = User::factory()->create();
        $team->addMember($member);

        $response = $this->actingAs($member)->put(route('workspace.teams.update', $team), [
            'name' => 'Unauthorized Update',
        ]);

        $response->assertForbidden();
    });
});

describe('Team Issues', function () {
    test('team member can view team issues', function () {
        $team = Team::factory()->create();
        $user = User::factory()->create();
        $team->addMember($user);

        Issue::factory()->for($team)->count(5)->create();

        $response = $this->actingAs($user)->get(route('workspace.teams.issues', $team->identifier));

        $response->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('workspace/teams/issues')
                ->has('issues', 5)
                ->has('team')
                ->has('statuses')
                ->has('priorities')
                ->has('labels')
            );
    });

    test('non-team member cannot view team issues', function () {
        $team = Team::factory()->create();
        $otherTeam = Team::factory()->create();
        $user = User::factory()->create();
        $otherTeam->addMember($user);

        $response = $this->actingAs($user)->get(route('workspace.teams.issues', $team->identifier));

        $response->assertForbidden();
    });

    test('workspace admin can view any team issues', function () {
        $admin = User::factory()->create();
        $admin->assignRole('workspace-admin');
        $team = Team::factory()->create();

        Issue::factory()->for($team)->count(3)->create();

        $response = $this->actingAs($admin)->get(route('workspace.teams.issues', $team->identifier));

        $response->assertOk()
            ->assertInertia(fn ($page) => $page->has('issues', 3));
    });
});

describe('Team Members', function () {
    test('team member can view team members', function () {
        $team = Team::factory()->create();
        $user = User::factory()->create();
        $team->addMember($user);

        $response = $this->actingAs($user)->get(route('workspace.teams.members', $team->identifier));

        $response->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('workspace/teams/members')
                ->has('team')
            );
    });
});

describe('Team Invite', function () {
    test('team lead can invite a user', function () {
        $team = Team::factory()->create();
        $lead = User::factory()->create();
        $invitee = User::factory()->create();
        $team->addMember($lead, WorkspaceRole::TeamLead->value);

        $response = $this->actingAs($lead)->post(route('workspace.teams.invite', $team), [
            'user_id' => $invitee->id,
            'role' => WorkspaceRole::TeamMember->value,
        ]);

        $response->assertRedirect();

        $this->assertDatabaseHas('team_invitations', [
            'team_id' => $team->id,
            'user_id' => $invitee->id,
            'invited_by' => $lead->id,
            'status' => 'pending',
        ]);
    });

    test('workspace admin can invite to any team', function () {
        $admin = User::factory()->create();
        $admin->assignRole('workspace-admin');
        $team = Team::factory()->create();
        $invitee = User::factory()->create();

        $response = $this->actingAs($admin)->post(route('workspace.teams.invite', $team), [
            'user_id' => $invitee->id,
            'role' => WorkspaceRole::TeamMember->value,
        ]);

        $response->assertRedirect();

        $this->assertDatabaseHas('team_invitations', [
            'team_id' => $team->id,
            'user_id' => $invitee->id,
        ]);
    });

    test('team member cannot invite', function () {
        $team = Team::factory()->create();
        $member = User::factory()->create();
        $invitee = User::factory()->create();
        $team->addMember($member);

        $response = $this->actingAs($member)->post(route('workspace.teams.invite', $team), [
            'user_id' => $invitee->id,
            'role' => WorkspaceRole::TeamMember->value,
        ]);

        $response->assertForbidden();
    });
});

describe('Team Leave', function () {
    test('team member can leave a team', function () {
        $team = Team::factory()->create();
        $lead = User::factory()->create();
        $member = User::factory()->create();
        $team->addMember($lead, WorkspaceRole::TeamLead->value);
        $team->addMember($member);

        $response = $this->actingAs($member)->post(route('workspace.teams.leave', $team));

        $response->assertRedirect();
        expect($team->fresh()->isMember($member))->toBeFalse();
    });

    test('last lead cannot leave the team', function () {
        $team = Team::factory()->create();
        $lead = User::factory()->create();
        $team->addMember($lead, WorkspaceRole::TeamLead->value);

        $response = $this->actingAs($lead)->post(route('workspace.teams.leave', $team));

        $response->assertSessionHasErrors('team');
        expect($team->fresh()->isLead($lead))->toBeTrue();
    });

    test('lead can leave if there are other leads', function () {
        $team = Team::factory()->create();
        $lead1 = User::factory()->create();
        $lead2 = User::factory()->create();
        $team->addMember($lead1, WorkspaceRole::TeamLead->value);
        $team->addMember($lead2, WorkspaceRole::TeamLead->value);

        $response = $this->actingAs($lead1)->post(route('workspace.teams.leave', $team));

        $response->assertRedirect();
        expect($team->fresh()->isMember($lead1))->toBeFalse()
            ->and($team->fresh()->isLead($lead2))->toBeTrue();
    });
});

describe('Team Remove Member', function () {
    test('team lead can remove a member', function () {
        $team = Team::factory()->create();
        $lead = User::factory()->create();
        $member = User::factory()->create();
        $team->addMember($lead, WorkspaceRole::TeamLead->value);
        $team->addMember($member);

        $response = $this->actingAs($lead)->delete(route('workspace.teams.remove-member', [$team, $member]));

        $response->assertRedirect();
        expect($team->fresh()->isMember($member))->toBeFalse();
    });

    test('cannot remove self via remove endpoint', function () {
        $team = Team::factory()->create();
        $lead = User::factory()->create();
        $team->addMember($lead, WorkspaceRole::TeamLead->value);

        $response = $this->actingAs($lead)->delete(route('workspace.teams.remove-member', [$team, $lead]));

        $response->assertSessionHasErrors('member');
    });

    test('cannot remove last lead', function () {
        $team = Team::factory()->create();
        $lead = User::factory()->create();
        $anotherLead = User::factory()->create();
        $team->addMember($lead, WorkspaceRole::TeamLead->value);
        $team->addMember($anotherLead, WorkspaceRole::TeamLead->value);

        // First, demote anotherLead to member to make lead the only lead
        $team->demoteLead($anotherLead);

        $response = $this->actingAs($anotherLead)->delete(route('workspace.teams.remove-member', [$team, $lead]));

        $response->assertForbidden(); // anotherLead is no longer lead, can't remove
    });
});

describe('Team Promote Member', function () {
    test('team lead can promote a member', function () {
        $team = Team::factory()->create();
        $lead = User::factory()->create();
        $member = User::factory()->create();
        $team->addMember($lead, WorkspaceRole::TeamLead->value);
        $team->addMember($member);

        expect($team->isLead($member))->toBeFalse();

        $response = $this->actingAs($lead)->post(route('workspace.teams.promote-member', [$team, $member]));

        $response->assertRedirect();
        expect($team->fresh()->isLead($member))->toBeTrue();
    });

    test('cannot promote non-member', function () {
        $team = Team::factory()->create();
        $lead = User::factory()->create();
        $nonMember = User::factory()->create();
        $team->addMember($lead, WorkspaceRole::TeamLead->value);

        $response = $this->actingAs($lead)->post(route('workspace.teams.promote-member', [$team, $nonMember]));

        $response->assertSessionHasErrors('member');
    });

    test('cannot promote user who is already lead', function () {
        $team = Team::factory()->create();
        $lead1 = User::factory()->create();
        $lead2 = User::factory()->create();
        $team->addMember($lead1, WorkspaceRole::TeamLead->value);
        $team->addMember($lead2, WorkspaceRole::TeamLead->value);

        $response = $this->actingAs($lead1)->post(route('workspace.teams.promote-member', [$team, $lead2]));

        $response->assertSessionHasErrors('member');
    });
});

describe('Team Demote Member', function () {
    test('team lead can demote another lead', function () {
        $team = Team::factory()->create();
        $lead1 = User::factory()->create();
        $lead2 = User::factory()->create();
        $team->addMember($lead1, WorkspaceRole::TeamLead->value);
        $team->addMember($lead2, WorkspaceRole::TeamLead->value);

        $response = $this->actingAs($lead1)->post(route('workspace.teams.demote-member', [$team, $lead2]));

        $response->assertRedirect();
        expect($team->fresh()->isLead($lead2))->toBeFalse()
            ->and($team->fresh()->isMember($lead2))->toBeTrue();
    });

    test('cannot demote non-lead', function () {
        $team = Team::factory()->create();
        $lead = User::factory()->create();
        $member = User::factory()->create();
        $team->addMember($lead, WorkspaceRole::TeamLead->value);
        $team->addMember($member);

        $response = $this->actingAs($lead)->post(route('workspace.teams.demote-member', [$team, $member]));

        $response->assertSessionHasErrors('member');
    });

    test('cannot demote last lead', function () {
        $team = Team::factory()->create();
        $lead = User::factory()->create();
        $anotherLead = User::factory()->create();
        $team->addMember($lead, WorkspaceRole::TeamLead->value);
        $team->addMember($anotherLead, WorkspaceRole::TeamLead->value);

        // Demote anotherLead so lead is the only one
        $this->actingAs($lead)->post(route('workspace.teams.demote-member', [$team, $anotherLead]));

        // Now try to demote the last lead
        $response = $this->actingAs($anotherLead)->post(route('workspace.teams.demote-member', [$team, $lead]));

        $response->assertForbidden(); // anotherLead is no longer lead
    });
});

describe('Team Invitation Accept/Decline', function () {
    test('user can accept a pending invitation', function () {
        $team = Team::factory()->create();
        $user = User::factory()->create();
        $inviter = User::factory()->create();
        $team->addMember($inviter, WorkspaceRole::TeamLead->value);
        // Add user to another team to have workspace access
        $otherTeam = Team::factory()->create();
        $otherTeam->addMember($user);

        $invitation = TeamInvitation::factory()
            ->for($team)
            ->for($user)
            ->for($inviter, 'inviter')
            ->asMember()
            ->pending()
            ->neverExpires()
            ->create();

        $response = $this->actingAs($user)->post(route('workspace.team-invitations.accept', $invitation));

        $response->assertRedirect();
        expect($invitation->fresh()->status)->toBe('accepted')
            ->and($team->fresh()->isMember($user))->toBeTrue();
    });

    test('user can decline a pending invitation', function () {
        $team = Team::factory()->create();
        $user = User::factory()->create();
        $inviter = User::factory()->create();
        $team->addMember($inviter, WorkspaceRole::TeamLead->value);
        // Add user to another team to have workspace access
        $otherTeam = Team::factory()->create();
        $otherTeam->addMember($user);

        $invitation = TeamInvitation::factory()
            ->for($team)
            ->for($user)
            ->for($inviter, 'inviter')
            ->pending()
            ->neverExpires()
            ->create();

        $response = $this->actingAs($user)->post(route('workspace.team-invitations.decline', $invitation));

        $response->assertRedirect();
        expect($invitation->fresh()->status)->toBe('declined')
            ->and($team->fresh()->isMember($user))->toBeFalse();
    });
});
