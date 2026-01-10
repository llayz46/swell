import { FC } from 'react';
import { HighPriorityIcon, LowPriorityIcon, MediumPriorityIcon, NoPriorityIcon, PriorityIconProps, UrgentPriorityIcon } from './priority';

// Map des icônes de priorité disponibles
const priorityIcons = {
    NoPriorityIcon,
    LowPriorityIcon,
    MediumPriorityIcon,
    HighPriorityIcon,
    UrgentPriorityIcon,
} as const;

export type PriorityIconName = keyof typeof priorityIcons;

interface PriorityIconComponentProps extends PriorityIconProps {
    iconType: PriorityIconName;
}

/**
 * Composant qui rend une icône de priorité personnalisée
 *
 * @example
 * <PriorityIcon iconType="HighPriorityIcon" color="#f97316" width={16} height={16} />
 */
export const PriorityIcon: FC<PriorityIconComponentProps> = ({ iconType, width = 16, height = 16, color, className, ...props }) => {
    const Icon = priorityIcons[iconType];
    return <Icon width={width} height={height} color={color} className={className} {...props} />;
};

/**
 * Liste des icônes de priorité disponibles
 */
export const PRIORITY_ICONS = Object.keys(priorityIcons) as PriorityIconName[];

/**
 * Vérifier si un type d'icône est valide
 */
export const isValidPriorityIcon = (iconType: string): iconType is PriorityIconName => {
    return iconType in priorityIcons;
};
