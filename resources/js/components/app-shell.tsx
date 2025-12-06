import { SidebarProvider } from '@/components/ui/sidebar';
import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';

interface AppShellProps {
    children: React.ReactNode;
    variant?: 'header' | 'sidebar';
}

function getSidebarStateFromCookie(): boolean | undefined {
    const cookies = document.cookie.split(';');
    const sidebarCookie = cookies.find((c) => c.trim().startsWith('sidebar_state='));
    if (!sidebarCookie) return undefined;
    const value = sidebarCookie.split('=')[1];
    return value === 'true';
}

export function AppShell({ children, variant = 'header' }: AppShellProps) {
    const fallbackOpen = usePage<SharedData>().props.sidebarOpen;

    if (variant === 'header') {
        return <div className="flex min-h-screen w-full flex-col">{children}</div>;
    }

    // Read the sidebar state from cookie if it exists, otherwise use the fallback from the backend
    const cookieState = getSidebarStateFromCookie();
    const defaultOpen = cookieState !== undefined ? cookieState : fallbackOpen;

    return <SidebarProvider defaultOpen={defaultOpen}>{children}</SidebarProvider>;
}
