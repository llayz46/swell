export interface IssueStatus {
  id: string
  name: string
  color: string
  iconType: string
}

export interface IssuePriority {
  id: string
  name: string
  color: string
}

export interface IssueLabel {
  id: string
  name: string
  color: string
}

export interface IssueAssignee {
  id: number
  name: string
  email: string
  avatarUrl?: string
}

export interface Issue {
  id: number
  identifier: string
  title: string
  description?: string
  status: IssueStatus
  priority: IssuePriority
  assignee: IssueAssignee | null
  creator: {
    id: number
    name: string
  }
  labels: IssueLabel[]
  dueDate?: string
  createdAt: string
  updatedAt: string
}

export type NotificationType =
  | 'comment'
  | 'mention'
  | 'assignment'
  | 'status'
  | 'reopened'
  | 'closed'
  | 'edited'
  | 'created'

export interface InboxItem {
  id: number
  issue: Issue
  type: NotificationType
  content?: string
  actor: IssueAssignee
  read: boolean
  readAt?: string
  createdAt: string
}

export interface WorkspaceContextData {
  statuses: IssueStatus[]
  priorities: IssuePriority[]
  labels: IssueLabel[]
}

export interface TeamMember {
  id: number
  name: string
  email: string
  avatarUrl?: string
  role: 'lead' | 'member'
  joinedAt: string
}

export interface Team {
  id: number
  identifier: string
  name: string
  icon?: string
  color: string
  description?: string
  members?: TeamMember[]
  leads?: {
    id: number
    name: string
    avatarUrl?: string
  }[]
  membersCount?: number
  issuesCount?: number
  joined?: boolean
  role?: string;
  createdAt: string
  updatedAt: string
}