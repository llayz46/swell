import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from '@inertiajs/react';
import { CircleAlertIcon, Folders } from 'lucide-react';
import { FormEventHandler, ReactNode } from 'react';
import { toast } from 'sonner';

type ConfirmDeleteDialogProps<T, K extends keyof T> = {
    item: T | null;
    open: boolean;
    onClose: () => void;
    itemNameKey: K;
    deleteRoute: (item: T) => string;
    successMessage?: string;
    errorMessage?: string;
    icon?: ReactNode;
    itemLabel?: string;
    prefix: 'La' | 'Le';
};

export function ConfirmDeleteDialog<T extends { id: number | string } & Record<K, string>, K extends keyof T = keyof T>({
    item,
    open,
    onClose,
    itemNameKey,
    deleteRoute,
    successMessage,
    errorMessage,
    icon = <Folders className="size-4" />,
    itemLabel = 'élément',
    prefix = 'La',
}: ConfirmDeleteDialogProps<T, K>) {
    const {
        data,
        setData,
        processing,
        errors,
        reset,
        delete: destroy,
    } = useForm<{ name: string }>({
        name: '',
    });

    if (!item) return null;

    const itemName = item[itemNameKey];

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        destroy(deleteRoute(item), {
            preserveScroll: true,
            onSuccess: () => {
                reset('name');
                onClose();
                toast.success(successMessage || `${prefix} ${itemLabel} a été supprimé·e avec succès`, {
                    description: `${itemName} a bien été supprimé·e.`,
                    icon,
                });
            },
            onError: (errors) => {
                const allErrors = Object.values(errors).join('\n') || errorMessage || `Erreur lors de la suppression ${prefix === 'La' ? 'de la' : 'du'} ${itemLabel}. Veuillez réessayer.`;
                toast.error(`Erreur lors de la suppression ${prefix === 'La' ? 'de la' : 'du'} ${itemLabel}`, {
                    description: allErrors,
                    icon,
                });
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
            <DialogContent>
                <div className="flex flex-col items-center gap-2">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-full border" aria-hidden="true">
                        <CircleAlertIcon className="opacity-80" size={16} />
                    </div>
                    <DialogHeader>
                        <DialogTitle className="sm:text-center">
                            Supprimer {prefix.toLowerCase()} {itemLabel} : <span className="text-foreground">{itemName}</span>
                        </DialogTitle>
                        <DialogDescription className="sm:text-center">
                            Cette action est irréversible. Pour confirmer, veuillez saisir le nom {prefix === 'La' ? 'de la' : 'du'} {itemLabel} {" "}
                            <span className="text-foreground">{itemName}</span>.
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <form className="space-y-5" onSubmit={submit}>
                    <div className="*:not-first:mt-2">
                        <Label htmlFor="name">Confirmer le nom</Label>
                        <Input
                            id="name"
                            type="text"
                            placeholder={`Saisissez "${itemName}" pour confirmer`}
                            onChange={(e) => setData('name', e.target.value)}
                            disabled={processing}
                        />
                        <InputError message={errors.name} />
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline" className="flex-1">
                                Annuler
                            </Button>
                        </DialogClose>
                        <Button type="submit" className="flex-1" variant="destructive" disabled={data.name !== itemName || processing}>
                            Supprimer
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
