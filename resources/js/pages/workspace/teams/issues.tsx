import WorkspaceLayout from '@/layouts/workspace-layout';
import Header from '@/components/swell/workspace/layout/headers/issues/header';
import { GroupIssues } from '@/components/swell/workspace/issues/group-issues';
import { Head } from '@inertiajs/react';
import { Issue, IssueStatus, IssuePriority, IssueLabel, Team } from '@/types/workspace';
import { useWorkspaceIssuesStore } from '@/stores/workspace-issues-store';
import { useEffect, useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';

interface IssuesPageProps {
    team: Team;
    issues: Issue[];
    statuses: IssueStatus[];
    priorities: IssuePriority[];
    labels: IssueLabel[];
    filters: {
        status?: string;
        priority?: string;
        assignee?: string[];
        labels?: string[];
    };
    isLead: boolean;
    isMember: boolean;
}

const normalizeFilters = (serverFilters: { status?: string; priority?: string }) => ({
    status: serverFilters.status ? [serverFilters.status] : [],
    priority: serverFilters.priority ? [serverFilters.priority] : [],
    assignee: [],
    labels: [],
});

export default function Issues({ team, issues, statuses, priorities, labels, filters, isLead, isMember }: IssuesPageProps) {
    const normalizedFilters = useMemo(() => normalizeFilters(filters), [filters]);

    useEffect(() => {
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
    }, [team, issues, statuses, labels, priorities, normalizedFilters, isLead, isMember]);

    const { statuses: storeStatuses, filters: storeFilters } = useWorkspaceIssuesStore(
        useShallow((state) => ({
            statuses: state.statuses,
            filters: state.filters,
        }))
    );

    const isFiltering = Object.values(storeFilters).some((f) => f.length > 0);

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
