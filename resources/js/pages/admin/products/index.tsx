import { ConfirmDeleteDialog } from '@/components/swell/confirm-delete-dialog';
import { PaginationComponent } from '@/components/swell/pagination-component';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AdminLayout from '@/layouts/admin-layout';
import { cn } from '@/lib/utils';
import type { BreadcrumbItem, PaginatedResponse, Product } from '@/types';
import { Deferred, Head, Link, router } from '@inertiajs/react';
import { Edit, Eye, Loader2, MoreHorizontal, MoveUp, Package, Plus, Search, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

interface ProductsType {
    breadcrumbs: BreadcrumbItem[];
    products: PaginatedResponse<Product>;
    search?: string | null;
    collectionId?: number | null;
    sort?: string | null;
}

export default function Index({ breadcrumbs: initialBreadcrumbs, products, search, collectionId, sort }: ProductsType) {
    const [searchTerm, setSearchTerm] = useState<string>(search || '');
    const [sorting, setSorting] = useState<string | null>(sort || null);
    const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const delayDebounce = setTimeout(() => {
            const params = searchTerm.trim() !== '' ? { search: searchTerm } : {};

            router.get(route('admin.products.index'), params, {
                preserveState: true,
                replace: true,
            });
        }, 400);

        return () => clearTimeout(delayDebounce);
    }, [searchTerm]);

    const localBreadcrumbs = useMemo(() => {
        if (deleteProduct) {
            return [
                ...initialBreadcrumbs,
                {
                    title: deleteProduct ? `Supprimer : ${deleteProduct.name}` : 'Nouvelle marque',
                    href: '#',
                },
            ];
        }
        return initialBreadcrumbs;
    }, [initialBreadcrumbs, deleteProduct]);

    const handleCollectionProducts = (collection_id: number) => {
        router.get(
            route('admin.products.index'),
            { collection_id },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const handleSort = (sort: string) => {
        let newSorting: string;

        if (!sorting) newSorting = `${sort}_desc`;
        else if (sorting && sorting.endsWith('_desc')) newSorting = `${sort}_asc`;
        else newSorting = `${sort}_desc`;

        setSorting(newSorting);

        router.get(
            route('admin.products.index'),
            { sort: newSorting },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    return (
        <AdminLayout breadcrumbs={localBreadcrumbs}>
            <Head title="Gérer les produits" />

            <Card className="border-border bg-card py-3 sm:py-4">
                <CardContent className="px-3 sm:px-4">
                    <div className="flex flex-col gap-4 sm:flex-row">
                        <div className="flex flex-1 gap-4">
                            <form className="relative flex-1" onSubmit={(e) => e.preventDefault()}>
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                                <Input
                                    placeholder="Rechercher un produit..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="border-border bg-background pl-10 text-foreground placeholder:text-muted-foreground"
                                />
                            </form>
                            {collectionId && (
                                <Button variant="outline" onClick={() => router.get(route('admin.products.index'))}>
                                    Voir tous les produits
                                </Button>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Deferred data="products" fallback={<DeferredFallback />}>
                <>
                    <Card className="gap-0 border-border bg-card pt-4 pb-0">
                        <CardHeader className="flex-row justify-between border-b border-border px-4 pb-4">
                            <CardTitle className="flex w-full justify-between max-sm:flex-col max-sm:gap-2 sm:items-center">
                                <div className="text-lg text-foreground">Liste des produits ({products && products.meta && products.meta.total})</div>

                                <Link
                                    href={route('admin.products.create', collectionId ? { collection_id: collectionId } : {})}
                                    className={buttonVariants({ variant: 'outline' })}
                                >
                                    <Plus />
                                    Ajouter un produit
                                </Link>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-border *:font-medium *:text-muted-foreground hover:bg-transparent">
                                        <TableHead onClick={() => handleSort('name')} className="group flex cursor-default items-center gap-1">
                                            Nom
                                            <MoveUp
                                                className={cn(
                                                    'opacity-0 transition-opacity group-hover:opacity-100',
                                                    sorting?.endsWith('_desc') && 'rotate-180',
                                                )}
                                                size={14}
                                            />
                                        </TableHead>
                                        <TableHead>Slug</TableHead>
                                        <TableHead>Marque</TableHead>
                                        <TableHead className="text-center">Description</TableHead>
                                        <TableHead>Prix</TableHead>
                                        <TableHead>Stock</TableHead>
                                        <TableHead className="w-12">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {products && products.data && products.data.length > 0 ? (
                                        products.data.map((product) => {
                                            return (
                                                <TableRow key={product.id} className="border-border hover:bg-muted/50">
                                                    <TableCell className="max-w-64 truncate font-medium">
                                                        <span className="text-foreground">{product.name}</span>
                                                    </TableCell>
                                                    <TableCell className="max-w-64 truncate">
                                                        <code className="rounded bg-muted px-2 py-1 text-xs text-muted-foreground">
                                                            {product.slug}
                                                        </code>
                                                    </TableCell>
                                                    <TableCell>
                                                        <code className="text-foreground">{product.brand.name}</code>
                                                    </TableCell>
                                                    <TableCell className="max-w-sm text-muted-foreground">
                                                        <p className="truncate">{product.short_description ?? product.description}</p>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className="text-foreground">{product.price.toFixed(2)}€</span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span
                                                            className={
                                                                product.stock === 0
                                                                    ? 'text-red-500'
                                                                    : product.stock < 10
                                                                      ? 'text-orange-500'
                                                                      : 'text-foreground'
                                                            }
                                                        >
                                                            {product.stock}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-muted">
                                                                    <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end" className="border-border bg-popover">
                                                                <DropdownMenuItem asChild>
                                                                    <Link
                                                                        href={route('admin.products.show', product.slug)}
                                                                        className="cursor-pointer text-foreground hover:bg-muted"
                                                                    >
                                                                        <Eye className="mr-1 h-4 w-4" />
                                                                        Voir détails
                                                                    </Link>
                                                                </DropdownMenuItem>
                                                                {product.collection && (
                                                                    <DropdownMenuItem asChild>
                                                                        <button
                                                                            className="cursor-pointer text-foreground hover:bg-muted"
                                                                            onClick={() => handleCollectionProducts(product.collection?.id || 0)}
                                                                        >
                                                                            <Eye className="mr-1 size-4" />
                                                                            Voir collection
                                                                        </button>
                                                                    </DropdownMenuItem>
                                                                )}
                                                                <DropdownMenuItem asChild>
                                                                    <Link
                                                                        href={route('admin.products.edit', product.slug)}
                                                                        className="cursor-pointer text-foreground hover:bg-muted"
                                                                    >
                                                                        <Edit className="mr-1 h-4 w-4" />
                                                                        Modifier
                                                                    </Link>
                                                                </DropdownMenuItem>
                                                                <DropdownMenuSeparator className="bg-border" />
                                                                <DropdownMenuItem
                                                                    className="cursor-pointer text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950"
                                                                    onClick={() => setDeleteProduct(product)}
                                                                >
                                                                    <Trash2 className="mr-1 h-4 w-4" />
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
                                                {searchTerm ? 'Aucun produit trouvé' : 'Aucun produit disponible'}
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    {products && products.links && products.meta && (
                        <PaginationComponent pagination={{ links: products.links, meta: products.meta }} only={['products']} />
                    )}
                </>
            </Deferred>

            <ConfirmDeleteDialog
                item={deleteProduct}
                open={!!deleteProduct}
                onClose={() => setDeleteProduct(null)}
                itemNameKey="name"
                deleteRoute={(product) => route('admin.products.destroy', product.slug)}
                itemLabel="produit"
                icon={<Package className="size-4" />}
                prefix="Le"
            />
        </AdminLayout>
    );
}

function DeferredFallback() {
    return (
        <Card className="gap-0 border-border bg-card pt-4 pb-0">
            <CardHeader className="flex-row justify-between border-b border-border px-4 pb-4">
                <CardTitle className="flex w-full justify-between max-sm:flex-col max-sm:gap-2 sm:items-center">
                    <div className="text-lg text-foreground">Liste des produits</div>

                    <Link href={route('admin.products.create')} className={buttonVariants({ variant: 'outline' })}>
                        <Plus />
                        Ajouter un produit
                    </Link>
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow className="border-border *:font-medium *:text-muted-foreground hover:bg-transparent">
                            <TableHead>Nom</TableHead>
                            <TableHead>Slug</TableHead>
                            <TableHead>Marque</TableHead>
                            <TableHead className="text-center">Description</TableHead>
                            <TableHead>Prix</TableHead>
                            <TableHead>Stock</TableHead>
                            <TableHead className="w-12">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow className="border-border hover:bg-muted/50">
                            <TableCell className="font-medium">
                                <span className="flex items-center gap-2 text-foreground">
                                    <Loader2 className="animate-spin" size={16} />
                                    Chargement des données...
                                </span>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
