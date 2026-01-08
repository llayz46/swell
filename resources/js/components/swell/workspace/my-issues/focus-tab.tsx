import { StatusIcon } from '@/components/swell/workspace/icons';
import { PriorityIcon } from '@/components/swell/workspace/icons/priority-mapper';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { IssuePriority, IssueStatus } from '@/types/workspace';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Filter, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { IssueDetailPanel } from './issue-detail-panel';
import type { MyIssue } from './types';

interface FocusTabProps {
    issues: MyIssue[];
    statuses: IssueStatus[];
    priorities: IssuePriority[];
    selectedIssue: MyIssue | null;
    onSelectIssue: (issue: MyIssue | null) => void;
}

export function FocusTab({ issues, statuses, priorities, selectedIssue, onSelectIssue }: FocusTabProps) {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<string[]>([]);
    const [priorityFilter, setPriorityFilter] = useState<string[]>([]);

    const filteredIssues = useMemo(() => {
        let filtered = [...issues];

        // Search filter
        if (search) {
            const searchLower = search.toLowerCase();
            filtered = filtered.filter(
                (issue) => issue.title.toLowerCase().includes(searchLower) || issue.identifier.toLowerCase().includes(searchLower),
            );
        }

        // Status filter
        if (statusFilter.length > 0) {
            filtered = filtered.filter((issue) => statusFilter.includes(issue.status.slug));
        }

        // Priority filter
        if (priorityFilter.length > 0) {
            filtered = filtered.filter((issue) => priorityFilter.includes(issue.priority.slug));
        }

        return filtered;
    }, [issues, search, statusFilter, priorityFilter]);

    const toggleStatusFilter = (slug: string) => {
        setStatusFilter((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]));
    };

    const togglePriorityFilter = (slug: string) => {
        setPriorityFilter((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]));
    };

    const hasActiveFilters = statusFilter.length > 0 || priorityFilter.length > 0;

    return (
        <ResizablePanelGroup direction="horizontal" autoSaveId="my-issues-focus-panel" className="h-full">
            {/* Left Panel - Issue List */}
            <ResizablePanel defaultSize={40} minSize={30} maxSize={60}>
                <div className="flex h-full flex-col border-r">
                    {/* Filters Header */}
                    <div className="flex items-center gap-2 border-b p-3">
                        <div className="relative flex-1">
                            <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input placeholder="Rechercher..." value={search} onChange={(e) => setSearch(e.target.value)} className="h-8 pl-8" />
                        </div>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant={hasActiveFilters ? 'secondary' : 'ghost'} size="sm" className="h-8 gap-1.5">
                                    <Filter className="size-3.5" />
                                    Filtres
                                    {hasActiveFilters && (
                                        <span className="ml-1 rounded-full bg-primary px-1.5 text-[10px] text-primary-foreground">
                                            {statusFilter.length + priorityFilter.length}
                                        </span>
                                    )}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuLabel>Statut</DropdownMenuLabel>
                                {statuses.map((status) => (
                                    <DropdownMenuCheckboxItem
                                        key={status.slug}
                                        checked={statusFilter.includes(status.slug)}
                                        onCheckedChange={() => toggleStatusFilter(status.slug)}
                                    >
                                        <StatusIcon iconType={status.icon_type} color={status.color} size={14} className="mr-2" />
                                        {status.name}
                                    </DropdownMenuCheckboxItem>
                                ))}

                                <DropdownMenuSeparator />

                                <DropdownMenuLabel>Priorité</DropdownMenuLabel>
                                {priorities.map((priority) => (
                                    <DropdownMenuCheckboxItem
                                        key={priority.slug}
                                        checked={priorityFilter.includes(priority.slug)}
                                        onCheckedChange={() => togglePriorityFilter(priority.slug)}
                                    >
                                        <PriorityIcon iconType={priority.icon_type} className="mr-2 size-3.5" />
                                        {priority.name}
                                    </DropdownMenuCheckboxItem>
                                ))}

                                {hasActiveFilters && (
                                    <>
                                        <DropdownMenuSeparator />
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="w-full justify-center text-xs"
                                            onClick={() => {
                                                setStatusFilter([]);
                                                setPriorityFilter([]);
                                            }}
                                        >
                                            Effacer les filtres
                                        </Button>
                                    </>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {/* Issue List */}
                    <ScrollArea className="flex-1">
                        <div className="p-2">
                            {filteredIssues.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-8 text-center">
                                    <Search className="mb-2 size-8 text-muted-foreground/50" />
                                    <p className="text-sm text-muted-foreground">
                                        {search || hasActiveFilters ? 'Aucune tâche trouvée' : 'Aucune tâche assignée'}
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-1">
                                    {filteredIssues.map((issue) => (
                                        <FocusIssueItem
                                            key={issue.id}
                                            issue={issue}
                                            isSelected={selectedIssue?.id === issue.id}
                                            onClick={() => onSelectIssue(issue)}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </ScrollArea>

                    {/* Footer */}
                    <div className="border-t px-3 py-2 text-xs text-muted-foreground">
                        {filteredIssues.length} tâche{filteredIssues.length > 1 ? 's' : ''}
                        {hasActiveFilters && ` (filtré)`}
                    </div>
                </div>
            </ResizablePanel>

            <ResizableHandle withHandle />

            {/* Right Panel - Issue Detail */}
            <ResizablePanel defaultSize={60}>
                <IssueDetailPanel issue={selectedIssue} />
            </ResizablePanel>
        </ResizablePanelGroup>
    );
}

interface FocusIssueItemProps {
    issue: MyIssue;
    isSelected: boolean;
    onClick: () => void;
}

function FocusIssueItem({ issue, isSelected, onClick }: FocusIssueItemProps) {
    return (
        <button
            onClick={onClick}
            className={`w-full rounded-md px-3 py-2 text-left transition-colors ${
                isSelected ? 'bg-primary/10 ring-1 ring-primary/20' : 'hover:bg-muted/50'
            }`}
        >
            <div className="flex items-start gap-2">
                <PriorityIcon iconType={issue.priority.icon_type} className="mt-0.5 size-3.5 shrink-0" />
                <div className="min-w-0 flex-1">
                    <div className="mb-0.5 flex items-center gap-2">
                        <span className="font-mono text-xs text-muted-foreground">{issue.identifier}</span>
                        <div className="size-2 shrink-0 rounded-full" style={{ backgroundColor: issue.team.color }} title={issue.team.name} />
                    </div>
                    <p className="truncate text-sm font-medium">{issue.title}</p>
                    <div className="mt-1 flex items-center gap-2">
                        <StatusIcon iconType={issue.status.icon_type} color={issue.status.color} size={12} />
                        <span className="text-xs text-muted-foreground">{issue.status.name}</span>
                        {issue.dueDate && (
                            <>
                                <span className="text-muted-foreground/50">•</span>
                                <span className="text-xs text-muted-foreground">{format(parseISO(issue.dueDate), 'dd MMM', { locale: fr })}</span>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </button>
    );
}
