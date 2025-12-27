<?php

namespace App\Modules\Workspace\Enums;

enum WorkspaceRole: string
{
    case TeamLead = 'team-lead';
    case TeamMember = 'team-member';

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
