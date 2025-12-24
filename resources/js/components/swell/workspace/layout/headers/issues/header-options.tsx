import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { SlidersHorizontal, LayoutList, LayoutGrid } from 'lucide-react';
import { Filter } from './filter';

export default function HeaderOptions() {
    return (
        <div className="flex h-10 w-full items-center justify-between border-b px-6 py-1.5">
            <Filter />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button className="relative" size="xs" variant="secondary">
                        <SlidersHorizontal className="mr-1 size-4" />
                        Affichage
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="flex w-72 gap-2 p-3" align="end">
                    <DropdownMenuItem
                        className="flex w-full flex-col gap-1 border border-accent text-xs"
                    >
                        <LayoutList className="size-4" />
                        Liste
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        className="flex w-full flex-col gap-1 border border-accent text-xs"
                    >
                        <LayoutGrid className="size-4" />
                        Kanban
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
