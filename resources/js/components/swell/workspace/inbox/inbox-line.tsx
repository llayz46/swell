import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import type { InboxItem, NotificationType } from '@/types/workspace';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
    AtSign,
    Bell,
    CheckCircle2,
    Edit3,
    MessageSquare,
    PlusCircle,
    RefreshCw,
    UserPlus,
    XCircle,
} from 'lucide-react';

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
    comment: 'a commenté',
    mention: 'vous a mentionné',
    assignment: 'vous a assigné',
    status: 'a changé le statut',
    reopened: 'a réouvert',
    closed: 'a fermé',
    edited: 'a modifié',
    created: 'a créé',
};

const notificationColors: Record<NotificationType, string> = {
    comment: 'text-blue-500',
    mention: 'text-purple-500',
    assignment: 'text-green-500',
    status: 'text-orange-500',
    reopened: 'text-yellow-500',
    closed: 'text-emerald-500',
    edited: 'text-slate-500',
    created: 'text-sky-500',
};

interface InboxLineProps {
    item: InboxItem;
    isSelected: boolean;
    onClick: () => void;
    showId?: boolean;
    showStatusIcon?: boolean;
}

export function InboxLine({ item, isSelected, onClick, showId = false, showStatusIcon = true }: InboxLineProps) {
    const Icon = notificationIcons[item.type] || Bell;
    const label = notificationLabels[item.type];
    const colorClass = notificationColors[item.type];

    const initials = item.actor.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                'flex w-full items-start gap-3 border-b border-border px-4 py-3 text-left transition-colors',
                'hover:bg-accent/50',
                isSelected && 'bg-accent',
                !item.read && 'bg-primary/5',
            )}
        >
            {/* Unread indicator */}
            <div className="flex h-full items-center pt-1.5">
                <span
                    className={cn(
                        'size-2 shrink-0 rounded-full',
                        item.read ? 'bg-transparent' : 'bg-primary',
                    )}
                />
            </div>

            {/* Avatar */}
            <Avatar className="size-8 shrink-0">
                <AvatarImage src={item.actor.avatar_url} alt={item.actor.name} />
                <AvatarFallback className="text-xs">{initials}</AvatarFallback>
            </Avatar>

            {/* Content */}
            <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                    {showStatusIcon && (
                        <Icon className={cn('size-4 shrink-0', colorClass)} />
                    )}
                    <span className="truncate text-sm font-medium">
                        {item.actor.name}
                    </span>
                    <span className="shrink-0 text-xs text-muted-foreground">
                        {label}
                    </span>
                </div>

                <div className="mt-0.5 flex items-center gap-2">
                    {showId && (
                        <span className="shrink-0 text-xs font-medium text-muted-foreground">
                            {item.issue.identifier}
                        </span>
                    )}
                    <span className={cn('truncate text-sm', item.read ? 'text-muted-foreground' : 'font-medium')}>
                        {item.issue.title}
                    </span>
                </div>

                {item.content && (
                    <p className="mt-1 truncate text-xs text-muted-foreground">
                        {item.content}
                    </p>
                )}

                <span className="mt-1 block text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(item.createdAt), {
                        addSuffix: true,
                        locale: fr,
                    })}
                </span>
            </div>

            {/* Snoozed indicator */}
            {item.snoozedUntil && new Date(item.snoozedUntil) > new Date() && (
                <div className="flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-xs text-amber-600">
                    <XCircle className="size-3" />
                    En veille
                </div>
            )}
        </button>
    );
}
