<?php

namespace App\Modules\Workspace\Database\Seeders;

use App\Models\User;
use App\Modules\Workspace\Enums\WorkspaceRole;
use App\Modules\Workspace\Models\InboxItem;
use App\Modules\Workspace\Models\Issue;
use App\Modules\Workspace\Models\IssueActivity;
use App\Modules\Workspace\Models\IssueComment;
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

        $commentsCount = $this->createIssueComments($issues, $users);

        $activitiesCount = $this->createIssueActivities($issues, $users, $statuses, $priorities);

        $subscriptionsCount = $this->createIssueSubscriptions($issues, $users);

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
        $this->command->info('   - Issue Comments: '.$commentsCount);
        $this->command->info('   - Issue Activities: '.$activitiesCount);
        $this->command->info('   - Issue Subscriptions: '.$subscriptionsCount);
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

    private function createIssueComments($issues, $users): int
    {
        $this->command->info('Creating issue comments...');

        $count = 0;
        $commentContents = [
            "J'ai commencé à travailler sur ce problème. Je vais créer une PR d'ici la fin de la journée.",
            "Est-ce qu'on pourrait avoir plus de détails sur le comportement attendu ?",
            "J'ai trouvé la cause du bug : c'était un problème de cache. Fix en cours.",
            "Très bonne idée ! Je pense qu'on devrait aussi considérer l'impact sur les performances.",
            'La PR est prête pour review : #1234',
            "J'ai testé en local et ça fonctionne parfaitement. ✅",
            'On devrait peut-être ajouter des tests unitaires pour cette fonctionnalité.',
            "Je suis bloqué sur ce point, quelqu'un peut m'aider ?",
            "Après discussion avec l'équipe, on va partir sur l'approche B.",
            'Le déploiement est prévu pour demain matin.',
            "J'ai ajouté la documentation dans le README.",
            'Attention, ce changement impacte aussi le module `auth`.',
            "Super travail ! C'est exactement ce qu'on voulait.",
            'Je propose de découper cette tâche en plusieurs sous-tâches.',
            'Le client a validé la maquette, on peut commencer le dev.',
        ];

        $replyContents = [
            "Merci pour l'update !",
            'OK, je vais regarder ça.',
            'Parfait, merci beaucoup.',
            "Je suis d'accord avec cette approche.",
            "J'ai une question : comment tu gères le cas X ?",
            "Bonne idée, je m'en occupe.",
            "C'est noté, je fais les modifications.",
            '👍',
            'Je valide !',
            'On en discute demain en standup ?',
        ];

        // Ajouter des commentaires à environ 60% des issues
        foreach ($issues->random((int) ($issues->count() * 0.6)) as $issue) {
            $teamMembers = $issue->team->members;
            $commentCount = rand(1, 5);

            for ($i = 0; $i < $commentCount; $i++) {
                $comment = IssueComment::create([
                    'issue_id' => $issue->id,
                    'user_id' => $teamMembers->random()->id,
                    'content' => $commentContents[array_rand($commentContents)],
                    'created_at' => $issue->created_at->addHours(rand(1, 72)),
                ]);
                $count++;

                // 30% chance d'avoir des réponses
                if (rand(0, 100) < 30) {
                    $replyCount = rand(1, 3);
                    for ($j = 0; $j < $replyCount; $j++) {
                        IssueComment::create([
                            'issue_id' => $issue->id,
                            'user_id' => $teamMembers->random()->id,
                            'parent_id' => $comment->id,
                            'content' => $replyContents[array_rand($replyContents)],
                            'created_at' => $comment->created_at->addMinutes(rand(5, 120)),
                        ]);
                        $count++;
                    }
                }
            }
        }

        return $count;
    }

    private function createIssueActivities($issues, $users, $statuses, $priorities): int
    {
        $this->command->info('Creating issue activities...');

        $count = 0;

        foreach ($issues as $issue) {
            $teamMembers = $issue->team->members;

            // Activité de création (toujours présente)
            IssueActivity::create([
                'issue_id' => $issue->id,
                'user_id' => $issue->creator_id,
                'type' => IssueActivity::TYPE_CREATED,
                'old_value' => null,
                'new_value' => null,
                'created_at' => $issue->created_at,
            ]);
            $count++;

            // 50% chance de changement de status
            if (rand(0, 100) < 50) {
                $oldStatus = $statuses->random();
                $newStatus = $statuses->where('id', '!=', $oldStatus->id)->random();
                IssueActivity::create([
                    'issue_id' => $issue->id,
                    'user_id' => $teamMembers->random()->id,
                    'type' => IssueActivity::TYPE_STATUS_CHANGED,
                    'old_value' => ['id' => $oldStatus->id, 'name' => $oldStatus->name],
                    'new_value' => ['id' => $newStatus->id, 'name' => $newStatus->name],
                    'created_at' => $issue->created_at->addHours(rand(1, 48)),
                ]);
                $count++;
            }

            // 40% chance de changement de priorité
            if (rand(0, 100) < 40) {
                $oldPriority = $priorities->random();
                $newPriority = $priorities->where('id', '!=', $oldPriority->id)->random();
                IssueActivity::create([
                    'issue_id' => $issue->id,
                    'user_id' => $teamMembers->random()->id,
                    'type' => IssueActivity::TYPE_PRIORITY_CHANGED,
                    'old_value' => ['id' => $oldPriority->id, 'name' => $oldPriority->name],
                    'new_value' => ['id' => $newPriority->id, 'name' => $newPriority->name],
                    'created_at' => $issue->created_at->addHours(rand(1, 72)),
                ]);
                $count++;
            }

            // 35% chance de changement d'assigné
            if (rand(0, 100) < 35) {
                $oldAssignee = rand(0, 100) < 50 ? $teamMembers->random() : null;
                $newAssignee = $teamMembers->random();
                IssueActivity::create([
                    'issue_id' => $issue->id,
                    'user_id' => $teamMembers->random()->id,
                    'type' => IssueActivity::TYPE_ASSIGNEE_CHANGED,
                    'old_value' => $oldAssignee ? ['id' => $oldAssignee->id, 'name' => $oldAssignee->name] : null,
                    'new_value' => ['id' => $newAssignee->id, 'name' => $newAssignee->name],
                    'created_at' => $issue->created_at->addHours(rand(1, 24)),
                ]);
                $count++;
            }

            // 20% chance de changement de titre
            if (rand(0, 100) < 20) {
                IssueActivity::create([
                    'issue_id' => $issue->id,
                    'user_id' => $teamMembers->random()->id,
                    'type' => IssueActivity::TYPE_TITLE_CHANGED,
                    'old_value' => ['value' => 'Ancien titre de la tâche'],
                    'new_value' => ['value' => $issue->title],
                    'created_at' => $issue->created_at->addHours(rand(1, 12)),
                ]);
                $count++;
            }

            // 15% chance de changement de date d'échéance
            if (rand(0, 100) < 15) {
                IssueActivity::create([
                    'issue_id' => $issue->id,
                    'user_id' => $teamMembers->random()->id,
                    'type' => IssueActivity::TYPE_DUE_DATE_CHANGED,
                    'old_value' => null,
                    'new_value' => ['date' => now()->addDays(rand(1, 30))->format('Y-m-d')],
                    'created_at' => $issue->created_at->addHours(rand(1, 48)),
                ]);
                $count++;
            }
        }

        return $count;
    }

    private function createIssueSubscriptions($issues, $users): int
    {
        $this->command->info('Creating issue subscriptions...');

        $count = 0;

        foreach ($issues as $issue) {
            $teamMembers = $issue->team->members;

            // Le créateur est toujours abonné
            $issue->subscriptions()->firstOrCreate(
                ['user_id' => $issue->creator_id],
                ['created_at' => $issue->created_at]
            );
            $count++;

            // L'assigné est abonné s'il existe
            if ($issue->assignee_id) {
                $issue->subscriptions()->firstOrCreate(
                    ['user_id' => $issue->assignee_id],
                    ['created_at' => $issue->created_at->addMinutes(rand(1, 60))]
                );
                $count++;
            }

            // 30% chance d'avoir d'autres abonnés
            if (rand(0, 100) < 30) {
                $additionalSubscribers = $teamMembers
                    ->where('id', '!=', $issue->creator_id)
                    ->where('id', '!=', $issue->assignee_id)
                    ->random(min(rand(1, 3), $teamMembers->count() - 2));

                foreach ($additionalSubscribers as $subscriber) {
                    $issue->subscriptions()->firstOrCreate(
                        ['user_id' => $subscriber->id],
                        ['created_at' => $issue->created_at->addHours(rand(1, 24))]
                    );
                    $count++;
                }
            }
        }

        return $count;
    }
}
