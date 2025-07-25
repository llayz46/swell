import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { type BreadcrumbItem, type NavItem } from '@/types';
import { type PropsWithChildren } from 'react';
import { AppHeader } from '@/components/app-header';
import { ToasterWrapper } from '@/components/toaster-wrapper';
import { Folders, LayoutGrid, Megaphone, Package, Tags } from 'lucide-react';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/admin',
        icon: LayoutGrid,
    },
    {
        title: 'Bannière',
        href: '/admin/banners',
        icon: Megaphone,
    },
    {
        title: 'Catégories',
        href: '/admin/categories',
        icon: Folders,
    },
    {
        title: 'Marques',
        href: '/admin/brands',
        icon: Tags,
    },
    {
        title: 'Produits',
        href: '/admin/products',
        icon: Package,
    },
];

export default function AdminLayout({ children, breadcrumbs = [] }: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
    return (
        <AppShell>
            <AppHeader breadcrumbs={breadcrumbs} mainNavItems={mainNavItems} />
            <AppContent>
                {children}
                <ToasterWrapper />
            </AppContent>
        </AppShell>
    );
}
