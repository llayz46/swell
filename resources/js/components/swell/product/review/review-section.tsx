import { Review } from '@/components/swell/product/review/review';
import { ReviewForm } from '@/components/swell/product/review/review-form';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useReview } from '@/contexts/review-context';
import { Star } from 'lucide-react';

export function ReviewSection() {
    const { reviews } = useReview();

    const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
        rating,
        count: reviews.filter((review) => review.rating === rating).length,
        percentage: reviews.length > 0 ? (reviews.filter((review) => review.rating === rating).length / reviews.length) * 100 : 0,
    }));

    return (
        <div className="mx-auto my-16 max-w-7xl space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-bold text-foreground">Avis clients</h2>
                    <Badge variant="secondary" className="rounded-full bg-muted text-muted-foreground">
                        {reviews.length} avis
                    </Badge>
                </div>
            </div>

            <Card className="max-sm:py-4">
                <CardContent className="px-6 max-sm:px-4">
                    <div className="grid gap-8 md:grid-cols-2">
                        <div className="flex flex-col items-center justify-center">
                            <div className="mb-2 text-4xl font-bold text-foreground">
                                {reviews.length > 0 ? (reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length).toFixed(1) : '0.0'}
                            </div>
                            <div className="mb-2 flex items-center justify-center gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        className={`size-5 ${
                                            star <=
                                            Math.round(
                                                Number.parseFloat(
                                                    reviews.length > 0
                                                        ? (reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length).toFixed(1)
                                                        : '0.0',
                                                ),
                                            )
                                                ? 'fill-primary text-primary'
                                                : 'text-muted-foreground'
                                        }`}
                                    />
                                ))}
                            </div>
                            <p className="text-muted-foreground">Basé sur {reviews.length} avis</p>
                        </div>

                        <div className="space-y-2">
                            {ratingDistribution.map(({ rating, count, percentage }) => (
                                <div key={rating} className="flex items-center gap-3">
                                    <div className="flex w-12 items-center gap-1">
                                        <span className="text-sm text-foreground">{rating}</span>
                                        <Star className="size-3 fill-primary text-primary" />
                                    </div>
                                    <div className="h-2 flex-1 rounded-full bg-muted">
                                        <div
                                            className="h-2 rounded-full bg-primary transition-all duration-300"
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                    <span className="w-8 text-sm text-muted-foreground">{count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <ReviewForm />

            <div className="space-y-4">
                {reviews.map((review) => (
                    <Review key={review.id} review={review} />
                ))}
            </div>
        </div>
    );
}
