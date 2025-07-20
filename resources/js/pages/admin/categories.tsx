import { Head, usePage } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import type { BreadcrumbItem, Category, SharedData } from '@/types';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import {
    ChevronDown,
    ChevronRight,
    Plus,
    Search,
    Edit,
    Trash2,
    MoreHorizontal,
    FolderOpen,
    Folder,
    Folders
} from 'lucide-react';
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
import { CategoryDialog } from '@/components/category-dialog';
import { ConfirmDeleteDialog } from '@/components/confirm-delete-dialog';

export default function Categories({ breadcrumbs: initialBreadcrumbs }: { breadcrumbs: BreadcrumbItem[] }) {
    const { categories } = usePage<SharedData>().props;

    const [searchTerm, setSearchTerm] = useState("")
    const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set())
    const [deleteCategory, setDeleteCategory] = useState<Category | null>(null);
    const [openCategoryDialog, setOpenCategoryDialog] = useState<boolean>(false);
    const [editCategory, setEditCategory] = useState<Category | null>(null);
    const [parentIdForNewCategory, setParentIdForNewCategory] = useState<number | null>(null);

    const localBreadcrumbs = useMemo(() => {
        if (openCategoryDialog) {
            return [
                ...initialBreadcrumbs,
                {
                    title: editCategory
                        ? `Modifier : ${editCategory.name}`
                        : 'Nouvelle catégorie',
                    href: "#"
                },
            ];
        }
        return initialBreadcrumbs;
    }, [initialBreadcrumbs, openCategoryDialog, editCategory]);

    const toggleExpanded = (categoryId: number) => {
        const newExpanded = new Set(expandedCategories)
        if (newExpanded.has(categoryId)) {
            newExpanded.delete(categoryId)
        } else {
            newExpanded.add(categoryId)
        }
        setExpandedCategories(newExpanded)
    }

    const CategoryRow = (category: Category, level = 0, onCategoryDelete?: () => void): ReactNode => {
        const hasChildren = category.children && category.children.length > 0
        const isExpanded = expandedCategories.has(category.id)
        const paddingLeft = level * 24

        const rows = []

        rows.push(
            <TableRow key={category.id} className="border-border hover:bg-muted/50">
                <TableCell className="font-medium">
                    <div className="flex items-center" style={{ paddingLeft: `${paddingLeft}px` }}>
                        {hasChildren ? (
                            <Button variant="ghost" size="sm" className="mr-2 h-6 w-6 p-0 hover:bg-muted" onClick={() => toggleExpanded(category.id)}>
                                {isExpanded ? (
                                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                )}
                            </Button>
                        ) : (
                            <div className="mr-2 w-6" />
                        )}
                        <div className="flex items-center gap-2">
                            {hasChildren ? <FolderOpen className="h-4 w-4 text-primary" /> : <Folder className="h-4 w-4 text-muted-foreground" />}
                            <span className="text-foreground">{category.name}</span>
                        </div>
                    </div>
                </TableCell>
                <TableCell className="max-w-md text-muted-foreground">
                    <p className="truncate">{category.description}</p>
                </TableCell>
                <TableCell>
                    <code className="rounded bg-muted px-2 py-1 text-xs text-muted-foreground">{category.slug}</code>
                </TableCell>
                <TableCell className="text-center">
                    <Badge variant="secondary" className="bg-muted text-muted-foreground">
                        {category.total_products_count || category.products_count || 0}
                    </Badge>
                </TableCell>
                <TableCell>
                    <Badge
                        variant={category.is_active ? 'default' : 'secondary'}
                        className={
                            category.is_active
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }
                    >
                        {category.is_active ? 'Actif' : 'Inactif'}
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
                                    setOpenCategoryDialog(true);
                                    setEditCategory(category);
                                }}
                            >
                                <Edit className="mr-2 h-4 w-4" />
                                Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="cursor-pointer text-foreground hover:bg-muted"
                                onClick={() => {
                                    setParentIdForNewCategory(category.id)
                                    setOpenCategoryDialog(true);
                                }}
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Ajouter sous-catégorie
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-border" />
                            <DropdownMenuItem
                                className="cursor-pointer text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950"
                                onClick={onCategoryDelete}
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Supprimer
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </TableCell>
            </TableRow>,
        );

        if (hasChildren && isExpanded && category.children) {
            category.children.forEach(child => {
                rows.push(CategoryRow(child, level + 1, () => setDeleteCategory(child)))
            })
        }

        return rows
    }

    const filterCategories = (categories: Category[], searchTerm: string): Category[] => {
        return categories
            .map(category => {
                const matches =
                    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    category.description.toLowerCase().includes(searchTerm.toLowerCase());

                const filteredChildren = category.children
                    ? filterCategories(category.children, searchTerm)
                    : [];

                if (matches || filteredChildren.length > 0) {
                    return {
                        ...category,
                        children: filteredChildren
                    };
                }

                return null;
            })
            .filter(Boolean) as Category[];
    }

    const filteredCategories = filterCategories(categories, searchTerm);

    useEffect(() => {
        if(searchTerm) setExpandedCategories(new Set(filteredCategories.map((c) => c.id)));
        else setExpandedCategories(new Set())
    }, [searchTerm]);

    const countCategoriesWithFilter = (categories: Category[], filter?: ((cat: Category) => boolean) | keyof Category | null): number => {
        return categories.reduce((acc, cat) => {
            let passesFilter = true;

            if (typeof filter === 'function') {
                passesFilter = filter(cat);
            } else if (typeof filter === 'string') {
                passesFilter = cat[filter] === true || cat[filter] === 'active';
            }

            return (
                acc +
                (passesFilter ? 1 : 0) +
                (cat.children && cat.children.length > 0
                    ? countCategoriesWithFilter(cat.children, filter)
                    : 0)
            );
        }, 0);
    }

    return (
        <AdminLayout breadcrumbs={localBreadcrumbs}>
            <Head title="Gérer les catégories" />

            <Card className="mt-4 py-3 sm:py-4 border-border bg-card">
                <CardContent className="px-3 sm:px-4">
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                <Input
                                    placeholder="Rechercher une catégorie..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 bg-background border-border text-foreground placeholder:text-muted-foreground"
                                />
                            </div>
                        </div>
                        <div className="flex max-sm:flex-wrap gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setExpandedCategories(new Set(categories.map((c) => c.id)))}
                                className="bg-background border-border text-foreground hover:bg-muted"
                            >
                                Tout développer
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => setExpandedCategories(new Set())}
                                className="bg-background border-border text-foreground hover:bg-muted"
                            >
                                Tout réduire
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-border bg-card pt-4 pb-0 gap-0">
                <CardHeader className="px-4 pb-4 border-b border-border sm:flex-row justify-between">
                    <CardTitle className="text-foreground text-lg">Liste des catégories ({countCategoriesWithFilter(filteredCategories)})</CardTitle>

                    <CategoryDialog
                        open={openCategoryDialog}
                        setOpen={() => {
                            setOpenCategoryDialog(!openCategoryDialog);
                            setEditCategory(null);
                        }}
                        category={editCategory}
                        parentId={parentIdForNewCategory}
                    />
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-border hover:bg-transparent *:text-muted-foreground *:font-medium">
                                <TableHead className="min-w-64">Nom</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Slug</TableHead>
                                <TableHead className="text-center">Produits</TableHead>
                                <TableHead>Statut</TableHead>
                                <TableHead className="w-12">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredCategories.length > 0 ? (
                                filteredCategories.map(category => CategoryRow(category, 0, () => setDeleteCategory(category)))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                        {searchTerm ? "Aucune catégorie trouvée" : "Aucune catégorie disponible"}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="border-border bg-card">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Total catégories</p>
                                <p className="text-2xl font-bold text-foreground">
                                    {countCategoriesWithFilter(categories)}
                                </p>
                            </div>
                            <Badge
                                variant="secondary"
                                className="bg-muted text-muted-foreground size-8 rounded-full flex items-center justify-center"
                            >
                                <FolderOpen />
                            </Badge>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border bg-card">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Catégories actives</p>
                                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                                    {countCategoriesWithFilter(categories, 'is_active')}
                                </p>
                            </div>
                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 h-8 w-8 rounded-full flex items-center justify-center">
                                ✓
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
                                    {categories.reduce((acc, cat) => acc + (cat.total_products_count ?? 0), 0)}
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
                                <p className="text-sm text-muted-foreground">Catégories vides</p>
                                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                                    {countCategoriesWithFilter(categories, cat =>
                                        !cat.total_products_count && !cat.products_count
                                    )}
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
                item={deleteCategory}
                open={!!deleteCategory}
                onClose={() => setDeleteCategory(null)}
                itemNameKey="name"
                deleteRoute={(item) => route('admin.categories.destroy', item.id)}
                itemLabel="catégorie"
                icon={<Folders className="size-4" />}
                prefix="La"
            />

        </AdminLayout>
    )
}
