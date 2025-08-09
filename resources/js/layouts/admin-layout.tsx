import { type BreadcrumbItem, type NavItem, SharedData } from '@/types';
import { type PropsWithChildren } from 'react';
import { Boxes, Folders, LayoutGrid, Megaphone, Package, Tags } from 'lucide-react';
import { usePage } from '@inertiajs/react';
import AdminLayoutTemplate from '@/layouts/app/app-header-layout';

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
    const { swell } = usePage<SharedData>().props

    const filteredNavItems = mainNavItems.filter((item) => {
        return !(item.title === 'Bannière' && !swell.banner?.enabled);
    });

    return (
        <AdminLayoutTemplate breadcrumbs={breadcrumbs} mainNavItems={filteredNavItems} {...props}>
            {children}
        </AdminLayoutTemplate>
    );
}
