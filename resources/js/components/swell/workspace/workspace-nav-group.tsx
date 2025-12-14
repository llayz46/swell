import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { useActiveNav } from '@/hooks/use-active-nav';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';

export function WorkspaceNavGroup({ items = [], label }: { items: NavItem[], label?: string }) {
    return (
        <SidebarGroup>
            {label && <SidebarGroupLabel>{label}</SidebarGroupLabel>}
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItemWithActive 
                        key={item.title} 
                        item={item} 
                    />
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}

const SidebarMenuItemWithActive = ({ item }: { item: NavItem }) => {
    const isActive = useActiveNav(item.href);

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
}