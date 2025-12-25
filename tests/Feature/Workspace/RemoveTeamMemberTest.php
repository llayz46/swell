<?php

use App\Models\User;
use App\Modules\Workspace\Actions\RemoveTeamMember;
use App\Modules\Workspace\Models\Issue;
use App\Modules\Workspace\Models\Team;

test('removing a team member unassigns their issues', function () {
    $team = Team::factory()->create();
    $member = User::factory()->create();
    $team->addMember($member);

    $issue1 = Issue::factory()->create([
        'team_id' => $team->id,
        'assignee_id' => $member->id,
    ]);

    $issue2 = Issue::factory()->create([
        'team_id' => $team->id,
        'assignee_id' => $member->id,
    ]);

    $otherMember = User::factory()->create();
    $team->addMember($otherMember);
    $issue3 = Issue::factory()->create([
        'team_id' => $team->id,
        'assignee_id' => $otherMember->id,
    ]);

    app(RemoveTeamMember::class)->handle($team, $member);

    expect($team->isMember($member))->toBeFalse();

    expect($issue1->fresh()->assignee_id)->toBeNull();
    expect($issue2->fresh()->assignee_id)->toBeNull();

    expect($issue3->fresh()->assignee_id)->toBe($otherMember->id);
});

test('removing a team member via model method unassigns their issues', function () {
    $team = Team::factory()->create();
    $member = User::factory()->create();
    $team->addMember($member);

    $issue = Issue::factory()->create([
        'team_id' => $team->id,
        'assignee_id' => $member->id,
    ]);

    $team->removeMember($member);

    expect($team->isMember($member))->toBeFalse();
    expect($issue->fresh()->assignee_id)->toBeNull();
});

test('leaving a team unassigns user issues', function () {
    $team = Team::factory()->create();
    $user = User::factory()->create();

    \Spatie\Permission\Models\Role::firstOrCreate(['name' => 'team-member']);
    $user->assignRole('team-member');

    $team->addMember($user);

    $issue = Issue::factory()->create([
        'team_id' => $team->id,
        'assignee_id' => $user->id,
    ]);

    expect($team->isMember($user))->toBeTrue();

    $this->actingAs($user)
        ->post(route('workspace.teams.leave', $team))
        ->assertRedirect(route('workspace.index'));

    expect($team->fresh()->isMember($user))->toBeFalse();
    expect($issue->fresh()->assignee_id)->toBeNull();
});
