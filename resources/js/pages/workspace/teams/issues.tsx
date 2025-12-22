import WorkspaceLayout from '@/layouts/workspace-layout';
import Header from '@/components/swell/workspace/layout/headers/issues/header';
import { GroupIssues } from '@/components/swell/workspace/issues/group-issues';
import { Head } from '@inertiajs/react';
import { Issue, IssueStatus, IssuePriority, IssueLabel, Team } from '@/types/workspace';
import { useWorkspaceIssuesStore } from '@/stores/workspace-issues-store';
import { useEffect } from 'react';

interface IssuesPageProps {
    team: Team;
    issues: Issue[];
    statuses: IssueStatus[];
    priorities: IssuePriority[];
    labels: IssueLabel[];
    filters: {
        status?: string;
        priority?: string;
    };
    isLead: boolean;
    isMember: boolean;
}

export default function Issues({ team, issues, statuses, priorities, labels, filters, isLead, isMember }: IssuesPageProps) {
    console.log(filters)
    useEffect(() => {
        const normalizedFilters = {
            status: filters.status ? [filters.status] : [],
            priority: filters.priority ? [filters.priority] : [],
            assignee: [],
            labels: [],
        };
        
        useWorkspaceIssuesStore.getState().initialize({
            team,
            issues,
            statuses,
            labels,
            priorities,
            filters: normalizedFilters,
            isLead,
            isMember,
        });
    }, [team, issues, statuses, labels, priorities, filters, isLead, isMember]);

    const storeStatuses = useWorkspaceIssuesStore((state) => state.statuses);
    const isFiltering = useWorkspaceIssuesStore((state) =>
        Object.values(state.filters).some(f => f.length > 0)
    );

    return (
        <WorkspaceLayout header={<Header />}>
            <Head title="Teams - Workspace" />

            <div>
                {storeStatuses.map((status) => (
                    isFiltering ? (
                        <span>filtering</span>
                    ) : (
                        <GroupIssues key={status.id} statusId={status.id} />
                    )
                ))}
            </div>
        </WorkspaceLayout>
    );
}
