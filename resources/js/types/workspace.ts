import type { PriorityIconName } from '@/components/swell/workspace/icons/priority-mapper';

export interface IssueStatus {
    id: number;
    slug: string;
    name: string;
    color: string;
    icon_type: string;
}

export interface IssuePriority {
    id: number;
    slug: string;
    name: string;
    icon_type: PriorityIconName;
}

export interface IssueLabel {
    id: number;
    name: string;
    slug: string;
    color: string;
}

export interface IssueAssignee {
    id: number;
    name: string;
    email: string;
    avatarUrl?: string;
}

export interface Issue {
    id: number;
    identifier: string;
    title: string;
    description?: string;
    status: IssueStatus;
    priority: IssuePriority;
    assignee: IssueAssignee | null;
    creator: {
        id: number;
        name: string;
    };
    labels: IssueLabel[];
    dueDate?: string;
    createdAt: string;
    updatedAt: string;
}

export type NotificationType = 'comment' | 'mention' | 'assignment' | 'status' | 'reopened' | 'closed' | 'edited' | 'created';

export interface InboxItem {
    id: number;
    issue: Issue;
    type: NotificationType;
    content?: string;
    actor: IssueAssignee;
    read: boolean;
    readAt?: string;
    createdAt: string;
}

export interface WorkspaceContextData {
    statuses: IssueStatus[];
    priorities: IssuePriority[];
    labels: IssueLabel[];
}

interface BaseMember {
    id: number;
    name: string;
    email: string;
    avatar_url?: string;
    created_at: string;
    updated_at: string;
}

export interface TeamMember extends BaseMember {
    role: 'team-lead' | 'team-member';
    joined_at: string;
}

export interface WorkspaceMember extends BaseMember {
    roles: string[];
    teams: Team[];
}

export interface Team {
    id: number;
    identifier: string;
    name: string;
    icon?: string;
    color: string;
    description?: string;
    members?: TeamMember[];
    leads?: {
        id: number;
        name: string;
        avatarUrl?: string;
    }[];
    membersCount?: number;
    issuesCount?: number;
    joined?: boolean;
    role?: string;
    createdAt: string;
    updatedAt: string;
}
