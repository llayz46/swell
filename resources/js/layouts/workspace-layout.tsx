import WorkspaceLayoutTemplate from '@/layouts/workspace/layout';
import { NavItem } from '@/types';
import { Contact, FolderKanban, Inbox, User } from 'lucide-react';
import { type PropsWithChildren, type ReactNode } from 'react';
import { index as inboxIndex } from '@/routes/workspace/inbox';
import { overview } from '@/routes/workspace/my-issues';
import { index as teamsIndex } from '@/routes/workspace/teams';
import { members } from '@/routes/workspace';

const mainNavItems: NavItem[] = [
    {
        title: 'Boîte de réception',
        href: inboxIndex().url,
        icon: Inbox,
    },
    {
        title: 'Mes tâches',
        href: overview().url,
        icon: FolderKanban,
    },
];

const workspaceNavItems: NavItem[] = [
    {
        title: 'Teams',
        href: teamsIndex().url,
        icon: Contact,
    },
    {
        title: 'Membres',
        href: members().url,
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
