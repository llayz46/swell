import WorkspaceLayoutTemplate from '@/layouts/workspace/layout';
import { type PropsWithChildren, type ReactNode } from 'react';
import { NavItem } from '@/types';
import { Inbox, FolderKanban, User, Contact, ChartColumn } from 'lucide-react';

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
}

export default function WorkspaceLayout({ children, header }: WorkspaceLayoutProps) {
    return (
        <WorkspaceLayoutTemplate
            mainNavItems={mainNavItems}
            workspaceNavItems={workspaceNavItems}
            header={header}
        >
            {children}
        </WorkspaceLayoutTemplate>
    )
}