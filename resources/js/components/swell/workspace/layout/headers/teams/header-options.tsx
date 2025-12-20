import { Filter } from './filter';
import type { Team } from '@/types/workspace';

export default function HeaderOptions({ teams }: { teams: Team[] }) {
   return (
      <div className="w-full flex justify-between items-center border-b py-1.5 px-6 h-10">
         <Filter teams={teams} />
         
         {/*<Button className="relative" size="xs" variant="secondary">
            <SlidersHorizontal className="size-4 mr-1" />
            Display
         </Button>*/}
      </div>
   );
}