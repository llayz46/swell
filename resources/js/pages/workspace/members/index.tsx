import Header from '@/components/swell/workspace/layout/headers/members/header';
import { TeamsBadgeGroup } from '@/components/swell/workspace/members/teams-badge-group';
import { WorkspaceTableHeader } from '@/components/swell/workspace/workspace-table-header';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import WorkspaceLayout from '@/layouts/workspace-layout';
import { WorkspaceMember } from '@/types/workspace';
import { formatWorkspaceRole } from '@/utils/format-workspace-role';
import { useInitials } from '@/hooks/use-initials';
import { useWorkspaceMembersStore } from '@/stores/workspace-members-store';
import { Head } from '@inertiajs/react';
import { useEffect } from 'react';

const TABLE_COLUMNS = [
    { label: 'Nom', className: 'w-[85%] md:w-[70%]' },
    { label: 'Rôle', className: 'w-[15%]' },
    { label: 'Teams', className: 'hidden md:block md:w-[15%]' },
];

export default function Index({ members }: { members: WorkspaceMember[] }) {
    const { setMembers, getFilteredAndSortedMembers } = useWorkspaceMembersStore();
    const filteredMembers = getFilteredAndSortedMembers() as WorkspaceMember[];

    useEffect(() => {
        setMembers(members);
    }, [members, setMembers]);

    return (
        <WorkspaceLayout
            header={<Header members={members} />}
            tableHeader={<WorkspaceTableHeader columns={TABLE_COLUMNS} />}
        >
            <Head title="Membres - Workspace" />

            <div className="w-full">
                {filteredMembers.map((member) => (
                    <MemberRow key={member.id} member={member} />
                ))}
            </div>
        </WorkspaceLayout>
    );
}

function MemberRow({ member }: { member: WorkspaceMember }) {
    const getInitials = useInitials();

    return (
        <div className="flex w-full items-center border-b border-muted-foreground/5 px-6 py-3 text-sm hover:bg-sidebar/50">
            <div className="flex w-[85%] items-center gap-2 md:w-[70%]">
                <Avatar className="size-8 shrink-0">
                    <AvatarImage src={member.avatar_url} alt={member.name} />
                    <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                </Avatar>

                <div className="flex flex-col items-start overflow-hidden">
                    <span className="w-full truncate font-medium">{member.name}</span>
                    <span className="w-full truncate text-xs text-muted-foreground">{member.email}</span>
                </div>
            </div>

            <div className="w-[15%] text-xs text-muted-foreground">
                <Badge variant="secondary">{formatWorkspaceRole(member.workspaceRole)}</Badge>
            </div>

            <div className="hidden w-[30%] text-xs text-muted-foreground md:flex md:w-[15%]">
                {member.teams && <TeamsBadgeGroup teams={member.teams} />}
            </div>
        </div>
    );
}
