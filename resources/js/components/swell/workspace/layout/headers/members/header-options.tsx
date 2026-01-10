import type { TeamMember, WorkspaceMember } from '@/types/workspace';
import { Filter } from './filter';

export default function HeaderOptions({ members }: { members: TeamMember[] | WorkspaceMember[] }) {
    return (
        <div className="flex h-10 w-full items-center justify-between border-b px-6 py-1.5">
            <Filter members={members} />

            {/*<Button className="relative" size="xs" variant="secondary">
            <SlidersHorizontal className="size-4 mr-1" />
            Display
         </Button>*/}
        </div>
    );
}
