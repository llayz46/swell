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
import { NavItemWithChildren, type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { Archive, Bell, ChevronRight, Link as LinkIcon, MoreHorizontal, Settings } from 'lucide-react';

const isNavItemWithChildren = (item: NavItem | NavItemWithChildren): item is NavItemWithChildren => {
    return 'childrens' in item && Array.isArray(item.childrens);
};

export function WorkspaceNavGroup({ items = [], label }: { items: (NavItem | NavItemWithChildren)[]; label?: string }) {
    return (
        <SidebarGroup>
            {label && <SidebarGroupLabel>{label}</SidebarGroupLabel>}
            <SidebarMenu>
                {items.map((item, index) => {
                    if (isNavItemWithChildren(item)) {
                        return <CollapsibleNavItem key={item.title} item={item} defaultOpen={index === 0} />;
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

const CollapsibleNavItem = ({ item, defaultOpen }: { item: NavItemWithChildren; defaultOpen: boolean }) => {
    return (
        <Collapsible asChild defaultOpen={defaultOpen} className="group/collapsible">
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
                                <DropdownMenuItem>
                                    <Settings className="size-4" />
                                    <span>Team settings</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <LinkIcon className="size-4" />
                                    <span>Copy link</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Archive className="size-4" />
                                    <span>Open archive</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <Bell className="size-4" />
                                    <span>Subscribe</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <span>Leave team...</span>
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
