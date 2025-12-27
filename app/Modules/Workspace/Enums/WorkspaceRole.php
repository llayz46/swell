<?php

namespace App\Modules\Workspace\Enums;

enum WorkspaceRole: string
{
    // Rôles Spatie (globaux au niveau workspace)
    case WorkspaceLead = 'workspace-lead';
    case WorkspaceMember = 'workspace-member';

    // Rôles Team (pour les pivots team_user)
    case TeamLead = 'team-lead';
    case TeamMember = 'team-member';

    /**
     * Get all workspace-level role values (for Spatie).
     *
     * @return array<string>
     */
    public static function workspaceRoles(): array
    {
        return [
            self::WorkspaceLead->value,
            self::WorkspaceMember->value,
        ];
    }

    /**
     * Get all team-level role values (for pivot).
     *
     * @return array<string>
     */
    public static function teamRoles(): array
    {
        return [
            self::TeamLead->value,
            self::TeamMember->value,
        ];
    }

    /**
     * Get all role values.
     *
     * @return array<string>
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    public function label(): string
    {
        return match ($this) {
            self::WorkspaceLead => 'Lead Workspace',
            self::WorkspaceMember => 'Membre Workspace',
            self::TeamLead => 'Chef d\'équipe',
            self::TeamMember => 'Membre de l\'équipe',
        };
    }

    /**
     * Get all roles as array for frontend consumption.
     *
     * @return array<int, array{value: string, label: string}>
     */
    public static function toArray(): array
    {
        return array_map(
            fn (self $role) => [
                'value' => $role->value,
                'label' => $role->label(),
            ],
            self::cases()
        );
    }
}
