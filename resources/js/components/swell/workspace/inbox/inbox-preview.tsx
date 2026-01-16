import { issues } from '@/actions/App/Modules/Workspace/Http/Controllers/WorkspaceTeamController';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { useInboxStore } from '@/stores/inbox-store';
import type { InboxItem, NotificationType } from '@/types/workspace';
import { Link } from '@inertiajs/react';
import { format, formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
    AlarmClock,
    ArrowUpRight,
    AtSign,
    Bell,
    CheckCircle2,
    Clock,
    Edit3,
    ExternalLink,
    Mail,
    MailOpen,
    MessageSquare,
    MoreHorizontal,
    PlusCircle,
    RefreshCw,
    Trash2,
    UserPlus,
} from 'lucide-react';
import { StatusIcon } from '../icons/icon-mapper';
import { PriorityIcon } from '../icons/priority-mapper';

const notificationIcons: Record<NotificationType, React.ElementType> = {
    comment: MessageSquare,
    mention: AtSign,
    assignment: UserPlus,
    status: RefreshCw,
    reopened: RefreshCw,
    closed: CheckCircle2,
    edited: Edit3,
    created: PlusCircle,
};

const notificationLabels: Record<NotificationType, string> = {
    comment: 'a commenté sur',
    mention: 'vous a mentionné dans',
    assignment: 'vous a assigné',
    status: 'a changé le statut de',
    reopened: 'a réouvert',
    closed: 'a fermé',
    edited: 'a modifié',
    created: 'a créé',
};

interface InboxPreviewProps {
    item: InboxItem | null;
}

export function InboxPreview({ item }: InboxPreviewProps) {
    const { performMarkAsRead, performMarkAsUnread, performSnooze, performUnsnooze, performDelete, isItemUpdating } = useInboxStore();

    if (!item) {
        return (
            <div className="flex h-full flex-col items-center justify-center p-8 text-center">
                <Bell className="size-12 text-muted-foreground/30" />
                <p className="mt-4 text-sm text-muted-foreground">Sélectionnez une notification pour voir les détails</p>
            </div>
        );
    }

    const Icon = notificationIcons[item.type] || Bell;
    const label = notificationLabels[item.type];
    const isUpdating = isItemUpdating(item.id);
    const isSnoozed = item.snoozedUntil && new Date(item.snoozedUntil) > new Date();

    const actorInitials = item.actor.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    const assigneeInitials = item.issue.assignee
        ? item.issue.assignee.name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase()
              .slice(0, 2)
        : null;

    const handleSnooze = (hours: number) => {
        const until = new Date();
        until.setHours(until.getHours() + hours);
        performSnooze(item.id, until.toISOString());
    };

    return (
        <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <div className="flex items-center gap-2">
                    <Icon className="size-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Notification</span>
                </div>

                <div className="flex items-center gap-1">
                    {item.read ? (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => performMarkAsUnread(item.id)}
                            disabled={isUpdating}
                            title="Marquer comme non lu"
                        >
                            <Mail className="size-4" />
                        </Button>
                    ) : (
                        <Button variant="ghost" size="sm" onClick={() => performMarkAsRead(item.id)} disabled={isUpdating} title="Marquer comme lu">
                            <MailOpen className="size-4" />
                        </Button>
                    )}

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" title="Mettre en veille">
                                <AlarmClock className="size-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {isSnoozed ? (
                                <DropdownMenuItem onClick={() => performUnsnooze(item.id)}>
                                    <Clock className="mr-2 size-4" />
                                    Annuler la mise en veille
                                </DropdownMenuItem>
                            ) : (
                                <>
                                    <DropdownMenuItem onClick={() => handleSnooze(1)}>
                                        <Clock className="mr-2 size-4" />
                                        Dans 1 heure
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleSnooze(3)}>
                                        <Clock className="mr-2 size-4" />
                                        Dans 3 heures
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleSnooze(24)}>
                                        <Clock className="mr-2 size-4" />
                                        Demain
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleSnooze(24 * 7)}>
                                        <Clock className="mr-2 size-4" />
                                        Dans une semaine
                                    </DropdownMenuItem>
                                </>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                                <MoreHorizontal className="size-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                                <Link href={issues.url(item.issue.team?.identifier ?? '')}>
                                    <ExternalLink className="mr-2 size-4" />
                                    Voir l'issue
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => performDelete(item.id)} className="text-destructive hover:bg-destructive/15! hover:text-destructive! focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40">
                                <Trash2 className="mr-2 size-4 text-destructive" />
                                Supprimer
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
                <div className="flex items-start gap-3">
                    <Avatar className="size-10">
                        <AvatarImage src={item.actor.avatar_url} alt={item.actor.name} />
                        <AvatarFallback>{actorInitials}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                        <p className="text-sm">
                            <span className="font-semibold">{item.actor.name}</span> <span className="text-muted-foreground">{label}</span>
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(item.createdAt), {
                                addSuffix: true,
                                locale: fr,
                            })}
                        </p>

                        {item.content && (
                            <div className="mt-3 rounded-lg border border-border bg-muted/30 p-3">
                                <p className="text-sm">{item.content}</p>
                            </div>
                        )}
                    </div>
                </div>

                <Separator className="my-4" />

                <div className="rounded-lg border border-border bg-card p-4">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-medium text-muted-foreground">{item.issue.identifier}</span>
                                {item.issue.team && (
                                    <Badge variant="outline" className="text-xs">
                                        {item.issue.team.name}
                                    </Badge>
                                )}
                            </div>

                            <h3 className="mt-1 font-semibold">{item.issue.title}</h3>

                            {item.issue.description && <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{item.issue.description}</p>}
                        </div>

                        <Link href={issues.url(item.issue.team?.identifier ?? '')} className="shrink-0">
                            <Button variant="ghost" size="sm">
                                <ArrowUpRight className="size-4" />
                            </Button>
                        </Link>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-1.5">
                            <StatusIcon iconType={item.issue.status.icon_type} className="size-4" />
                            <span className="text-xs">{item.issue.status.name}</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                            <PriorityIcon iconType={item.issue.priority.icon_type} className="size-4" />
                            <span className="text-xs">{item.issue.priority.name}</span>
                        </div>

                        {item.issue.assignee && (
                            <div className="flex items-center gap-1.5">
                                <Avatar className="size-4">
                                    <AvatarImage src={item.issue.assignee.avatar_url} alt={item.issue.assignee.name} />
                                    <AvatarFallback className="text-[8px]">{assigneeInitials}</AvatarFallback>
                                </Avatar>
                                <span className="text-xs">{item.issue.assignee.name}</span>
                            </div>
                        )}

                        {item.issue.dueDate && (
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <Clock className="size-3" />
                                {format(new Date(item.issue.dueDate), 'dd MMM yyyy', { locale: fr })}
                            </div>
                        )}
                    </div>

                    {item.issue.labels && item.issue.labels.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                            {item.issue.labels.map((label) => (
                                <Badge key={label.id} variant="outline" className="gap-1.5 text-xs">
                                    <span className="size-2 rounded-full" style={{ backgroundColor: label.color }} />
                                    {label.name}
                                </Badge>
                            ))}
                        </div>
                    )}
                </div>

                {isSnoozed && (
                    <div className="mt-4 flex items-center gap-2 rounded-lg bg-amber-500/10 p-3 text-sm text-amber-600">
                        <AlarmClock className="size-4" />
                        <span>En veille jusqu'au {format(new Date(item.snoozedUntil!), "dd MMM 'à' HH:mm", { locale: fr })}</span>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="ml-auto h-auto py-1 text-amber-600 hover:text-amber-700"
                            onClick={() => performUnsnooze(item.id)}
                        >
                            Annuler
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
