import { PriorityIcon, StatusIcon } from '@/components/swell/workspace/icons';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useWorkspaceIssuesStore } from '@/stores/workspace-issues-store';
import { BarChart3, CheckIcon, ChevronRight, CircleCheck, ListFilter, Tag, User } from 'lucide-react';
import { useState } from 'react';

type FilterType = 'status' | 'assignee' | 'priority' | 'labels';

export function Filter() {
    const [open, setOpen] = useState<boolean>(false);
    const [activeFilter, setActiveFilter] = useState<FilterType | null>(null);

    const {
        team,
        statuses,
        priorities,
        labels,
        filters,
        toggleFilter,
        clearFilters,
        getActiveFiltersCount,
        filterByStatus,
        filterByAssignee,
        filterByPriority,
        filterByLabel,
    } = useWorkspaceIssuesStore();

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button size="xs" variant="ghost" className="relative">
                    <ListFilter className="mr-1 size-4" />
                    Filtrer
                    {getActiveFiltersCount() > 0 && (
                        <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                            {getActiveFiltersCount()}
                        </span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-60 p-0" align="start">
                {activeFilter === null ? (
                    <Command>
                        <CommandList>
                            <CommandGroup>
                                <CommandItem onSelect={() => setActiveFilter('status')} className="flex cursor-pointer items-center justify-between">
                                    <span className="flex items-center gap-2">
                                        <CircleCheck className="size-4 text-muted-foreground" />
                                        Statut
                                    </span>
                                    <div className="flex items-center">
                                        {filters.status.length > 0 && (
                                            <span className="mr-1 text-xs text-muted-foreground">{filters.status.length}</span>
                                        )}
                                        <ChevronRight className="size-4" />
                                    </div>
                                </CommandItem>
                                <CommandItem
                                    onSelect={() => setActiveFilter('assignee')}
                                    className="flex cursor-pointer items-center justify-between"
                                >
                                    <span className="flex items-center gap-2">
                                        <User className="size-4 text-muted-foreground" />
                                        Attribution
                                    </span>
                                    <div className="flex items-center">
                                        {filters.assignee.length > 0 && (
                                            <span className="mr-1 text-xs text-muted-foreground">{filters.assignee.length}</span>
                                        )}
                                        <ChevronRight className="size-4" />
                                    </div>
                                </CommandItem>
                                <CommandItem
                                    onSelect={() => setActiveFilter('priority')}
                                    className="flex cursor-pointer items-center justify-between"
                                >
                                    <span className="flex items-center gap-2">
                                        <BarChart3 className="size-4 text-muted-foreground" />
                                        Priorité
                                    </span>
                                    <div className="flex items-center">
                                        {filters.priority.length > 0 && (
                                            <span className="mr-1 text-xs text-muted-foreground">{filters.priority.length}</span>
                                        )}
                                        <ChevronRight className="size-4" />
                                    </div>
                                </CommandItem>
                                <CommandItem onSelect={() => setActiveFilter('labels')} className="flex cursor-pointer items-center justify-between">
                                    <span className="flex items-center gap-2">
                                        <Tag className="size-4 text-muted-foreground" />
                                        Étiquette
                                    </span>
                                    <div className="flex items-center">
                                        {filters.labels.length > 0 && (
                                            <span className="mr-1 text-xs text-muted-foreground">{filters.labels.length}</span>
                                        )}
                                        <ChevronRight className="size-4" />
                                    </div>
                                </CommandItem>
                            </CommandGroup>
                            {getActiveFiltersCount() > 0 && (
                                <>
                                    <CommandSeparator />
                                    <CommandGroup>
                                        <CommandItem
                                            onSelect={() => clearFilters()}
                                            className="text-destructive focus-visible:ring-destructive/20 data-[selected=true]:bg-destructive/15 data-[selected=true]:text-destructive! dark:focus-visible:ring-destructive/40"
                                        >
                                            Effacer tous les filtres
                                        </CommandItem>
                                    </CommandGroup>
                                </>
                            )}
                        </CommandList>
                    </Command>
                ) : activeFilter === 'status' ? (
                    <Command>
                        <div className="flex items-center border-b p-2">
                            <Button variant="ghost" size="icon" className="size-6" onClick={() => setActiveFilter(null)}>
                                <ChevronRight className="size-4 rotate-180" />
                            </Button>
                            <span className="ml-2 font-medium">Statut</span>
                        </div>
                        <CommandInput placeholder="Rechercher un statut..." />
                        <CommandList>
                            <CommandEmpty>Aucun statut trouvé.</CommandEmpty>
                            <CommandGroup>
                                {statuses.map((item) => (
                                    <CommandItem
                                        key={item.id}
                                        onSelect={() => toggleFilter('status', item.id)}
                                        className="flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-2">
                                            <StatusIcon iconType={item.icon_type} color={item.color} size={14} />
                                            {item.name}
                                        </div>
                                        {filters.status.includes(item.id) && <CheckIcon size={16} className="ml-auto" />}
                                        <span className="text-xs text-muted-foreground">{filterByStatus(item.id).length}</span>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                ) : activeFilter === 'assignee' ? (
                    <Command>
                        <div className="flex items-center border-b p-2">
                            <Button variant="ghost" size="icon" className="size-6" onClick={() => setActiveFilter(null)}>
                                <ChevronRight className="size-4 rotate-180" />
                            </Button>
                            <span className="ml-2 font-medium">Attribution</span>
                        </div>
                        <CommandInput placeholder="Rechercher un utilisateur..." />
                        <CommandList>
                            <CommandEmpty>Aucun utilisateur trouvé.</CommandEmpty>
                            <CommandGroup>
                                <CommandItem
                                    value="unassigned"
                                    onSelect={() => toggleFilter('assignee', 'unassigned')}
                                    className="flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-2">
                                        <User className="size-5" />
                                        Non assigné
                                    </div>
                                    {filters.assignee.includes('unassigned') && <CheckIcon size={16} className="ml-auto" />}
                                    <span className="text-xs text-muted-foreground">{filterByAssignee(null).length}</span>
                                </CommandItem>

                                {team?.members?.map((member) => (
                                    <CommandItem
                                        key={member.id}
                                        value={member.name}
                                        onSelect={() => toggleFilter('assignee', member.id)}
                                        className="flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-2">
                                            <Avatar className="size-5">
                                                <AvatarImage src={member.avatarUrl} alt={member.name} />
                                                <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            {member.name}
                                        </div>
                                        {filters.assignee.includes(member.id.toString()) && <CheckIcon size={16} className="ml-auto" />}
                                        <span className="text-xs text-muted-foreground">{filterByAssignee(member.id.toString()).length}</span>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                ) : activeFilter === 'priority' ? (
                    <Command>
                        <div className="flex items-center border-b p-2">
                            <Button variant="ghost" size="icon" className="size-6" onClick={() => setActiveFilter(null)}>
                                <ChevronRight className="size-4 rotate-180" />
                            </Button>
                            <span className="ml-2 font-medium">Priorité</span>
                        </div>
                        <CommandInput placeholder="Rechercher une priorité..." />
                        <CommandList>
                            <CommandEmpty>Aucune priorité trouvée.</CommandEmpty>
                            <CommandGroup>
                                {priorities.map((priority) => (
                                    <CommandItem
                                        key={priority.id}
                                        onSelect={() => toggleFilter('priority', priority.id)}
                                        className="flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-2">
                                            <PriorityIcon iconType={priority.icon_type} />
                                            {priority.name}
                                        </div>
                                        {filters.priority.includes(priority.id) && <CheckIcon size={16} className="ml-auto" />}
                                        <span className="text-xs text-muted-foreground">{filterByPriority(priority.id).length}</span>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                ) : activeFilter === 'labels' ? (
                    <Command>
                        <div className="flex items-center border-b p-2">
                            <Button variant="ghost" size="icon" className="size-6" onClick={() => setActiveFilter(null)}>
                                <ChevronRight className="size-4 rotate-180" />
                            </Button>
                            <span className="ml-2 font-medium">Étiquettes</span>
                        </div>
                        <CommandInput placeholder="Rechercher des étiquettes..." />
                        <CommandList>
                            <CommandEmpty>Aucune étiquette trouvée.</CommandEmpty>
                            <CommandGroup>
                                {labels.map((label) => (
                                    <CommandItem
                                        key={label.id}
                                        onSelect={() => toggleFilter('labels', label.id)}
                                        className="flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className="size-3 rounded-full" style={{ backgroundColor: label.color }}></span>
                                            {label.name}
                                        </div>
                                        {filters.labels.includes(label.id) && <CheckIcon size={16} className="ml-auto" />}
                                        <span className="text-xs text-muted-foreground">{filterByLabel(label.id).length}</span>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                ) : null}
            </PopoverContent>
        </Popover>
    );
}
