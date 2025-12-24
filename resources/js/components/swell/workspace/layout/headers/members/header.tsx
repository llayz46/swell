import type { TeamMember } from '@/types/workspace';
import HeaderNav from './header-nav';
import HeaderOptions from './header-options';

export default function Header({ members }: { members: TeamMember[] }) {
    return (
        <div className="flex w-full flex-col items-center">
            <HeaderNav members={members.length} />
            <HeaderOptions members={members} />
        </div>
    );
}
