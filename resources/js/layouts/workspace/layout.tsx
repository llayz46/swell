import { AppContent } from '@/components/app-content';
import { WorkspaceShell } from '@/components/swell/workspace/workspace-shell';
import { WorkspaceSidebarHeader } from '@/components/swell/workspace/workspace-sidebar-header';
import { ToasterWrapper } from '@/components/swell/toaster-wrapper';
import { WorkspaceSidebar } from '@/components/swell/workspace/workspace-sidebar';
import type { NavItem } from '@/types';
import { type PropsWithChildren } from 'react';

export default function AppSidebarLayout({
    children,
    header,
    mainNavItems,
    workspaceNavItems,
}: PropsWithChildren<{ mainNavItems: NavItem[]; workspaceNavItems: NavItem[], header: React.ReactNode }>) {
    return (
        <WorkspaceShell variant="sidebar">
            <WorkspaceSidebar mainNavItems={mainNavItems} workspaceNavItems={workspaceNavItems} />
            <AppContent variant="sidebar" className="dark:bg-sidebar overflow-x-hidden md:border lg:peer-data-[variant=inset]:rounded-md md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2 lg:peer-data-[variant=inset]:peer-data-[state=expanded]:m-2 md:peer-data-[variant=inset]:shadow-none">
                <WorkspaceSidebarHeader>{header}</WorkspaceSidebarHeader>
                <div className="flex flex-col gap-4">{children}</div>
                <ToasterWrapper />
            </AppContent>
        </WorkspaceShell>
    );
}
