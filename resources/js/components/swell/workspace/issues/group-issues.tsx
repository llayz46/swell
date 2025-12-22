import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useWorkspaceIssuesStore } from '@/stores/workspace-issues-store';
import { IssueLine } from './issue-line';
import { StatusIcon } from '@/components/swell/workspace/icons';
import { useMemo } from 'react';
import { IssueStatus } from '@/types/workspace';

interface GroupIssuesProps {
    status: IssueStatus;
}

export function GroupIssues({ status }: GroupIssuesProps) {
    const allIssues = useWorkspaceIssuesStore((state) => state.issues);

    const issues = useMemo(
        () => allIssues.filter((issue) => issue.status.id === status.id),
        [allIssues, status]
    );

    const count = issues.length;

    if (!status) return null;

    return (
        <div className="bg-workspace">
            <div className="bg-workspace sticky top-0 z-10 w-full h-10">
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

                    <Button
                        className="size-6"
                        size="icon"
                        variant="ghost"
                        // onClick={(e) => {
                        //     e.stopPropagation();
                        //     openModal(status);
                        // }}
                    >
                        <Plus className="size-4" />
                    </Button>
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
