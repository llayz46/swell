import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminLayout from '@/layouts/admin-layout';
import type { BreadcrumbItem, Product } from '@/types';
import { Head, Link } from '@inertiajs/react';
import {
    Boxes,
    Building2,
    Calendar,
    Copy,
    Edit,
    ExternalLink,
    FolderOpen,
    Package,
    Trash2,
    TrendingUp
} from 'lucide-react';
import { useState } from 'react';
import { getStorageUrl } from '@/utils/format-storage-url';
import { calculateMargin, calculateProfit } from '@/utils/product-price-calculating';
import { ConfirmDeleteDialog } from '@/components/confirm-delete-dialog';

interface ProductType {
    breadcrumbs: BreadcrumbItem[];
    product: Product;
}

export default function Show({ breadcrumbs, product }: ProductType) {
    const [selectedImage, setSelectedImage] = useState<number>(0);
    const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title={`Gérer : ${product.name}`} />

            <div className="space-y-6 py-6">
                <div className="flex max-sm:flex-col-reverse sm:items-center justify-between">
                    <div className="flex flex-col gap-4">
                        <h1 className="text-3xl font-bold text-foreground">{product.name}</h1>
                        <p className="text-muted-foreground">SKU: {product.sku}</p>
                    </div>
                    <div className="max-sm:mb-4 flex flex-wrap gap-2">
                        <Link href={route('admin.products.create')} data={{ duplicate: product.id }} className={buttonVariants({ variant: 'outline' })}>
                            <Copy className="size-4" />
                            Dupliquer
                        </Link>
                        <Link href={route('admin.products.edit', product.slug)} className={buttonVariants({ variant: 'outline' })}>
                            <Edit className="size-4" />
                            Modifier
                        </Link>
                        <Button variant="outline" className="border-border bg-background text-red-600 hover:border-red-300 hover:bg-red-200 dark:text-red-400 dark:hover:border-red-900 dark:hover:bg-red-950" onClick={() => setDeleteProduct(product)}>
                            <Trash2 className="size-4" />
                            Supprimer
                        </Button>
                    </div>
                </div>

                <div className="flex gap-2">
                    {product.status ? <Badge className="bg-green-900 text-green-200">Actif</Badge> : <Badge className="bg-red-900 text-red-200">Inactif</Badge>}
                    {product.isNew && <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Nouveau</Badge>}
                    <Badge variant="secondary" className="bg-green-900 text-green-200">
                        En stock
                    </Badge>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-1">
                        <Card className="border-border bg-card py-0 rounded-md">
                            <CardContent className="p-4">
                                <div className="space-y-4">
                                    <div className="aspect-square overflow-hidden rounded-sm bg-muted">
                                        <img
                                            src={getStorageUrl(product.images?.[selectedImage]?.image_url)}
                                            alt={product.images?.[selectedImage]?.alt_text || product.name}
                                            width={400}
                                            height={400}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    <div className="grid grid-cols-3 gap-2">
                                        {product.images?.map((image, index) => (
                                            <button
                                                key={image.id}
                                                onClick={() => setSelectedImage(index)}
                                                className={`aspect-square overflow-hidden rounded-sm bg-muted transition-colors ${
                                                    selectedImage === index && 'border border-muted-foreground'
                                                }`}
                                            >
                                                <img
                                                    src={getStorageUrl(image.image_url)}
                                                    alt={image.alt_text}
                                                    width={100}
                                                    height={100}
                                                    className="h-full w-full object-cover"
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:col-span-2">
                        <Tabs defaultValue="overview" className="space-y-4">
                            <TabsList className="flex flex-wrap">
                                <TabsTrigger value="overview">
                                    Vue d'ensemble
                                </TabsTrigger>
                                <TabsTrigger value="inventory">
                                    Inventaire
                                </TabsTrigger>
                                <TabsTrigger value="seo">
                                    SEO
                                </TabsTrigger>
                                <TabsTrigger value="analytics">
                                    Analytics
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="overview" className="space-y-4">
                                <Card className="max-sm:py-4 border-border bg-card rounded-md">
                                    <CardHeader className="max-sm:px-4">
                                        <CardTitle className="text-foreground">Informations générales</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4 max-sm:px-4">
                                        <div className="grid gap-4 md:grid-cols-2">
                                            <div>
                                                <label className="text-sm font-medium text-muted-foreground">Nom du produit</label>
                                                <p className="font-medium text-foreground">{product.name}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-muted-foreground">Slug</label>
                                                <p className="font-mono text-sm text-foreground">{product.slug}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-muted-foreground">Marque</label>
                                                <div className="flex items-center gap-2">
                                                    <Building2 className="size-4 text-muted-foreground" />
                                                    <Link href={route('brand.show', product.brand.slug)} className="text-primary hover:underline">
                                                        {product.brand.name}
                                                    </Link>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-muted-foreground">Catégorie</label>
                                                <div className="flex items-center gap-2">
                                                    <FolderOpen className="size-4 text-muted-foreground" />
                                                    <Link href={route('category.show', product.categories?.[0].slug)} className="text-primary hover:underline">
                                                        {product.categories?.[0].name}
                                                    </Link>
                                                </div>
                                            </div>
                                            {product.group && (
                                                <div>
                                                    <label className="text-sm font-medium text-muted-foreground">Groupe associé</label>
                                                    <div className="flex items-center gap-2">
                                                        <Boxes className="size-4 text-muted-foreground" />
                                                        <p className="font-medium text-foreground">{product.group.name}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">Description courte</label>
                                            <p className="mt-1 leading-relaxed text-foreground">{product.short_description}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">Description</label>
                                            <p className="mt-1 leading-relaxed text-foreground">{product.description}</p>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="max-sm:py-4 border-border bg-card rounded-md">
                                    <CardHeader className="max-sm:px-4">
                                        <CardTitle className="text-foreground">Tarification</CardTitle>
                                    </CardHeader>
                                    <CardContent className="max-sm:px-4">
                                        <div className="grid md:grid-cols-4 gap-4">
                                            {product.discount_price ? (
                                                <div>
                                                    <label className="text-sm font-medium text-muted-foreground">Prix de vente (discount)</label>
                                                    <p className="text-lg font-semibold text-muted-foreground">€{product.discount_price.toFixed(2)}</p>
                                                </div>
                                            ) : (
                                                <div>
                                                    <label className="text-sm font-medium text-muted-foreground">Prix de vente</label>
                                                    <p className="text-2xl font-bold text-foreground">€{product.price.toFixed(2)}</p>
                                                </div>
                                            )}
                                            <div>
                                                <label className="text-sm font-medium text-muted-foreground">Prix coûtant</label>
                                                <p className="text-lg font-semibold text-muted-foreground">
                                                    €{product.cost_price.toFixed(2)}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-muted-foreground">Marge</label>
                                                <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                                                    {calculateMargin(product.cost_price, product.discount_price ?? product.price)}%
                                                </p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-muted-foreground">Profit</label>
                                                <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                                                    €{calculateProfit(product.cost_price, product.discount_price ?? product.price)}
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="inventory" className="space-y-4">
                                <Card className="max-sm:py-4 border-border bg-card rounded-md">
                                    <CardHeader className="max-sm:px-4">
                                        <CardTitle className="text-foreground">Gestion des stocks</CardTitle>
                                    </CardHeader>
                                    <CardContent className="max-sm:px-4">
                                        <div className="grid gap-4 md:grid-cols-3">
                                            <div>
                                                <label className="text-sm font-medium text-muted-foreground">Stock total</label>
                                                <p className="text-2xl font-bold text-foreground">{product.stock}</p>
                                            </div>
                                        </div>
                                        <Separator className="my-4" />
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">Seuil de réapprovisionnement</label>
                                            <p className="font-medium text-foreground">{product.reorder_level} unités</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="seo" className="space-y-4">
                                <Card className="max-sm:py-4 border-border bg-card">
                                    <CardHeader className="max-sm:px-4">
                                        <CardTitle className="text-foreground">Optimisation SEO</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4 max-sm:px-4">
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">Titre Meta</label>
                                            <p className="mt-1 text-foreground">{product.meta_title ?? 'Pas de titre meta'}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">Description Meta</label>
                                            <p className="mt-1 text-foreground">{product.meta_description ?? 'Pas de description meta'}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">Mots-clés</label>
                                            <p className="mt-1 text-foreground">{product.meta_keywords ?? 'Pas de mot clés meta'}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">URL du produit</label>
                                            <div className="mt-1 flex items-center gap-2">
                                                <code className="rounded bg-muted px-2 py-1 text-sm text-muted-foreground">/products/{product.slug}</code>
                                                <Link href={route('product.show', product.slug)} prefetch className={buttonVariants({ variant: 'ghost', size: 'icon' })}>
                                                    <ExternalLink />
                                                </Link>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="analytics" className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <Card className="max-sm:py-4 border-border bg-card">
                                        <CardHeader className="max-sm:px-4">
                                            <CardTitle className="flex items-center gap-2 text-foreground">
                                                <TrendingUp className="h-5 w-5" />
                                                Performances
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="max-sm:px-4">
                                            <div className="space-y-4">
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Ventes totales:</span>
                                                    <span className="font-semibold text-foreground">32</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Vues produit:</span>
                                                    <span className="font-semibold text-foreground">211</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Taux de conversion:</span>
                                                    <span className="font-semibold text-foreground">
                                                        {((32 / 211) * 100).toFixed(1)}%
                                                    </span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="max-sm:py-4 border-border bg-card">
                                        <CardHeader className="max-sm:px-4">
                                            <CardTitle className="flex items-center gap-2 text-foreground">
                                                <Calendar className="h-5 w-5" />
                                                Dates importantes
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="max-sm:px-4">
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="text-sm font-medium text-muted-foreground">Créé le</label>
                                                    <p className="text-foreground">{product.created_at}</p>
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium text-muted-foreground">Dernière modification</label>
                                                    <p className="text-foreground">{product.updated_at}</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>

            <ConfirmDeleteDialog
                item={deleteProduct}
                open={!!deleteProduct}
                onClose={() => setDeleteProduct(null)}
                itemNameKey="name"
                deleteRoute={(item) => route('admin.products.destroy', item.slug)}
                itemLabel="produit"
                icon={<Package className="size-4" />}
                prefix="Le"
            />
        </AdminLayout>
    );
}
