import { destroy } from '@/actions/App/Http/Controllers/Admin/BrandController';
import { BrandDialog } from '@/components/swell/brand-dialog';
import { ConfirmDeleteDialog } from '@/components/swell/confirm-delete-dialog';
import SearchInput from '@/components/swell/search-input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, SwellCard, SwellCardContent } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AdminLayout from '@/layouts/admin-layout';
import type { Brand, BreadcrumbItem } from '@/types';
import { useStorageUrl } from '@/utils/format-storage-url';
import { Head } from '@inertiajs/react';
import { Edit, MoreHorizontal, Tags, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';

export default function Brands({ breadcrumbs: initialBreadcrumbs, brands }: { breadcrumbs: BreadcrumbItem[]; brands: Brand[] }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteBrand, setDeleteBrand] = useState<Brand | null>(null);
    const [openBrandDialog, setOpenBrandDialog] = useState<boolean>(false);
    const [editBrand, setEditBrand] = useState<Brand | null>(null);
    const [sortBy, setSortBy] = useState('name');
    const getStorageUrl = useStorageUrl();

    const localBreadcrumbs = useMemo(() => {
        if (openBrandDialog) {
            return [
                ...initialBreadcrumbs,
                {
                    title: editBrand ? `Modifier : ${editBrand.name}` : 'Nouvelle marque',
                    href: '#',
                },
            ];
        }
        return initialBreadcrumbs;
    }, [initialBreadcrumbs, openBrandDialog, editBrand]);

    const filterBrands = (brands: Brand[], searchTerm: string, sortBy: string): Brand[] => {
        let filtered = brands;

        if (searchTerm) {
            filtered = filtered.filter((brand) => brand.name.toLowerCase().includes(searchTerm.toLowerCase()));
        }

        return [...filtered].sort((a, b) => {
            switch (sortBy) {
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'products':
                    return (b.products_count || 0) - (a.products_count || 0);
                case 'date':
                    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                default:
                    return a.name.localeCompare(b.name);
            }
        });
    };

    const filteredBrands = filterBrands(brands, searchTerm, sortBy);

    const countBrandsWithFilter = (brands: Brand[], filter?: ((cat: Brand) => boolean) | keyof Brand | null): number => {
        return brands.reduce((acc, cat) => {
            let passesFilter = true;

            if (typeof filter === 'function') {
                passesFilter = filter(cat);
            } else if (typeof filter === 'string') {
                passesFilter = !!cat[filter];
            }

            return acc + (passesFilter ? 1 : 0);
        }, 0);
    };

    return (
        <AdminLayout breadcrumbs={localBreadcrumbs}>
            <Head title="Gérer les marques" />

            <SearchInput placeholder="Rechercher une marque..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}>
                <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="border-border bg-background text-foreground sm:w-40">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="border-border bg-popover">
                        <SelectItem value="name">Nom A-Z</SelectItem>
                        <SelectItem value="products">Nb produits</SelectItem>
                        <SelectItem value="date">Date création</SelectItem>
                    </SelectContent>
                </Select>
            </SearchInput>

            <Card className="gap-0 border-border bg-card pt-4 pb-0">
                <CardHeader className="justify-between border-b border-border px-4 pb-4 sm:flex-row">
                    <CardTitle className="text-lg text-foreground">Liste des marques ({countBrandsWithFilter(filteredBrands)})</CardTitle>

                    <BrandDialog
                        open={openBrandDialog}
                        setOpen={() => {
                            setOpenBrandDialog(!openBrandDialog);
                            setEditBrand(null);
                        }}
                        brand={editBrand}
                    />
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-border *:font-medium *:text-muted-foreground hover:bg-transparent">
                                <TableHead className="w-8">Logo</TableHead>
                                <TableHead>Nom</TableHead>
                                <TableHead>Slug</TableHead>
                                <TableHead className="text-center">Produits</TableHead>
                                <TableHead className="w-12">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredBrands.length > 0 ? (
                                filteredBrands.map((brand) => {
                                    return (
                                        <TableRow key={brand.id} className="border-border hover:bg-muted/50">
                                            <TableCell>
                                                {brand.logo_url ? (
                                                    <img
                                                        className="aspect-square size-8 truncate rounded-md object-cover"
                                                        src={getStorageUrl(brand.logo_url)}
                                                        alt={brand.name}
                                                        loading="lazy"
                                                    />
                                                ) : (
                                                    <span className="block size-8 rounded-md bg-muted"></span>
                                                )}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                <span className="text-foreground">{brand.name}</span>
                                            </TableCell>
                                            <TableCell>
                                                <code className="rounded bg-muted px-2 py-1 text-xs text-muted-foreground">{brand.slug}</code>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge variant="secondary" className="bg-muted text-muted-foreground">
                                                    {brand.products_count || 0}
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
                                                                setOpenBrandDialog(true);
                                                                setEditBrand(brand);
                                                            }}
                                                        >
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            Modifier
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator className="bg-border" />
                                                        <DropdownMenuItem
                                                            className="cursor-pointer text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950"
                                                            onClick={() => setDeleteBrand(brand)}
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
                                        {searchTerm ? 'Aucune marque trouvée' : 'Aucune marque disponible'}
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
                                <p className="text-sm text-muted-foreground">Total marques</p>
                                <p className="text-2xl font-bold text-foreground">{countBrandsWithFilter(brands)}</p>
                            </div>
                            <Badge
                                variant="secondary"
                                className="flex size-8 items-center justify-center rounded-full bg-muted text-muted-foreground"
                            >
                                <Tags />
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
                                    {brands.reduce((acc, brand) => acc + (brand.products_count ?? 0), 0)}
                                </p>
                            </div>
                            <Badge
                                variant="secondary"
                                className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground"
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
                                    {countBrandsWithFilter(brands, (brand) => !brand.products_count)}
                                </p>
                            </div>
                            <Badge className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                                !
                            </Badge>
                        </div>
                    </SwellCardContent>
                </SwellCard>
            </div>

            <ConfirmDeleteDialog
                item={deleteBrand}
                open={!!deleteBrand}
                onClose={() => setDeleteBrand(null)}
                itemNameKey="name"
                deleteRoute={(item) => destroy.url(item.id)}
                itemLabel="marque"
                icon={<Tags className="size-4" />}
                prefix="La"
            />
        </AdminLayout>
    );
}
