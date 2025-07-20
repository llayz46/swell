import { Button, buttonVariants } from '@/components/ui/button';
import {
    AlertCircle,
    Bolt,
    ChartNoAxesCombined,
    Euro,
    ExternalLink,
    Eye,
    Images,
    Loader2, Package, Trash2,
    Warehouse
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Transition } from '@headlessui/react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Link, useForm } from '@inertiajs/react';
import type { Product, ProductForm } from '@/types';
import { FormEventHandler, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { GeneralTabContent } from '@/components/product-form-tab-general';
import { ImagesTabContent } from '@/components/product-form-tab-images';
import { PricingTabContent } from '@/components/product-form-tab-pricing';
import { InventoryTabContent } from '@/components/product-form-tab-inventory';
import { SeoTabContent } from '@/components/product-form-tab-seo';
import { calculateMargin } from '@/utils/product-price-calculating';

interface ProductFormType {
    product?: Product;
    brands: {
        id: number;
        name: string;
    }[];
    groups: {
        id: number;
        name: string;
        products: {
            id: number;
            name: string;
        }[];
    }[];
    setDeleteProduct?: (product: Product) => void;
    isDuplicate: boolean;
}

export function ProductFormPage({ product, brands, groups, setDeleteProduct, isDuplicate = false }: ProductFormType) {
    const { data, setData, post, errors, processing } = useForm<ProductForm>({
        name: product?.name ?? '',
        short_description: product?.short_description ?? '',
        description: product?.description ?? '',
        price: product?.price ?? 0,
        discount_price: product?.discount_price ?? null,
        cost_price: product?.cost_price ?? 0,
        stock: !isDuplicate && product?.stock ? product.stock : 0,
        reorder_level: !isDuplicate && product?.reorder_level ? product.reorder_level : 0,
        status: !isDuplicate && Boolean(product?.status),
        images: !isDuplicate && product?.images ? product.images.map(img => ({
            id: img.id ?? null,
            image_url: img.image_url,
            image_file: null,
            alt_text: img.alt_text ?? '',
            is_featured: Boolean(img.is_featured),
            order: img.order ?? 0,
        })) : [],
        meta_title: product?.meta_title ?? null,
        meta_description: product?.meta_description ?? null,
        meta_keywords: product?.meta_keywords ?? null,
        brand_id: product?.brand.id ?? null,
        category_id: product?.categories && product?.categories.length > 0 ? String(product?.categories[0].id) : '',
        group_id: product?.group ? String(product?.group.id) : '',
    });

    const [initialData, setInitialData] = useState(data);

    useEffect(() => {
        setInitialData(data);
    }, [product]);

    const isDirty = !isDuplicate && product ? JSON.stringify(data) !== JSON.stringify(initialData) : false;

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (!isDuplicate && product) {
            post(route('admin.products.update', product.id), {
                method: 'put',
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Produit modifié avec succès', {
                        description: data.name + ' a bien été modifié.',
                        icon: <Package className="size-4" />,
                    });
                },
                onError: (errors) => {
                    const allErrors = Object.values(errors).join('\n') || 'Veuillez vérifier les informations saisies.';

                    toast.error('Erreur lors de la modification du produit.', {
                        description: allErrors,
                        icon: <Package className="size-4" />,
                    });
                },
            })
        } else {
            post(route('admin.products.store'), {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Produit créer avec succès', {
                        description: data.name + ' a bien été créer.',
                        icon: <Package className="size-4" />,
                    });
                },
                onError: (errors) => {
                    const allErrors = Object.values(errors).join('\n') || 'Veuillez vérifier les informations saisies.';

                    toast.error('Erreur lors de la création du produit.', {
                        description: allErrors,
                        icon: <Package className="size-4" />,
                    });
                },
            })
        }
    };

    return (
        <form className="space-y-6 py-6" onSubmit={submit}>
            <div className="flex max-sm:flex-col max-sm:gap-4 sm:items-center justify-between">
                <div className="flex flex-col gap-2 sm:gap-4">
                    <h1 className="text-3xl font-bold text-foreground">
                        {!isDuplicate && product ? (
                            `Modifier : ${product.name}`
                        ) : (
                            "Créer un nouveau produit"
                        )}
                    </h1>
                    <p className="text-muted-foreground">
                        {!isDuplicate && product ? (
                            `SKU: ${product.sku}`
                        ) : (
                            "Créez un nouveau produit pour commencer à le vendre."
                        )}
                    </p>
                </div>
                <Button disabled={processing || (!isDuplicate && product && !isDirty)} className="w-fit">
                    {processing && (
                        <Loader2 className="animate-spin" />
                    )}
                    {!isDuplicate && product ? 'Enregistrer les modifications' : 'Créer le produit'}
                </Button>
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

            <div className="grid gap-4 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <Tabs defaultValue="general">
                        <TabsList className="mb-3 flex-wrap">
                            <TabsTrigger value="general">
                                <Bolt className="-ms-0.5 me-1.5 opacity-60" size={16} aria-hidden="true" />
                                Général
                            </TabsTrigger>
                            <TabsTrigger value="images" className="group">
                                <Images className="-ms-0.5 me-1.5 opacity-60" size={16} aria-hidden="true" />
                                Images
                            </TabsTrigger>
                            <TabsTrigger value="pricing" className="group">
                                <Euro className="-ms-0.5 me-1.5 opacity-60" size={16} aria-hidden="true" />
                                Tarification
                            </TabsTrigger>
                            <TabsTrigger value="inventory" className="group">
                                <Warehouse className="-ms-0.5 me-1.5 opacity-60" size={16} aria-hidden="true" />
                                Inventaire
                            </TabsTrigger>
                            <TabsTrigger value="seo" className="group">
                                <ChartNoAxesCombined className="-ms-0.5 me-1.5 opacity-60" size={16} aria-hidden="true" />
                                Seo
                            </TabsTrigger>
                        </TabsList>

                        <GeneralTabContent data={data} setData={setData} errors={errors} processing={processing}
                                           brands={brands} groups={groups} />

                        <ImagesTabContent data={data} setData={setData} processing={processing} />

                        <PricingTabContent data={data} setData={setData} errors={errors} />

                        <InventoryTabContent data={data} setData={setData} errors={errors} />

                        <SeoTabContent data={data} setData={setData} errors={errors} processing={processing} />
                    </Tabs>
                </div>

                <div className="space-y-4 lg:col-span-1">
                    <Card className="max-sm:py-4 border-border bg-card">
                        <CardHeader className="max-sm:px-4">
                            <CardTitle className="text-foreground">Statut du produit</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 max-sm:px-4">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="status">Produit actif</Label>
                                <Switch id="status" defaultChecked={!isDuplicate && product && product.status} onCheckedChange={(checked) => setData('status', checked)} />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label>Date du produit</Label>
                                <Label>{!isDuplicate && product ? product.created_at : 'N/A'}</Label>
                            </div>
                            <div className="flex items-center justify-between">
                                <Label>Dernière modification</Label>
                                <Label>{!isDuplicate && product ? product.updated_at : 'N/A'}</Label>
                            </div>
                            <div className="flex items-center justify-between">
                                <Label>Référence produit</Label>
                                <Label>{!isDuplicate && product ? product.sku : 'N/A'}</Label>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="max-sm:py-4 border-border bg-card">
                        <CardHeader className="max-sm:px-4">
                            <CardTitle className="text-foreground">Aperçu rapide</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 max-sm:px-4">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Prix de vente:</span>
                                <span className="font-semibold text-foreground">€{data.price.toFixed(2)}</span>
                            </div>
                            {data.discount_price !== null && data.discount_price !== 0 && (
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Prix promo:</span>
                                    <span className="font-semibold text-green-600 dark:text-green-400">
                                        €{data.discount_price.toFixed(2)}
                                    </span>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Stock:</span>
                                <span className="font-semibold text-foreground">{data.stock}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Marge:</span>
                                <span className="font-semibold text-green-600 dark:text-green-400">{calculateMargin(data.cost_price, (data.discount_price !== null && data.discount_price !== 0) ? data.discount_price : data.price)}%</span>
                            </div>
                            <Separator />
                            <div className="space-y-2">
                                <div className="flex flex-wrap gap-1">
                                    {data.status ? <Badge className="bg-green-600 dark:bg-green-900 dark:text-green-200">Actif</Badge> : <Badge variant="destructive">Inactif</Badge>}
                                    {!isDuplicate && product && product.isNew && <Badge className="bg-blue-900 text-blue-200">Nouveau</Badge>}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {!isDuplicate && product && (
                        <Card className="border-border bg-card">
                            <CardHeader>
                                <CardTitle className="text-foreground">Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-2">
                                <Link
                                    className={`${buttonVariants({ variant: 'outline' })} justify-start`}
                                    href={route('admin.products.show', product.slug)}
                                >
                                    <Eye />
                                    Voir le produit
                                </Link>
                                <Link
                                    className={`${buttonVariants({ variant: 'outline' })} justify-start`}
                                    href={route('product.show', product.slug)}
                                >
                                    <ExternalLink />
                                    Voir sur le site
                                </Link>
                                <Separator />
                                {product && (
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start border-border bg-background text-red-600 hover:text-red-600 dark:text-red-100 hover:border-red-400 dark:hover:border-red-900 hover:bg-red-50 dark:hover:bg-red-950"
                                        type="button"
                                        onClick={() => setDeleteProduct && setDeleteProduct(product)}
                                    >
                                        <Trash2 />
                                        Supprimer le produit
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </form>
    )
}
