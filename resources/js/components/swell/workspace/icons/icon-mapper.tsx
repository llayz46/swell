import * as LucideIcons from 'lucide-react';
import { FC } from 'react';
import { BacklogIcon, CompletedIcon, InProgressIcon, PausedIcon, TechnicalReviewIcon, ToDoIcon } from './status';

// Map des icônes personnalisées
const customIcons = {
    BacklogIcon,
    PausedIcon,
    ToDoIcon,
    InProgressIcon,
    TechnicalReviewIcon,
    CompletedIcon,
} as const;

type CustomIconName = keyof typeof customIcons;
type LucideIconName = keyof typeof LucideIcons;

interface StatusIconProps {
    iconType: string;
    size?: number;
    color?: string;
    className?: string;
}

/**
 * Composant qui rend une icône de statut
 * Supporte à la fois les icônes personnalisées et Lucide
 *
 * @example
 * // Icône personnalisée
 * <StatusIcon iconType="BacklogIcon" color="#bec2c8" size={16} />
 *
 * // Icône Lucide
 * <StatusIcon iconType="Circle" className="size-4" />
 */
export const StatusIcon: FC<StatusIconProps> = ({ iconType, size = 14, color, className }) => {
    // Vérifier si c'est une icône personnalisée
    if (iconType in customIcons) {
        const CustomIcon = customIcons[iconType as CustomIconName];
        return <CustomIcon size={size} color={color} />;
    }

    // Sinon, chercher dans Lucide
    const LucideIcon = LucideIcons[iconType as LucideIconName] as FC<{ className?: string; size?: number; color?: string }>;

    if (LucideIcon) {
        return <LucideIcon className={className} size={size} color={color} />;
    }

    // Fallback : icône par défaut
    return <LucideIcons.Circle className={className} size={size} color={color} />;
};

/**
 * Liste des icônes personnalisées disponibles
 */
export const CUSTOM_ICONS = Object.keys(customIcons) as CustomIconName[];

/**
 * Vérifier si une icône est personnalisée
 */
export const isCustomIcon = (iconType: string): iconType is CustomIconName => {
    return iconType in customIcons;
};
