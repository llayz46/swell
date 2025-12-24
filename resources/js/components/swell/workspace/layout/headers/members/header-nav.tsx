import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Plus } from 'lucide-react';

export default function HeaderNav({ members }: { members: number }) {
    return (
        <div className="flex h-10 w-full items-center justify-between border-b px-6 py-1.5">
            <div className="flex items-center gap-2">
                <SidebarTrigger />

                <div className="flex items-center gap-1">
                    <span className="text-sm font-medium">Membres</span>
                    <Badge variant="secondary">{members}</Badge>
                </div>
            </div>

            <Button variant="secondary" size="xs">
                <Plus />
                Inviter
            </Button>
        </div>
    );
}
