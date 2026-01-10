import { Button } from '@/components/ui/button';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ActivityFeed } from '@/components/swell/workspace/issues/activity-feed';
import { CommentEditor } from '@/components/swell/workspace/issues/comment-editor';
import { CommentList } from '@/components/swell/workspace/issues/comment-list';
import { IssueDetailSidebar } from '@/components/swell/workspace/issues/issue-detail-sidebar';
import { MarkdownPreview } from '@/components/swell/workspace/issues/markdown-preview';
import WorkspaceLayout from '@/layouts/workspace-layout';
import { useIssueDetailStore } from '@/stores/issue-detail-store';
import type { IssueAssignee, IssueDetail, IssueLabel, IssuePriority, IssueStatus } from '@/types/workspace';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft, MessageSquare, Activity } from 'lucide-react';
import { useEffect } from 'react';

type PageProps = {
    issue: IssueDetail;
    statuses: IssueStatus[];
    priorities: IssuePriority[];
    labels: IssueLabel[];
    teamMembers: IssueAssignee[];
};

export default function Show() {
    const { issue: serverIssue, statuses, priorities, labels, teamMembers } = usePage<PageProps>().props;

    const { initialize, issue, isSubmittingComment, performAddComment } = useIssueDetailStore();

    useEffect(() => {
        initialize({ issue: serverIssue, statuses, priorities, labels, teamMembers });
    }, [serverIssue, statuses, priorities, labels, teamMembers, initialize]);

    if (!issue) return null;

    const commentsCount = issue.comments.length + issue.comments.reduce((acc, c) => acc + (c.replies?.length || 0), 0);
    const activitiesCount = issue.activities.length;

    return (
        <WorkspaceLayout>
            <Head title={`${issue.identifier} - ${issue.title}`} />

            <ResizablePanelGroup direction="horizontal" autoSaveId="issue-detail-panel-group" className="size-full">
                <ResizablePanel defaultSize={65} minSize={50}>
                    <div className="flex h-full flex-col">
                        <div className="flex h-12 items-center gap-3 border-b border-border px-4">
                            <Button variant="ghost" size="sm" asChild>
                                <Link href={route('workspace.teams.issues', { team: issue.team?.identifier })}>
                                    <ArrowLeft className="mr-1 h-4 w-4" />
                                    {issue.team?.name}
                                </Link>
                            </Button>
                            <span className="font-mono text-sm text-muted-foreground">{issue.identifier}</span>
                            {issue.team && (
                                <span
                                    className="rounded px-2 py-0.5 text-xs font-medium"
                                    style={{ backgroundColor: issue.team.color + '20', color: issue.team.color }}
                                >
                                    {issue.team.name}
                                </span>
                            )}
                        </div>

                        <ScrollArea className="flex-1">
                            <div className="p-6">
                                <h1 className="text-2xl font-bold">{issue.title}</h1>

                                {issue.description && (
                                    <div className="mt-4">
                                        <MarkdownPreview content={issue.description} />
                                    </div>
                                )}

                                <div className="mt-8">
                                    <Tabs defaultValue="comments">
                                        <TabsList>
                                            <TabsTrigger value="comments" className="gap-2">
                                                <MessageSquare className="h-4 w-4" />
                                                Commentaires
                                                {commentsCount > 0 && (
                                                    <span className="ml-1 rounded-full bg-muted px-2 py-0.5 text-xs">
                                                        {commentsCount}
                                                    </span>
                                                )}
                                            </TabsTrigger>
                                            <TabsTrigger value="activity" className="gap-2">
                                                <Activity className="h-4 w-4" />
                                                Activité
                                                {activitiesCount > 0 && (
                                                    <span className="ml-1 rounded-full bg-muted px-2 py-0.5 text-xs">
                                                        {activitiesCount}
                                                    </span>
                                                )}
                                            </TabsTrigger>
                                        </TabsList>

                                        <TabsContent value="comments" className="mt-4">
                                            <CommentList comments={issue.comments} />

                                            <div className="mt-6">
                                                <CommentEditor
                                                    onSubmit={(content) => performAddComment(content)}
                                                    isSubmitting={isSubmittingComment}
                                                    placeholder="Écrire un commentaire... (Markdown supporté)"
                                                />
                                            </div>
                                        </TabsContent>

                                        <TabsContent value="activity" className="mt-4">
                                            <ActivityFeed activities={issue.activities} />
                                        </TabsContent>
                                    </Tabs>
                                </div>
                            </div>
                        </ScrollArea>
                    </div>
                </ResizablePanel>

                <ResizableHandle withHandle />

                <ResizablePanel defaultSize={35} minSize={25} maxSize={45}>
                    <IssueDetailSidebar />
                </ResizablePanel>
            </ResizablePanelGroup>
        </WorkspaceLayout>
    );
}
