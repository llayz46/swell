import { FilteredGroupIssues } from '@/components/swell/workspace/issues/filtered-group-issues';
import { GroupIssues } from '@/components/swell/workspace/issues/group-issues';
import { IssueDialog } from '@/components/swell/workspace/issues/issue-dialog';
import Header from '@/components/swell/workspace/layout/headers/issues/header';
import WorkspaceLayout from '@/layouts/workspace-layout';
import { useWorkspaceIssuesStore } from '@/stores/workspace-issues-store';
import { Issue, IssueLabel, IssuePriority, IssueStatus, Team } from '@/types/workspace';
import { Head } from '@inertiajs/react';
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

    const {
        statuses: storeStatuses,
        filters: storeFilters,
        issues: allIssues,
    } = useWorkspaceIssuesStore(
        useShallow((state) => ({
            statuses: state.statuses,
            filters: state.filters,
            issues: state.issues,
        })),
    );

    const isFiltering = Object.values(storeFilters).some((f) => f.length > 0);

    const filteredIssues = useMemo(() => {
        if (!isFiltering) return allIssues;

        const filtered = useWorkspaceIssuesStore.getState().getFilteredIssues();

        return filtered;
    }, [allIssues, storeFilters, isFiltering]);

    return (
        <WorkspaceLayout header={<Header />}>
            <Head title="Équipes - Workspace" />

            <div>
                {storeStatuses.map((status) =>
                    isFiltering ? (
                        <FilteredGroupIssues key={status.id} status={status} allIssues={filteredIssues} />
                    ) : (
                        <GroupIssues key={status.id} status={status} allIssues={allIssues} />
                    ),
                )}
            </div>

            <IssueDialog teamId={team?.id} />
        </WorkspaceLayout>
    );
}
