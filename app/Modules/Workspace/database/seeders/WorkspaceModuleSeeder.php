<?php

namespace App\Modules\Workspace\Database\Seeders;

use App\Models\User;
use App\Modules\Workspace\Enums\WorkspaceRole;
use App\Modules\Workspace\Models\InboxItem;
use App\Modules\Workspace\Models\Issue;
use App\Modules\Workspace\Models\IssueLabel;
use App\Modules\Workspace\Models\IssuePriority;
use App\Modules\Workspace\Models\IssueStatus;
use App\Modules\Workspace\Models\Team;
use App\Modules\Workspace\Models\TeamInvitation;
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

        $invitations = $this->createTeamInvitations($teams, $users);

        $this->command->info('✅ Workspace Module seeded successfully!');
        $this->command->newLine();
        $this->command->info('📊 Summary:');
        $this->command->info('   - Users: '.$users->count());
        $this->command->info('   - Teams: '.$teams->count());
        $this->command->info('   - Issues: '.$issues->count());
        $this->command->info('   - Statuses: '.$statuses->count());
        $this->command->info('   - Priorities: '.$priorities->count());
        $this->command->info('   - Labels: '.$labels->count());
        $this->command->info('   - Team Invitations: '.$invitations->count());
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

        // Workspace Admin (seul rôle Spatie pour le workspace)
        $workspaceAdmin = Role::firstOrCreate(['name' => WorkspaceRole::adminRole()]);
        $workspaceAdmin->syncPermissions($allPermissions);
    }

    private function createStatuses()
    {
        $this->command->info('Creating issue statuses...');

        $statuses = [
            ['slug' => 'backlog', 'name' => 'Backlog', 'color' => '#ec4899', 'icon_type' => 'BacklogIcon', 'order' => 1],
            ['slug' => 'todo', 'name' => 'A faire', 'color' => '#f97316', 'icon_type' => 'ToDoIcon', 'order' => 2],
            ['slug' => 'in-progress', 'name' => 'En cours', 'color' => '#facc15', 'icon_type' => 'InProgressIcon', 'order' => 3],
            ['slug' => 'technical-review', 'name' => 'Révision technique', 'color' => '#22c55e', 'icon_type' => 'TechnicalReviewIcon', 'order' => 4],
            ['slug' => 'paused', 'name' => 'En pause', 'color' => '#0ea5e9', 'icon_type' => 'PausedIcon', 'order' => 5],
            ['slug' => 'completed', 'name' => 'Terminé', 'color' => '#8b5cf6', 'icon_type' => 'CompletedIcon', 'order' => 6],
        ];

        return collect($statuses)->map(function ($status) {
            return IssueStatus::firstOrCreate(
                ['slug' => $status['slug']],
                $status
            );
        });
    }

    private function createPriorities()
    {
        $this->command->info('Creating issue priorities...');

        $priorities = [
            ['slug' => 'none', 'name' => 'Aucune', 'icon_type' => 'NoPriorityIcon', 'order' => 1],
            ['slug' => 'low', 'name' => 'Faible', 'icon_type' => 'LowPriorityIcon', 'order' => 2],
            ['slug' => 'medium', 'name' => 'Moyenne', 'icon_type' => 'MediumPriorityIcon', 'order' => 3],
            ['slug' => 'high', 'name' => 'Haute', 'icon_type' => 'HighPriorityIcon', 'order' => 4],
            ['slug' => 'urgent', 'name' => 'Urgent', 'icon_type' => 'UrgentPriorityIcon', 'order' => 5],
        ];

        return collect($priorities)->map(function ($priority) {
            return IssuePriority::firstOrCreate(
                ['slug' => $priority['slug']],
                $priority
            );
        });
    }

    private function createLabels()
    {
        $this->command->info('Creating issue labels...');

        $labels = [
            ['slug' => 'ui', 'name' => 'Développement UI', 'color' => '#3b82f6'],
            ['slug' => 'bug', 'name' => 'Correction de Bug', 'color' => '#ef4444'],
            ['slug' => 'feature', 'name' => 'Nouvelle Fonctionnalité', 'color' => '#10b981'],
            ['slug' => 'documentation', 'name' => 'Documentation', 'color' => '#8b5cf6'],
            ['slug' => 'refactor', 'name' => 'Refactorisation du Code', 'color' => '#f59e0b'],
            ['slug' => 'performance', 'name' => 'Optimisation des Performances', 'color' => '#06b6d4'],
            ['slug' => 'design', 'name' => 'Implémentation du Design', 'color' => '#ec4899'],
            ['slug' => 'security', 'name' => 'Correctif de Sécurité', 'color' => '#f97316'],
            ['slug' => 'accessibility', 'name' => 'Amélioration de l\'Accessibilité', 'color' => '#84cc16'],
            ['slug' => 'testing', 'name' => 'Tests Unitaires', 'color' => '#14b8a6'],
            ['slug' => 'internationalization', 'name' => 'Internationalisation (i18n)', 'color' => '#a855f7'],
        ];

        return collect($labels)->map(function ($label) {
            return IssueLabel::firstOrCreate(
                ['slug' => $label['slug']],
                $label
            );
        });
    }

    private function createUsers()
    {
        $this->command->info('Creating users...');

        $users = collect();

        // Workspace Admin (seul rôle Spatie)
        $workspaceAdmin = User::factory()->create(
            [
                'name' => 'Workspace Admin',
                'email' => 'workspace-admin@example.com',
            ],
        );
        $workspaceAdmin->assignRole(WorkspaceRole::adminRole());
        $users->push($workspaceAdmin);

        // Team Leads (seront assignés comme team-lead dans les teams)
        $leadNames = [
            ['name' => 'Alice Martin', 'email' => 'alice.martin@example.com'],
            ['name' => 'Thomas Bernard', 'email' => 'thomas.bernard@example.com'],
            ['name' => 'Sophie Dubois', 'email' => 'sophie.dubois@example.com'],
            ['name' => 'Lucas Moreau', 'email' => 'lucas.moreau@example.com'],
        ];

        foreach ($leadNames as $leadData) {
            $lead = User::factory()->create(
                [
                    'name' => $leadData['name'],
                    'email' => $leadData['email'],
                ],
            );
            // Plus de rôle Spatie, le rôle sera dans le pivot team_user
            $users->push($lead);
        }

        // Team Members (seront assignés comme team-member dans les teams)
        $memberNames = [
            ['name' => 'Emma Petit', 'email' => 'emma.petit@example.com'],
            ['name' => 'Hugo Roux', 'email' => 'hugo.roux@example.com'],
            ['name' => 'Léa Laurent', 'email' => 'lea.laurent@example.com'],
            ['name' => 'Nathan Simon', 'email' => 'nathan.simon@example.com'],
            ['name' => 'Chloé Michel', 'email' => 'chloe.michel@example.com'],
            ['name' => 'Louis Lefebvre', 'email' => 'louis.lefebvre@example.com'],
            ['name' => 'Camille Garcia', 'email' => 'camille.garcia@example.com'],
            ['name' => 'Gabriel David', 'email' => 'gabriel.david@example.com'],
            ['name' => 'Manon Bertrand', 'email' => 'manon.bertrand@example.com'],
            ['name' => 'Arthur Robert', 'email' => 'arthur.robert@example.com'],
            ['name' => 'Inès Richard', 'email' => 'ines.richard@example.com'],
            ['name' => 'Jules Durand', 'email' => 'jules.durand@example.com'],
            ['name' => 'Zoé Leroy', 'email' => 'zoe.leroy@example.com'],
            ['name' => 'Raphaël Moreau', 'email' => 'raphael.moreau@example.com'],
            ['name' => 'Lina Girard', 'email' => 'lina.girard@example.com'],
        ];

        foreach ($memberNames as $memberData) {
            $member = User::factory()->create(
                [
                    'name' => $memberData['name'],
                    'email' => $memberData['email'],
                ]
            );
            // Plus de rôle Spatie, le rôle sera dans le pivot team_user
            $users->push($member);
        }

        return $users;
    }

    private function createTeams($users)
    {
        $this->command->info('Creating teams...');

        $teams = collect();
        // Admin est le premier, leads sont les 4 suivants (index 1-4), membres sont le reste
        $leads = $users->slice(1, 4)->values();
        $members = $users->slice(5)->values();

        $teamsData = [
            [
                'identifier' => 'CORE',
                'name' => 'Core Development',
                'icon' => '💻',
                'color' => '#3b82f6',
                'description' => 'Main application development team',
                'memberCount' => 6,
            ],
            [
                'identifier' => 'DESIGN',
                'name' => 'Design System',
                'icon' => '🎨',
                'color' => '#ec4899',
                'description' => 'UI/UX and design system team',
                'memberCount' => 4,
            ],
            [
                'identifier' => 'PERF',
                'name' => 'Performance',
                'icon' => '⚡',
                'color' => '#f59e0b',
                'description' => 'Performance optimization and monitoring',
                'memberCount' => 3,
            ],
            [
                'identifier' => 'API',
                'name' => 'API Development',
                'icon' => '🔌',
                'color' => '#10b981',
                'description' => 'Backend API development and integration',
                'memberCount' => 5,
            ],
            [
                'identifier' => 'QA',
                'name' => 'Quality Assurance',
                'icon' => '🧪',
                'color' => '#8b5cf6',
                'description' => 'Testing and quality assurance',
                'memberCount' => 4,
            ],
            [
                'identifier' => 'INFRA',
                'name' => 'Infrastructure',
                'icon' => '🛠️',
                'color' => '#06b6d4',
                'description' => 'DevOps and infrastructure management',
                'memberCount' => 3,
            ],
        ];

        $availableMembers = $members->shuffle();
        $memberIndex = 0;
        $leadsList = $leads->values(); // Reset keys for proper indexing

        foreach ($teamsData as $index => $teamData) {
            $team = Team::firstOrCreate(
                ['identifier' => $teamData['identifier']],
                [
                    'name' => $teamData['name'],
                    'icon' => $teamData['icon'],
                    'color' => $teamData['color'],
                    'description' => $teamData['description'],
                ]
            );

            // Assigner un lead seulement si le team n'a pas encore de membres
            if ($team->members()->count() === 0) {
                if ($leadsList->count() > 0) {
                    $lead = $leadsList[$index % $leadsList->count()];
                    $team->addMember($lead, WorkspaceRole::TeamLead->value);
                }

                // Assigner des membres
                for ($i = 0; $i < $teamData['memberCount']; $i++) {
                    if ($memberIndex < $availableMembers->count()) {
                        $team->addMember($availableMembers[$memberIndex], WorkspaceRole::TeamMember->value);
                        $memberIndex++;
                    }
                }
            }

            $teams->push($team);
        }

        return $teams;
    }

    private function createIssues($teams, $users, $statuses, $priorities, $labels)
    {
        $this->command->info('Creating issues...');

        $issues = collect();

        foreach ($teams as $team) {
            // Plus de tâches pour les équipes plus grandes
            $issueCount = rand(40, 60);

            $teamMembers = $team->members;

            for ($i = 0; $i < $issueCount; $i++) {
                $issue = Issue::factory()->create([
                    'team_id' => $team->id,
                    'creator_id' => $teamMembers->random()->id,
                    'assignee_id' => rand(0, 100) < 80 ? $teamMembers->random()->id : null,
                    'status_id' => $statuses->random()->id,
                    'priority_id' => $priorities->random()->id,
                ]);

                // Ajouter 1 à 4 labels par issue
                $issue->labels()->syncWithoutDetaching(
                    $labels->random(rand(1, 4))->pluck('id')->toArray()
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
            // Plus d'items dans l'inbox pour un jeu de données plus réaliste
            InboxItem::factory()
                ->count(rand(15, 30))
                ->create([
                    'user_id' => $user->id,
                    'issue_id' => $issues->random()->id,
                    'actor_id' => $users->random()->id,
                ]);
        }
    }

    private function createTeamInvitations($teams, $users)
    {
        $this->command->info('Creating team invitations...');

        $invitations = collect();

        $workspaceAdmin = $users->firstWhere('email', 'workspace-admin@example.com');
        // Tous les utilisateurs sauf l'admin peuvent recevoir des invitations
        $potentialInvitees = $users->filter(fn ($u) => $u->email !== 'workspace-admin@example.com');

        // Créer plusieurs invitations pending pour différents utilisateurs
        foreach ($teams as $team) {
            $teamLead = $team->leads()->first();

            if (! $teamLead) {
                continue;
            }

            // Inviter le workspace admin à quelques équipes
            if (! $team->isMember($workspaceAdmin) && rand(0, 100) < 40) {
                $invitations->push(
                    TeamInvitation::factory()->create([
                        'team_id' => $team->id,
                        'user_id' => $workspaceAdmin->id,
                        'invited_by' => $teamLead->id,
                        'role' => WorkspaceRole::TeamMember->value,
                        'message' => "Nous aimerions que tu rejoignes l'équipe {$team->name} !",
                        'status' => 'pending',
                        'expires_at' => now()->addDays(rand(3, 14)),
                    ])
                );
            }

            // Inviter quelques utilisateurs qui ne sont pas encore membres
            $nonMembers = $potentialInvitees->filter(fn ($u) => ! $team->isMember($u));

            foreach ($nonMembers->random(min(3, $nonMembers->count())) as $member) {
                $statusChoice = rand(0, 100);

                if ($statusChoice < 60) {
                    // 60% pending
                    $invitations->push(
                        TeamInvitation::factory()->pending()->create([
                            'team_id' => $team->id,
                            'user_id' => $member->id,
                            'invited_by' => $teamLead->id,
                            'role' => rand(0, 100) < 90 ? WorkspaceRole::TeamMember->value : WorkspaceRole::TeamLead->value,
                            'expires_at' => now()->addDays(rand(5, 30)),
                        ])
                    );
                } elseif ($statusChoice < 80) {
                    // 20% accepted
                    $invitations->push(
                        TeamInvitation::factory()->accepted()->create([
                            'team_id' => $team->id,
                            'user_id' => $member->id,
                            'invited_by' => $teamLead->id,
                            'role' => WorkspaceRole::TeamMember->value,
                        ])
                    );
                } elseif ($statusChoice < 90) {
                    // 10% declined
                    $invitations->push(
                        TeamInvitation::factory()->declined()->create([
                            'team_id' => $team->id,
                            'user_id' => $member->id,
                            'invited_by' => $teamLead->id,
                            'role' => WorkspaceRole::TeamMember->value,
                        ])
                    );
                } else {
                    // 10% expired
                    $invitations->push(
                        TeamInvitation::factory()->expired()->create([
                            'team_id' => $team->id,
                            'user_id' => $member->id,
                            'invited_by' => $teamLead->id,
                            'role' => WorkspaceRole::TeamMember->value,
                        ])
                    );
                }
            }
        }

        return $invitations;
    }
}
