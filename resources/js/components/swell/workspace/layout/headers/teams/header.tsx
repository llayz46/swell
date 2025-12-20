import HeaderNav from './header-nav';
import HeaderOptions from './header-options';
import type { Team } from "@/types/workspace";

export default function Header({ teams }: { teams: Team[] }) {
   return (
      <div className="w-full flex flex-col items-center">
         <HeaderNav teamsLength={teams.length} />
         <HeaderOptions teams={teams} />
      </div>
   );
}