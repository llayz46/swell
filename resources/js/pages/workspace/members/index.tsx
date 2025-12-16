import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TeamsBadgeGroup } from '@/components/swell/workspace/teams-badge-group';
import { WorkspaceTableHeader } from '@/components/swell/workspace/workspace-table-header';
import WorkspaceLayout from '@/layouts/workspace-layout';
import { User } from '@/types';
import { formatWorkspaceRole } from '@/utils/format-workspace-role';
import { Head } from '@inertiajs/react';
import { Plus } from 'lucide-react';

const TABLE_COLUMNS = [
    { label: 'Nom', className: 'w-[85%] md:w-[70%]' },
    { label: 'Rôle', className: 'w-[15%]' },
    { label: 'Teams', className: 'hidden md:block md:w-[15%]' },
];

export default function Index({ members }: { members: User[] }) {
    return (
        <WorkspaceLayout
            header={
                <div className="flex w-full items-center justify-between">
                    <div className="flex items-center gap-1">
                        <span className="text-sm font-semibold">Membres</span>
                        <Badge variant="secondary">{members.length}</Badge>
                    </div>

                    <Button variant="secondary" size="xs">
                        <Plus />
                        Inviter
                    </Button>
                </div>
            }
        >
            <Head title="Membres - Workspace" />

            <div className="w-full">
                <WorkspaceTableHeader columns={TABLE_COLUMNS} />

                <div className="w-full">
                    {members.map((member) => (
                        <MemberRow key={member.id} user={member} />
                    ))}
                </div>
            </div>
        </WorkspaceLayout>
    );
}

function MemberRow({ user }: { user: User }) {
    return (
        <div className="flex w-full items-center border-b border-muted-foreground/5 px-6 py-3 text-sm hover:bg-sidebar/50">
            <div className="flex w-[85%] md:w-[70%] items-center gap-2">
                <Avatar className="size-8 shrink-0">
                    <AvatarImage src={user.avatarUrl} alt={user.name} />
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>
                
                <div className="flex flex-col items-start overflow-hidden">
                    <span className="w-full truncate font-medium">{user.name}</span>
                    <span className="w-full truncate text-xs text-muted-foreground">{user.email}</span>
                </div>
            </div>

            <div className="w-[15%] text-xs text-muted-foreground">
                <Badge variant="secondary">{formatWorkspaceRole(user.roles)}</Badge>
            </div>

            <div className="hidden w-[30%] text-xs text-muted-foreground md:flex md:w-[15%]">
                {user.teams && <TeamsBadgeGroup teams={user.teams} />}
            </div>
        </div>
    );
}
