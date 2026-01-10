<?php

use App\Models\User;
use App\Modules\Workspace\Enums\WorkspaceRole;
use App\Modules\Workspace\Models\Issue;
use App\Modules\Workspace\Models\IssueLabel;
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

    $this->todoStatus = IssueStatus::factory()->todo()->create();
    $this->inProgressStatus = IssueStatus::factory()->inProgress()->create();
    $this->completedStatus = IssueStatus::factory()->completed()->create();

    $this->lowPriority = IssuePriority::factory()->low()->create();
    $this->mediumPriority = IssuePriority::factory()->medium()->create();
    $this->highPriority = IssuePriority::factory()->high()->create();

    $this->bugLabel = IssueLabel::factory()->bug()->create();
    $this->featureLabel = IssueLabel::factory()->feature()->create();
});

describe('Issue Model', function () {
    test('issue belongs to a team', function () {
        $team = Team::factory()->create();
        $issue = Issue::factory()->for($team)->create();

        expect($issue->team->id)->toBe($team->id);
    });

    test('issue belongs to a status', function () {
        $issue = Issue::factory()->create([
            'status_id' => $this->todoStatus->id,
        ]);

        expect($issue->status->id)->toBe($this->todoStatus->id);
    });

    test('issue belongs to a priority', function () {
        $issue = Issue::factory()->create([
            'priority_id' => $this->mediumPriority->id,
        ]);

        expect($issue->priority->id)->toBe($this->mediumPriority->id);
    });

    test('issue can have an assignee', function () {
        $user = User::factory()->create();
        $issue = Issue::factory()->create([
            'assignee_id' => $user->id,
        ]);

        expect($issue->assignee->id)->toBe($user->id);
    });

    test('issue has a creator', function () {
        $user = User::factory()->create();
        $issue = Issue::factory()->create([
            'creator_id' => $user->id,
        ]);

        expect($issue->creator->id)->toBe($user->id);
    });

    test('issue can have labels', function () {
        $issue = Issue::factory()->create();
        $issue->labels()->attach([$this->bugLabel->id, $this->featureLabel->id]);

        expect($issue->labels)->toHaveCount(2)
            ->and($issue->labels->pluck('id')->toArray())
            ->toContain($this->bugLabel->id, $this->featureLabel->id);
    });

    test('issue can have comments', function () {
        $team = Team::factory()->create();
        $user = User::factory()->create();
        $team->addMember($user);

        $issue = Issue::factory()->for($team)->create();

        \App\Modules\Workspace\Models\IssueComment::factory()
            ->for($issue)
            ->for($user)
            ->count(3)
            ->create();

        expect($issue->comments)->toHaveCount(3);
    });

    test('issue can have activities', function () {
        $team = Team::factory()->create();
        $user = User::factory()->create();
        $team->addMember($user);
        $issue = Issue::factory()->for($team)->create(['creator_id' => $user->id]);

        \App\Modules\Workspace\Models\IssueActivity::factory()
            ->for($issue)
            ->for($user)
            ->count(5)
            ->create();

        expect($issue->activities)->toHaveCount(5);
    });

    test('issue can have subscriptions', function () {
        $team = Team::factory()->create();
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
        $team->addMember($user1);
        $team->addMember($user2);

        $issue = Issue::factory()->for($team)->create();

        IssueSubscription::create([
            'issue_id' => $issue->id,
            'user_id' => $user1->id,
            'created_at' => now(),
        ]);
        IssueSubscription::create([
            'issue_id' => $issue->id,
            'user_id' => $user2->id,
            'created_at' => now(),
        ]);

        expect($issue->subscriptions)->toHaveCount(2)
            ->and($issue->subscribers)->toHaveCount(2);
    });

    test('isSubscribed returns true for subscribed users', function () {
        $team = Team::factory()->create();
        $user = User::factory()->create();
        $team->addMember($user);

        $issue = Issue::factory()->for($team)->create();

        IssueSubscription::create([
            'issue_id' => $issue->id,
            'user_id' => $user->id,
            'created_at' => now(),
        ]);

        expect($issue->isSubscribed($user))->toBeTrue();
    });

    test('isSubscribed returns false for non-subscribed users', function () {
        $team = Team::factory()->create();
        $user = User::factory()->create();

        $issue = Issue::factory()->for($team)->create();

        expect($issue->isSubscribed($user))->toBeFalse();
    });

    test('generateIdentifier creates sequential identifiers', function () {
        $team = Team::factory()->create();

        $issue1 = Issue::factory()->for($team)->create([
            'identifier' => Issue::generateIdentifier(),
        ]);

        $issue2 = Issue::factory()->for($team)->create([
            'identifier' => Issue::generateIdentifier(),
        ]);

        expect($issue1->identifier)->not->toBe($issue2->identifier);
    });

    test('withFullRelations scope loads all common relations', function () {
        $team = Team::factory()->create();
        $user = User::factory()->create();
        $team->addMember($user);

        $issue = Issue::factory()->for($team)->create([
            'assignee_id' => $user->id,
            'creator_id' => $user->id,
        ]);
        $issue->labels()->attach($this->bugLabel);

        $loadedIssue = Issue::withFullRelations()->find($issue->id);

        expect($loadedIssue->relationLoaded('status'))->toBeTrue()
            ->and($loadedIssue->relationLoaded('priority'))->toBeTrue()
            ->and($loadedIssue->relationLoaded('labels'))->toBeTrue()
            ->and($loadedIssue->relationLoaded('creator'))->toBeTrue()
            ->and($loadedIssue->relationLoaded('team'))->toBeTrue()
            ->and($loadedIssue->relationLoaded('assignee'))->toBeTrue();
    });

    test('due_date is cast to datetime', function () {
        $issue = Issue::factory()->create([
            'due_date' => '2025-12-31',
        ]);

        expect($issue->due_date)->toBeInstanceOf(\Carbon\Carbon::class);
    });
});

describe('Issue Controller', function () {
    test('team member can view an issue', function () {
        $team = Team::factory()->create();
        $user = User::factory()->create();
        $team->addMember($user);

        $issue = Issue::factory()->for($team)->create();

        $response = $this->actingAs($user)->get(route('workspace.issues.show', $issue->identifier));

        $response->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('workspace/issues/show')
                ->has('issue')
                ->has('statuses')
                ->has('priorities')
                ->has('labels')
            );
    });

    test('non-team member cannot view an issue', function () {
        $team = Team::factory()->create();
        $user = User::factory()->create();
        // User is NOT added to team

        $issue = Issue::factory()->for($team)->create();

        $response = $this->actingAs($user)->get(route('workspace.issues.show', $issue->identifier));

        $response->assertForbidden();
    });

    test('workspace admin can view any issue', function () {
        $team = Team::factory()->create();
        $admin = User::factory()->create();
        $admin->assignRole('workspace-admin');

        $issue = Issue::factory()->for($team)->create();

        $response = $this->actingAs($admin)->get(route('workspace.issues.show', $issue->identifier));

        $response->assertOk();
    });

    test('team member can create an issue', function () {
        $team = Team::factory()->create();
        $user = User::factory()->create();
        $team->addMember($user);

        $response = $this->actingAs($user)->post(route('workspace.issues.store'), [
            'title' => 'Test Issue Title',
            'description' => 'Test issue description',
            'team_id' => $team->id,
            'status_id' => $this->todoStatus->id,
            'priority_id' => $this->mediumPriority->id,
        ]);

        $response->assertRedirect();

        $this->assertDatabaseHas('issues', [
            'title' => 'Test Issue Title',
            'team_id' => $team->id,
            'creator_id' => $user->id,
        ]);
    });

    test('issue creation requires title', function () {
        $team = Team::factory()->create();
        $user = User::factory()->create();
        $team->addMember($user);

        $response = $this->actingAs($user)->post(route('workspace.issues.store'), [
            'description' => 'Test issue description',
            'team_id' => $team->id,
            'status_id' => $this->todoStatus->id,
            'priority_id' => $this->mediumPriority->id,
        ]);

        $response->assertSessionHasErrors('title');
    });

    test('issue creation requires minimum title length', function () {
        $team = Team::factory()->create();
        $user = User::factory()->create();
        $team->addMember($user);

        $response = $this->actingAs($user)->post(route('workspace.issues.store'), [
            'title' => 'AB',
            'team_id' => $team->id,
            'status_id' => $this->todoStatus->id,
            'priority_id' => $this->mediumPriority->id,
        ]);

        $response->assertSessionHasErrors('title');
    });

    test('issue creation requires valid status', function () {
        $team = Team::factory()->create();
        $user = User::factory()->create();
        $team->addMember($user);

        $response = $this->actingAs($user)->post(route('workspace.issues.store'), [
            'title' => 'Test Issue Title',
            'team_id' => $team->id,
            'status_id' => 9999,
            'priority_id' => $this->mediumPriority->id,
        ]);

        $response->assertSessionHasErrors('status_id');
    });

    test('issue creation requires valid priority', function () {
        $team = Team::factory()->create();
        $user = User::factory()->create();
        $team->addMember($user);

        $response = $this->actingAs($user)->post(route('workspace.issues.store'), [
            'title' => 'Test Issue Title',
            'team_id' => $team->id,
            'status_id' => $this->todoStatus->id,
            'priority_id' => 9999,
        ]);

        $response->assertSessionHasErrors('priority_id');
    });

    test('issue can be created with labels', function () {
        $team = Team::factory()->create();
        $user = User::factory()->create();
        $team->addMember($user);

        $response = $this->actingAs($user)->post(route('workspace.issues.store'), [
            'title' => 'Test Issue With Labels',
            'team_id' => $team->id,
            'status_id' => $this->todoStatus->id,
            'priority_id' => $this->mediumPriority->id,
            'label_ids' => [$this->bugLabel->id, $this->featureLabel->id],
        ]);

        $response->assertRedirect();

        $issue = Issue::where('title', 'Test Issue With Labels')->first();
        expect($issue->labels)->toHaveCount(2);
    });

    test('issue assignee must be team member', function () {
        $team = Team::factory()->create();
        $user = User::factory()->create();
        $nonMember = User::factory()->create();
        $team->addMember($user);

        $response = $this->actingAs($user)->post(route('workspace.issues.store'), [
            'title' => 'Test Issue With Invalid Assignee',
            'team_id' => $team->id,
            'status_id' => $this->todoStatus->id,
            'priority_id' => $this->mediumPriority->id,
            'assignee_id' => $nonMember->id,
        ]);

        $response->assertSessionHasErrors('assignee_id');
    });

    test('team member can update an issue', function () {
        $team = Team::factory()->create();
        $user = User::factory()->create();
        $team->addMember($user);

        $issue = Issue::factory()->for($team)->create([
            'title' => 'Original Title',
        ]);

        $response = $this->actingAs($user)->patch(route('workspace.issues.update', $issue), [
            'title' => 'Updated Title',
            'description' => 'Updated description',
            'status_id' => $this->inProgressStatus->id,
            'priority_id' => $this->highPriority->id,
            'team_id' => $team->id,
            'assignee_id' => null,
            'due_date' => null,
        ]);

        $response->assertRedirect();

        expect($issue->fresh()->title)->toBe('Updated Title')
            ->and($issue->fresh()->status_id)->toBe($this->inProgressStatus->id)
            ->and($issue->fresh()->priority_id)->toBe($this->highPriority->id);
    });

    test('team member can update issue status', function () {
        $team = Team::factory()->create();
        $user = User::factory()->create();
        $team->addMember($user);

        $issue = Issue::factory()->for($team)->create([
            'status_id' => $this->todoStatus->id,
        ]);

        $response = $this->actingAs($user)->patch(route('workspace.issues.update-status', $issue), [
            'status_id' => $this->inProgressStatus->id,
        ]);

        $response->assertRedirect();
        expect($issue->fresh()->status_id)->toBe($this->inProgressStatus->id);
    });

    test('team member can update issue priority', function () {
        $team = Team::factory()->create();
        $user = User::factory()->create();
        $team->addMember($user);

        $issue = Issue::factory()->for($team)->create([
            'priority_id' => $this->lowPriority->id,
        ]);

        $response = $this->actingAs($user)->patch(route('workspace.issues.update-priority', $issue), [
            'priority_id' => $this->highPriority->id,
        ]);

        $response->assertRedirect();
        expect($issue->fresh()->priority_id)->toBe($this->highPriority->id);
    });

    test('team member can update issue assignee', function () {
        $team = Team::factory()->create();
        $user = User::factory()->create();
        $assignee = User::factory()->create();
        $team->addMember($user);
        $team->addMember($assignee);

        $issue = Issue::factory()->for($team)->create([
            'assignee_id' => null,
        ]);

        $response = $this->actingAs($user)->patch(route('workspace.issues.update-assignee', $issue), [
            'assignee_id' => $assignee->id,
        ]);

        $response->assertRedirect();
        expect($issue->fresh()->assignee_id)->toBe($assignee->id);
    });

    test('team member can toggle issue label', function () {
        $team = Team::factory()->create();
        $user = User::factory()->create();
        $team->addMember($user);

        $issue = Issue::factory()->for($team)->create();

        // Add label
        $response = $this->actingAs($user)->patch(route('workspace.issues.update-label', $issue), [
            'label_id' => $this->bugLabel->id,
        ]);

        $response->assertRedirect();
        expect($issue->fresh()->labels->pluck('id')->toArray())->toContain($this->bugLabel->id);

        // Remove label
        $response = $this->actingAs($user)->patch(route('workspace.issues.update-label', $issue), [
            'label_id' => $this->bugLabel->id,
        ]);

        $response->assertRedirect();
        expect($issue->fresh()->labels->pluck('id')->toArray())->not->toContain($this->bugLabel->id);
    });

    test('team member can update issue due date', function () {
        $team = Team::factory()->create();
        $user = User::factory()->create();
        $team->addMember($user);

        $issue = Issue::factory()->for($team)->create([
            'due_date' => null,
        ]);

        $dueDate = now()->addDays(7)->format('Y-m-d');

        $response = $this->actingAs($user)->patch(route('workspace.issues.update-due-date', $issue), [
            'due_date' => $dueDate,
        ]);

        $response->assertRedirect();
        expect($issue->fresh()->due_date->format('Y-m-d'))->toBe($dueDate);
    });

    test('due date must be today or in the future', function () {
        $team = Team::factory()->create();
        $user = User::factory()->create();
        $team->addMember($user);

        $issue = Issue::factory()->for($team)->create();

        $pastDate = now()->subDays(7)->format('Y-m-d');

        $response = $this->actingAs($user)->patch(route('workspace.issues.update-due-date', $issue), [
            'due_date' => $pastDate,
        ]);

        $response->assertSessionHasErrors('due_date');
    });

    test('team lead can delete an issue', function () {
        $team = Team::factory()->create();
        $lead = User::factory()->create();
        $team->addMember($lead, WorkspaceRole::TeamLead->value);

        $issue = Issue::factory()->for($team)->create();
        $issueId = $issue->id;

        $response = $this->actingAs($lead)->delete(route('workspace.issues.destroy', $issue));

        $response->assertRedirect();
        expect(Issue::find($issueId))->toBeNull();
    });

    test('regular team member cannot delete an issue', function () {
        $team = Team::factory()->create();
        $member = User::factory()->create();
        $team->addMember($member);

        $issue = Issue::factory()->for($team)->create();

        $response = $this->actingAs($member)->delete(route('workspace.issues.destroy', $issue));

        $response->assertForbidden();
    });

    test('workspace admin can delete any issue', function () {
        $team = Team::factory()->create();
        $admin = User::factory()->create();
        $admin->assignRole('workspace-admin');

        $issue = Issue::factory()->for($team)->create();
        $issueId = $issue->id;

        $response = $this->actingAs($admin)->delete(route('workspace.issues.destroy', $issue));

        $response->assertRedirect();
        expect(Issue::find($issueId))->toBeNull();
    });

    test('team member can subscribe to an issue', function () {
        $team = Team::factory()->create();
        $user = User::factory()->create();
        $team->addMember($user);

        $issue = Issue::factory()->for($team)->create();

        $response = $this->actingAs($user)->post(route('workspace.issues.subscribe', $issue));

        $response->assertRedirect();
        expect($issue->fresh()->isSubscribed($user))->toBeTrue();
    });

    test('team member can unsubscribe from an issue', function () {
        $team = Team::factory()->create();
        $user = User::factory()->create();
        $team->addMember($user);

        $issue = Issue::factory()->for($team)->create();

        IssueSubscription::create([
            'issue_id' => $issue->id,
            'user_id' => $user->id,
            'created_at' => now(),
        ]);

        expect($issue->isSubscribed($user))->toBeTrue();

        $response = $this->actingAs($user)->delete(route('workspace.issues.unsubscribe', $issue));

        $response->assertRedirect();
        expect($issue->fresh()->isSubscribed($user))->toBeFalse();
    });
});
