import type { SidebarConfig } from '@/config/sidebar';
import { cn } from '@/lib/utils';

/**
 * Generate sidebar CSS custom properties from config
 */
export function getSidebarCSSProperties(config: Partial<SidebarConfig>): React.CSSProperties {
    return {
        '--sidebar-width': config.width,
        '--sidebar-width-icon': config.widthIcon,
    } as React.CSSProperties;
}

/**
 * Generate sidebar provider class names based on config
 */
export function getSidebarProviderClassName(
    config: Partial<SidebarConfig>,
    customClassName?: string
): string {
    const baseClasses = 'group/sidebar-wrapper has-data-[variant=inset]:bg-sidebar flex min-h-svh w-full';

    const configClasses = {
        'has-data-[variant=inset]:bg-background': config.variant === 'inset',
    };

    return cn(baseClasses, configClasses, customClassName);
}

/**
 * Generate sidebar wrapper class names based on config
 */
export function getSidebarWrapperClassName(
    config: Partial<SidebarConfig>,
    customClassName?: string
): string {
    const baseClasses = '';

    const variantClasses = {
        'bg-background': config.variant === 'inset',
        'bg-sidebar': config.variant === 'sidebar',
    };

    return cn(baseClasses, variantClasses, customClassName);
}
