import type { IssueComment } from '@/types/workspace';
import { MessageSquare } from 'lucide-react';
import { CommentItem } from './comment-item';

interface CommentListProps {
    comments: IssueComment[];
}

export function CommentList({ comments }: CommentListProps) {
    if (comments.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <MessageSquare className="h-12 w-12 mb-4 opacity-50" />
                <p className="text-sm">Aucun commentaire pour le moment</p>
                <p className="text-xs mt-1">Soyez le premier à commenter cette issue</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {comments.map((comment) => (
                <CommentItem key={comment.id} comment={comment} />
            ))}
        </div>
    );
}
