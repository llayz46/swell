import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem, type NavItem, SharedData } from '@/types';
import { type ReactNode } from 'react';
import { Calendar, Heart, LayoutGrid } from 'lucide-react';
import { usePage } from '@inertiajs/react';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Wishlist',
        href: '/wishlist',
        icon: Heart,
    },
    {
        title: 'Commandes',
        href: '/orders',
        icon: Calendar,
    },
];

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default function AppLayout({ children, breadcrumbs, ...props }: AppLayoutProps) {
    const { swell } = usePage<SharedData>().props

    const filteredNavItems = mainNavItems.filter((item) => {
        return !(item.title === 'Wishlist' && !swell.wishlist?.enabled);
    });

    return (
        <AppLayoutTemplate breadcrumbs={breadcrumbs} mainNavItems={filteredNavItems} {...props}>
            {children}
        </AppLayoutTemplate>
    );
}
