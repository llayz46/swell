import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { ActivityType, IssueActivity } from '@/types/workspace';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
    ArrowRight,
    Calendar,
    CircleDot,
    Flag,
    Pencil,
    Plus,
    Tag,
    User,
    FileText,
} from 'lucide-react';

interface ActivityItemProps {
    activity: IssueActivity;
}

const activityConfig: Record<ActivityType, { icon: React.ElementType; label: string; color: string }> = {
    created: { icon: Plus, label: "a créé l'issue", color: 'text-green-500' },
    status_changed: { icon: CircleDot, label: 'a changé le statut', color: 'text-blue-500' },
    priority_changed: { icon: Flag, label: 'a changé la priorité', color: 'text-orange-500' },
    assignee_changed: { icon: User, label: "a modifié l'assigné", color: 'text-purple-500' },
    labels_changed: { icon: Tag, label: 'a modifié les étiquettes', color: 'text-pink-500' },
    due_date_changed: { icon: Calendar, label: "a modifié la date d'échéance", color: 'text-cyan-500' },
    title_changed: { icon: Pencil, label: 'a modifié le titre', color: 'text-yellow-500' },
    description_changed: { icon: FileText, label: 'a modifié la description', color: 'text-gray-500' },
};

export function ActivityItem({ activity }: ActivityItemProps) {
    const config = activityConfig[activity.type] || {
        icon: CircleDot,
        label: 'a effectué une action',
        color: 'text-muted-foreground',
    };

    const Icon = config.icon;

    const userInitials = activity.user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    const timeAgo = formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true, locale: fr });

    const renderValueChange = () => {
        if (!activity.oldValue && !activity.newValue) return null;

        const formatValue = (value: Record<string, unknown> | null): string => {
            if (!value) return '(aucun)';
            if ('name' in value) return String(value.name);
            if ('date' in value) return String(value.date);
            if ('value' in value) return String(value.value);
            return JSON.stringify(value);
        };

        const oldStr = formatValue(activity.oldValue);
        const newStr = formatValue(activity.newValue);

        if (activity.type === 'created') {
            return null;
        }

        return (
            <div className="mt-1 flex items-center gap-2 text-sm">
                <span className="text-muted-foreground line-through">{oldStr}</span>
                <ArrowRight className="size-3 text-muted-foreground" />
                <span className="font-medium">{newStr}</span>
            </div>
        );
    };

    return (
        <div className="flex gap-3 py-3">
            <div className={`flex size-8 shrink-0 items-center justify-center rounded-full bg-muted ${config.color}`}>
                <Icon className="size-4" />
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                    <Avatar className="size-5">
                        <AvatarImage src={activity.user.avatar_url} alt={activity.user.name} />
                        <AvatarFallback className="text-[10px]">{userInitials}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-sm">{activity.user.name}</span>
                    <span className="text-sm text-muted-foreground">{config.label}</span>
                    <span className="text-xs text-muted-foreground">{timeAgo}</span>
                </div>

                {renderValueChange()}
            </div>
        </div>
    );
}
