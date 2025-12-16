import { SidebarTrigger } from '@/components/ui/sidebar';
import { PropsWithChildren } from 'react';

export function WorkspaceSidebarHeader({ children }: PropsWithChildren) {
    return (
        <header className="flex h-10 shrink-0 items-center gap-2 border-b px-6 py-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
            </div>
            
            {children}
        </header>
    );
}
