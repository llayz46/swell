import { Filter } from './filter';
import type { TeamMember } from '@/types/workspace';

export default function HeaderOptions({ members }: { members: TeamMember[] }) {
   return (
      <div className="w-full flex justify-between items-center border-b py-1.5 px-6 h-10">
         <Filter members={members} />
         
         {/*<Button className="relative" size="xs" variant="secondary">
            <SlidersHorizontal className="size-4 mr-1" />
            Display
         </Button>*/}
      </div>
   );
}