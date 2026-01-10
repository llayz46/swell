<?php

use App\Models\User;
use App\Modules\Workspace\Actions\RemoveTeamMember;
use App\Modules\Workspace\Models\Issue;
use App\Modules\Workspace\Models\Team;

beforeEach(function () {
    if (!config('swell.workspace.enabled')) {
        $this->markTestSkipped('La fonctionnalité workspace est désactivée.');
        return;
    }
});

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

    // L'utilisateur est ajouté comme membre de la team (pas besoin de rôle Spatie)
    $team->addMember($user);

    $issue = Issue::factory()->create([
        'team_id' => $team->id,
        'assignee_id' => $user->id,
    ]);

    expect($team->isMember($user))->toBeTrue();

    $this->actingAs($user)
        ->post(route('workspace.teams.leave', $team))
        ->assertRedirect(route('workspace.my-issues.overview'));

    expect($team->fresh()->isMember($user))->toBeFalse();
    expect($issue->fresh()->assignee_id)->toBeNull();
});

test('the last lead cannot leave the team', function () {
    $team = Team::factory()->create();
    $lead = User::factory()->create();

    // Le lead est ajouté via le pivot avec le rôle team-lead (pas besoin de rôle Spatie)
    $team->addMember($lead, 'team-lead');

    expect($team->isLead($lead))->toBeTrue();
    expect($team->leads()->count())->toBe(1);

    $this->actingAs($lead)
        ->post(route('workspace.teams.leave', $team))
        ->assertSessionHasErrors('team');

    expect($team->fresh()->isLead($lead))->toBeTrue();
});

test('a lead can leave if there are other leads', function () {
    $team = Team::factory()->create();
    $lead1 = User::factory()->create();
    $lead2 = User::factory()->create();

    // Les leads sont ajoutés via le pivot avec le rôle team-lead (pas besoin de rôle Spatie)
    $team->addMember($lead1, 'team-lead');
    $team->addMember($lead2, 'team-lead');

    expect($team->leads()->count())->toBe(2);

    $this->actingAs($lead1)
        ->post(route('workspace.teams.leave', $team))
        ->assertRedirect(route('workspace.my-issues.overview'));

    expect($team->fresh()->isMember($lead1))->toBeFalse();

    expect($team->fresh()->isLead($lead2))->toBeTrue();
    expect($team->fresh()->leads()->count())->toBe(1);
});
