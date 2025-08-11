import { Card, CardContent } from '../../../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../../../ui/avatar';
import { Star } from 'lucide-react';
import type { Review as ReviewType } from '@/types';
import { getStorageUrl } from '@/utils/format-storage-url';
import { useInitials } from '@/hooks/use-initials';
import { useState } from 'react';

export function Review({ review }: { review: ReviewType }) {
    const [expandedComments, setExpandedComments] = useState<Set<number>>(new Set())
    const isExpanded = expandedComments.has(review.id)
    const shouldTruncate = review.comment.length > 300

    const getInitials = useInitials();

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("fr-FR", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
    }

    const toggleCommentExpansion = (reviewId: number) => {
        setExpandedComments((prev) => {
            const newSet = new Set(prev)
            if (newSet.has(reviewId)) {
                newSet.delete(reviewId)
            } else {
                newSet.add(reviewId)
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
                            <AvatarImage src={getStorageUrl(review.user?.avatar)} alt="User avatar" />
                            <AvatarFallback className="bg-muted text-muted-foreground">
                                {getInitials(review.user?.name || '')}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="mb-1 flex items-center gap-2">
                                <span className="font-medium text-foreground">{review.user?.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            className={`size-4 ${
                                                star <= review.rating ? 'fill-primary text-primary' : 'text-muted-foreground'
                                            }`}
                                        />
                                    ))}
                                </div>
                                <span className="text-sm text-muted-foreground">{formatDate(review.created_at)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h4 className="font-semibold text-foreground">{review.title}</h4>
                        <div className="text-foreground">
                            {shouldTruncate && !isExpanded ? (
                                <>
                                    {review.comment.substring(0, 300)}...
                                    <button
                                        onClick={() => toggleCommentExpansion(review.id)}
                                        className="ml-2 text-sm font-medium text-primary hover:underline"
                                    >
                                        Lire la suite
                                    </button>
                                </>
                            ) : (
                                <>
                                    {review.comment}
                                    {shouldTruncate && isExpanded && (
                                        <button
                                            onClick={() => toggleCommentExpansion(review.id)}
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
