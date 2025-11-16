import {
    Dialog, DialogClose,
    DialogContent,
    DialogDescription, DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { LoaderCircle, Plus, Boxes, Box } from 'lucide-react';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useEffect } from 'react';
import InputError from '@/components/input-error';
import { toast } from 'sonner';
import type { Collection } from '@/types';

type CollectionForm = {
    title: string;
};

interface CollectionDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    collection?: Collection | null;
    inputValue?: string;
}

export function CollectionDialog({ open, setOpen, collection, inputValue }: CollectionDialogProps) {
    const { data, setData, post, put, processing, errors, reset } = useForm<CollectionForm>({
        title: '',
    });

    useEffect(() => {
        if (collection) {
            setData({
                title: collection.title || '',
            });
        } else if (inputValue) {
            setData({
                title: inputValue
            });
        } else {
            reset();
        }
    }, [collection, inputValue]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!collection) {
            post(route('admin.collections.store'), {
                preserveScroll: true,
                onSuccess: () => {
                    reset('title');
                    setOpen(false);
                    toast.success('Collection créé avec succès', {
                        description: data.title + ' a bien été créé.',
                        icon: <Boxes className="size-4" />,
                    });
                },
                onError: (errors) => {
                    const allErrors = Object.values(errors).join('\n') || 'Veuillez vérifier les informations saisies.';

                    toast.error('Erreur lors de la création de la collection.', {
                        description: allErrors,
                        icon: <Boxes className="size-4" />,
                    });
                },
            })
        } else {
            put(route('admin.collections.update', collection.id), {
                preserveScroll: true,
                onSuccess: () => {
                    reset('title');
                    setOpen(false);
                    toast.success('Collection modifiée avec succès', {
                        description: data.title + ' a bien été modifiée.',
                        icon: <Box className="size-4" />,
                    });
                },
                onError: (errors) => {
                    const allErrors = Object.values(errors).join('\n') || 'Veuillez vérifier les informations saisies.';

                    toast.error('Erreur lors de la modification de la collection.', {
                        description: allErrors,
                        icon: <Boxes className="size-4" />,
                    });
                },
            })
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm">
                    <Plus /> Nouvelle collection
                </Button>
            </DialogTrigger>
            <DialogContent className="flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-xl max-h-[calc(100vh-32px)] [&>button:last-child]:top-3.5 shadow-dialog border-transparent">
                <DialogHeader className="contents space-y-0 text-left">
                    <DialogTitle className="border-b px-6 py-4 text-base">{collection ? `Modifier la collection : ${collection.title}` : 'Créer une nouvelle collection'}</DialogTitle>
                </DialogHeader>
                <DialogDescription className="sr-only">
                    {collection ? 'Modifier les détails de la collection' : 'Créer une nouvelle collection pour organiser vos produits. Remplissez les informations ci-dessous pour ajouter une nouvelle collection à votre boutique.'}
                </DialogDescription>
                <div className="overflow-y-auto">
                    <div className="pt-4">
                        <form className="space-y-4 *:not-last:px-6" onSubmit={submit}>
                            <div className="*:not-first:mt-2">
                                <Label htmlFor="title">Nom</Label>
                                <Input
                                    id="title"
                                    placeholder="Gamme Saturn Pro"
                                    type="text"
                                    required
                                    tabIndex={1}
                                    onChange={(e) => setData('title', e.target.value)}
                                    value={data.title}
                                    disabled={processing}
                                />
                                <InputError message={errors.title} />
                            </div>
                            <DialogFooter className="border-t px-6 py-4">
                                <DialogClose asChild>
                                    <Button type="button" variant="outline" tabIndex={2}>
                                        Annuler
                                    </Button>
                                </DialogClose>
                                <Button tabIndex={3} type="submit" disabled={processing}>
                                    {processing && <LoaderCircle className="size-4 animate-spin" />}
                                    Enregistrer
                                </Button>
                            </DialogFooter>
                        </form>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
