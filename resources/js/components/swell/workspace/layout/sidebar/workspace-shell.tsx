import { SidebarProvider } from '@/components/ui/sidebar';
import { workspaceSidebarConfig } from '@/config/sidebar';
import { getCookieBoolean } from '@/lib/cookies';
import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';

interface WorkspaceShellProps {
    children: React.ReactNode;
    variant?: 'header' | 'sidebar';
}

export function WorkspaceShell({ children, variant = 'header' }: WorkspaceShellProps) {
    const fallbackOpen = usePage<SharedData>().props.sidebarOpen;

    if (variant === 'header') {
        return <div className="flex min-h-screen w-full flex-col">{children}</div>;
    }

    // Read the sidebar state from cookie if it exists, otherwise use the fallback from the backend
    const cookieState = getCookieBoolean(workspaceSidebarConfig.cookieName);
    const defaultOpen = cookieState !== undefined ? cookieState : fallbackOpen;

    return (
        <SidebarProvider
            defaultOpen={defaultOpen}
            cookieName={workspaceSidebarConfig.cookieName}
            className="h-svh has-data-[variant=inset]:bg-background"
        >
            {children}
        </SidebarProvider>
    );
}
