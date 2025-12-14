/**
 * Sidebar configuration for different contexts
 */

export interface SidebarConfig {
    cookieName: string;
    cookieMaxAge: number;
    width: string;
    widthMobile: string;
    widthIcon: string;
    keyboardShortcut: string;
    variant: 'sidebar' | 'floating' | 'inset';
    collapsible: 'offcanvas' | 'icon' | 'none';
}

const WEEK_IN_SECONDS = 60 * 60 * 24 * 7;

/**
 * Default sidebar configuration
 */
const defaultConfig: Omit<SidebarConfig, 'cookieName'> = {
    cookieMaxAge: WEEK_IN_SECONDS,
    width: '16rem',
    widthMobile: '18rem',
    widthIcon: '3rem',
    keyboardShortcut: 'b',
    variant: 'sidebar',
    collapsible: 'icon',
};

/**
 * App sidebar configuration
 */
export const appSidebarConfig: SidebarConfig = {
    ...defaultConfig,
    cookieName: 'app_sidebar_state',
    variant: 'sidebar',
    collapsible: 'icon',
};

/**
 * Workspace sidebar configuration
 */
export const workspaceSidebarConfig: SidebarConfig = {
    ...defaultConfig,
    cookieName: 'workspace_sidebar_state',
    variant: 'inset',
    collapsible: 'offcanvas',
};
