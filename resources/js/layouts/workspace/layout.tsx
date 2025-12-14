import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { WorkspaceSidebarHeader } from '@/components/swell/workspace/workspace-sidebar-header';
import { ToasterWrapper } from '@/components/swell/toaster-wrapper';
import { WorkspaceSidebar } from '@/components/swell/workspace/workspace-sidebar';
import type { NavItem } from '@/types';
import { type PropsWithChildren } from 'react';

export default function AppSidebarLayout({
    children,
    mainNavItems,
    workspaceNavItems,
}: PropsWithChildren<{ mainNavItems: NavItem[]; workspaceNavItems: NavItem[] }>) {
    return (
        <AppShell variant="sidebar">
            <WorkspaceSidebar mainNavItems={mainNavItems} workspaceNavItems={workspaceNavItems} />
            <AppContent variant="sidebar" className="overflow-x-hidden lg:border lg:peer-data-[variant=inset]:rounded-md md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2 lg:peer-data-[variant=inset]:peer-data-[state=expanded]:m-2">
                <WorkspaceSidebarHeader />
                <div className="my-4 flex flex-col gap-4 px-4">{children}</div>
                <ToasterWrapper />
            </AppContent>
        </AppShell>
    );
}
