import { useInitials } from '@/hooks/use-initials';
import type { Review as ReviewType } from '@/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Star } from 'lucide-react';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../../../ui/avatar';
import { Card, CardContent } from '../../../ui/card';

export function Review({ review }: { review: ReviewType }) {
    const [expandedComments, setExpandedComments] = useState<Set<number>>(new Set());
    const isExpanded = expandedComments.has(review.id);
    const shouldTruncate = review.comment.length > 300;

    const getInitials = useInitials();

    const toggleCommentExpansion = (reviewId: number) => {
        setExpandedComments((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(reviewId)) {
                newSet.delete(reviewId);
            } else {
                newSet.add(reviewId);
            }
            return newSet;
        });
    };

    return (
        <Card className="border bg-card max-sm:py-4">
            <CardContent className="px-6 max-sm:px-4">
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-10 w-10">
                            <AvatarImage src={review.user?.avatar_url} alt="User avatar" />
                            <AvatarFallback className="bg-muted text-muted-foreground">{getInitials(review.user?.name || '')}</AvatarFallback>
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
                                            className={`size-4 ${star <= review.rating ? 'fill-primary text-primary' : 'text-muted-foreground'}`}
                                        />
                                    ))}
                                </div>
                                <span className="text-sm text-muted-foreground">{format(review.created_at, 'dd MMMM yyyy', { locale: fr })}</span>
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
