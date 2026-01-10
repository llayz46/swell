import { SidebarTrigger } from '@/components/ui/sidebar';

export default function HeaderNav() {
    return (
        <div className="flex h-10 w-full items-center justify-between border-b px-6 py-1.5">
            <SidebarTrigger className="" />
        </div>
    );
}
