import { PriorityIcon } from '@/components/swell/workspace/icons';
import { StatusIcon } from '@/components/swell/workspace/icons/icon-mapper';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
    ContextMenuContent,
    ContextMenuGroup,
    ContextMenuItem,
    ContextMenuSeparator,
    ContextMenuShortcut,
    ContextMenuSub,
    ContextMenuSubContent,
    ContextMenuSubTrigger,
} from '@/components/ui/context-menu';
import { useWorkspaceIssuesStore } from '@/stores/workspace-issues-store';
import type { Issue } from '@/types/workspace';
import { format, isValid, parse } from 'date-fns';
import { useState, useEffect } from 'react';
import { fr } from 'date-fns/locale';
import {
    AlarmClock,
    ArrowRightLeft,
    BarChart3,
    CalendarClock,
    CheckCircle2,
    CheckIcon,
    CircleCheck,
    Clipboard,
    Clock,
    Copy as CopyIcon,
    FileText,
    Flag,
    Link as LinkIcon,
    MessageSquare,
    Pencil,
    PlusSquare,
    Repeat2,
    Tag,
    Trash2,
    User,
    X,
} from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';

interface IssueContextMenuProps {
    issue: Issue;
}

export function IssueContextMenu({ issue }: IssueContextMenuProps) {
    const { statuses, team, priorities, labels, performUpdateStatus, performUpdateAssignee, performUpdatePriority, performToggleLabel, performUpdateDueDate, performDeleteIssue, openIssueDialog } =
        useWorkspaceIssuesStore(
            useShallow((state) => ({
                statuses: state.statuses,
                team: state.team,
                priorities: state.priorities,
                labels: state.labels,
                performUpdateStatus: state.performUpdateStatus,
                performUpdateAssignee: state.performUpdateAssignee,
                performUpdatePriority: state.performUpdatePriority,
                performToggleLabel: state.performToggleLabel,
                performUpdateDueDate: state.performUpdateDueDate,
                performDeleteIssue: state.performDeleteIssue,
                openIssueDialog: state.openIssueDialog,
            })),
        );

    const handleStatusChange = (statusSlug: string) => {
        performUpdateStatus(issue.id, statusSlug, issue.status);
    };

    const handleAssigneeChange = (assigneeId: number | null) => {
        const newAssignee = assigneeId ? team?.members?.find((m) => m.id === assigneeId) || null : null;
        performUpdateAssignee(issue.id, newAssignee, issue.assignee);
    };

    const handlePriorityChange = (priorityId: number) => {
        performUpdatePriority(issue.id, priorityId, issue.priority);
    };

    const handleLabelToggle = (labelId: number) => {
        performToggleLabel(issue.id, labelId, issue.labels);
    };

    const handleDueDateChange = (selectedDate: Date | undefined) => {
        if (selectedDate && isValid(selectedDate)) {
            const formattedDate = format(selectedDate, 'yyyy-MM-dd');
            performUpdateDueDate(issue.id, formattedDate, issue.dueDate);
            setDate(selectedDate);
        }
    };

    const handleClearDueDate = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        performUpdateDueDate(issue.id, null, issue.dueDate);
        setDate(undefined);
    };

    const initialDate = issue.dueDate ? parse(issue.dueDate, 'yyyy-MM-dd', new Date()) : undefined;
    const validInitialDate = initialDate && isValid(initialDate) ? initialDate : undefined;
    const [date, setDate] = useState<Date | undefined>(validInitialDate);

    useEffect(() => {
        const newDate = issue.dueDate ? parse(issue.dueDate, 'yyyy-MM-dd', new Date()) : undefined;
        const validDate = newDate && isValid(newDate) ? newDate : undefined;
        setDate(validDate);
    }, [issue.dueDate]);

    const handleDeleteIssue = async () => {
        await performDeleteIssue(issue.id);
    };

    return (
        <ContextMenuContent className="w-64 bg-sidebar">
            <ContextMenuGroup>
                <ContextMenuSub>
                    <ContextMenuSubTrigger>
                        <CircleCheck className="mr-2 size-4" /> Statut
                    </ContextMenuSubTrigger>
                    <ContextMenuSubContent className="w-48">
                        {statuses.map((status) => (
                            <ContextMenuItem className="gap-2" key={status.id} onClick={() => handleStatusChange(status.slug)}>
                                <StatusIcon iconType={status.icon_type} color={status.color} size={14} />
                                {status.name}
                                {issue.status.slug === status.slug && <CheckIcon size={14} className="ml-auto" />}
                            </ContextMenuItem>
                        ))}
                    </ContextMenuSubContent>
                </ContextMenuSub>

                <ContextMenuSub>
                    <ContextMenuSubTrigger>
                        <User className="mr-2 size-4" /> Attribution
                    </ContextMenuSubTrigger>
                    <ContextMenuSubContent className="w-48">
                        <ContextMenuItem
                            onClick={(e) => {
                                e.preventDefault();
                                handleAssigneeChange(null);
                            }}
                        >
                            <User className="mr-2 size-4" /> Non attribué
                            {!issue.assignee && <CheckIcon className="ml-auto size-4" />}
                        </ContextMenuItem>
                        {team?.members?.map((member) => (
                            <ContextMenuItem
                                key={member.id}
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleAssigneeChange(member.id);
                                }}
                            >
                                <Avatar className="mr-2 size-4">
                                    <AvatarImage src={member.avatarUrl} alt={member.name} />
                                    <AvatarFallback>{member.name[0]}</AvatarFallback>
                                </Avatar>
                                {member.name}
                                {member.id === issue.assignee?.id && <CheckIcon className="ml-auto size-4" />}
                            </ContextMenuItem>
                        ))}
                    </ContextMenuSubContent>
                </ContextMenuSub>

                <ContextMenuSub>
                    <ContextMenuSubTrigger>
                        <BarChart3 className="mr-2 size-4" /> Priorité
                    </ContextMenuSubTrigger>
                    <ContextMenuSubContent className="w-48">
                        {priorities.map((priority) => (
                            <ContextMenuItem
                                key={priority.id}
                                className="flex gap-2"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handlePriorityChange(priority.id);
                                }}
                            >
                                <PriorityIcon iconType={priority.icon_type} width={16} height={16} />
                                {priority.name}
                                {priority.id === issue.priority?.id && <CheckIcon className="ml-auto size-4" />}
                            </ContextMenuItem>
                        ))}
                    </ContextMenuSubContent>
                </ContextMenuSub>

                <ContextMenuSub>
                    <ContextMenuSubTrigger>
                        <Tag className="mr-2 size-4" /> Étiquettes
                    </ContextMenuSubTrigger>
                    <ContextMenuSubContent className="w-48">
                        {labels.map((label) => (
                            <ContextMenuItem
                                key={label.id}
                                className="flex gap-2"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleLabelToggle(label.id);
                                }}
                            >
                                <span className="inline-block size-2 rounded-full" style={{ backgroundColor: label.color }} aria-hidden="true" />
                                {label.name}
                                {issue.labels.some((l) => l.id === label.id) && <CheckIcon className="ml-auto size-4" />}
                            </ContextMenuItem>
                        ))}
                    </ContextMenuSubContent>
                </ContextMenuSub>

                <ContextMenuSub>
                    <ContextMenuSubTrigger>
                        <CalendarClock className="mr-2 size-4" /> Définir la date d'échéance
                    </ContextMenuSubTrigger>
                    <ContextMenuSubContent className="w-auto p-0">
                        <div className="flex flex-col">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={handleDueDateChange}
                                className="bg-transparent"
                                locale={fr}
                            />
                            {date && (
                                <div className="flex items-center justify-between border-t border-border px-3 py-2">
                                    <span className="text-sm text-muted-foreground">
                                        {format(date, 'dd MMMM yyyy', { locale: fr })}
                                    </span>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="size-6 p-0"
                                        onClick={handleClearDueDate}
                                    >
                                        <X className="size-3.5" />
                                        <span className="sr-only">Effacer la date</span>
                                    </Button>
                                </div>
                            )}
                        </div>
                    </ContextMenuSubContent>
                </ContextMenuSub>

                <ContextMenuItem onClick={() => openIssueDialog({ issue })}>
                    <Pencil className="mr-2 size-4" /> Editer
                </ContextMenuItem>

                <ContextMenuSeparator />

                {/*<ContextMenuItem onClick={handleAddLink}>*/}
                <ContextMenuItem disabled>
                    <LinkIcon className="mr-2 size-4" /> Ajouter un lien...
                    <ContextMenuShortcut>Ctrl L</ContextMenuShortcut>
                </ContextMenuItem>

                <ContextMenuSub>
                    <ContextMenuSubTrigger disabled>
                        <Repeat2 className="mr-2 size-4" /> Convertir en
                    </ContextMenuSubTrigger>
                    <ContextMenuSubContent className="w-48">
                        <ContextMenuItem disabled>
                            <FileText className="mr-2 size-4" /> Document
                        </ContextMenuItem>
                        <ContextMenuItem disabled>
                            <MessageSquare className="mr-2 size-4" /> Commentaire
                        </ContextMenuItem>
                    </ContextMenuSubContent>
                </ContextMenuSub>

                {/*<ContextMenuItem onClick={handleMakeCopy}>*/}
                <ContextMenuItem disabled>
                    <CopyIcon className="mr-2 size-4" /> Faire une copie...
                </ContextMenuItem>
            </ContextMenuGroup>

            <ContextMenuSeparator />

            {/*<ContextMenuItem onClick={handleCreateRelated}>*/}
            <ContextMenuItem disabled>
                <PlusSquare className="mr-2 size-4" /> Create related
            </ContextMenuItem>

            <ContextMenuSub>
                <ContextMenuSubTrigger disabled>
                    <Flag className="mr-2 size-4" /> Marquer comme
                </ContextMenuSubTrigger>
                <ContextMenuSubContent className="w-48">
                    {/*<ContextMenuItem onClick={() => handleMarkAs('Completed')}>*/}
                    <ContextMenuItem disabled>
                        <CheckCircle2 className="mr-2 size-4" /> Terminé
                    </ContextMenuItem>
                    {/*<ContextMenuItem onClick={() => handleMarkAs('Duplicate')}>*/}
                    <ContextMenuItem disabled>
                        <CopyIcon className="mr-2 size-4" /> Dupliquer
                    </ContextMenuItem>
                    {/*<ContextMenuItem onClick={() => handleMarkAs("Won't Fix")}>*/}
                    <ContextMenuItem disabled>
                        <Clock className="mr-2 size-4" /> Non résolu
                    </ContextMenuItem>
                </ContextMenuSubContent>
            </ContextMenuSub>

            {/*<ContextMenuItem onClick={handleMove}>*/}
            <ContextMenuItem disabled>
                <ArrowRightLeft className="mr-2 size-4" /> Déplacer
            </ContextMenuItem>

            <ContextMenuSeparator />

            {/*<ContextMenuItem onClick={handleSubscribe}>*/}
            <ContextMenuItem disabled>
                {/*<Bell className="mr-2 size-4" /> {isSubscribed ? "Se désabonner" : "S'abonner"}*/}
                <ContextMenuShortcut>S</ContextMenuShortcut>
            </ContextMenuItem>

            {/*<ContextMenuItem onClick={handleFavorite}>*/}
            <ContextMenuItem disabled>
                {/*<Star className="mr-2 size-4" /> {isFavorite ? 'Retirer des favoris' : 'Favoris'}*/}
                <ContextMenuShortcut>F</ContextMenuShortcut>
            </ContextMenuItem>

            {/*<ContextMenuItem onClick={handleCopy}>*/}
            <ContextMenuItem disabled>
                <Clipboard className="mr-2 size-4" /> Copier
            </ContextMenuItem>

            {/*<ContextMenuItem onClick={handleRemindMe}>*/}
            <ContextMenuItem disabled>
                <AlarmClock className="mr-2 size-4" /> Rappeler
                <ContextMenuShortcut>H</ContextMenuShortcut>
            </ContextMenuItem>

            <ContextMenuSeparator />

            <ContextMenuItem
                className="text-destructive hover:bg-destructive/15! hover:text-destructive! focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40"
                onClick={handleDeleteIssue}
            >
                <Trash2 className="mr-2 size-4 text-destructive" /> Supprimer
                <ContextMenuShortcut className="text-destructive">⌘⌫</ContextMenuShortcut>
            </ContextMenuItem>
        </ContextMenuContent>
    );
}
