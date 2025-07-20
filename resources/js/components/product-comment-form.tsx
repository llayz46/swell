import { useForm, usePage } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Loader2, Send, Star } from 'lucide-react';
import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { FormEventHandler } from 'react';
import { useProductComment } from '@/contexts/product-comment-context';
import { toast } from 'sonner';
import { SharedData } from '@/types';

type CommentForm = {
    product_id: number;
    title: string;
    comment: string;
    rating: number;
}

export function ProductCommentForm() {
    const { productId, comments } = useProductComment();
    const { auth } = usePage<SharedData>().props;

    const comment = comments.find(comment => comment.user_id === auth.user.id && comment.product_id === productId);

    const { data, setData, errors, processing, post, put } = useForm<CommentForm>({
        product_id: productId,
        title: comment ? comment.title : '',
        comment: comment ? comment.comment : '',
        rating: comment ? comment.rating : 0,
    })

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

        if (!comment) {
            post(route('comments.store'), {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Commentaire ajouté avec succès', {
                        description: 'Le commentaire a été ajouté avec succès.'
                    });
                },
                onError: (errors) => {
                    const allErrors = Object.values(errors).join('\n') || 'Veuillez vérifier les informations saisies.';

                    toast.error('Erreur lors de l\'ajout du commentaire.', {
                        description: allErrors
                    });
                },
            })
        } else {
            put(route('comments.update', comment.id), {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Commentaire modifié avec succès', {
                        description: 'Le commentaire a été modifié avec succès.'
                    });
                },
                onError: (errors) => {
                    const allErrors = Object.values(errors).join('\n') || 'Veuillez vérifier les informations saisies.';

                    toast.error('Erreur lors de la modification du commentaire.', {
                        description: allErrors
                    });
                },
            })
        }
    }

    const hasChanges = !comment ||
        comment.title !== data.title ||
        comment.comment !== data.comment ||
        comment.rating !== data.rating;

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
                                    className="p-1 hover:scale-110 transition-transform"
                                >
                                    <Star
                                        className={`size-6 ${
                                            star <= data.rating
                                                ? "fill-primary text-primary"
                                                : "text-muted-foreground hover:text-primary"
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
                        <Label htmlFor="comment" className="text-foreground">
                            Votre avis *
                        </Label>

                        <Textarea
                            id="comment"
                            value={data.comment}
                            onChange={(e) => setData('comment', e.target.value)}
                            rows={4}
                            placeholder="Partagez votre expérience avec ce produit..."
                        />

                        <InputError className="mt-2" message={errors.comment} />
                    </div>

                    <Button disabled={processing || !hasChanges}>
                        {processing ? <Loader2 className="animate-spin" /> : <Send />}
                        {comment ? 'Modifier l\'avis' : 'Publier l\'avis'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
