import { StatusIcon } from '@/components/swell/workspace/icons';
import { PriorityIcon } from '@/components/swell/workspace/icons/priority-mapper';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useMyIssuesStore } from '@/stores/my-issues-store';
import { format, formatDistanceToNow, isPast, isToday, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar as CalendarIcon, CheckIcon, ExternalLink, Tag, User, X } from 'lucide-react';
import { useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import type { MyIssue } from './types';

interface IssueDetailPanelProps {
    issue: MyIssue | null;
}

export function IssueDetailPanel({ issue }: IssueDetailPanelProps) {
    if (!issue) {
        return <EmptyState />;
    }

    const dueDate = issue.dueDate ? parseISO(issue.dueDate) : null;
    const isOverdue = dueDate && isPast(dueDate) && !isToday(dueDate) && issue.status.slug !== 'done' && issue.status.slug !== 'cancelled';
    const isDueToday = dueDate && isToday(dueDate);

    return (
        <ScrollArea className="h-full">
            <div className="flex flex-col p-6">
                <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                        <div className="mb-2 flex items-center gap-2">
                            <Badge variant="outline" className="font-mono text-xs">
                                {issue.identifier}
                            </Badge>
                            <div
                                className="flex items-center gap-1 rounded-full px-2 py-0.5 text-xs"
                                style={{ backgroundColor: `${issue.team.color}20` }}
                            >
                                <div className="size-2 rounded-full" style={{ backgroundColor: issue.team.color }} />
                                {issue.team.identifier}
                            </div>
                        </div>
                        <h2 className="text-xl leading-tight font-semibold">{issue.title}</h2>
                    </div>
                </div>

                <Separator className="my-6" />

                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <span className="w-24 text-sm text-muted-foreground">Statut</span>
                        <StatusSelector issue={issue} />
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="w-24 text-sm text-muted-foreground">Priorité</span>
                        <PrioritySelector issue={issue} />
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="w-24 text-sm text-muted-foreground">Assigné à</span>
                        <div className="flex items-center gap-2 rounded-md px-2 py-1">
                            {issue.assignee ? (
                                <>
                                    <Avatar className="size-5">
                                        <AvatarImage src={issue.assignee.avatar_url} />
                                        <AvatarFallback className="text-[10px]">{issue.assignee.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm font-medium">{issue.assignee.name}</span>
                                </>
                            ) : (
                                <>
                                    <User className="size-4 text-muted-foreground" />
                                    <span className="text-sm text-muted-foreground">Non assigné</span>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="w-24 text-sm text-muted-foreground">Échéance</span>
                        <DueDatePicker issue={issue} isOverdue={isOverdue} isDueToday={isDueToday} />
                    </div>

                    <div className="flex items-start gap-4">
                        <span className="w-24 pt-1 text-sm text-muted-foreground">Labels</span>
                        <LabelSelector issue={issue} />
                    </div>
                </div>

                <Separator className="my-6" />

                <div>
                    <h3 className="mb-3 text-sm font-medium">Description</h3>
                    {issue.description ? (
                        <div className="text-sm leading-relaxed whitespace-pre-wrap text-muted-foreground">{issue.description}</div>
                    ) : (
                        <p className="text-sm text-muted-foreground italic">Aucune description</p>
                    )}
                </div>

                <Separator className="my-6" />

                <div className="space-y-2 text-xs text-muted-foreground">
                    <div className="flex items-center justify-between">
                        <span>Créé par {issue.creator.name}</span>
                        <span>{format(parseISO(issue.createdAt), 'dd MMM yyyy', { locale: fr })}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span>Dernière modification</span>
                        <span>{formatDistanceToNow(parseISO(issue.updatedAt), { addSuffix: true, locale: fr })}</span>
                    </div>
                </div>

                <div className="mt-6">
                    <Button
                        variant="outline"
                        size="sm"
                        className="w-full gap-2"
                        onClick={() => window.open(route('workspace.teams.issues', { team: issue.team.identifier }), '_blank')}
                    >
                        <ExternalLink className="size-4" />
                        Voir dans l'équipe
                    </Button>
                </div>
            </div>
        </ScrollArea>
    );
}

function StatusSelector({ issue }: { issue: MyIssue }) {
    const [open, setOpen] = useState(false);

    const { statuses, updatingIssues, performUpdateStatus } = useMyIssuesStore(
        useShallow((state) => ({
            statuses: state.statuses,
            updatingIssues: state.updatingIssues,
            performUpdateStatus: state.performUpdateStatus,
        })),
    );

    const isUpdating = updatingIssues.has(issue.id);

    const handleStatusChange = (statusSlug: string) => {
        setOpen(false);
        performUpdateStatus(issue.id, statusSlug, issue.status);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <button
                    className="flex items-center gap-2 rounded-md px-2 py-1 transition-colors hover:bg-muted/50 disabled:opacity-50"
                    disabled={isUpdating}
                >
                    <StatusIcon iconType={issue.status.icon_type} color={issue.status.color} size={16} />
                    <span className="text-sm font-medium">{issue.status.name}</span>
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-52 p-0" align="start">
                <Command>
                    <CommandInput placeholder="Changer le statut..." />
                    <CommandList>
                        <CommandEmpty>Aucun statut trouvé.</CommandEmpty>
                        <CommandGroup>
                            {statuses.map((status) => (
                                <CommandItem
                                    key={status.id}
                                    value={status.slug}
                                    keywords={[status.name]}
                                    onSelect={handleStatusChange}
                                    className="flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-2">
                                        <StatusIcon iconType={status.icon_type} color={status.color} size={14} />
                                        {status.name}
                                    </div>
                                    {issue.status.slug === status.slug && <CheckIcon size={16} />}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}

function PrioritySelector({ issue }: { issue: MyIssue }) {
    const [open, setOpen] = useState(false);

    const { priorities, updatingIssues, performUpdatePriority } = useMyIssuesStore(
        useShallow((state) => ({
            priorities: state.priorities,
            updatingIssues: state.updatingIssues,
            performUpdatePriority: state.performUpdatePriority,
        })),
    );

    const isUpdating = updatingIssues.has(issue.id);

    const handlePriorityChange = (prioritySlug: string) => {
        const selectedPriority = priorities.find((p) => p.slug === prioritySlug);
        if (!selectedPriority) return;

        setOpen(false);
        performUpdatePriority(issue.id, selectedPriority.id, issue.priority);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <button
                    className="flex items-center gap-2 rounded-md px-2 py-1 transition-colors hover:bg-muted/50 disabled:opacity-50"
                    disabled={isUpdating}
                >
                    <PriorityIcon iconType={issue.priority.icon_type} className="size-4" />
                    <span className="text-sm font-medium">{issue.priority.name}</span>
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-52 p-0" align="start">
                <Command>
                    <CommandInput placeholder="Changer la priorité..." />
                    <CommandList>
                        <CommandEmpty>Aucune priorité trouvée.</CommandEmpty>
                        <CommandGroup>
                            {priorities.map((priority) => (
                                <CommandItem
                                    key={priority.id}
                                    value={priority.slug}
                                    keywords={[priority.name]}
                                    onSelect={handlePriorityChange}
                                    className="flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-2">
                                        <PriorityIcon iconType={priority.icon_type} className="size-3.5" />
                                        {priority.name}
                                    </div>
                                    {issue.priority.slug === priority.slug && <CheckIcon size={16} />}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}

function DueDatePicker({ issue, isOverdue, isDueToday }: { issue: MyIssue; isOverdue?: boolean; isDueToday?: boolean }) {
    const [open, setOpen] = useState(false);

    const { updatingIssues, performUpdateDueDate } = useMyIssuesStore(
        useShallow((state) => ({
            updatingIssues: state.updatingIssues,
            performUpdateDueDate: state.performUpdateDueDate,
        })),
    );

    const isUpdating = updatingIssues.has(issue.id);
    const dueDate = issue.dueDate ? parseISO(issue.dueDate) : undefined;

    const handleDateSelect = (date: Date | undefined) => {
        const newDueDate = date ? format(date, 'yyyy-MM-dd') : null;
        performUpdateDueDate(issue.id, newDueDate, issue.dueDate);
        setOpen(false);
    };

    const handleClearDate = (e: React.MouseEvent) => {
        e.stopPropagation();
        performUpdateDueDate(issue.id, null, issue.dueDate);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <button
                    className="flex items-center gap-2 rounded-md px-2 py-1 transition-colors hover:bg-muted/50 disabled:opacity-50"
                    disabled={isUpdating}
                >
                    <CalendarIcon className={`size-4 ${isOverdue ? 'text-red-500' : isDueToday ? 'text-amber-500' : 'text-muted-foreground'}`} />
                    {dueDate ? (
                        <span className={`text-sm font-medium ${isOverdue ? 'text-red-500' : isDueToday ? 'text-amber-500' : ''}`}>
                            {format(dueDate, 'dd MMM yyyy', { locale: fr })}
                            {isOverdue && <span className="ml-2 text-xs">(en retard)</span>}
                            {isDueToday && <span className="ml-2 text-xs">(aujourd'hui)</span>}
                        </span>
                    ) : (
                        <span className="text-sm text-muted-foreground">Aucune échéance</span>
                    )}
                    {dueDate && !isUpdating && (
                        <X className="ml-1 size-3 text-muted-foreground hover:text-foreground" onClick={handleClearDate} />
                    )}
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={dueDate} onSelect={handleDateSelect} locale={fr} initialFocus />
            </PopoverContent>
        </Popover>
    );
}

function LabelSelector({ issue }: { issue: MyIssue }) {
    const [open, setOpen] = useState(false);

    const { labels, updatingIssues, performToggleLabel } = useMyIssuesStore(
        useShallow((state) => ({
            labels: state.labels,
            updatingIssues: state.updatingIssues,
            performToggleLabel: state.performToggleLabel,
        })),
    );

    const isUpdating = updatingIssues.has(issue.id);

    const handleToggleLabel = (labelId: number) => {
        performToggleLabel(issue.id, labelId, issue.labels);
    };

    return (
        <div className="flex flex-wrap items-center gap-1.5">
            {issue.labels.length > 0 &&
                issue.labels.map((label) => (
                    <Badge key={label.id} variant="outline" className="gap-1.5 rounded-full">
                        <span className="size-2 rounded-full" style={{ backgroundColor: label.color }} />
                        {label.name}
                    </Badge>
                ))}

            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <button
                        className="flex items-center gap-1.5 rounded-md px-2 py-1 text-sm text-muted-foreground transition-colors hover:bg-muted/50 disabled:opacity-50"
                        disabled={isUpdating}
                    >
                        <Tag className="size-3.5" />
                        {issue.labels.length === 0 ? 'Ajouter' : 'Modifier'}
                    </button>
                </PopoverTrigger>
                <PopoverContent className="w-52 p-0" align="start">
                    <Command>
                        <CommandInput placeholder="Rechercher un label..." />
                        <CommandList>
                            <CommandEmpty>Aucun label trouvé.</CommandEmpty>
                            <CommandGroup>
                                {labels.map((label) => {
                                    const isSelected = issue.labels.some((l) => l.id === label.id);
                                    return (
                                        <CommandItem
                                            key={label.id}
                                            value={label.slug}
                                            keywords={[label.name]}
                                            onSelect={() => handleToggleLabel(label.id)}
                                            className="flex items-center justify-between"
                                        >
                                            <div className="flex items-center gap-2">
                                                <span className="size-3 rounded-full" style={{ backgroundColor: label.color }} />
                                                {label.name}
                                            </div>
                                            {isSelected && <CheckIcon size={16} />}
                                        </CommandItem>
                                    );
                                })}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
}

function EmptyState() {
    return (
        <div className="flex h-full flex-col items-center justify-center p-6 text-center">
            <div className="mb-4 rounded-full bg-muted p-4">
                <svg className="size-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
                    />
                </svg>
            </div>
            <h3 className="mb-1 text-lg font-semibold">Sélectionnez une tâche</h3>
            <p className="max-w-[200px] text-sm text-muted-foreground">Cliquez sur une tâche dans la liste pour afficher ses détails</p>
        </div>
    );
}
