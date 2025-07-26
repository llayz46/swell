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
import { Tags, LoaderCircle, Plus } from 'lucide-react';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useEffect } from 'react';
import InputError from '@/components/input-error';
import { toast } from 'sonner';
import { Brand } from '@/types';

type BrandForm = {
    name: string;
    logo_url: File | null;
};

interface BrandDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    brand?: Brand | null;
    inputValue?: string;
}

export function BrandDialog({ open, setOpen, brand, inputValue }: BrandDialogProps) {
    const { data, setData, post, processing, errors, reset } = useForm<BrandForm>({
        name: '',
        logo_url: null
    });

    useEffect(() => {
        if (brand) {
            setData({
                name: brand.name || '',
                logo_url: null
            });
        } else if (inputValue) {
            setData({
                name: inputValue,
                logo_url: null
            });
        } else {
            reset();
        }
    }, [brand, inputValue]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!brand) {
            post(route('admin.brands.store'), {
                preserveScroll: true,
                forceFormData: true,
                onSuccess: () => {
                    reset('name', 'logo_url');
                    setOpen(false);
                    toast.success('Marque créée avec succès', {
                        description: data.name + ' a bien été créée.',
                        icon: <Tags className="size-4" />,
                    });
                },
                onError: (errors) => {
                    const allErrors = Object.values(errors).join('\n') || 'Veuillez vérifier les informations saisies.';

                    toast.error('Erreur lors de la création de la marque.', {
                        description: allErrors,
                        icon: <Tags className="size-4" />,
                    });
                },
            })
        } else {
            post(route('admin.brands.update', brand.id), {
                method: 'put',
                preserveScroll: true,
                onSuccess: () => {
                    reset('name', 'logo_url');
                    setOpen(false);
                    toast.success('Marque modifiée avec succès', {
                        description: data.name + ' a bien été modifiée.',
                        icon: <Tags className="size-4" />,
                    });
                },
                onError: (errors) => {
                    const allErrors = Object.values(errors).join('\n') || 'Veuillez vérifier les informations saisies.';

                    toast.error('Erreur lors de la modification de la marque.', {
                        description: allErrors,
                        icon: <Tags className="size-4" />,
                    });
                },
            })
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm">
                    <Plus /> Nouvelle marque
                </Button>
            </DialogTrigger>
            <DialogContent className="flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-xl max-h-[calc(100vh-32px)] [&>button:last-child]:top-3.5">
                <DialogHeader className="contents space-y-0 text-left">
                    <DialogTitle className="border-b px-6 py-4 text-base">{brand ? `Modifier la marque : ${brand.name}` : 'Créer une nouvelle marque'}</DialogTitle>
                </DialogHeader>
                <DialogDescription className="sr-only">
                    {brand ? 'Modifier les détails de la marque' : 'Créer une nouvelle marque pour organiser vos produits. Remplissez les informations ci-dessous pour ajouter une nouvelle marque à votre boutique.'}
                </DialogDescription>
                <div className="overflow-y-auto">
                    <div className="pt-4">
                        <form className="space-y-4 *:not-last:px-6" onSubmit={submit}>
                            <div className="*:not-first:mt-2">
                                <Label htmlFor="name">Nom</Label>
                                <Input
                                    id="name"
                                    placeholder="Razer"
                                    type="text"
                                    required
                                    tabIndex={1}
                                    onChange={(e) => setData('name', e.target.value)}
                                    value={data.name}
                                    disabled={processing}
                                />
                                <InputError message={errors.name} />
                            </div>
                            <div className="*:not-first:mt-2">
                                <Label htmlFor="logo_url">Logo</Label>
                                <Input
                                    id="logo_url"
                                    type="file"
                                    tabIndex={2}
                                    onChange={(e) => setData('logo_url', e.target.files?.[0] ?? null)}
                                    disabled={processing}
                                />
                                <InputError message={errors.logo_url} />
                            </div>
                            <DialogFooter className="border-t px-6 py-4">
                                <DialogClose asChild>
                                    <Button type="button" variant="outline" tabIndex={3}>
                                        Annuler
                                    </Button>
                                </DialogClose>
                                <Button tabIndex={4} type="submit" disabled={processing}>
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
