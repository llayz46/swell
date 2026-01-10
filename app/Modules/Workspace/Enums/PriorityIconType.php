<?php

namespace App\Modules\Workspace\Enums;

enum PriorityIconType: string
{
    case NoPriority = 'NoPriorityIcon';
    case Low = 'LowPriorityIcon';
    case Medium = 'MediumPriorityIcon';
    case High = 'HighPriorityIcon';
    case Urgent = 'UrgentPriorityIcon';

    /**
     * Get all icon type values.
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
            self::NoPriority => 'Pas prioritaire',
            self::Low => 'Faible',
            self::Medium => 'Moyenne',
            self::High => 'Haute',
            self::Urgent => 'Urgent',
        };
    }
}
