import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useWorkspaceIssuesStore } from '@/stores/workspace-issues-store';
import { useWorkspaceMembersStore } from '@/stores/workspace-members-store';
import { SharedData } from '@/types';
import { IssueAssignee } from '@/types/workspace';
import { usePage } from '@inertiajs/react';
import { CheckIcon, CircleUserRound, Send, UserIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

interface AssigneeUserProps {
    user: IssueAssignee | null;
    issueId: number;
}

export function UserAssignee({ user, issueId }: AssigneeUserProps) {
    const [open, setOpen] = useState(false);
    const [currentAssignee, setCurrentAssignee] = useState<IssueAssignee | null>(user);

    const { auth } = usePage<SharedData>().props;
    const { openInviteMemberDialog } = useWorkspaceMembersStore();

    const { team, members, updatingIssues, performUpdateAssignee } = useWorkspaceIssuesStore(
        useShallow((state) => ({
            team: state.team,
            members: state.team?.members || [],
            updatingIssues: state.updatingIssues,
            performUpdateAssignee: state.performUpdateAssignee,
        })),
    );

    const isUpdating = updatingIssues.has(issueId);

    useEffect(() => {
        setCurrentAssignee(user);
    }, [user]);

    const handleAssigneeChange = (newAssignee: IssueAssignee | null) => {
        setOpen(false);

        if (newAssignee?.id === user?.id) return;

        setCurrentAssignee(newAssignee);
        performUpdateAssignee(issueId, newAssignee, user);
    };

    const isAdminOrTeamLead = auth.user?.roles?.some(role => role.name === 'team-lead' || role.name === 'workspace-admin') ?? false;
    
    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
                <button className="relative w-fit focus:outline-none">
                    {currentAssignee ? (
                        <Avatar className="size-6 shrink-0">
                            <AvatarImage src={currentAssignee.avatar_url} alt={currentAssignee.name} />
                            <AvatarFallback>{currentAssignee.name[0]}</AvatarFallback>
                        </Avatar>
                    ) : (
                        <CircleUserRound className="size-6 text-zinc-600" />
                    )}
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-52">
                <DropdownMenuLabel>Assigner à...</DropdownMenuLabel>
                <DropdownMenuItem
                    onClick={(e) => {
                        e.stopPropagation();
                        handleAssigneeChange(null);
                    }}
                    disabled={isUpdating}
                >
                    <div className="flex items-center gap-2">
                        <UserIcon className="size-5" />
                        <span>Personne</span>
                    </div>

                    {!currentAssignee && <CheckIcon className="ml-auto size-4" />}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {members.map((member) => (
                    <DropdownMenuItem
                        key={member.id}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleAssigneeChange(member);
                        }}
                        disabled={isUpdating}
                    >
                        <div className="flex items-center gap-2">
                            <Avatar className="size-5">
                                <AvatarImage src={member.avatar_url} alt={member.name} />
                                <AvatarFallback>{member.name[0]}</AvatarFallback>
                            </Avatar>

                            <span>{member.name}</span>
                        </div>

                        {currentAssignee?.id === member.id && <CheckIcon className="ml-auto size-4" />}
                    </DropdownMenuItem>
                ))}
                
                {isAdminOrTeamLead && (
                    <>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel>Nouveau membre</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => {
                            openInviteMemberDialog({ teamId: team?.id });
                        }}>
                            <div className="flex items-center gap-2">
                                <Send className="size-4" />
                                <span>Inviter</span>
                            </div>
                        </DropdownMenuItem>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
