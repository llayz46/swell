<?php

namespace App\Modules\Workspace\Enums;

enum WorkspaceRole: string
{
    // Rôle Spatie (global au workspace)
    case WorkspaceAdmin = 'workspace-admin';

    // Rôles Team (pour les pivots team_user)
    case TeamLead = 'team-lead';
    case TeamMember = 'team-member';

    /**
     * Get the admin role value (for Spatie).
     */
    public static function adminRole(): string
    {
        return self::WorkspaceAdmin->value;
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
            self::WorkspaceAdmin => 'Admin Workspace',
            self::TeamLead => 'Chef d\'équipe',
            self::TeamMember => 'Membre',
        };
    }

    /**
     * Get team roles as array for frontend consumption (for invite dialog).
     *
     * @return array<int, array{value: string, label: string}>
     */
    public static function teamRolesToArray(): array
    {
        return [
            ['value' => self::TeamLead->value, 'label' => self::TeamLead->label()],
            ['value' => self::TeamMember->value, 'label' => self::TeamMember->label()],
        ];
    }
}
