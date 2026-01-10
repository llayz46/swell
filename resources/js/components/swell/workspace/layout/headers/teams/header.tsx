import type { Team } from '@/types/workspace';
import HeaderNav from './header-nav';
import HeaderOptions from './header-options';

export default function Header({ teams }: { teams: Team[] }) {
    return (
        <div className="flex w-full flex-col items-center">
            <HeaderNav teamsLength={teams.length} />
            <HeaderOptions teams={teams} />
        </div>
    );
}
