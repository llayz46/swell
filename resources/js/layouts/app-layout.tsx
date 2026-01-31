import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { dashboard } from '@/routes';
import { index as loyaltyIndex } from '@/routes/loyalty';
import { index as ordersIndex } from '@/routes/orders';
import { index as wishlistIndex } from '@/routes/wishlist';
import { type BreadcrumbItem, type NavItem, SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { Calendar, Gift, Heart, LayoutGrid } from 'lucide-react';
import { type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default function AppLayout({ children, breadcrumbs, ...props }: AppLayoutProps) {
    const { t } = useTranslation();
    const { swell } = usePage<SharedData>().props;

    const mainNavItems: NavItem[] = [
        {
            title: t('nav.dashboard'),
            href: dashboard().url,
            icon: LayoutGrid,
        },
        ...(swell.wishlist?.enabled
            ? [
                  {
                      title: t('nav.wishlist'),
                      href: wishlistIndex().url,
                      icon: Heart,
                  },
              ]
            : []),
        {
            title: t('nav.orders'),
            href: ordersIndex().url,
            icon: Calendar,
        },
        ...(swell.loyalty?.enabled
            ? [
                  {
                      title: t('nav.loyalty'),
                      href: loyaltyIndex().url,
                      icon: Gift,
                  },
              ]
            : []),
    ];

    return (
        <AppLayoutTemplate breadcrumbs={breadcrumbs} mainNavItems={mainNavItems} {...props}>
            {children}
        </AppLayoutTemplate>
    );
}
