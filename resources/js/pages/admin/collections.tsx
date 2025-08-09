import { Head } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import type { BreadcrumbItem, Collection } from '@/types';
import { useMemo, useState } from 'react';
import { Search, Edit, Trash2, MoreHorizontal, Boxes, Box } from 'lucide-react';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ConfirmDeleteDialog } from '@/components/swell/confirm-delete-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CollectionDialog } from '@/components/swell/product/collection-dialog';

export default function Categories({ breadcrumbs: initialBreadcrumbs, collections }: { breadcrumbs: BreadcrumbItem[], collections: Collection[] }) {
    const [searchTerm, setSearchTerm] = useState("")
    const [deleteCollection, setDeleteCollection] = useState<Collection | null>(null);
    const [openCollectionDialog, setOpenCollectionDialog] = useState<boolean>(false);
    const [editCollection, setEditCollection] = useState<Collection | null>(null);
    const [sortBy, setSortBy] = useState("title")

    const localBreadcrumbs = useMemo(() => {
        if (openCollectionDialog) {
            return [
                ...initialBreadcrumbs,
                {
                    title: editCollection
                        ? `Modifier : ${editCollection.title}`
                        : 'Nouvelle collection',
                    href: "#"
                },
            ];
        }
        return initialBreadcrumbs;
    }, [initialBreadcrumbs, openCollectionDialog, editCollection]);

    const filterCollections = (collections: Collection[], searchTerm: string, sortBy: string): Collection[] => {
        let filtered = collections;

        if (searchTerm) {
            filtered = filtered.filter(collection =>
                collection.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
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
    }

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
    }

    return (
        <AdminLayout breadcrumbs={localBreadcrumbs}>
            <Head title="Gérer les collections" />

            <Card className="mt-4 py-3 sm:py-4 border-border bg-card">
                <CardContent className="px-3 sm:px-4">
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                <Input
                                    placeholder="Rechercher une collection..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 bg-background border-border text-foreground placeholder:text-muted-foreground"
                                />
                            </div>
                        </div>
                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="sm:w-40 bg-background border-border text-foreground">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-popover border-border">
                                <SelectItem value="title">Nom A-Z</SelectItem>
                                <SelectItem value="date">Date création</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-border bg-card pt-4 pb-0 gap-0">
                <CardHeader className="px-4 pb-4 border-b border-border sm:flex-row justify-between">
                    <CardTitle className="text-foreground text-lg">Liste des collections ({countCollectionsWithFilter(filteredCollections)})</CardTitle>

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
                            <TableRow className="border-border hover:bg-transparent *:text-muted-foreground *:font-medium">
                                <TableHead>Nom</TableHead>
                                <TableHead>Slug</TableHead>
                                <TableHead className="text-center">Produits</TableHead>
                                <TableHead className="w-12">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredCollections.length > 0 ? (
                                filteredCollections.map(collection => {
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
                                                        <DropdownMenuItem
                                                            className="cursor-pointer text-foreground hover:bg-muted"
                                                            onClick={() => {
                                                                setOpenCollectionDialog(true);
                                                                setEditCollection(collection);
                                                            }}
                                                        >
                                                            <Edit className="mr-2 h-4 w-4" />
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
                                    )
                                })
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                        {searchTerm ? "Aucune marque trouvée" : "Aucune marque disponible"}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-border bg-card">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Total collections</p>
                                <p className="text-2xl font-bold text-foreground">
                                    {countCollectionsWithFilter(collections)}
                                </p>
                            </div>
                            <Badge
                                variant="secondary"
                                className="bg-muted text-muted-foreground size-8 rounded-full flex items-center justify-center"
                            >
                                <Boxes />
                            </Badge>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border bg-card">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Total produits</p>
                                <p className="text-2xl font-bold text-foreground">
                                    {collections.reduce((acc, collection) => acc + (collection.products_count ?? 0), 0)}
                                </p>
                            </div>
                            <Badge
                                variant="secondary"
                                className="bg-muted text-muted-foreground h-8 w-8 rounded-full flex items-center justify-center"
                            >
                                #
                            </Badge>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border bg-card">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Sans produits</p>
                                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                                    {countCollectionsWithFilter(collections, collection => !collection.products_count)}
                                </p>
                            </div>
                            <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 h-8 w-8 rounded-full flex items-center justify-center">
                                !
                            </Badge>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <ConfirmDeleteDialog
                item={deleteCollection}
                open={!!deleteCollection}
                onClose={() => setDeleteCollection(null)}
                itemNameKey="title"
                deleteRoute={(item) => route('admin.collections.destroy', item.id)}
                itemLabel="collection"
                icon={<Box className="size-4" />}
                prefix="La"
            />
        </AdminLayout>
    )
}
