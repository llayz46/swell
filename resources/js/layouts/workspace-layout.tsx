import WorkspaceLayoutTemplate from '@/layouts/workspace/layout';
import { NavItem } from '@/types';
import { ChartColumn, Contact, FolderKanban, Inbox, User } from 'lucide-react';
import { type PropsWithChildren, type ReactNode } from 'react';

const mainNavItems: NavItem[] = [
    {
        title: 'Boîte de réception',
        href: '/workspace/inbox',
        icon: Inbox,
    },
    {
        title: 'Mes tâches',
        href: '/workspace/my-issues',
        icon: FolderKanban,
    },
];

const workspaceNavItems: NavItem[] = [
    {
        title: 'Tableau de bord',
        href: '/workspace',
        icon: ChartColumn,
    },
    {
        title: 'Teams',
        href: '/workspace/teams',
        icon: Contact,
    },
    {
        title: 'Membres',
        href: '/workspace/members',
        icon: User,
    },
];

interface WorkspaceLayoutProps extends PropsWithChildren {
    header?: ReactNode;
    headersNumber?: 1 | 2;
    tableHeader?: ReactNode;
}

export default function WorkspaceLayout({ children, header, headersNumber = 2, tableHeader }: WorkspaceLayoutProps) {
    return (
        <WorkspaceLayoutTemplate
            mainNavItems={mainNavItems}
            workspaceNavItems={workspaceNavItems}
            header={header}
            headersNumber={headersNumber}
            tableHeader={tableHeader}
        >
            {children}
        </WorkspaceLayoutTemplate>
    );
}
