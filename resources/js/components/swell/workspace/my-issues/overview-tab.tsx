import { StatusIcon } from '@/components/swell/workspace/icons';
import { PriorityIcon } from '@/components/swell/workspace/icons/priority-mapper';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { isPast, isToday, parseISO } from 'date-fns';
import { AlertTriangle, CheckCircle2, Clock, ListTodo, Target } from 'lucide-react';
import { useMemo } from 'react';
import { StatCard } from './stat-card';
import { cn } from '@/lib/utils';
import type { MyIssue, MyIssuesStats } from './types';

interface OverviewTabProps {
    issues: MyIssue[];
    stats: MyIssuesStats;
    onIssueClick?: (issue: MyIssue) => void;
}

export function OverviewTab({ issues, stats, onIssueClick }: OverviewTabProps) {
    const focusIssues = useMemo(() => {
        return issues
            .filter((issue) => {
                const isHighPriority = issue.priority.slug === 'high' || issue.priority.slug === 'urgent';
                const isDueToday = issue.dueDate && isToday(parseISO(issue.dueDate));
                const isNotDone = issue.status.slug !== 'done' && issue.status.slug !== 'cancelled';
                return isNotDone && (isHighPriority || isDueToday);
            })
            .slice(0, 5);
    }, [issues]);

    const overdueIssues = useMemo(() => {
        return issues.filter((issue) => {
            if (!issue.dueDate) return false;
            const dueDate = parseISO(issue.dueDate);
            const isNotDone = issue.status.slug !== 'done' && issue.status.slug !== 'cancelled';
            return isNotDone && isPast(dueDate) && !isToday(dueDate);
        });
    }, [issues]);

    const issuesByTeam = useMemo(() => {
        const grouped = new Map<string, { team: MyIssue['team']; issues: MyIssue[] }>();

        issues.forEach((issue) => {
            if (!issue.team) return;
            const key = issue.team.identifier;
            if (!grouped.has(key)) {
                grouped.set(key, { team: issue.team, issues: [] });
            }
            grouped.get(key)!.issues.push(issue);
        });

        return Array.from(grouped.values()).sort((a, b) => a.team.identifier.localeCompare(b.team.identifier));
    }, [issues]);

    return (
        <div className="flex flex-col gap-6 p-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard title="Total" value={stats.total} icon={ListTodo} description="Tâches assignées" />
                <StatCard title="En cours" value={stats.inProgress} icon={Clock} description="Tâches actives" />
                <StatCard
                    title="En retard"
                    value={stats.overdue}
                    icon={AlertTriangle}
                    variant={stats.overdue > 0 ? 'danger' : 'default'}
                    description={stats.overdue > 0 ? 'À traiter en priorité' : 'Aucune tâche en retard'}
                />
                <StatCard title="Terminées" value={stats.completedThisWeek} icon={CheckCircle2} variant="success" description="Cette semaine" />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card className="gap-0">
                    <CardHeader className="pb-3">
                        <div className="flex items-center gap-2">
                            <Target className="size-4 text-amber-500" />
                            <CardTitle className="text-base">Focus du jour</CardTitle>
                            <Badge variant="secondary" className="ml-auto">
                                {focusIssues.length}
                            </Badge>
                        </div>
                        <CardDescription>Tâches prioritaires ou dues aujourd'hui</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {focusIssues.length === 0 ? (
                            <p className="py-4 text-center text-sm text-muted-foreground">Aucune tâche prioritaire pour aujourd'hui</p>
                        ) : (
                            <div className="space-y-2">
                                {focusIssues.map((issue) => (
                                    <IssueRow key={issue.id} issue={issue} onClick={() => onIssueClick?.(issue)} />
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className={cn('gap-0', overdueIssues.length > 0 ? 'border-red-200 dark:border-red-900/50' : '')}>
                    <CardHeader className="pb-3">
                        <div className="flex items-center gap-2">
                            <AlertTriangle className={`size-4 ${overdueIssues.length > 0 ? 'text-red-500' : 'text-muted-foreground'}`} />
                            <CardTitle className="text-base">En retard</CardTitle>
                            <Badge variant={overdueIssues.length > 0 ? 'destructive' : 'secondary'} className="ml-auto">
                                {overdueIssues.length}
                            </Badge>
                        </div>
                        <CardDescription>Tâches dont la date d'échéance est passée</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {overdueIssues.length === 0 ? (
                            <p className="py-4 text-center text-sm text-muted-foreground">Aucune tâche en retard</p>
                        ) : (
                            <div className="space-y-2">
                                {overdueIssues.map((issue) => (
                                    <IssueRow key={issue.id} issue={issue} onClick={() => onIssueClick?.(issue)} showOverdueBadge />
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <Card className="gap-0">
                <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                        <ListTodo className="size-4 text-muted-foreground" />
                        <CardTitle className="text-base">Toutes mes tâches</CardTitle>
                        <Badge variant="secondary" className="ml-auto">
                            {issues.length}
                        </Badge>
                    </div>
                    <CardDescription>Groupées par équipe</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <ScrollArea className="h-[400px]">
                        {issuesByTeam.length === 0 ? (
                            <p className="py-4 text-center text-sm text-muted-foreground">Aucune tâche assignée</p>
                        ) : (
                            <div>
                                {issuesByTeam.map(({ team, issues: teamIssues }) => (
                                    <div key={team.identifier} className="relative">
                                        <div className="sticky top-0 z-10 flex items-center gap-2 border-b bg-card px-6 py-2">
                                            <div className="size-3 rounded-sm" style={{ backgroundColor: team.color }} />
                                            <span className="text-sm font-semibold">{team.identifier}</span>
                                            <span className="text-xs text-muted-foreground">{team.name}</span>
                                            <Badge variant="outline" className="ml-auto text-xs">
                                                {teamIssues.length}
                                            </Badge>
                                        </div>
                                        <div className="space-y-1 px-6 py-2">
                                            {teamIssues.map((issue) => (
                                                <IssueRow key={issue.id} issue={issue} onClick={() => onIssueClick?.(issue)} compact />
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    );
}

interface IssueRowProps {
    issue: MyIssue;
    onClick?: () => void;
    showOverdueBadge?: boolean;
    compact?: boolean;
}

function IssueRow({ issue, onClick, showOverdueBadge, compact }: IssueRowProps) {
    return (
        <div
            onClick={onClick}
            className={`flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 hover:bg-muted/50 ${compact ? 'py-1' : ''}`}
        >
            <PriorityIcon iconType={issue.priority.icon_type} className="size-3.5 shrink-0" />
            <StatusIcon iconType={issue.status.icon_type} color={issue.status.color} size={14} />

            <span className="shrink-0 font-mono text-xs text-muted-foreground">{issue.identifier}</span>

            <span className={`truncate ${compact ? 'text-sm' : 'text-sm font-medium'}`}>{issue.title}</span>

            {showOverdueBadge && issue.dueDate && (
                <Badge variant="destructive" className="ml-auto shrink-0 text-xs">
                    En retard
                </Badge>
            )}

            {issue.labels.length > 0 && !showOverdueBadge && (
                <div className="ml-auto flex shrink-0 items-center gap-1">
                    {issue.labels.slice(0, 2).map((label) => (
                        <div key={label.id} className="size-2 rounded-full" style={{ backgroundColor: label.color }} title={label.name} />
                    ))}
                </div>
            )}
        </div>
    );
}
