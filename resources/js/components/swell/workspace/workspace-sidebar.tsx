import AppLogoIcon from '@/components/app-logo-icon';
import { NavFooter } from '@/components/nav-footer';
import { NavUser } from '@/components/nav-user';
import WorkspaceNewIssueDialog from '@/components/swell/workspace/workspace-new-issue-dialog';
import ThemeToggle from '@/components/theme-toggle';
import { DropdownMenu, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { workspaceSidebarConfig } from '@/config/sidebar';
import type { SharedData, NavItem, NavItemWithChildren } from '@/types';
import { usePage } from '@inertiajs/react';
import { BookOpen, ChevronsUpDown, FolderMinus, Users } from 'lucide-react';
import { WorkspaceNavGroup } from './workspace-nav-group';

const footerNavItems: NavItem[] = [
    {
        title: 'Documentation',
        href: 'https://swellkit.dev',
        icon: BookOpen,
    },
];

interface SidebarProps {
    mainNavItems: NavItem[];
    workspaceNavItems: NavItem[];
}

export function WorkspaceSidebar({ mainNavItems, workspaceNavItems }: SidebarProps) {
    const { name, auth } = usePage<SharedData>().props;

    const teamsNavItems: NavItemWithChildren[] = (auth.teams ?? []).map(team => ({
        title: team.name,
        icon: team.icon,
        childrens: [
            {
                title: 'Tâches',
                href: `/workspace/${team.id}/issues`,
                icon: FolderMinus,
            },
            {
                title: 'Membres',
                href: `/workspace/${team.id}/members`,
                icon: Users,
            },
        ]
    }));

    return (
        <Sidebar
            collapsible={workspaceSidebarConfig.collapsible}
            variant={workspaceSidebarConfig.variant}
            className="**:data-[sidebar='sidebar']:bg-background p-0"
        >
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <div className="flex w-full items-center gap-1 pt-2">
                                <DropdownMenuTrigger asChild>
                                    <SidebarMenuButton
                                        size="lg"
                                        className="h-8 p-1 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                                    >
                                        <div className="flex aspect-square size-6 items-center justify-center rounded bg-primary text-sidebar-primary-foreground">
                                            <AppLogoIcon className="size-4 fill-current text-white dark:text-black" />
                                        </div>
                                        <div className="grid flex-1 text-left text-sm leading-tight">
                                            <span className="truncate font-semibold">{name}</span>
                                        </div>
                                        <ChevronsUpDown className="ml-auto" />
                                    </SidebarMenuButton>
                                </DropdownMenuTrigger>

                                <ThemeToggle />

                                <WorkspaceNewIssueDialog />
                            </div>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <WorkspaceNavGroup items={mainNavItems} />
                <WorkspaceNavGroup items={workspaceNavItems} label="Workspace" />
                {teamsNavItems.length > 0 && (
                    <WorkspaceNavGroup items={teamsNavItems} label="Mes teams" />
                )}
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
