import { Head, router, useForm, usePage } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import type { BannerItem, BreadcrumbItem, SharedData } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    AlertCircle,
    CheckCircle,
    Edit,
    Eye,
    EyeOff,
    Info, Megaphone,
    MoreHorizontal,
    Trash2
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { closestCenter, DndContext, DragEndEvent } from '@dnd-kit/core';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import { CSS } from '@dnd-kit/utilities';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Transition } from '@headlessui/react';
import { toast } from 'sonner';
import { FormEventHandler, useMemo, useState } from 'react';
import { BannerDialog } from '@/components/banner-dialog';
import { WordRotate } from '@/components/ui/word-rotate';

export default function Banners({ breadcrumbs }: { breadcrumbs: BreadcrumbItem[] }) {
    const { infoBanner } = usePage<SharedData>().props;

    const banners = useMemo(() => {
        return infoBanner.filter(item => item.is_active).sort((a, b) => a.order - b.order);
    }, [infoBanner]);

    const [openBannerDialog, setOpenBannerDialog] = useState<boolean>(false);
    const [editBanner, setEditBanner] = useState<BannerItem | null>(null);

    const { data, setData, isDirty, processing, put, delete: destroy, setDefaults } = useForm({
        infoBanner: infoBanner ? infoBanner.map(banner => ({
            id: banner.id,
            message: banner.message,
            order: banner.order,
            is_active: banner.is_active,
            created_at: banner.created_at,
            updated_at: banner.updated_at
        })) : []
    })

    const handleOrdering: FormEventHandler = (e) => {
        e.preventDefault();

        put(route('admin.banners.ordering'), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Bannières mises à jour avec succès !', {
                    description: 'Vos modifications ont été enregistrées.',
                });
            },
            onError: () => {
                toast.error('Erreur lors de la mise à jour des bannières.', {
                    description: 'Veuillez vérifier les erreurs et réessayer.',
                });
            },
            onFinish: () => {
                setDefaults();
            }
        });
    }

    const handleDeleting = (id: number) => {
        setData('infoBanner', data.infoBanner.filter((banner) => banner.id !== id));
        setDefaults({ infoBanner: data.infoBanner.filter((banner) => banner.id !== id) });

        destroy(route('admin.banners.destroy', id), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Bannière supprimée avec succès', {
                    description: 'La bannière a été retirée.',
                    icon: <Megaphone className="size-4" />,
                });
            },
            onError: () => {
                toast.error('Erreur lors de la suppression', {
                    description: 'Impossible de supprimer cette bannière.',
                    icon: <Megaphone className="size-4" />,
                });
            },
        })
    }

    const handleIsActive = (id: number) => {
        const banner = data.infoBanner.find(b => b.id === id);
        if (!banner) return;

        const updatedBanner = { ...banner, is_active: !banner.is_active };

        setData('infoBanner', data.infoBanner.map(b => b.id === id ? updatedBanner : b));
        setDefaults({ infoBanner: data.infoBanner.map(b => b.id === id ? updatedBanner : b) });

        router.put(route('admin.banners.update', id),
            updatedBanner,
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success(`Bannière ${updatedBanner.is_active ? 'activée' : 'désactivée'} avec succès`, {
                        description: `La bannière a été ${updatedBanner.is_active ? 'activée' : 'désactivée'}.`,
                    });
                },
                onError: () => {
                    toast.error('Erreur lors de la mise à jour de la bannière.', {
                        description: 'Veuillez vérifier les erreurs et réessayer.',
                    });
                }
            }
        )
    }

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Gérer la bannière" />

                <Card className="mt-4 py-4 border-border bg-card">
                    <CardHeader className="max-sm:px-4">
                        <CardTitle className="text-foreground flex items-center gap-2">
                            <Eye className="size-4" />
                            Aperçu de la bannière
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="max-sm:px-4">
                        <div className={`rounded-md overflow-hidden ${data.infoBanner.length === 0 && 'hidden'}`}>
                            <div className="w-full bg-black dark:bg-white">
                                <WordRotate
                                    duration={4000}
                                    className="font-bold text-center text-white dark:text-black"
                                    words={banners.map(item => item.message)}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-border bg-card">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Total bannières</p>
                                <p className="text-2xl font-bold text-foreground">{data.infoBanner.length}</p>
                            </div>
                            <Info className="size-6 text-primary" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border bg-card">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Actives</p>
                                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{data.infoBanner.filter((b) => b.is_active).length}</p>
                            </div>
                            <CheckCircle className="size-6 text-green-600 dark:text-green-400" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border bg-card">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Inactives</p>
                                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{data.infoBanner.filter((b) => !b.is_active).length}</p>
                            </div>
                            <EyeOff className="size-6 text-orange-600 dark:text-orange-400" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Transition
                show={isDirty}
                enter="transition ease-in-out duration-300"
                enterFrom="opacity-0 scale-95"
                leave="transition ease-in-out"
                leaveTo="opacity-0 scale-95"
            >
                <Alert className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
                    <AlertCircle className="size-4 !text-orange-600 !dark:text-orange-400" />
                    <AlertDescription className="text-orange-800 dark:text-orange-200">
                        Vous avez des modifications non enregistrées. N'oubliez pas de sauvegarder vos changements.
                    </AlertDescription>
                </Alert>
            </Transition>

            <Card className="max-sm:py-4 border-border bg-card">
                <CardHeader className="max-sm:px-4 flex sm:flex-row sm:items-center justify-between">
                    <div className="space-y-2">
                        <CardTitle className="text-foreground">Liste des messages de bannières</CardTitle>
                        <p className="text-sm text-muted-foreground">
                            Glissez-déposez les bannières pour changer leur ordre d'affichage
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        {isDirty && (
                            <Button disabled={processing} onClick={handleOrdering}>
                                Enregistrer
                            </Button>
                        )}
                        <BannerDialog
                            open={openBannerDialog}
                            setOpen={() => {
                                setOpenBannerDialog(!openBannerDialog);
                                setEditBanner(null);
                            }}
                            banner={editBanner}
                            onCreated={(newBanner) => {
                                const bannersToAdd = Array.isArray(newBanner) ? newBanner : [newBanner];

                                const updated = [...data.infoBanner, ...bannersToAdd]
                                    .sort((a, b) => a.order - b.order)
                                    .map((b, i) => ({ ...b, order: i + 1 }));

                                setData('infoBanner', updated);
                                setDefaults({ infoBanner: updated });
                            }}
                        />
                    </div>
                </CardHeader>
                <CardContent className="max-sm:px-4 flex flex-col gap-4">
                    <DndContext
                        collisionDetection={closestCenter}
                        modifiers={[restrictToWindowEdges]}
                        onDragEnd={(event: DragEndEvent) => {
                            const { active, over } = event;

                            if (over && active.id !== over.id) {
                                const oldIndex = data.infoBanner.findIndex(b => b.id === active.id);
                                const newIndex = data.infoBanner.findIndex(b => b.id === over.id);

                                if (oldIndex !== -1 && newIndex !== -1) {
                                    const newBanner = arrayMove(data.infoBanner, oldIndex, newIndex).map((banner, idx) => ({
                                        ...banner,
                                        order: idx + 1
                                    }));

                                    setData('infoBanner', newBanner);
                                }
                            }
                        }}
                    >
                        <SortableContext items={data.infoBanner.map((banner) => banner.id)} strategy={verticalListSortingStrategy}>
                            {data.infoBanner.map(banner => (
                                <SortableBannerItem key={banner.id} item={banner} setEditBanner={setEditBanner} setOpenBannerDialog={setOpenBannerDialog} onDelete={handleDeleting} onToggleActive={handleIsActive} />
                            ))}
                        </SortableContext>
                    </DndContext>
                </CardContent>
            </Card>
        </AdminLayout>
    )
}

interface SortableBannerItemProps {
    item: BannerItem;
    setEditBanner: (banner: BannerItem | null) => void;
    setOpenBannerDialog: (open: boolean) => void;
    onDelete: (id: number) => void;
    onToggleActive: (id: number) => void;
}

function SortableBannerItem({ item, setEditBanner, setOpenBannerDialog, onDelete, onToggleActive }: SortableBannerItemProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("fr-FR", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({
        id: item.id,
        transition: {
            duration: 150,
            easing: 'cubic-bezier(0.2, 0, 0, 1)',
        },
        animateLayoutChanges: () => false,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        willChange: isDragging ? 'transform' : 'auto',
        zIndex: isDragging ? 999 : 'auto',
        opacity: isDragging ? 0.4 : 1,
        boxShadow: isDragging ? '0 0 0 1px rgba(63, 63, 70, 0.1), 0 4px 8px -2px rgba(63, 63, 70, 0.1), 0 2px 4px -2px rgba(63, 63, 70, 0.1)' : 'none',
    };

    return (
        <div
            className="p-4 border border-border rounded-lg bg-muted/20 relative"
            ref={setNodeRef}
            style={style}
        >
            <div className="absolute inset-0 h-full w-10/12" {...attributes} {...listeners}></div>
            <div className="flex items-start gap-4">
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                            <div className="flex max-sm:flex-col-reverse sm:items-center gap-2 mb-2">
                                <h3 className="font-semibold text-foreground">{item.message}</h3>
                                <Badge variant="outline" className="text-xs rounded-full">
                                    Ordre {item.order}
                                </Badge>
                            </div>

                            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                <span>Créé le {formatDate(item.created_at)}</span>
                                {item.updated_at !== item.created_at && (
                                    <span>Modifié le {formatDate(item.updated_at)}</span>
                                )}
                            </div>
                        </div>

                        <div className="flex max-sm:flex-col items-end sm:items-center gap-2">
                            {item.is_active ? (
                                <Badge className="bg-green-600 dark:bg-green-900 dark:text-green-200">
                                    <CheckCircle className="size-3 mr-1" />
                                    Actif
                                </Badge>
                            ) : (
                                <Badge
                                    variant="secondary"
                                    className="dark:bg-gray-900 dark:text-gray-200"
                                >
                                    <EyeOff className="h-3 w-3 mr-1" />
                                    Inactif
                                </Badge>
                            )}

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                        <MoreHorizontal className="size-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="bg-popover border-border">
                                    <DropdownMenuItem
                                        onClick={() => {
                                            setOpenBannerDialog(true);
                                            setEditBanner(item)
                                        }}
                                        className="text-foreground hover:bg-muted cursor-pointer"
                                    >
                                        <Edit className="size-4" />
                                        Modifier
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => onToggleActive(item.id)}
                                        className="text-foreground hover:bg-muted cursor-pointer"
                                    >
                                        {item.is_active ? (
                                            <>
                                                <EyeOff className="size-4" />
                                                Désactiver
                                            </>
                                        ) : (
                                            <>
                                                <Eye className="size-4" />
                                                Activer
                                            </>
                                        )}
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onClick={() => onDelete(item.id)}
                                        className="text-red-600 dark:text-red-400 hover:bg-red-500 dark:hover:bg-red-950 cursor-pointer"
                                    >
                                        <Trash2 className="size-4" />
                                        Supprimer
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
