import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { useActiveNav } from '@/hooks/use-active-nav';
import { useConfirmContext } from '@/contexts/confirm-context';
import { NavItemWithChildren, type NavItem } from '@/types';
import { Link, router } from '@inertiajs/react';
import { ChevronRight, MoreHorizontal, Settings, LogOutIcon } from 'lucide-react';
import { toast } from 'sonner';

const isNavItemWithChildren = (item: NavItem | NavItemWithChildren): item is NavItemWithChildren => {
    return 'childrens' in item && Array.isArray(item.childrens);
};

export function WorkspaceNavGroup({ items = [], label }: { items: (NavItem | NavItemWithChildren)[]; label?: string }) {
    return (
        <SidebarGroup>
            {label && <SidebarGroupLabel>{label}</SidebarGroupLabel>}
            <SidebarMenu>
                {items.map((item) => {
                    if (isNavItemWithChildren(item)) {
                        return <CollapsibleNavItem key={item.title} item={item} />;
                    }

                    return <SidebarMenuItemWithActive key={item.title} item={item} />;
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}

const SidebarMenuItemWithActive = ({ child = false, item }: { child?: boolean; item: NavItem }) => {
    const isActive = useActiveNav(item.href);

    if (child) {
        return (
            <SidebarMenuSubItem>
                <SidebarMenuSubButton asChild isActive={isActive}>
                    <Link href={item.href}>
                        {item.icon && <item.icon size={14} />}
                        <span>{item.title}</span>
                    </Link>
                </SidebarMenuSubButton>
            </SidebarMenuSubItem>
        );
    }

    return (
        <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive} tooltip={{ children: item.title }}>
                <Link href={item.href} prefetch>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                </Link>
            </SidebarMenuButton>
        </SidebarMenuItem>
    );
};

const CollapsibleNavItem = ({ item }: { item: NavItemWithChildren }) => {
    const { confirm } = useConfirmContext();

    const handleLeaveTeam = async (teamId: number) => {
        await confirm({
            title: 'Voulez-vous vraiment quitter cette équipe ?',
            description:
            'Voulez-vous vraiment quitter cette équipe ? Ceci est une action irréversible.',
            confirmText: 'Quitter l\'équipe',
            cancelText: 'Annuler',
            variant: 'destructive',
            icon: <LogOutIcon className="size-4" />,
            onConfirm: () => leaveTeam(teamId),
        });
    };

    const leaveTeam = (teamId: number) => {
        router.post(route('workspace.teams.leave', teamId), {}, {
            onSuccess: () => {
                toast.success('Vous avez quitté l\'équipe')
            },
            onError: (error) => {
                toast.error(error.team)
            }
        });
    };

    return (
        <Collapsible asChild className="group/collapsible">
            <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.title}>
                        {item.icon && (
                            <div className="inline-flex size-6 shrink-0 items-center justify-center rounded bg-muted/50">
                                {typeof item.icon === 'string' ? item.icon : <item.icon />}
                            </div>
                        )}
                        <span className="text-sm">{item.title}</span>
                        <span className="w-3 shrink-0">
                            <ChevronRight className="w-full transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        </span>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuAction asChild showOnHover>
                                    <div>
                                        <MoreHorizontal />
                                        <span className="sr-only">More</span>
                                    </div>
                                </SidebarMenuAction>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-48 rounded-lg" side="right" align="start">
                                <DropdownMenuItem disabled>
                                    <Settings className="size-4" />
                                    <span>Paramètres</span>
                                </DropdownMenuItem>
                                {/*<DropdownMenuItem>
                                    <LinkIcon className="size-4" />
                                    <span>Copier le lien</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Archive className="size-4" />
                                    <span>Ouvrir les archives</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <Bell className="size-4" />
                                    <span>S'abonner</span>
                                </DropdownMenuItem>*/}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    className="text-destructive hover:bg-destructive/15! hover:text-destructive! focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (item.id) handleLeaveTeam(item.id);
                                    }}
                                >
                                    <span>Quitter l'équipe</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <SidebarMenuSub>
                        {item.childrens.map((child) => (
                            <SidebarMenuItemWithActive key={child.title} child item={child} />
                        ))}
                    </SidebarMenuSub>
                </CollapsibleContent>
            </SidebarMenuItem>
        </Collapsible>
    );
};
