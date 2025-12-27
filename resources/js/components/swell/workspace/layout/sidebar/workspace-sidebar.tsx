import AppLogoIcon from '@/components/app-logo-icon';
import { NavFooter } from '@/components/nav-footer';
import { NavUser } from '@/components/nav-user';
import ThemeToggle from '@/components/theme-toggle';
import { DropdownMenu, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { workspaceSidebarConfig } from '@/config/sidebar';
import type { NavItem, NavItemWithChildren, SharedData } from '@/types';
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

    const teamsNavItems: NavItemWithChildren[] = (auth.teams ?? []).map((team) => ({
        id: team.id,
        title: team.name,
        icon: team.icon,
        childrens: [
            {
                title: 'Tâches',
                href: `/workspace/teams/${team.identifier}/issues`,
                icon: FolderMinus,
            },
            {
                title: 'Membres',
                href: `/workspace/teams/${team.identifier}/members`,
                icon: Users,
            },
        ],
    }));

    return (
        <Sidebar
            collapsible={workspaceSidebarConfig.collapsible}
            variant={workspaceSidebarConfig.variant}
            className="p-0 **:data-[sidebar='sidebar']:bg-background"
        >
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <div className="flex w-full items-center gap-2 justify-between pt-2">
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
                            </div>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <WorkspaceNavGroup items={mainNavItems} />
                <WorkspaceNavGroup items={workspaceNavItems} label="Workspace" />
                {teamsNavItems.length > 0 && <WorkspaceNavGroup items={teamsNavItems} label="Mes équipes" />}
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
