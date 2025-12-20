import HeaderNav from './header-nav';
import HeaderOptions from './header-options';
import type { TeamMember } from "@/types/workspace";

export default function Header({ members }: { members: TeamMember[] }) {
   return (
      <div className="w-full flex flex-col items-center">
         <HeaderNav members={members.length} />
         <HeaderOptions members={members} />
      </div>
   );
}