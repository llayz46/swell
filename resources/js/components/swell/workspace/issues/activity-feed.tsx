import type { IssueActivity } from '@/types/workspace';
import { Activity } from 'lucide-react';
import { ActivityItem } from './activity-item';

interface ActivityFeedProps {
    activities: IssueActivity[];
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
    if (activities.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <Activity className="h-12 w-12 mb-4 opacity-50" />
                <p className="text-sm">Aucune activité enregistrée</p>
            </div>
        );
    }

    return (
        <div className="divide-y divide-border">
            {activities.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
            ))}
        </div>
    );
}
