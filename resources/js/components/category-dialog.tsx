import {
    Dialog, DialogClose,
    DialogContent,
    DialogDescription, DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Folders, LoaderCircle, Plus } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { useCharacterLimit } from '@/hooks/use-character-limit';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useEffect } from 'react';
import InputError from '@/components/input-error';
import { toast } from 'sonner';
import { Category } from '@/types';
import { CategoryTree } from '@/components/category-tree';

type CategoryForm = {
    name: string;
    description: string;
    parent_id?: number | null;
    slug?: string;
    status?: 'active' | 'inactive';
};

interface CategoryDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    category?: Category | null;
    parentId?: number | null;
}

export function CategoryDialog({ open, setOpen, category, parentId }: CategoryDialogProps) {
    const maxLength = 500
    const {
        handleChange,
        maxLength: limit,
    } = useCharacterLimit({
        maxLength
    })

    const { data, setData, post, put, processing, errors, reset } = useForm<CategoryForm>({
        name: '',
        description: '',
        parent_id: null,
        status: 'inactive',
    });

    useEffect(() => {
        if (category) {
            setData({
                name: category.name || '',
                description: category.description || '',
                parent_id: category.parent_id || null,
                status: category.is_active ? 'active' : 'inactive',
            });
        } else if (parentId) {
            setData(data => ({
                ...data,
                parent_id: parentId
            }));
        } else {
            reset();
        }
    }, [category, parentId]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (!category) {
            post(route('admin.categories.store'), {
                preserveScroll: true,
                onSuccess: () => {
                    reset('name', 'description', 'status');
                    setOpen(false);
                    toast.success('Catégorie créée avec succès', {
                        description: data.name + ' a bien été créée.',
                        icon: <Folders className="size-4" />,
                    });
                },
                onError: (errors) => {
                    const allErrors = Object.values(errors).join('\n') || 'Veuillez vérifier les informations saisies.';

                    toast.error('Erreur lors de la création de la catégorie', {
                        description: allErrors,
                        icon: <Folders className="size-4" />,
                    });
                },
            })
        } else {
            put(route('admin.categories.update', category.id), {
                preserveScroll: true,
                onSuccess: () => {
                    reset('name', 'description', 'status');
                    setOpen(false);
                    toast.success('Catégorie modifiée avec succès', {
                        description: data.name + ' a bien été modifiée.',
                        icon: <Folders className="size-4" />,
                    });
                },
                onError: (errors) => {
                    const allErrors = Object.values(errors).join('\n') || 'Veuillez vérifier les informations saisies.';

                    toast.error('Erreur lors de la modification de la catégorie', {
                        description: allErrors,
                        icon: <Folders className="size-4" />,
                    });
                },
            })
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm">
                    <Plus /> Nouvelle catégorie
                </Button>
            </DialogTrigger>
            <DialogContent className="flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-xl max-h-[calc(100vh-32px)] [&>button:last-child]:top-3.5">
                <DialogHeader className="contents space-y-0 text-left">
                    <DialogTitle className="border-b px-6 py-4 text-base">{category ? `Modifier la catégorie : ${category.name}` : 'Créer une nouvelle catégorie'}</DialogTitle>
                </DialogHeader>
                <DialogDescription className="sr-only">
                    {category ? 'Modifier les détails de la catégorie' : 'Créer une nouvelle catégorie pour organiser vos produits. Remplissez les informations ci-dessous pour ajouter une nouvelle catégorie à votre boutique.'}
                </DialogDescription>
                <div className="overflow-y-auto">
                    <div className="pt-4">
                        <form className="space-y-4 *:not-last:px-6" onSubmit={submit}>
                            <div className="*:not-first:mt-2">
                                <Label htmlFor="name">Nom</Label>
                                <Input
                                    id="name"
                                    placeholder="Tapis de souris"
                                    type="text"
                                    required
                                    tabIndex={1}
                                    onChange={(e) => setData('name', e.target.value)}
                                    value={data.name}
                                    disabled={processing}
                                />
                                <InputError message={errors.name || errors.slug} />
                            </div>
                            <div className="*:not-first:mt-2">
                                <div className="flex justify-between items-center">
                                    <Label htmlFor="description">Description</Label>
                                    <p
                                        id="description"
                                        className="text-xs text-muted-foreground"
                                        role="status"
                                        aria-live="polite"
                                    >
                                        <span className="tabular-nums">{limit - data.description.length}</span> caractères restants
                                    </p>
                                </div>
                                <Textarea
                                    id="description"
                                    maxLength={maxLength}
                                    onChange={(e) => {
                                        handleChange(e);
                                        setData('description', e.target.value);
                                    }}
                                    value={data.description}
                                    rows={4}
                                    tabIndex={2}
                                    placeholder="Entrez une description de la catégorie"
                                    aria-describedby="description"
                                    disabled={processing}
                                />
                                <InputError message={errors.description} />
                            </div>
                            <CategoryTree label={{ htmlFor: 'parent', name: 'Catégorie parente' }} field="parent_id" setData={setData} initialSelectedItem={String(parentId)} />
                            <div className="*:not-first:mt-2">
                                <Label htmlFor="status">Statut</Label>
                                <Select defaultValue="inactive" value={data.status} onValueChange={(value) => setData('status', value as 'active' | 'inactive')}>
                                    <SelectTrigger className="w-full" tabIndex={3}>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="active">Active</SelectItem>
                                            <SelectItem value="inactive">Inactive</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.status} />
                            </div>
                            <DialogFooter className="border-t px-6 py-4">
                                <DialogClose asChild>
                                    <Button type="button" variant="outline" tabIndex={4}>
                                        Annuler
                                    </Button>
                                </DialogClose>
                                <Button tabIndex={5} type="submit" disabled={processing}>
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
