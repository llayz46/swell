import { AppContent } from '@/components/app-content';
import { AppHeader } from '@/components/app-header';
import { AppShell } from '@/components/app-shell';
import { type BreadcrumbItem, NavItem } from '@/types';
import type { PropsWithChildren } from 'react';

export default function AppHeaderLayout({ children, breadcrumbs, mainNavItems }: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[]; mainNavItems: NavItem[] }>) {
    return (
        <AppShell>
            <AppHeader breadcrumbs={breadcrumbs} mainNavItems={mainNavItems} />
            <AppContent>{children}</AppContent>
        </AppShell>
    );
}
