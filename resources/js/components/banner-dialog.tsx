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
import { LoaderCircle, Megaphone, Plus } from 'lucide-react';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useEffect } from 'react';
import InputError from '@/components/input-error';
import { toast } from 'sonner';
import { BannerItem } from '@/types';

type BannerForm = {
    message: string;
    is_active: boolean;
    order: number;
};

interface BannerDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    banner?: BannerItem | null;
    onCreated?: (newBanner: BannerItem[]) => void;
}

export function BannerDialog({ open, setOpen, banner, onCreated }: BannerDialogProps) {
    const { data, setData, put, post, processing, errors, reset } = useForm<BannerForm>({
        message: banner?.message ?? '',
        is_active: banner?.is_active ?? true,
        order: banner?.order ?? 0,
    });

    useEffect(() => {
        if (open && banner) {
            setData({
                message: banner.message ?? '',
                is_active: banner.is_active ?? true,
                order: banner.order ?? 0,
            });
        } else if (open && !banner) {
            reset();
        }
    }, [open, banner]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (!banner) {
            post(route('admin.banners.store'), {
                preserveScroll: true,
                onSuccess: (page) => {
                    reset('message');
                    setOpen(false);

                    const { props } = page;

                    const newBanner = Array.isArray(props.infoBanner)
                                        ? props.infoBanner.filter((b: BannerItem) => b.message === data.message)
                                        : null;

                    if (newBanner && onCreated) {
                        onCreated(newBanner);
                    }

                    toast.success('Message ajouté avec succès', {
                        description:'Le message a bien été ajouté.',
                        icon: <Megaphone className="size-4" />,
                    });
                },
                onError: (errors) => {
                    const allErrors = Object.values(errors).join('\n') || 'Veuillez vérifier les informations saisies.';

                    toast.error('Erreur lors de l\'ajout du message', {
                        description: allErrors,
                        icon: <Megaphone className="size-4" />,
                    });
                },
            })
        } else {
            put(route('admin.banners.update', banner.id), {
                preserveScroll: true,
                onSuccess: () => {
                    reset('message');
                    setOpen(false);
                    toast.success('Message modifié avec succès', {
                        description:'Le message a bien été modifié.',
                        icon: <Megaphone className="size-4" />,
                    });
                },
                onError: (errors) => {
                    const allErrors = Object.values(errors).join('\n') || 'Veuillez vérifier les informations saisies.';

                    toast.error('Erreur lors de la modification du message', {
                        description: allErrors,
                        icon: <Megaphone className="size-4" />,
                    });
                },
            })
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus size={16} /> Ajouter un message
                </Button>
            </DialogTrigger>
            <DialogContent className="flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-xl max-h-[calc(100vh-32px)] [&>button:last-child]:top-3.5">
                <DialogHeader className="contents space-y-0 text-left">
                    <DialogTitle className="border-b px-6 py-4 text-base">{banner ? 'Modifier le message' : 'Ajouter un message'}</DialogTitle>
                </DialogHeader>
                <DialogDescription className="sr-only">
                    {banner ? 'Modifier le message' : 'Ajouter un message.'}
                </DialogDescription>
                <div className="overflow-y-auto">
                    <div className="pt-4">
                        <form className="space-y-4 *:not-last:px-6" onSubmit={submit}>
                            <div className="*:not-first:mt-2">
                                <Label htmlFor="message">Message</Label>
                                <Input
                                    id="message"
                                    placeholder="Livraison gratuite à partir de 50€ d'achat"
                                    type="text"
                                    required
                                    tabIndex={1}
                                    onChange={(e) => setData('message', e.target.value)}
                                    value={data.message}
                                    disabled={processing}
                                />
                                <InputError message={errors.message} />
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
