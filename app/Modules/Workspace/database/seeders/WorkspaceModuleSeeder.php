<?php

namespace App\Modules\Workspace\Database\Seeders;

use App\Models\User;
use App\Modules\Workspace\Models\Issue;
use App\Modules\Workspace\Models\IssueLabel;
use App\Modules\Workspace\Models\IssuePriority;
use App\Modules\Workspace\Models\IssueStatus;
use App\Modules\Workspace\Models\InboxItem;
use App\Modules\Workspace\Models\Team;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class WorkspaceModuleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('🚀 Seeding Workspace Module...');

        $this->createRolesAndPermissions();

        $statuses = $this->createStatuses();

        $priorities = $this->createPriorities();

        $labels = $this->createLabels();

        $users = $this->createUsers();

        $teams = $this->createTeams($users);

        $issues = $this->createIssues($teams, $users, $statuses, $priorities, $labels);

        $this->createInboxItems($users, $issues);

        $this->command->info('✅ Workspace Module seeded successfully!');
        $this->command->newLine();
        $this->command->info("📊 Summary:");
        $this->command->info("   - Users: " . $users->count());
        $this->command->info("   - Teams: " . $teams->count());
        $this->command->info("   - Issues: " . $issues->count());
        $this->command->info("   - Statuses: " . $statuses->count());
        $this->command->info("   - Priorities: " . $priorities->count());
        $this->command->info("   - Labels: " . $labels->count());
    }

    private function createRolesAndPermissions(): void
    {
        $this->command->info('Creating roles and permissions...');

        // Toutes les permissions possibles
        $allPermissions = [
            'workspace.access',
            'workspace.admin.manage',
            'workspace.teams.view',
            'workspace.teams.create',
            'workspace.teams.update',
            'workspace.teams.delete',
            'workspace.teams.manage-all',
            'workspace.teams.manage-own',
            'workspace.teams.manage-members',
            'workspace.teams.assign-leads',
            'workspace.teams.transfer-lead',
            'workspace.issues.view',
            'workspace.issues.create',
            'workspace.issues.update',
            'workspace.issues.delete',
            'workspace.issues.assign',
            'workspace.inbox.view',
        ];

        foreach ($allPermissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Workspace Admin
        $workspaceAdmin = Role::firstOrCreate(['name' => 'workspace-admin']);
        $workspaceAdmin->syncPermissions($allPermissions);

        // Team Lead
        $teamLead = Role::firstOrCreate(['name' => 'team-lead']);
        $teamLead->syncPermissions([
            'workspace.access',
            'workspace.teams.view',
            'workspace.teams.create',
            'workspace.teams.manage-own',
            'workspace.teams.manage-members',
            'workspace.teams.transfer-lead',
            'workspace.issues.view',
            'workspace.issues.create',
            'workspace.issues.update',
            'workspace.issues.delete',
            'workspace.issues.assign',
            'workspace.inbox.view',
        ]);

        // Team Member
        $teamMember = Role::firstOrCreate(['name' => 'team-member']);
        $teamMember->syncPermissions([
            'workspace.access',
            'workspace.teams.view',
            'workspace.issues.view',
            'workspace.issues.create',
            'workspace.issues.update',
            'workspace.inbox.view',
        ]);
    }

    private function createStatuses()
    {
        $this->command->info('Creating issue statuses...');

        return collect([
            IssueStatus::factory()->backlog()->create(['color' => '#ec4899', 'icon_type' => 'BacklogIcon']),
            IssueStatus::factory()->todo()->create(['color' => '#f97316', 'icon_type' => 'ToDoIcon']),
            IssueStatus::factory()->inProgress()->create(['color' => '#facc15', 'icon_type' => 'InProgressIcon']),
            IssueStatus::factory()->technicalReview()->create(['color' => '#22c55e', 'icon_type' => 'TechnicalReviewIcon']),
            IssueStatus::factory()->paused()->create(['color' => '#0ea5e9', 'icon_type' => 'PausedIcon']),
            IssueStatus::factory()->completed()->create(['color' => '#8b5cf6', 'icon_type' => 'CompletedIcon']),
        ]);
    }

    private function createPriorities()
    {
        $this->command->info('Creating issue priorities...');

        return collect([
            IssuePriority::factory()->urgent()->create(),
            IssuePriority::factory()->high()->create(),
            IssuePriority::factory()->medium()->create(),
            IssuePriority::factory()->low()->create(),
            IssuePriority::factory()->none()->create(),
        ]);
    }

    private function createLabels()
    {
        $this->command->info('Creating issue labels...');

        return collect([
            IssueLabel::factory()->ui()->create(),
            IssueLabel::factory()->bug()->create(),
            IssueLabel::factory()->feature()->create(),
            IssueLabel::factory()->documentation()->create(),
            IssueLabel::factory()->refactor()->create(),
            IssueLabel::factory()->performance()->create(),
            IssueLabel::factory()->design()->create(),
            IssueLabel::factory()->security()->create(),
            IssueLabel::factory()->accessibility()->create(),
            IssueLabel::factory()->testing()->create(),
            IssueLabel::factory()->internationalization()->create(),
        ]);
    }

    private function createUsers()
    {
        $this->command->info('Creating users...');

        $existingUsers = User::whereIn('email', [
            'workspace-admin@example.com',
            'lead@example.com',
            'member1@example.com',
            'member2@example.com',
            'member3@example.com',
        ])->get();

        if ($existingUsers->count() >= 5) {
            $this->command->info('Using existing users...');
            return $existingUsers;
        }

        // Workspace Admin
        $workspaceAdmin = User::factory()->create([
            'name' => 'Workspace Admin',
            'email' => 'workspace-admin@example.com',
        ]);
        $workspaceAdmin->assignRole('workspace-admin');

        // Team Lead
        $teamLead = User::factory()->create([
            'name' => 'Team Lead',
            'email' => 'lead@example.com',
        ]);
        $teamLead->assignRole('team-lead');

        // Team Members
        $member1 = User::factory()->create([
            'name' => 'John Developer',
            'email' => 'member1@example.com',
        ]);
        $member1->assignRole('team-member');

        $member2 = User::factory()->create([
            'name' => 'Jane Designer',
            'email' => 'member2@example.com',
        ]);
        $member2->assignRole('team-member');

        $member3 = User::factory()->create([
            'name' => 'Bob Tester',
            'email' => 'member3@example.com',
        ]);
        $member3->assignRole('team-member');

        return collect([$workspaceAdmin, $teamLead, $member1, $member2, $member3]);
    }

    private function createTeams($users)
    {
        $this->command->info('Creating teams...');

        $teamLead = $users->firstWhere('email', 'lead@example.com');
        $members = $users->reject(fn($u) => $u->email === 'lead@example.com');

        $coreTeam = Team::create([
            'identifier' => 'CORE',
            'name' => 'Core Development',
            'icon' => '💻',
            'color' => '#3b82f6',
            'description' => 'Main application development team',
        ]);
        $coreTeam->addMember($teamLead, 'lead');
        foreach ($members->take(2) as $member) {
            $coreTeam->addMember($member, 'member');
        }

        $designTeam = Team::create([
            'identifier' => 'DESIGN',
            'name' => 'Design System',
            'icon' => '🎨',
            'color' => '#ec4899',
            'description' => 'UI/UX and design system team',
        ]);
        $designTeam->addMember($teamLead, 'lead');
        $designTeam->addMember($members->values()[1], 'member');

        $perfTeam = Team::create([
            'identifier' => 'PERF',
            'name' => 'Performance',
            'icon' => '⚡',
            'color' => '#f59e0b',
            'description' => 'Performance optimization and monitoring',
        ]);
        $perfTeam->addMember($teamLead, 'lead');
        $perfTeam->addMember($members->values()[2], 'member');

        return collect([$coreTeam, $designTeam, $perfTeam]);
    }

    private function createIssues($teams, $users, $statuses, $priorities, $labels)
    {
        $this->command->info('Creating issues...');

        $issues = collect();

        foreach ($teams as $team) {
            $issueCount = rand(10, 15);

            for ($i = 0; $i < $issueCount; $i++) {
                $issue = Issue::factory()->create([
                    'team_id' => $team->id,
                    'creator_id' => $users->random()->id,
                    'assignee_id' => $users->random()->id,
                    'status_id' => $statuses->random()->id,
                    'priority_id' => $priorities->random()->id,
                ]);

                $issue->labels()->syncWithoutDetaching(
                    $labels->random(rand(1, 3))->pluck('id')->toArray()
                );

                $issues->push($issue);
            }
        }

        return $issues;
    }

    private function createInboxItems($users, $issues)
    {
        $this->command->info('Creating inbox items...');

        foreach ($users as $user) {
            InboxItem::factory()
                ->count(rand(5, 10))
                ->create([
                    'user_id' => $user->id,
                    'issue_id' => $issues->random()->id,
                    'actor_id' => $users->random()->id,
                ]);
        }
    }
}
