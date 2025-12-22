import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { IssueAssignee } from '@/types/workspace';
import { CheckIcon, CircleUserRound, Send, UserIcon } from 'lucide-react';
import { useWorkspaceIssuesStore } from '@/stores/workspace-issues-store';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { router } from '@inertiajs/react';

interface AssigneeUserProps {
    user: IssueAssignee | null;
    issueId: number;
}

export function UserAssignee({ user, issueId }: AssigneeUserProps) {
    const [open, setOpen] = useState(false);
    const [currentAssignee, setCurrentAssignee] = useState<IssueAssignee | null>(user);
    const [isUpdating, setIsUpdating] = useState<boolean>(false);

    const members = useWorkspaceIssuesStore((state) => state.team?.members || []);
    const updateIssueAssignee = useWorkspaceIssuesStore((state) => state.updateIssueAssignee);

    useEffect(() => {
        setCurrentAssignee(user);
    }, [user]);
    
    const handleAssigneeChange = (newAssignee: IssueAssignee | null) => {
        setOpen(false);

        if (newAssignee?.id === user?.id) return;

        setCurrentAssignee(newAssignee);
        updateIssueAssignee(issueId, newAssignee);

        setIsUpdating(true);

        router.patch(
            route('workspace.issues.update-assignee', { issue: issueId }),
            { assignee_id: newAssignee?.id || null },
            {
                preserveScroll: true,
                preserveState: true,
                onError: (errors) => {
                    setCurrentAssignee(user);
                    updateIssueAssignee(issueId, user);
                    setIsUpdating(false);

                    toast.error(errors.assignee_id);
                },
                onSuccess: () => {
                    setIsUpdating(false);

                    toast.success('Assigné mis à jour avec succès');
                }
            }
        );
    };

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
                <button className="relative w-fit focus:outline-none">
                    {currentAssignee ? (
                        <Avatar className="size-6 shrink-0">
                            <AvatarImage src={currentAssignee.avatarUrl} alt={currentAssignee.name} />
                            <AvatarFallback>{currentAssignee.name[0]}</AvatarFallback>
                        </Avatar>
                    ) : (
                        <CircleUserRound className="size-5 text-zinc-600" />
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
                                <AvatarImage src={member.avatarUrl} alt={member.name} />
                                <AvatarFallback>{member.name[0]}</AvatarFallback>
                            </Avatar>

                            <span>{member.name}</span>
                        </div>

                        {currentAssignee?.id === member.id && <CheckIcon className="ml-auto size-4" />}
                    </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Nouveau membre</DropdownMenuLabel>
                <DropdownMenuItem>
                    <div className="flex items-center gap-2">
                        <Send className="size-4" />
                        <span>Inviter et assigner...</span>
                    </div>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
