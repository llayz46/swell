import { focus } from '@/actions/App/Modules/Workspace/Http/Controllers/WorkspaceMyIssuesController';
import { MyIssuesLayout } from '@/components/swell/workspace/my-issues/my-issues-layout';
import { OverviewTab } from '@/components/swell/workspace/my-issues/overview-tab';
import type { MyIssue, MyIssuesStats } from '@/components/swell/workspace/my-issues/types';
import WorkspaceLayout from '@/layouts/workspace-layout';
import { Head, router } from '@inertiajs/react';

interface OverviewProps {
    issues: MyIssue[];
    stats: MyIssuesStats;
}

export default function Overview({ issues, stats }: OverviewProps) {
    const handleIssueClick = (issue: MyIssue) => {
        router.visit(focus.url({ query: { issue: issue.id } }));
    };

    return (
        <WorkspaceLayout>
            <Head title="Mes tâches - Aperçu" />
            <MyIssuesLayout activeTab="overview">
                <OverviewTab issues={issues} stats={stats} onIssueClick={handleIssueClick} />
            </MyIssuesLayout>
        </WorkspaceLayout>
    );
}
