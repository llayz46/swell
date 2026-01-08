<?php

use App\Models\User;
use App\Modules\Workspace\Models\InboxItem;
use App\Modules\Workspace\Models\Issue;
use App\Modules\Workspace\Models\IssuePriority;
use App\Modules\Workspace\Models\IssueStatus;
use App\Modules\Workspace\Models\Team;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed(\Database\Seeders\RoleSeeder::class);

    Role::create(['name' => 'workspace-admin']);

    IssueStatus::factory()->create(['slug' => 'todo', 'name' => 'A faire']);
    IssuePriority::factory()->create(['slug' => 'medium', 'name' => 'Moyenne']);
});

test('user can view their inbox', function () {
    $user = User::factory()->create();
    $user->assignRole('workspace-admin');

    $team = Team::factory()->create();
    $team->members()->attach($user, ['role' => 'team-lead']);

    $issue = Issue::factory()->for($team)->create();
    $actor = User::factory()->create();

    InboxItem::factory()
        ->for($user)
        ->for($issue)
        ->for($actor, 'actor')
        ->unread()
        ->create();

    $response = $this->actingAs($user)->get(route('workspace.inbox.index'));

    $response->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('workspace/inbox/index')
            ->has('items', 1)
        );
});

test('user can mark an inbox item as read', function () {
    $user = User::factory()->create();
    $user->assignRole('workspace-admin');

    $team = Team::factory()->create();
    $team->members()->attach($user, ['role' => 'team-lead']);

    $issue = Issue::factory()->for($team)->create();
    $actor = User::factory()->create();

    $inboxItem = InboxItem::factory()
        ->for($user)
        ->for($issue)
        ->for($actor, 'actor')
        ->unread()
        ->create();

    $response = $this->actingAs($user)->patch(route('workspace.inbox.read', $inboxItem));

    $response->assertRedirect();
    expect($inboxItem->fresh()->read)->toBeTrue()
        ->and($inboxItem->fresh()->read_at)->not->toBeNull();
});

test('user can mark an inbox item as unread', function () {
    $user = User::factory()->create();
    $user->assignRole('workspace-admin');

    $team = Team::factory()->create();
    $team->members()->attach($user, ['role' => 'team-lead']);

    $issue = Issue::factory()->for($team)->create();
    $actor = User::factory()->create();

    $inboxItem = InboxItem::factory()
        ->for($user)
        ->for($issue)
        ->for($actor, 'actor')
        ->read()
        ->create();

    $response = $this->actingAs($user)->patch(route('workspace.inbox.unread', $inboxItem));

    $response->assertRedirect();
    expect($inboxItem->fresh()->read)->toBeFalse()
        ->and($inboxItem->fresh()->read_at)->toBeNull();
});

test('user can mark all inbox items as read', function () {
    $user = User::factory()->create();
    $user->assignRole('workspace-admin');

    $team = Team::factory()->create();
    $team->members()->attach($user, ['role' => 'team-lead']);

    $issue = Issue::factory()->for($team)->create();
    $actor = User::factory()->create();

    InboxItem::factory()
        ->for($user)
        ->for($issue)
        ->for($actor, 'actor')
        ->unread()
        ->count(3)
        ->create();

    $response = $this->actingAs($user)->post(route('workspace.inbox.read-all'));

    $response->assertRedirect();
    expect(InboxItem::where('user_id', $user->id)->where('read', false)->count())->toBe(0);
});

test('user can snooze an inbox item', function () {
    $user = User::factory()->create();
    $user->assignRole('workspace-admin');

    $team = Team::factory()->create();
    $team->members()->attach($user, ['role' => 'team-lead']);

    $issue = Issue::factory()->for($team)->create();
    $actor = User::factory()->create();

    $inboxItem = InboxItem::factory()
        ->for($user)
        ->for($issue)
        ->for($actor, 'actor')
        ->create();

    $snoozedUntil = now()->addHours(2);

    $response = $this->actingAs($user)->patch(route('workspace.inbox.snooze', $inboxItem), [
        'until' => $snoozedUntil->toISOString(),
    ]);

    $response->assertRedirect();
    expect($inboxItem->fresh()->snoozed_until)->not->toBeNull()
        ->and($inboxItem->fresh()->isSnoozed())->toBeTrue();
});

test('user can delete an inbox item', function () {
    $user = User::factory()->create();
    $user->assignRole('workspace-admin');

    $team = Team::factory()->create();
    $team->members()->attach($user, ['role' => 'team-lead']);

    $issue = Issue::factory()->for($team)->create();
    $actor = User::factory()->create();

    $inboxItem = InboxItem::factory()
        ->for($user)
        ->for($issue)
        ->for($actor, 'actor')
        ->create();

    $response = $this->actingAs($user)->delete(route('workspace.inbox.destroy', $inboxItem));

    $response->assertRedirect();
    expect(InboxItem::find($inboxItem->id))->toBeNull();
});

test('user cannot access another user inbox item', function () {
    $user = User::factory()->create();
    $user->assignRole('workspace-admin');

    $otherUser = User::factory()->create();

    $team = Team::factory()->create();
    $team->members()->attach($user, ['role' => 'team-lead']);

    $issue = Issue::factory()->for($team)->create();
    $actor = User::factory()->create();

    $inboxItem = InboxItem::factory()
        ->for($otherUser)
        ->for($issue)
        ->for($actor, 'actor')
        ->create();

    $response = $this->actingAs($user)->patch(route('workspace.inbox.read', $inboxItem));

    $response->assertForbidden();
});

test('user can delete all inbox items', function () {
    $user = User::factory()->create();
    $user->assignRole('workspace-admin');

    $team = Team::factory()->create();
    $team->members()->attach($user, ['role' => 'team-lead']);

    $issue = Issue::factory()->for($team)->create();
    $actor = User::factory()->create();

    InboxItem::factory()
        ->for($user)
        ->for($issue)
        ->for($actor, 'actor')
        ->count(5)
        ->create();

    $response = $this->actingAs($user)->delete(route('workspace.inbox.destroy-all'));

    $response->assertRedirect();
    expect(InboxItem::where('user_id', $user->id)->count())->toBe(0);
});

test('user can delete all read inbox items', function () {
    $user = User::factory()->create();
    $user->assignRole('workspace-admin');

    $team = Team::factory()->create();
    $team->members()->attach($user, ['role' => 'team-lead']);

    $issue = Issue::factory()->for($team)->create();
    $actor = User::factory()->create();

    InboxItem::factory()
        ->for($user)
        ->for($issue)
        ->for($actor, 'actor')
        ->read()
        ->count(3)
        ->create();

    InboxItem::factory()
        ->for($user)
        ->for($issue)
        ->for($actor, 'actor')
        ->unread()
        ->count(2)
        ->create();

    $response = $this->actingAs($user)->delete(route('workspace.inbox.destroy-read'));

    $response->assertRedirect();
    expect(InboxItem::where('user_id', $user->id)->count())->toBe(2)
        ->and(InboxItem::where('user_id', $user->id)->where('read', false)->count())->toBe(2);
});

test('inbox item model can mark as read', function () {
    $user = User::factory()->create();
    $team = Team::factory()->create();
    $issue = Issue::factory()->for($team)->create();
    $actor = User::factory()->create();

    $inboxItem = InboxItem::factory()
        ->for($user)
        ->for($issue)
        ->for($actor, 'actor')
        ->unread()
        ->create();

    $inboxItem->markAsRead();

    expect($inboxItem->read)->toBeTrue()
        ->and($inboxItem->read_at)->not->toBeNull();
});

test('inbox item model can mark as unread', function () {
    $user = User::factory()->create();
    $team = Team::factory()->create();
    $issue = Issue::factory()->for($team)->create();
    $actor = User::factory()->create();

    $inboxItem = InboxItem::factory()
        ->for($user)
        ->for($issue)
        ->for($actor, 'actor')
        ->read()
        ->create();

    $inboxItem->markAsUnread();

    expect($inboxItem->read)->toBeFalse()
        ->and($inboxItem->read_at)->toBeNull();
});

test('inbox item model can snooze and unsnooze', function () {
    $user = User::factory()->create();
    $team = Team::factory()->create();
    $issue = Issue::factory()->for($team)->create();
    $actor = User::factory()->create();

    $inboxItem = InboxItem::factory()
        ->for($user)
        ->for($issue)
        ->for($actor, 'actor')
        ->create();

    $snoozedUntil = now()->addHours(2);
    $inboxItem->snooze($snoozedUntil);

    expect($inboxItem->isSnoozed())->toBeTrue()
        ->and($inboxItem->snoozed_until)->not->toBeNull();

    $inboxItem->unsnooze();

    expect($inboxItem->isSnoozed())->toBeFalse()
        ->and($inboxItem->snoozed_until)->toBeNull();
});

test('unread scope returns only unread items', function () {
    $user = User::factory()->create();
    $team = Team::factory()->create();
    $issue = Issue::factory()->for($team)->create();
    $actor = User::factory()->create();

    InboxItem::factory()
        ->for($user)
        ->for($issue)
        ->for($actor, 'actor')
        ->unread()
        ->count(3)
        ->create();

    InboxItem::factory()
        ->for($user)
        ->for($issue)
        ->for($actor, 'actor')
        ->read()
        ->count(2)
        ->create();

    expect(InboxItem::unread()->count())->toBe(3);
});

test('forUser scope returns items for specific user', function () {
    $user1 = User::factory()->create();
    $user2 = User::factory()->create();
    $team = Team::factory()->create();
    $issue = Issue::factory()->for($team)->create();
    $actor = User::factory()->create();

    InboxItem::factory()
        ->for($user1)
        ->for($issue)
        ->for($actor, 'actor')
        ->count(3)
        ->create();

    InboxItem::factory()
        ->for($user2)
        ->for($issue)
        ->for($actor, 'actor')
        ->count(2)
        ->create();

    expect(InboxItem::forUser($user1->id)->count())->toBe(3)
        ->and(InboxItem::forUser($user2->id)->count())->toBe(2);
});
