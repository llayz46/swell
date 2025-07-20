import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { type BreadcrumbItem } from '@/types';
import { type PropsWithChildren } from 'react';
import { AppHeader } from '@/components/app-header';
import { Toaster } from 'sonner';
import { useAppearance } from '@/hooks/use-appearance';

export default function AdminLayout({ children, breadcrumbs = [] }: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
    const { appearance } = useAppearance();

    return (
        <AppShell>
            <AppHeader breadcrumbs={breadcrumbs} />
            <AppContent>
                {children}
                <Toaster
                    theme={appearance}
                    toastOptions={{
                        classNames: {
                            toast: '!bg-background !border !border-border !text-sm !font-medium !font-sans',
                            description: '!text-sm !text-muted-foreground !font-sans',
                        },
                    }}
                />
            </AppContent>
        </AppShell>
    );
}
