import { FocusTab } from '@/components/swell/workspace/my-issues/focus-tab';
import { MyIssuesLayout } from '@/components/swell/workspace/my-issues/my-issues-layout';
import type { MyIssue } from '@/components/swell/workspace/my-issues/types';
import WorkspaceLayout from '@/layouts/workspace-layout';
import type { IssueLabel, IssuePriority, IssueStatus } from '@/types/workspace';
import { Head } from '@inertiajs/react';
import { useMemo, useState } from 'react';

interface FocusProps {
    issues: MyIssue[];
    statuses: IssueStatus[];
    priorities: IssuePriority[];
    labels: IssueLabel[];
    selectedIssueId?: string;
}

export default function Focus({ issues, statuses, priorities, selectedIssueId }: FocusProps) {
    const initialIssue = useMemo(() => {
        if (!selectedIssueId) return null;
        return issues.find((i) => i.id === Number(selectedIssueId)) ?? null;
    }, [issues, selectedIssueId]);

    const [selectedIssue, setSelectedIssue] = useState<MyIssue | null>(initialIssue);

    return (
        <WorkspaceLayout>
            <Head title="Mes tâches - Focus" />
            <MyIssuesLayout activeTab="focus">
                <div className="h-full overflow-hidden">
                    <FocusTab
                        issues={issues}
                        statuses={statuses}
                        priorities={priorities}
                        selectedIssue={selectedIssue}
                        onSelectIssue={setSelectedIssue}
                    />
                </div>
            </MyIssuesLayout>
        </WorkspaceLayout>
    );
}
