import { AppContent } from '@/components/app-content';
import { WorkspaceShell } from '@/components/swell/workspace/workspace-shell';
import { ToasterWrapper } from '@/components/swell/toaster-wrapper';
import { WorkspaceSidebar } from '@/components/swell/workspace/workspace-sidebar';
import type { NavItem } from '@/types';
import { type PropsWithChildren } from 'react';
import { cn } from '@/lib/utils';

interface SidebarProps {
    mainNavItems: NavItem[];
    workspaceNavItems: NavItem[];
    header?: React.ReactNode;
    headersNumber?: 1 | 2;
}

export default function AppSidebarLayout({
    children,
    header,
    headersNumber = 2,
    mainNavItems,
    workspaceNavItems,
}: PropsWithChildren<SidebarProps>) {
    const height = {
        1: 'peer-data-[variant=inset]:h-[calc(100svh-40px)] lg:peer-data-[variant=inset]:h-[calc(100svh-56px)]',
        2: 'peer-data-[variant=inset]:h-[calc(100svh-80px)] lg:peer-data-[variant=inset]:h-[calc(100svh-96px)]',
    };
    
    return (
        <WorkspaceShell variant="sidebar">
            <WorkspaceSidebar mainNavItems={mainNavItems} workspaceNavItems={workspaceNavItems} />
            <AppContent variant="sidebar" className="bg-workspace overflow-x-hidden md:border lg:peer-data-[variant=inset]:rounded-md md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2 lg:peer-data-[variant=inset]:peer-data-[state=expanded]:m-2 md:peer-data-[variant=inset]:shadow-none">
                {header}
                
                <div className={cn('flex flex-col gap-4 size-full', height[headersNumber])}>
                    {children}
                </div>
                
                <ToasterWrapper />
            </AppContent>
        </WorkspaceShell>
    );
}
