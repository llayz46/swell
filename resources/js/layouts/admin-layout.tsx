import AdminLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem, type NavItem, SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { Boxes, Folders, Gift, LayoutGrid, Megaphone, Package, Tags } from 'lucide-react';
import { type PropsWithChildren } from 'react';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/admin',
        icon: LayoutGrid,
    },
    {
        title: 'Bannières',
        href: '/admin/banners',
        icon: Megaphone,
    },
    {
        title: 'Catégories',
        href: '/admin/categories',
        icon: Folders,
    },
    {
        title: 'Collections',
        href: '/admin/collections',
        icon: Boxes,
    },
    {
        title: 'Fidélité',
        href: '/admin/loyalty',
        icon: Gift,
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

export default function AdminLayout({ children, breadcrumbs = [], ...props }: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
    const { swell } = usePage<SharedData>().props;

    const filteredNavItems = mainNavItems.filter((item) => {
        if (item.title === 'Bannières' && !swell.banner?.enabled) return false;
        if (item.title === 'Fidélité' && !swell.loyalty?.enabled) return false;

        return true;
    });

    return (
        <AdminLayoutTemplate breadcrumbs={breadcrumbs} mainNavItems={filteredNavItems} {...props}>
            {children}
        </AdminLayoutTemplate>
    );
}
