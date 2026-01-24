import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { dashboard } from '@/routes';
import { index as loyaltyIndex } from '@/routes/loyalty';
import { index as ordersIndex } from '@/routes/orders';
import { index as wishlistIndex } from '@/routes/wishlist';
import { type BreadcrumbItem, type NavItem, SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { Calendar, Gift, Heart, LayoutGrid } from 'lucide-react';
import { type ReactNode } from 'react';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
        icon: LayoutGrid,
    },
    {
        title: 'Wishlist',
        href: wishlistIndex().url,
        icon: Heart,
    },
    {
        title: 'Commandes',
        href: ordersIndex().url,
        icon: Calendar,
    },
    {
        title: 'Fidélité',
        href: loyaltyIndex().url,
        icon: Gift,
    },
];

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default function AppLayout({ children, breadcrumbs, ...props }: AppLayoutProps) {
    const { swell } = usePage<SharedData>().props;

    const filteredNavItems = mainNavItems.filter((item) => {
        return !(item.title === 'Wishlist' && !swell.wishlist?.enabled);
    });

    return (
        <AppLayoutTemplate breadcrumbs={breadcrumbs} mainNavItems={filteredNavItems} {...props}>
            {children}
        </AppLayoutTemplate>
    );
}
