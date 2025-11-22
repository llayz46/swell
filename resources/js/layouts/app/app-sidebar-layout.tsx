import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { ToasterWrapper } from '@/components/swell/toaster-wrapper';
import { type BreadcrumbItem, NavItem } from '@/types';
import { type PropsWithChildren } from 'react';

export default function AppSidebarLayout({
    children,
    breadcrumbs = [],
    mainNavItems,
}: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[]; mainNavItems: NavItem[] }>) {
    return (
        <AppShell variant="sidebar">
            <AppSidebar mainNavItems={mainNavItems} />
            <AppContent variant="sidebar" className="overflow-x-hidden">
                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                {children}
                <ToasterWrapper />
            </AppContent>
        </AppShell>
    );
}
