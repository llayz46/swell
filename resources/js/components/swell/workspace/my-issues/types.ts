import type { Issue, Team } from '@/types/workspace';

export interface MyIssue extends Issue {
    team: Pick<Team, 'id' | 'identifier' | 'name' | 'color'>;
}

export interface MyIssuesStats {
    total: number;
    inProgress: number;
    overdue: number;
    completedThisWeek: number;
}
