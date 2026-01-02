import Header from '@/components/swell/workspace/layout/headers/members/header';
import { WorkspaceTableHeader } from '@/components/swell/workspace/workspace-table-header';
import WorkspaceLayout from '@/layouts/workspace-layout';
import { Team, TeamMember } from '@/types/workspace';
import { Head } from '@inertiajs/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { formatWorkspaceRole } from '@/utils/format-workspace-role';
import { useWorkspaceRole } from '@/hooks/use-workspace-role';
import { useInitials } from '@/hooks/use-initials';
import { useWorkspaceMembersStore } from '@/stores/workspace-members-store';
import { useWorkspaceIssuesStore } from '@/stores/workspace-issues-store';
import { toast } from 'sonner';
import { MoreHorizontal, Shield, ShieldOff, UserMinus } from 'lucide-react';
import { useEffect } from 'react';

interface IssuesPageProps {
    team: Team;
    members: TeamMember[];
}

const TABLE_COLUMNS = [
    { label: 'Nom', className: 'w-[75%] md:w-[65%]' },
    { label: 'Rôle', className: 'w-[20%] md:w-[15%]' },
    { label: 'Rejoint le', className: 'hidden md:block md:w-[15%]' },
    { label: 'Actions', className: 'w-[5%] flex justify-center' },
];

export default function Members({ team }: IssuesPageProps) {
    useEffect(() => {
        useWorkspaceIssuesStore.getState().setTeam(team);
    }, [team]);

    return (
        <WorkspaceLayout
            header={<Header members={team.members ?? []} />}
            tableHeader={<WorkspaceTableHeader columns={TABLE_COLUMNS} />}
        >
            <Head title={`Tâches - ${team.identifier} - Workspace`} />

            <div className="w-full">
                {team.members?.map((member) => (
                    <MemberRow key={member.id} team={team} member={member} />
                ))}
            </div>
        </WorkspaceLayout>
    );
}

function MemberRow({ team, member }: { team: Team; member: TeamMember }) {
    const { isLead } = useWorkspaceRole(team.id);
    const getInitials = useInitials();
    
    const {
        performPromoteMember,
        performDemoteMember,
        performRemoveMember,
    } = useWorkspaceMembersStore();
    
    const handleRemoveMember = (member: TeamMember) => {
        if (!isLead) return toast.error("Vous n'avez pas les droits pour retirer un membre de l'équipe");
        performRemoveMember(team, member);
    };

    return (
        <div className="flex w-full items-center border-b border-muted-foreground/5 px-6 py-3 text-sm hover:bg-sidebar/50">
            <div className="flex w-[75%] items-center gap-2 md:w-[65%]">
                <Avatar className="size-8 shrink-0">
                    <AvatarImage src={member.avatar_url} alt={member.name} />
                    <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                </Avatar>

                <div className="flex flex-col items-start overflow-hidden">
                    <span className="w-full truncate font-medium">{member.name}</span>
                    <span className="w-full truncate text-xs text-muted-foreground">{member.email}</span>
                </div>
            </div>

            <div className="w-[20%] text-xs text-muted-foreground md:w-[15%]">
                <Badge variant="secondary">{formatWorkspaceRole(member.role)}</Badge>
            </div>

            <div className="hidden w-[15%] text-xs text-muted-foreground md:block">
                {format(member.joined_at, 'dd MMMM yyyy', { locale: fr })}
            </div>

            <div className="flex w-[5%] justify-center">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8">
                            <MoreHorizontal className="size-4" />
                            <span className="sr-only">Actions</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {member.role === 'team-member' ? (
                            <DropdownMenuItem onClick={() => performPromoteMember(team, member)}>
                                <Shield className="mr-2 size-4" />
                                Promouvoir en lead
                            </DropdownMenuItem>
                        ) : (
                            <DropdownMenuItem onClick={() => performDemoteMember(team, member)}>
                                <ShieldOff className="mr-2 size-4" />
                                Rétrograder en membre
                            </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleRemoveMember(member)} className="text-destructive hover:bg-destructive/15! hover:text-destructive! focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40">
                            <UserMinus className="mr-2 size-4 text-destructive" />
                            Retirer de l'équipe
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}