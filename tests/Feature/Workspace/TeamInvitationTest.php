<?php

use App\Models\User;
use App\Modules\Workspace\Models\Team;
use App\Modules\Workspace\Models\TeamInvitation;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    if (!config('swell.workspace.enabled')) {
        $this->markTestSkipped('La fonctionnalité workspace est désactivée.');
        return;
    }
    
    $this->seed(\Database\Seeders\RoleSeeder::class);
});

test('a user can accept a pending invitation', function () {
    $team = Team::factory()->create();
    $user = User::factory()->create();
    $inviter = User::factory()->create();

    $invitation = TeamInvitation::factory()
        ->for($team)
        ->for($user)
        ->for($inviter, 'inviter')
        ->asMember()
        ->pending()
        ->create();

    $invitation->accept();

    expect($invitation->fresh()->status)->toBe('accepted')
        ->and($team->fresh()->members->contains($user))->toBeTrue()
        ->and($team->fresh()->members->first()->pivot->role)->toBe('team-member');
});

test('accepting a team-lead invitation adds user as team-lead', function () {
    $team = Team::factory()->create();
    $user = User::factory()->create();
    $inviter = User::factory()->create();

    $invitation = TeamInvitation::factory()
        ->for($team)
        ->for($user)
        ->for($inviter, 'inviter')
        ->asLead()
        ->pending()
        ->create();

    $invitation->accept();

    expect($invitation->fresh()->status)->toBe('accepted')
        ->and($team->fresh()->members->contains($user))->toBeTrue()
        ->and($team->fresh()->members->first()->pivot->role)->toBe('team-lead');
});

test('a user can decline a pending invitation', function () {
    $team = Team::factory()->create();
    $user = User::factory()->create();
    $inviter = User::factory()->create();

    $invitation = TeamInvitation::factory()
        ->for($team)
        ->for($user)
        ->for($inviter, 'inviter')
        ->pending()
        ->create();

    $invitation->decline();

    expect($invitation->fresh()->status)->toBe('declined')
        ->and($team->fresh()->members->contains($user))->toBeFalse();
});

test('expired invitations cannot be accepted', function () {
    $team = Team::factory()->create();
    $user = User::factory()->create();
    $inviter = User::factory()->create();

    $invitation = TeamInvitation::factory()
        ->for($team)
        ->for($user)
        ->for($inviter, 'inviter')
        ->expired()
        ->pending()
        ->create();

    expect(fn () => $invitation->accept())
        ->toThrow(Exception::class, 'Cette invitation a expiré');
});

test('accepted invitations cannot be re-accepted', function () {
    $team = Team::factory()->create();
    $user = User::factory()->create();
    $inviter = User::factory()->create();

    $invitation = TeamInvitation::factory()
        ->for($team)
        ->for($user)
        ->for($inviter, 'inviter')
        ->accepted()
        ->create();

    expect(fn () => $invitation->accept())
        ->toThrow(Exception::class, 'Cette invitation a déjà été traitée');
});

test('declined invitations cannot be re-declined', function () {
    $team = Team::factory()->create();
    $user = User::factory()->create();
    $inviter = User::factory()->create();

    $invitation = TeamInvitation::factory()
        ->for($team)
        ->for($user)
        ->for($inviter, 'inviter')
        ->declined()
        ->create();

    expect(fn () => $invitation->decline())
        ->toThrow(Exception::class, 'Cette invitation a déjà été traitée');
});

test('pending scope returns only pending invitations', function () {
    $team = Team::factory()->create();
    $user = User::factory()->create();
    $inviter = User::factory()->create();

    TeamInvitation::factory()
        ->for($team)
        ->for($user)
        ->for($inviter, 'inviter')
        ->pending()
        ->create();

    TeamInvitation::factory()
        ->for($team)
        ->for($user)
        ->for($inviter, 'inviter')
        ->accepted()
        ->create();

    TeamInvitation::factory()
        ->for($team)
        ->for($user)
        ->for($inviter, 'inviter')
        ->declined()
        ->create();

    expect(TeamInvitation::pending()->count())->toBe(1)
        ->and(TeamInvitation::pending()->first()->status)->toBe('pending');
});

test('notExpired scope returns non-expired invitations', function () {
    $team = Team::factory()->create();
    $user = User::factory()->create();
    $inviter = User::factory()->create();

    TeamInvitation::factory()
        ->for($team)
        ->for($user)
        ->for($inviter, 'inviter')
        ->neverExpires()
        ->create();

    TeamInvitation::factory()
        ->for($team)
        ->for($user)
        ->for($inviter, 'inviter')
        ->expired()
        ->create();

    expect(TeamInvitation::notExpired()->count())->toBe(1)
        ->and(TeamInvitation::notExpired()->first()->expires_at)->toBeNull();
});

test('forUser scope returns invitations for a specific user', function () {
    $team = Team::factory()->create();
    $user1 = User::factory()->create();
    $user2 = User::factory()->create();
    $inviter = User::factory()->create();

    TeamInvitation::factory()
        ->for($team)
        ->for($user1)
        ->for($inviter, 'inviter')
        ->create();

    TeamInvitation::factory()
        ->for($team)
        ->for($user2)
        ->for($inviter, 'inviter')
        ->create();

    expect(TeamInvitation::forUser($user1)->count())->toBe(1)
        ->and(TeamInvitation::forUser($user1)->first()->user_id)->toBe($user1->id);
});

test('forTeam scope returns invitations for a specific team', function () {
    $team1 = Team::factory()->create();
    $team2 = Team::factory()->create();
    $user = User::factory()->create();
    $inviter = User::factory()->create();

    TeamInvitation::factory()
        ->for($team1)
        ->for($user)
        ->for($inviter, 'inviter')
        ->create();

    TeamInvitation::factory()
        ->for($team2)
        ->for($user)
        ->for($inviter, 'inviter')
        ->create();

    expect(TeamInvitation::forTeam($team1)->count())->toBe(1)
        ->and(TeamInvitation::forTeam($team1)->first()->team_id)->toBe($team1->id);
});

test('isPending helper method works correctly', function () {
    $invitation = TeamInvitation::factory()->pending()->make();
    expect($invitation->isPending())->toBeTrue();

    $invitation = TeamInvitation::factory()->accepted()->make();
    expect($invitation->isPending())->toBeFalse();
});

test('isExpired helper method works correctly', function () {
    $invitation = TeamInvitation::factory()->expired()->make();
    expect($invitation->isExpired())->toBeTrue();

    $invitation = TeamInvitation::factory()->neverExpires()->make();
    expect($invitation->isExpired())->toBeFalse();
});
