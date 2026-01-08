import { StatusIcon } from '@/components/swell/workspace/icons';
import { PriorityIcon } from '@/components/swell/workspace/icons/priority-mapper';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { format, formatDistanceToNow, isPast, isToday, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar, ExternalLink, MoreHorizontal, Tag, User } from 'lucide-react';
import type { MyIssue } from './types';

interface IssueDetailPanelProps {
    issue: MyIssue | null;
}

export function IssueDetailPanel({ issue }: IssueDetailPanelProps) {
    if (!issue) {
        return <EmptyState />;
    }

    const dueDate = issue.dueDate ? parseISO(issue.dueDate) : null;
    const isOverdue = dueDate && isPast(dueDate) && !isToday(dueDate);
    const isDueToday = dueDate && isToday(dueDate);

    return (
        <ScrollArea className="h-full">
            <div className="flex flex-col p-6">
                {/* Header */}
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
                    <Button variant="ghost" size="icon" className="shrink-0">
                        <MoreHorizontal className="size-4" />
                    </Button>
                </div>

                <Separator className="my-6" />

                {/* Properties */}
                <div className="space-y-4">
                    {/* Status */}
                    <div className="flex items-center gap-4">
                        <span className="w-24 text-sm text-muted-foreground">Statut</span>
                        <button className="flex items-center gap-2 rounded-md px-2 py-1 transition-colors hover:bg-muted/50">
                            <StatusIcon iconType={issue.status.icon_type} color={issue.status.color} size={16} />
                            <span className="text-sm font-medium">{issue.status.name}</span>
                        </button>
                    </div>

                    {/* Priority */}
                    <div className="flex items-center gap-4">
                        <span className="w-24 text-sm text-muted-foreground">Priorité</span>
                        <button className="flex items-center gap-2 rounded-md px-2 py-1 transition-colors hover:bg-muted/50">
                            <PriorityIcon iconType={issue.priority.icon_type} className="size-4" />
                            <span className="text-sm font-medium">{issue.priority.name}</span>
                        </button>
                    </div>

                    {/* Assignee */}
                    <div className="flex items-center gap-4">
                        <span className="w-24 text-sm text-muted-foreground">Assigné à</span>
                        <button className="flex items-center gap-2 rounded-md px-2 py-1 transition-colors hover:bg-muted/50">
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
                        </button>
                    </div>

                    {/* Due Date */}
                    <div className="flex items-center gap-4">
                        <span className="w-24 text-sm text-muted-foreground">Échéance</span>
                        <button className="flex items-center gap-2 rounded-md px-2 py-1 transition-colors hover:bg-muted/50">
                            <Calendar className={`size-4 ${isOverdue ? 'text-red-500' : isDueToday ? 'text-amber-500' : 'text-muted-foreground'}`} />
                            {dueDate ? (
                                <span className={`text-sm font-medium ${isOverdue ? 'text-red-500' : isDueToday ? 'text-amber-500' : ''}`}>
                                    {format(dueDate, 'dd MMM yyyy', { locale: fr })}
                                    {isOverdue && <span className="ml-2 text-xs">(en retard de {formatDistanceToNow(dueDate, { locale: fr })})</span>}
                                    {isDueToday && <span className="ml-2 text-xs">(aujourd'hui)</span>}
                                </span>
                            ) : (
                                <span className="text-sm text-muted-foreground">Aucune échéance</span>
                            )}
                        </button>
                    </div>

                    {/* Labels */}
                    <div className="flex items-start gap-4">
                        <span className="w-24 pt-1 text-sm text-muted-foreground">Labels</span>
                        <div className="flex flex-wrap gap-1.5">
                            {issue.labels.length > 0 ? (
                                issue.labels.map((label) => (
                                    <Badge key={label.id} variant="outline" className="gap-1.5 rounded-full">
                                        <span className="size-2 rounded-full" style={{ backgroundColor: label.color }} />
                                        {label.name}
                                    </Badge>
                                ))
                            ) : (
                                <button className="flex items-center gap-2 rounded-md px-2 py-1 transition-colors hover:bg-muted/50">
                                    <Tag className="size-4 text-muted-foreground" />
                                    <span className="text-sm text-muted-foreground">Ajouter un label</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <Separator className="my-6" />

                {/* Description */}
                <div>
                    <h3 className="mb-3 text-sm font-medium">Description</h3>
                    {issue.description ? (
                        <div className="text-sm leading-relaxed whitespace-pre-wrap text-muted-foreground">{issue.description}</div>
                    ) : (
                        <p className="text-sm text-muted-foreground italic">Aucune description</p>
                    )}
                </div>

                <Separator className="my-6" />

                {/* Metadata */}
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

                {/* Action */}
                <div className="mt-6">
                    <Button variant="outline" size="sm" className="w-full gap-2">
                        <ExternalLink className="size-4" />
                        Voir la tâche complète
                    </Button>
                </div>
            </div>
        </ScrollArea>
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
