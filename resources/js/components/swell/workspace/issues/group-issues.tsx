import { StatusIcon } from '@/components/swell/workspace/icons';
import { CreateIssueButton } from '@/components/swell/workspace/issues/create-issue-button';
import { Issue, IssueStatus } from '@/types/workspace';
import { useMemo } from 'react';
import { IssueLine } from './issue-line';

interface GroupIssuesProps {
    status: IssueStatus;
    allIssues: Issue[];
}

export function GroupIssues({ status, allIssues }: GroupIssuesProps) {
    const issues = useMemo(() => allIssues.filter((issue) => issue.status.id === status.id), [allIssues, status]);

    const count = issues.length;

    return (
        <div className="bg-workspace">
            <div className="sticky top-0 z-10 h-10 w-full bg-workspace">
                <div
                    className="flex h-full w-full items-center justify-between px-6"
                    style={{
                        backgroundColor: `${status.color}08`,
                    }}
                >
                    <div className="flex items-center gap-2">
                        <StatusIcon iconType={status.icon_type} color={status.color} size={14} />
                        <span className="text-sm font-medium">{status.name}</span>
                        <span className="text-sm text-muted-foreground">{count}</span>
                    </div>

                    <CreateIssueButton statusId={status.id} />
                </div>
            </div>

            <div className="space-y-0">
                {issues.map((issue) => (
                    <IssueLine key={issue.id} issue={issue} />
                ))}
            </div>
        </div>
    );
}
