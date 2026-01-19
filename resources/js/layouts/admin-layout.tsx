import AdminLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem, type NavItem, SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { Boxes, Folders, Gift, LayoutGrid, Megaphone, Package, Tags } from 'lucide-react';
import { type PropsWithChildren } from 'react';
import { dashboard } from '@/routes/admin';
import { index as loyaltyIndex } from '@/routes/admin/loyalty';
import { index as bannersIndex } from '@/routes/admin/banners';
import { index as categoriesIndex } from '@/routes/admin/categories';
import { index as collectionsIndex } from '@/routes/admin/collections';
import { index as brandsIndex } from '@/routes/admin/brands';
import { index as productsIndex } from '@/routes/admin/products';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
        icon: LayoutGrid,
    },
    {
        title: 'Bannières',
        href: bannersIndex().url,
        icon: Megaphone,
    },
    {
        title: 'Catégories',
        href: categoriesIndex().url,
        icon: Folders,
    },
    {
        title: 'Collections',
        href: collectionsIndex().url,
        icon: Boxes,
    },
    {
        title: 'Fidélité',
        href: loyaltyIndex().url,
        icon: Gift,
    },
    {
        title: 'Marques',
        href: brandsIndex().url,
        icon: Tags,
    },
    {
        title: 'Produits',
        href: productsIndex().url,
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
