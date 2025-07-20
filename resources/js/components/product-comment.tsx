import { Card, CardContent } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Star } from 'lucide-react';
import type { ProductComment as ProductCommentType } from '@/types';
import { getStorageUrl } from '@/utils/format-storage-url';
import { useInitials } from '@/hooks/use-initials';
import { useState } from 'react';

export function ProductComment({ comment }: { comment: ProductCommentType }) {
    const [expandedComments, setExpandedComments] = useState<Set<number>>(new Set())
    const isExpanded = expandedComments.has(comment.id)
    const shouldTruncate = comment.comment.length > 300

    const getInitials = useInitials();

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("fr-FR", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
    }

    const toggleCommentExpansion = (commentId: number) => {
        setExpandedComments((prev) => {
            const newSet = new Set(prev)
            if (newSet.has(commentId)) {
                newSet.delete(commentId)
            } else {
                newSet.add(commentId)
            }
            return newSet
        })
    }

    return (
        <Card className="max-sm:py-4 border bg-card">
            <CardContent className="max-sm:px-4 px-6">
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-10 w-10">
                            <AvatarImage src={getStorageUrl(comment.user?.avatar)} alt="User avatar" />
                            <AvatarFallback className="bg-muted text-muted-foreground">
                                {getInitials(comment.user?.name || '')}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="mb-1 flex items-center gap-2">
                                <span className="font-medium text-foreground">{comment.user?.name}</span>
                                {/*{comment.author.isVerifiedPurchaser && (*/}
                                {/*    <Badge*/}
                                {/*        variant="secondary"*/}
                                {/*        className="bg-green-100 text-xs text-green-800 dark:bg-green-900 dark:text-green-200"*/}
                                {/*    >*/}
                                {/*        Achat vérifié*/}
                                {/*    </Badge>*/}
                                {/*)}*/}
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            className={`size-4 ${
                                                star <= comment.rating ? 'fill-primary text-primary' : 'text-muted-foreground'
                                            }`}
                                        />
                                    ))}
                                </div>
                                <span className="text-sm text-muted-foreground">{formatDate(comment.created_at)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h4 className="font-semibold text-foreground">{comment.title}</h4>
                        <div className="text-foreground">
                            {shouldTruncate && !isExpanded ? (
                                <>
                                    {comment.comment.substring(0, 300)}...
                                    <button
                                        onClick={() => toggleCommentExpansion(comment.id)}
                                        className="ml-2 text-sm font-medium text-primary hover:underline"
                                    >
                                        Lire la suite
                                    </button>
                                </>
                            ) : (
                                <>
                                    {comment.comment}
                                    {shouldTruncate && isExpanded && (
                                        <button
                                            onClick={() => toggleCommentExpansion(comment.id)}
                                            className="ml-2 text-sm font-medium text-primary hover:underline"
                                        >
                                            Réduire
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
