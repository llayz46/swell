import { destroy } from '@/actions/App/Http/Controllers/Admin/CollectionController';
import { index as productsIndex } from '@/actions/App/Http/Controllers/Admin/ProductController';
import { ConfirmDeleteDialog } from '@/components/swell/confirm-delete-dialog';
import { CollectionDialog } from '@/components/swell/product/collection-dialog';
import SearchInput from '@/components/swell/search-input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, SwellCard, SwellCardContent } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AdminLayout from '@/layouts/admin-layout';
import type { BreadcrumbItem, Collection } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Box, Boxes, Edit, Eye, MoreHorizontal, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';

export default function Categories({ breadcrumbs: initialBreadcrumbs, collections }: { breadcrumbs: BreadcrumbItem[]; collections: Collection[] }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteCollection, setDeleteCollection] = useState<Collection | null>(null);
    const [openCollectionDialog, setOpenCollectionDialog] = useState<boolean>(false);
    const [editCollection, setEditCollection] = useState<Collection | null>(null);
    const [sortBy, setSortBy] = useState('title');

    const localBreadcrumbs = useMemo(() => {
        if (openCollectionDialog) {
            return [
                ...initialBreadcrumbs,
                {
                    title: editCollection ? `Modifier : ${editCollection.title}` : 'Nouvelle collection',
                    href: '#',
                },
            ];
        }
        return initialBreadcrumbs;
    }, [initialBreadcrumbs, openCollectionDialog, editCollection]);

    const filterCollections = (collections: Collection[], searchTerm: string, sortBy: string): Collection[] => {
        let filtered = collections;

        if (searchTerm) {
            filtered = filtered.filter((collection) => collection.title.toLowerCase().includes(searchTerm.toLowerCase()));
        }

        return [...filtered].sort((a, b) => {
            switch (sortBy) {
                case 'title':
                    return a.title.localeCompare(b.title);
                case 'date':
                    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                default:
                    return a.title.localeCompare(b.title);
            }
        });
    };

    const filteredCollections = filterCollections(collections, searchTerm, sortBy);

    const countCollectionsWithFilter = (collections: Collection[], filter?: ((col: Collection) => boolean) | keyof Collection | null): number => {
        return collections.reduce((acc, col) => {
            let passesFilter = true;

            if (typeof filter === 'function') {
                passesFilter = filter(col);
            } else if (typeof filter === 'string') {
                passesFilter = !!col[filter];
            }

            return acc + (passesFilter ? 1 : 0);
        }, 0);
    };

    return (
        <AdminLayout breadcrumbs={localBreadcrumbs}>
            <Head title="Gérer les collections" />

            <SearchInput placeholder="Rechercher une collection..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}>
                <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="border-border bg-background text-foreground sm:w-40">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="border-border bg-popover">
                        <SelectItem value="title">Nom A-Z</SelectItem>
                        <SelectItem value="date">Date création</SelectItem>
                    </SelectContent>
                </Select>
            </SearchInput>

            <Card className="gap-0 border-border bg-card pt-4 pb-0">
                <CardHeader className="justify-between border-b border-border px-4 pb-4 sm:flex-row">
                    <CardTitle className="text-lg text-foreground">
                        Liste des collections ({countCollectionsWithFilter(filteredCollections)})
                    </CardTitle>

                    <CollectionDialog
                        open={openCollectionDialog}
                        setOpen={(open) => {
                            setOpenCollectionDialog(open);
                            if (!open) {
                                setEditCollection(null);
                            }
                        }}
                        collection={editCollection}
                    />
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-border *:font-medium *:text-muted-foreground hover:bg-transparent">
                                <TableHead>Nom</TableHead>
                                <TableHead>Slug</TableHead>
                                <TableHead className="text-center">Produits</TableHead>
                                <TableHead className="w-12">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredCollections.length > 0 ? (
                                filteredCollections.map((collection) => {
                                    return (
                                        <TableRow key={collection.id} className="border-border hover:bg-muted/50">
                                            <TableCell className="font-medium">
                                                <span className="text-foreground">{collection.title}</span>
                                            </TableCell>
                                            <TableCell>
                                                <code className="rounded bg-muted px-2 py-1 text-xs text-muted-foreground">{collection.slug}</code>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge variant="secondary" className="bg-muted text-muted-foreground">
                                                    {collection.products_count || 0}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-muted">
                                                            <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="border-border bg-popover">
                                                        <DropdownMenuItem className="cursor-pointer text-foreground hover:bg-muted">
                                                            <Link
                                                                href={productsIndex.url({ query: { collection_id: collection.id } })}
                                                                className="flex items-center gap-2"
                                                            >
                                                                <Eye className="mr-2 size-4" />
                                                                Voir les produits
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="cursor-pointer text-foreground hover:bg-muted"
                                                            onClick={() => {
                                                                setOpenCollectionDialog(true);
                                                                setEditCollection(collection);
                                                            }}
                                                        >
                                                            <Edit className="mr-2 size-4" />
                                                            Modifier
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator className="bg-border" />
                                                        <DropdownMenuItem
                                                            className="cursor-pointer text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950"
                                                            onClick={() => setDeleteCollection(collection)}
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Supprimer
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                                        {searchTerm ? 'Aucune collection trouvée' : 'Aucune collection disponible'}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <SwellCard>
                    <SwellCardContent>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Total collections</p>
                                <p className="text-2xl font-bold text-foreground">{countCollectionsWithFilter(collections)}</p>
                            </div>
                            <Badge
                                variant="secondary"
                                className="flex size-8 items-center justify-center rounded-full bg-muted text-muted-foreground"
                            >
                                <Boxes />
                            </Badge>
                        </div>
                    </SwellCardContent>
                </SwellCard>

                <SwellCard>
                    <SwellCardContent>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Total produits</p>
                                <p className="text-2xl font-bold text-foreground">
                                    {collections.reduce((acc, collection) => acc + (collection.products_count ?? 0), 0)}
                                </p>
                            </div>
                            <Badge
                                variant="secondary"
                                className="flex size-8 items-center justify-center rounded-full bg-muted text-muted-foreground"
                            >
                                #
                            </Badge>
                        </div>
                    </SwellCardContent>
                </SwellCard>

                <SwellCard>
                    <SwellCardContent>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Sans produits</p>
                                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                                    {countCollectionsWithFilter(collections, (collection) => !collection.products_count)}
                                </p>
                            </div>
                            <Badge className="flex size-8 items-center justify-center rounded-full bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                                !
                            </Badge>
                        </div>
                    </SwellCardContent>
                </SwellCard>
            </div>

            <ConfirmDeleteDialog
                item={deleteCollection}
                open={!!deleteCollection}
                onClose={() => setDeleteCollection(null)}
                itemNameKey="title"
                deleteRoute={(item) => destroy.url(item.id)}
                itemLabel="collection"
                icon={<Box className="size-4" />}
                prefix="La"
            />
        </AdminLayout>
    );
}
