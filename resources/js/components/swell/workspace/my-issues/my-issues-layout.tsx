import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { LayoutDashboard, Target } from 'lucide-react';
import type { ReactNode } from 'react';

interface MyIssuesLayoutProps {
    children: ReactNode;
    activeTab: 'overview' | 'focus';
}

export function MyIssuesLayout({ children, activeTab }: MyIssuesLayoutProps) {
    return (
        <div className="flex h-full flex-col gap-0">
            <div className="border-b px-6 pt-4">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold tracking-tight">Mes tâches</h1>
                </div>
                <div className="flex gap-0">
                    <TabLink href={route('workspace.my-issues.overview')} active={activeTab === 'overview'}>
                        <LayoutDashboard className="size-4" />
                        Aperçu
                    </TabLink>
                    <TabLink href={route('workspace.my-issues.focus')} active={activeTab === 'focus'}>
                        <Target className="size-4" />
                        Focus
                    </TabLink>
                </div>
            </div>
            <div className="min-h-0 flex-1">{children}</div>
        </div>
    );
}

interface TabLinkProps {
    href: string;
    active: boolean;
    children: ReactNode;
}

function TabLink({ href, active, children }: TabLinkProps) {
    return (
        <Link
            href={href}
            prefetch="mount"
            className={cn(
                'inline-flex h-10 items-center justify-center gap-2 border-b-2 px-4 text-sm font-medium transition-colors',
                active
                    ? 'border-primary text-foreground'
                    : 'border-transparent text-muted-foreground hover:border-muted-foreground/20 hover:text-foreground',
            )}
        >
            {children}
        </Link>
    );
}
