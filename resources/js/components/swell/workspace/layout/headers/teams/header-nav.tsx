import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function HeaderNav({ teamsLength }: { teamsLength: number }) {
   return (
      <div className="w-full flex justify-between items-center border-b py-1.5 px-6 h-10">
         <div className="flex items-center gap-2">
             <SidebarTrigger/>
             
            <div className="flex items-center gap-1">
               <span className="text-sm font-medium">Teams</span>
               <Badge variant="secondary">{teamsLength}</Badge>
            </div>
         </div>
         
        <Button variant="secondary" size="xs">
            <Plus />
            Ajouter une team
        </Button>
      </div>
   );
}