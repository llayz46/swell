import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useReview } from '@/contexts/review-context';
import { SharedData } from '@/types';
import { useForm, usePage } from '@inertiajs/react';
import { Loader2, Send, Star } from 'lucide-react';
import { FormEventHandler } from 'react';
import { toast } from 'sonner';

type ReviewForm = {
    product_id: number;
    title: string;
    comment: string;
    rating: number;
};

export function ReviewForm() {
    const { productId, reviews } = useReview();
    const { auth } = usePage<SharedData>().props;

    const review = auth.user ? reviews.find((review) => review.user_id === auth.user.id && review.product_id === productId) : null;

    const { data, setData, errors, processing, post, put } = useForm<ReviewForm>({
        product_id: productId,
        title: review ? review.title : '',
        comment: review ? review.comment : '',
        rating: review ? review.rating : 0,
    });

    if (!auth.user) {
        return (
            <Card className="max-sm:py-4">
                <CardHeader className="max-sm:px-4">
                    <CardTitle className="text-foreground">Laisser un avis</CardTitle>
                </CardHeader>
                <CardContent className="max-sm:px-4">
                    <p className="text-muted-foreground">Veuillez vous connecter pour laisser un avis.</p>
                </CardContent>
            </Card>
        );
    }

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (!review) {
            post(route('reviews.store'), {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Commentaire ajouté avec succès', {
                        description: 'Le commentaire a été ajouté avec succès.',
                    });
                },
                onError: (errors) => {
                    const allErrors = Object.values(errors).join('\n') || 'Veuillez vérifier les informations saisies.';

                    toast.error("Erreur lors de l'ajout du commentaire.", {
                        description: allErrors,
                    });
                },
            });
        } else {
            put(route('reviews.update', review.id), {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Commentaire modifié avec succès', {
                        description: 'Le commentaire a été modifié avec succès.',
                    });
                },
                onError: (errors) => {
                    const allErrors = Object.values(errors).join('\n') || 'Veuillez vérifier les informations saisies.';

                    toast.error('Erreur lors de la modification du commentaire.', {
                        description: allErrors,
                    });
                },
            });
        }
    };

    const hasChanges = !review || review.title !== data.title || review.comment !== data.comment || review.rating !== data.rating;

    return (
        <Card className="max-sm:py-4">
            <CardHeader className="max-sm:px-4">
                <CardTitle className="text-foreground">Laisser un avis</CardTitle>
            </CardHeader>
            <CardContent className="max-sm:px-4">
                <form className="space-y-4" onSubmit={submit}>
                    <div className="space-y-2">
                        <Label className="text-foreground">Note *</Label>
                        <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setData('rating', star)}
                                    className="p-1 transition-transform hover:scale-110"
                                >
                                    <Star
                                        className={`size-6 ${
                                            star <= data.rating ? 'fill-primary text-primary' : 'text-muted-foreground hover:text-primary'
                                        }`}
                                    />
                                </button>
                            ))}

                            <span className="ml-2 text-sm text-muted-foreground">{data.rating}/5</span>
                        </div>

                        <InputError className="mt-2" message={errors.rating} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="title" className="text-foreground">
                            Titre de l'avis *
                        </Label>

                        <Input
                            id="title"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            placeholder="Résumez votre expérience"
                        />

                        <InputError className="mt-2" message={errors.title} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="review" className="text-foreground">
                            Votre avis *
                        </Label>

                        <Textarea
                            id="review"
                            value={data.comment}
                            onChange={(e) => setData('comment', e.target.value)}
                            rows={4}
                            placeholder="Partagez votre expérience avec ce produit..."
                        />

                        <InputError className="mt-2" message={errors.comment} />
                    </div>

                    <Button disabled={processing || !hasChanges}>
                        {processing ? <Loader2 className="animate-spin" /> : <Send />}
                        {review ? "Modifier l'avis" : "Publier l'avis"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
