import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useIssueDetailStore } from '@/stores/issue-detail-store';
import type { IssueComment } from '@/types/workspace';
import { usePage } from '@inertiajs/react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { MoreHorizontal, Pencil, Reply, Trash2 } from 'lucide-react';
import { CommentEditor } from './comment-editor';
import { MarkdownPreview } from './markdown-preview';

interface CommentItemProps {
    comment: IssueComment;
    isReply?: boolean;
}

export function CommentItem({ comment, isReply = false }: CommentItemProps) {
    const { auth } = usePage<{ auth: { user: { id: number } } }>().props;
    const {
        editingCommentId,
        replyingToCommentId,
        isSubmittingComment,
        setEditingCommentId,
        setReplyingToCommentId,
        performUpdateComment,
        performDeleteComment,
        performAddComment,
    } = useIssueDetailStore();

    const isEditing = editingCommentId === comment.id;
    const isReplying = replyingToCommentId === comment.id;
    const isOwner = auth.user.id === comment.user.id;

    const userInitials = comment.user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    const timeAgo = formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: fr });

    return (
        <div className={`group ${isReply ? 'mt-3 ml-10' : ''}`}>
            <div className="flex gap-3">
                <Avatar className="h-8 w-8 shrink-0">
                    <AvatarImage src={comment.user.avatar_url} alt={comment.user.name} />
                    <AvatarFallback className="text-xs">{userInitials}</AvatarFallback>
                </Avatar>

                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{comment.user.name}</span>
                        <span className="text-xs text-muted-foreground">{timeAgo}</span>
                        {comment.editedAt && <span className="text-xs text-muted-foreground">(modifié)</span>}

                        <div className="ml-auto opacity-0 transition-opacity group-hover:opacity-100">
                            {!isReply || isOwner ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="xs" className="h-6 w-6 p-0">
                                            <MoreHorizontal className="size-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        {!isReply && (
                                            <DropdownMenuItem onClick={() => setReplyingToCommentId(comment.id)}>
                                                <Reply className="mr-2 size-4" />
                                                Répondre
                                            </DropdownMenuItem>
                                        )}
                                        {isOwner && (
                                            <>
                                                <DropdownMenuItem onClick={() => setEditingCommentId(comment.id)}>
                                                    <Pencil className="mr-2 size-4" />
                                                    Modifier
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-destructive" onClick={() => performDeleteComment(comment.id)}>
                                                    <Trash2 className="mr-2 size-4" />
                                                    Supprimer
                                                </DropdownMenuItem>
                                            </>
                                        )}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : null}
                        </div>
                    </div>

                    {isEditing ? (
                        <div className="mt-2">
                            <CommentEditor
                                initialContent={comment.content}
                                onSubmit={(content) => performUpdateComment(comment.id, content)}
                                onCancel={() => setEditingCommentId(null)}
                                isSubmitting={isSubmittingComment}
                                submitLabel="Modifier"
                                showCancel
                                autoFocus
                            />
                        </div>
                    ) : (
                        <div className="mt-1">
                            <MarkdownPreview content={comment.content} className="text-sm" />
                        </div>
                    )}

                    {!isReply && !isEditing && (
                        <Button
                            variant="ghost"
                            size="xs"
                            className="mt-2 text-muted-foreground hover:text-foreground"
                            onClick={() => setReplyingToCommentId(comment.id)}
                        >
                            <Reply className="mr-1 h-3 w-3" />
                            Répondre
                        </Button>
                    )}
                </div>
            </div>

            {isReplying && (
                <div className="mt-3 ml-11">
                    <CommentEditor
                        onSubmit={(content) => performAddComment(content, comment.id)}
                        onCancel={() => setReplyingToCommentId(null)}
                        isSubmitting={isSubmittingComment}
                        placeholder={`Répondre à ${comment.user.name}...`}
                        submitLabel="Répondre"
                        showCancel
                        autoFocus
                    />
                </div>
            )}

            {comment.replies && comment.replies.length > 0 && (
                <div className="mt-3 border-l-2 border-border pl-3">
                    {comment.replies.map((reply) => (
                        <CommentItem key={reply.id} comment={reply} isReply />
                    ))}
                </div>
            )}
        </div>
    );
}
