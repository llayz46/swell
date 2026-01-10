import { Badge } from '@/components/ui/badge';
import { ContextMenu, ContextMenuTrigger } from '@/components/ui/context-menu';
import { Issue } from '@/types/workspace';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { IssueContextMenu } from './issue-context-menu';
import { PrioritySelector } from './priority-selector';
import { StatusSelector } from './status-selector';
import { UserAssignee } from './user-assignee';

export function IssueLine({ issue }: { issue: Issue }) {
    return (
        <ContextMenu>
            <ContextMenuTrigger asChild>
                <div
                    //href={`/lndev-ui/issue/${issue.identifier}`}
                    className="flex h-11 w-full items-center justify-start px-6 hover:bg-sidebar/50"
                >
                    <div className="flex items-center gap-0.5">
                        <PrioritySelector priority={issue.priority} issueId={issue.id} />

                        <span className="mr-0.5 hidden w-18 shrink-0 truncate text-sm font-medium text-muted-foreground sm:inline-block">
                            {issue.identifier}
                        </span>

                        <StatusSelector status={issue.status} issueId={issue.id} />
                    </div>

                    <span className="mr-1 ml-0.5 flex min-w-0 items-center justify-start">
                        <span className="truncate text-xs font-medium sm:text-sm sm:font-semibold">{issue.title}</span>
                    </span>

                    <div className="ml-auto flex items-center justify-end gap-2 sm:w-fit">
                        <div className="w-3 shrink-0"></div>

                        <div className="hidden items-center justify-end -space-x-5 transition-all duration-200 hover:space-x-1 sm:flex lg:space-x-1">
                            {issue.labels.map((l) => (
                                <Badge key={l.id} variant="outline" className="gap-1.5 rounded-full bg-background text-muted-foreground">
                                    <span className="size-1.5 rounded-full" style={{ backgroundColor: l.color }} aria-hidden="true"></span>
                                    {l.name}
                                </Badge>
                            ))}
                        </div>

                        <span className="hidden shrink-0 text-xs text-muted-foreground sm:inline-block">
                            {format(issue.createdAt, 'dd MMM', { locale: fr })}
                        </span>

                        <UserAssignee user={issue.assignee} issueId={issue.id} />
                    </div>
                </div>
            </ContextMenuTrigger>

            <IssueContextMenu issue={issue} />
        </ContextMenu>
    );
}
