import { AppContent } from '@/components/app-content';
import { ToasterWrapper } from '@/components/swell/toaster-wrapper';
import { WorkspaceShell } from '@/components/swell/workspace/layout/sidebar/workspace-shell';
import { WorkspaceSidebar } from '@/components/swell/workspace/layout/sidebar/workspace-sidebar';
import { InviteMemberDialog } from '@/components/swell/workspace/members/invite-member-dialog';
import { TeamDialog } from '@/components/swell/workspace/teams/team-dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useWorkspaceMembersStore } from '@/stores/workspace-members-store';
import type { NavItem } from '@/types';
import type { Team, WorkspaceMember } from '@/types/workspace';
import { usePage } from '@inertiajs/react';
import { type PropsWithChildren, useEffect } from 'react';

interface WorkspaceSharedProps {
    workspaceMembers: WorkspaceMember[] | null;
    invitableTeams: Team[] | null;
}

interface SidebarProps {
    mainNavItems: NavItem[];
    workspaceNavItems: NavItem[];
    header?: React.ReactNode;
    headersNumber?: 1 | 2;
    tableHeader?: React.ReactNode;
}

export default function AppSidebarLayout({
    children,
    header,
    headersNumber = 2,
    mainNavItems,
    workspaceNavItems,
    tableHeader,
}: PropsWithChildren<SidebarProps>) {
    const { workspaceMembers, invitableTeams } = usePage<WorkspaceSharedProps>().props;

    useEffect(() => {
        if (workspaceMembers) {
            useWorkspaceMembersStore.getState().setWorkspaceMembers(workspaceMembers);
        }
        if (invitableTeams) {
            useWorkspaceMembersStore.setState({ invitableTeams });
        }
    }, [workspaceMembers, invitableTeams]);

    // Hauteur ajustée selon le nombre de headers ET si un tableHeader existe
    const scrollHeight = tableHeader
        ? {
              1: 'peer-data-[variant=inset]:h-[calc(100svh-80px)] lg:peer-data-[variant=inset]:h-[calc(100svh-96px)]',
              2: 'peer-data-[variant=inset]:h-[calc(100svh-120px)] lg:peer-data-[variant=inset]:h-[calc(100svh-136px)]',
          }
        : {
              1: 'peer-data-[variant=inset]:h-[calc(100svh-40px)] lg:peer-data-[variant=inset]:h-[calc(100svh-56px)]',
              2: 'peer-data-[variant=inset]:h-[calc(100svh-80px)] lg:peer-data-[variant=inset]:h-[calc(100svh-96px)]',
          };

    return (
        <WorkspaceShell variant="sidebar">
            <WorkspaceSidebar mainNavItems={mainNavItems} workspaceNavItems={workspaceNavItems} />

            <AppContent
                variant="sidebar"
                className="overflow-hidden bg-workspace md:border md:peer-data-[variant=inset]:shadow-none md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2 lg:peer-data-[variant=inset]:rounded-md lg:peer-data-[variant=inset]:peer-data-[state=expanded]:m-2"
            >
                {header}
                {tableHeader}

                <ScrollArea className={cn('size-full', scrollHeight[headersNumber])}>{children}</ScrollArea>

                <InviteMemberDialog />
                <TeamDialog />
                <ToasterWrapper />
            </AppContent>
        </WorkspaceShell>
    );
}
