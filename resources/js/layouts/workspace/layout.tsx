import { AppContent } from '@/components/app-content';
import { ToasterWrapper } from '@/components/swell/toaster-wrapper';
import { WorkspaceShell } from '@/components/swell/workspace/workspace-shell';
import { WorkspaceSidebar } from '@/components/swell/workspace/workspace-sidebar';
import { cn } from '@/lib/utils';
import type { NavItem } from '@/types';
import { type PropsWithChildren } from 'react';

interface SidebarProps {
    mainNavItems: NavItem[];
    workspaceNavItems: NavItem[];
    header?: React.ReactNode;
    headersNumber?: 1 | 2;
}

export default function AppSidebarLayout({ children, header, headersNumber = 2, mainNavItems, workspaceNavItems }: PropsWithChildren<SidebarProps>) {
    const height = {
        1: 'peer-data-[variant=inset]:h-[calc(100svh-40px)] lg:peer-data-[variant=inset]:h-[calc(100svh-56px)]',
        2: 'peer-data-[variant=inset]:h-[calc(100svh-80px)] lg:peer-data-[variant=inset]:h-[calc(100svh-96px)]',
    };

    return (
        <WorkspaceShell variant="sidebar">
            <WorkspaceSidebar mainNavItems={mainNavItems} workspaceNavItems={workspaceNavItems} />
            <AppContent
                variant="sidebar"
                className="overflow-x-hidden bg-workspace md:border md:peer-data-[variant=inset]:shadow-none md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2 lg:peer-data-[variant=inset]:rounded-md lg:peer-data-[variant=inset]:peer-data-[state=expanded]:m-2"
            >
                {header}

                <div className={cn('flex size-full flex-col gap-4', height[headersNumber])}>{children}</div>

                <ToasterWrapper />
            </AppContent>
        </WorkspaceShell>
    );
}
