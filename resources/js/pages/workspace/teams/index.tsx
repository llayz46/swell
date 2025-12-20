import { Badge } from '@/components/ui/badge';
import { MembersAvatarGroup } from '@/components/swell/workspace/members-avatar-group';
import { WorkspaceTableHeader } from '@/components/swell/workspace/workspace-table-header';
import WorkspaceLayout from '@/layouts/workspace-layout';
import { Team } from '@/types/workspace';
import { formatWorkspaceRole } from '@/utils/format-workspace-role';
import { Head } from '@inertiajs/react';
import { CircleDashed, Check } from 'lucide-react';
import Header from '@/components/swell/workspace/layout/headers/teams/header';

const TABLE_COLUMNS = [
    { label: 'Nom', className: 'w-[70%] sm:w-[50%] md:w-[45%] lg:w-[40%]' },
    { label: 'Adhésion', className: 'hidden sm:block sm:w-[20%] md:w-[15%]' },
    { label: 'Identifiant', className: 'hidden sm:block sm:w-[20%] md:w-[15%]' },
    { label: 'Membres', className: 'w-[30%] sm:w-[20%] md:w-[15%]' },
    { label: 'Tâches', className: 'hidden sm:block sm:w-[20%] md:w-[15%]' },
];

export default function Index({ teams }: { teams: Team[] }) {
    return (
        <WorkspaceLayout header={<Header teams={teams} />}>
            <Head title="Teams - Workspace" />

            <div className="w-full">
                <WorkspaceTableHeader columns={TABLE_COLUMNS} />

                <div className="w-full">
                    {teams.map((team) => (
                        <TeamRow key={team.id} team={team} />
                    ))}
                </div>
            </div>
        </WorkspaceLayout>
    );
}

function TeamRow({ team }: { team: Team }) {
    return (
        <div className="flex w-full items-center border-b border-muted-foreground/5 px-6 py-3 text-sm hover:bg-sidebar/50">
            <div className="flex w-[70%] items-center gap-2 sm:w-[50%] md:w-[45%] lg:w-[40%]">
                <div className="inline-flex size-6 shrink-0 items-center justify-center rounded bg-muted/50">
                    <div className="text-sm">{team.icon}</div>
                </div>
                <span className="w-full truncate font-medium">{team.name}</span>
            </div>

            <div className="hidden text-xs text-muted-foreground sm:block sm:w-[20%] md:w-[15%]">
                {team.joined && team.role && (
                    <Badge variant="secondary" className="gap-1">
                        <Check className="size-3" />
                        {formatWorkspaceRole(team.role)}
                    </Badge>
                )}
            </div>

            <div className="hidden text-xs text-muted-foreground sm:block sm:w-[20%] md:w-[15%]">
                {team.identifier}
            </div>

            <div className="flex w-[30%] sm:w-[20%] md:w-[15%]">
                {team.members && team.members.length > 0 && <MembersAvatarGroup members={team.members} />}
            </div>

            <div className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex sm:w-[20%] md:w-[15%]">
                <CircleDashed className="size-4" />
                {team.issuesCount ?? 0}
            </div>
        </div>
    );
}
