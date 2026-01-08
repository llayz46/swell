import { FocusTab } from '@/components/swell/workspace/my-issues/focus-tab';
import { MyIssuesLayout } from '@/components/swell/workspace/my-issues/my-issues-layout';
import type { MyIssue } from '@/components/swell/workspace/my-issues/types';
import WorkspaceLayout from '@/layouts/workspace-layout';
import { useMyIssuesStore } from '@/stores/my-issues-store';
import type { IssueLabel, IssuePriority, IssueStatus } from '@/types/workspace';
import { Head } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

interface FocusProps {
    issues: MyIssue[];
    statuses: IssueStatus[];
    priorities: IssuePriority[];
    labels: IssueLabel[];
    selectedIssueId?: string;
}

export default function Focus({ issues, statuses, priorities, labels, selectedIssueId }: FocusProps) {
    const { initialize, issues: storeIssues } = useMyIssuesStore(
        useShallow((state) => ({
            initialize: state.initialize,
            issues: state.issues,
        })),
    );

    useEffect(() => {
        initialize({ issues, statuses, priorities, labels });
    }, [issues, statuses, priorities, labels, initialize]);

    const initialIssue = useMemo(() => {
        if (!selectedIssueId) return null;
        return storeIssues.find((i) => i.id === Number(selectedIssueId)) ?? null;
    }, [storeIssues, selectedIssueId]);

    const [selectedIssue, setSelectedIssue] = useState<MyIssue | null>(initialIssue);

    // Sync selected issue with store updates
    useEffect(() => {
        if (selectedIssue) {
            const updatedIssue = storeIssues.find((i) => i.id === selectedIssue.id);
            if (updatedIssue) {
                setSelectedIssue(updatedIssue);
            }
        }
    }, [storeIssues, selectedIssue?.id]);

    return (
        <WorkspaceLayout>
            <Head title="Mes tâches - Focus" />
            <MyIssuesLayout activeTab="focus">
                <div className="h-full overflow-hidden">
                    <FocusTab selectedIssue={selectedIssue} onSelectIssue={setSelectedIssue} />
                </div>
            </MyIssuesLayout>
        </WorkspaceLayout>
    );
}
