import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { ProductCommentForm } from '@/components/product-comment-form';
import { useProductComment } from '@/contexts/product-comment-context';
import { ProductComment } from '@/components/product-comment';

export function ProductCommentSection() {
    const { comments } = useProductComment();

    const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
        rating,
        count: comments.filter(comment => comment.rating === rating).length,
        percentage:
            comments.length > 0
                ? (comments.filter(comment => comment.rating === rating).length / comments.length) * 100
                : 0,
    }))

    return (
        <div className="max-w-7xl mx-auto space-y-6 my-16">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-bold text-foreground">Avis clients</h2>
                    <Badge variant="secondary" className="bg-muted text-muted-foreground rounded-full">
                        {comments.length} avis
                    </Badge>
                </div>
            </div>

            <Card className="max-sm:py-4">
                <CardContent className="max-sm:px-4 px-6">
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="flex flex-col items-center justify-center">
                            <div className="text-4xl font-bold text-foreground mb-2">
                                {comments.length > 0
                                    ? (comments.reduce((acc, comment) => acc + comment.rating, 0) / comments.length).toFixed(1)
                                    : '0.0'}
                            </div>
                            <div className="flex items-center justify-center gap-1 mb-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        className={`w-5 h-5 ${
                                            star <= Math.round(Number.parseFloat(
                                                comments.length > 0
                                                    ? (comments.reduce((acc, comment) => acc + comment.rating, 0) / comments.length).toFixed(1)
                                                    : '0.0'
                                            ))
                                                ? "fill-primary text-primary"
                                                : "text-muted-foreground"
                                        }`}
                                    />
                                ))}
                            </div>
                            <p className="text-muted-foreground">Basé sur {comments.length} avis</p>
                        </div>

                        <div className="space-y-2">
                            {ratingDistribution.map(({ rating, count, percentage }) => (
                                <div key={rating} className="flex items-center gap-3">
                                    <div className="flex items-center gap-1 w-12">
                                        <span className="text-sm text-foreground">{rating}</span>
                                        <Star className="w-3 h-3 fill-primary text-primary" />
                                    </div>
                                    <div className="flex-1 bg-muted rounded-full h-2">
                                        <div
                                            className="bg-primary h-2 rounded-full transition-all duration-300"
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                    <span className="text-sm text-muted-foreground w-8">{count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <ProductCommentForm />

            <div className="space-y-4">
                {comments.map((comment => (
                    <ProductComment key={comment.id} comment={comment} />
                )))}
            </div>
        </div>
    )
}
