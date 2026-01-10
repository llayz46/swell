import { PriorityIcon, StatusIcon } from '@/components/swell/workspace/icons';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { useIssueDetailStore } from '@/stores/issue-detail-store';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Bell, BellOff, Calendar as CalendarIcon, Check, Eye, Flag, Loader2, Tag, User, Users } from 'lucide-react';
import { useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

export function IssueDetailSidebar() {
    const {
        issue,
        statuses,
        priorities,
        labels,
        teamMembers,
        isUpdating,
        performUpdateStatus,
        performUpdatePriority,
        performUpdateAssignee,
        performToggleLabel,
        performUpdateDueDate,
        performToggleSubscription,
    } = useIssueDetailStore(
        useShallow((state) => ({
            issue: state.issue,
            statuses: state.statuses,
            priorities: state.priorities,
            labels: state.labels,
            teamMembers: state.teamMembers,
            isUpdating: state.isUpdating,
            performUpdateStatus: state.performUpdateStatus,
            performUpdatePriority: state.performUpdatePriority,
            performUpdateAssignee: state.performUpdateAssignee,
            performToggleLabel: state.performToggleLabel,
            performUpdateDueDate: state.performUpdateDueDate,
            performToggleSubscription: state.performToggleSubscription,
        })),
    );

    if (!issue) return null;

    return (
        <div className="flex h-full flex-col">
            <div className="flex h-12 items-center justify-between border-b border-border px-4">
                <h3 className="font-semibold">Détails</h3>
                {isUpdating && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto p-4">
                <SidebarField label="Statut" icon={<StatusIcon iconType={issue.status.icon_type} color={issue.status.color} size={16} />}>
                    <StatusPopover currentStatus={issue.status} statuses={statuses} onSelect={(slug) => performUpdateStatus(slug)} />
                </SidebarField>

                <SidebarField label="Priorité" icon={<Flag className="h-4 w-4" />}>
                    <PriorityPopover currentPriority={issue.priority} priorities={priorities} onSelect={(id) => performUpdatePriority(id)} />
                </SidebarField>

                <SidebarField label="Assigné" icon={<User className="h-4 w-4" />}>
                    <AssigneePopover currentAssignee={issue.assignee} teamMembers={teamMembers} onSelect={(id) => performUpdateAssignee(id)} />
                </SidebarField>

                <SidebarField label="Étiquettes" icon={<Tag className="h-4 w-4" />}>
                    <LabelsPopover currentLabels={issue.labels} allLabels={labels} onToggle={(id) => performToggleLabel(id)} />
                </SidebarField>

                <SidebarField label="Échéance" icon={<CalendarIcon className="h-4 w-4" />}>
                    <DueDatePopover currentDate={issue.dueDate} onSelect={(date) => performUpdateDueDate(date)} />
                </SidebarField>

                <Separator />

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                        <Eye className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{issue.subscribersCount} abonnés</span>
                    </div>
                    <Button variant={issue.isSubscribed ? 'secondary' : 'outline'} size="sm" onClick={performToggleSubscription}>
                        {issue.isSubscribed ? (
                            <>
                                <BellOff className="mr-2 h-4 w-4" />
                                Se désabonner
                            </>
                        ) : (
                            <>
                                <Bell className="mr-2 h-4 w-4" />
                                S'abonner
                            </>
                        )}
                    </Button>
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Créé par</span>
                        <span className="font-medium">{issue.creator.name}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">{format(new Date(issue.createdAt), "d MMMM yyyy 'à' HH:mm", { locale: fr })}</div>
                    {issue.updatedAt !== issue.createdAt && (
                        <div className="text-xs text-muted-foreground">
                            Modifié {format(new Date(issue.updatedAt), "d MMMM yyyy 'à' HH:mm", { locale: fr })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// Helper component for sidebar fields
function SidebarField({ label, icon, children }: { label: string; icon: React.ReactNode; children: React.ReactNode }) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {icon}
                {label}
            </div>
            {children}
        </div>
    );
}

// Status Popover
function StatusPopover({
    currentStatus,
    statuses,
    onSelect,
}: {
    currentStatus: { slug: string; name: string; color: string; icon_type: string };
    statuses: Array<{ id: number; slug: string; name: string; color: string; icon_type: string }>;
    onSelect: (slug: string) => void;
}) {
    const [open, setOpen] = useState(false);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 gap-2">
                    <StatusIcon iconType={currentStatus.icon_type} color={currentStatus.color} size={14} />
                    {currentStatus.name}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-0" align="end">
                <Command>
                    <CommandInput placeholder="Rechercher..." />
                    <CommandList>
                        <CommandEmpty>Aucun statut trouvé</CommandEmpty>
                        <CommandGroup>
                            {statuses.map((status) => (
                                <CommandItem
                                    key={status.id}
                                    value={status.slug}
                                    onSelect={() => {
                                        onSelect(status.slug);
                                        setOpen(false);
                                    }}
                                >
                                    <StatusIcon iconType={status.icon_type} color={status.color} size={14} />
                                    <span className="ml-2">{status.name}</span>
                                    {currentStatus.slug === status.slug && <Check className="ml-auto h-4 w-4" />}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}

// Priority Popover
function PriorityPopover({
    currentPriority,
    priorities,
    onSelect,
}: {
    currentPriority: { id: number; name: string; icon_type: string };
    priorities: Array<{ id: number; slug: string; name: string; icon_type: string }>;
    onSelect: (id: number) => void;
}) {
    const [open, setOpen] = useState(false);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 gap-2">
                    <PriorityIcon iconType={currentPriority.icon_type} size={14} />
                    {currentPriority.name}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-0" align="end">
                <Command>
                    <CommandList>
                        <CommandGroup>
                            {priorities.map((priority) => (
                                <CommandItem
                                    key={priority.id}
                                    value={priority.slug}
                                    onSelect={() => {
                                        onSelect(priority.id);
                                        setOpen(false);
                                    }}
                                >
                                    <PriorityIcon iconType={priority.icon_type} size={14} />
                                    <span className="ml-2">{priority.name}</span>
                                    {currentPriority.id === priority.id && <Check className="ml-auto h-4 w-4" />}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}

// Assignee Popover
function AssigneePopover({
    currentAssignee,
    teamMembers,
    onSelect,
}: {
    currentAssignee: { id: number; name: string; avatar_url?: string } | null;
    teamMembers: Array<{ id: number; name: string; email: string; avatar_url?: string }>;
    onSelect: (id: number | null) => void;
}) {
    const [open, setOpen] = useState(false);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 gap-2">
                    {currentAssignee ? (
                        <>
                            <Avatar className="h-5 w-5">
                                <AvatarImage src={currentAssignee.avatar_url} />
                                <AvatarFallback className="text-[10px]">{currentAssignee.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            {currentAssignee.name}
                        </>
                    ) : (
                        <span className="text-muted-foreground">Non assigné</span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-0" align="end">
                <Command>
                    <CommandInput placeholder="Rechercher..." />
                    <CommandList>
                        <CommandEmpty>Aucun membre trouvé</CommandEmpty>
                        <CommandGroup>
                            <CommandItem
                                value="unassigned"
                                onSelect={() => {
                                    onSelect(null);
                                    setOpen(false);
                                }}
                            >
                                <User className="mr-2 h-4 w-4 text-muted-foreground" />
                                Non assigné
                                {!currentAssignee && <Check className="ml-auto h-4 w-4" />}
                            </CommandItem>
                            {teamMembers.map((member) => (
                                <CommandItem
                                    key={member.id}
                                    value={member.name}
                                    onSelect={() => {
                                        onSelect(member.id);
                                        setOpen(false);
                                    }}
                                >
                                    <Avatar className="mr-2 h-5 w-5">
                                        <AvatarImage src={member.avatar_url} />
                                        <AvatarFallback className="text-[10px]">{member.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    {member.name}
                                    {currentAssignee?.id === member.id && <Check className="ml-auto h-4 w-4" />}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}

// Labels Popover
function LabelsPopover({
    currentLabels,
    allLabels,
    onToggle,
}: {
    currentLabels: Array<{ id: number; name: string; color: string }>;
    allLabels: Array<{ id: number; name: string; slug: string; color: string }>;
    onToggle: (id: number) => void;
}) {
    const [open, setOpen] = useState(false);
    const currentLabelIds = new Set(currentLabels.map((l) => l.id));

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="h-auto min-h-8 flex-wrap justify-start gap-1">
                    {currentLabels.length > 0 ? (
                        currentLabels.map((label) => (
                            <Badge key={label.id} variant="outline" className="text-xs" style={{ borderColor: label.color, color: label.color }}>
                                {label.name}
                            </Badge>
                        ))
                    ) : (
                        <span className="text-muted-foreground">Aucune</span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-0" align="end">
                <Command>
                    <CommandInput placeholder="Rechercher..." />
                    <CommandList>
                        <CommandEmpty>Aucune étiquette trouvée</CommandEmpty>
                        <CommandGroup>
                            {allLabels.map((label) => (
                                <CommandItem key={label.id} value={label.name} onSelect={() => onToggle(label.id)}>
                                    <div className="mr-2 h-3 w-3 rounded-full" style={{ backgroundColor: label.color }} />
                                    {label.name}
                                    {currentLabelIds.has(label.id) && <Check className="ml-auto h-4 w-4" />}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}

// Due Date Popover
function DueDatePopover({ currentDate, onSelect }: { currentDate?: string; onSelect: (date: string | null) => void }) {
    const [open, setOpen] = useState(false);
    const date = currentDate ? new Date(currentDate) : undefined;

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8">
                    {date ? format(date, 'd MMM yyyy', { locale: fr }) : <span className="text-muted-foreground">Non définie</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(newDate) => {
                        onSelect(newDate ? format(newDate, 'yyyy-MM-dd') : null);
                        setOpen(false);
                    }}
                    locale={fr}
                    initialFocus
                />
                {currentDate && (
                    <div className="border-t p-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="w-full"
                            onClick={() => {
                                onSelect(null);
                                setOpen(false);
                            }}
                        >
                            Supprimer la date
                        </Button>
                    </div>
                )}
            </PopoverContent>
        </Popover>
    );
}
