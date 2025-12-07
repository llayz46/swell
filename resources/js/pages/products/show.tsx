import { ProductBreadcrumb } from '@/components/swell/product/product-breadcrumb';
import { ProductCard } from '@/components/swell/product/product-card';
import { ProductQuickViewDialog } from '@/components/swell/product/product-quick-view-dialog';
import { ReviewSection } from '@/components/swell/product/review/review-section';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useCartContext } from '@/contexts/cart-context';
import { ReviewProvider } from '@/contexts/review-context';
import { useWishlist } from '@/hooks/use-wishlist';
import BaseLayout from '@/layouts/base-layout';
import { cn } from '@/lib/utils';
import type { Product, ProductImage, Review, SharedData } from '@/types';
import { getStorageUrl } from '@/utils/format-storage-url';
import { Head, Link, usePage, WhenVisible } from '@inertiajs/react';
import { Heart, Loader2, RotateCcw, Shield, ShoppingCart, Star, Truck } from 'lucide-react';
import { useMemo, useState } from 'react';

interface ShowProductProps {
    product: Product;
    similarProducts: Product[];
    reviews: Review[];
}

export default function Show({ product, similarProducts, reviews }: ShowProductProps) {
    const { swell } = usePage<SharedData>().props;
    const featuredImage: ProductImage | undefined =
        product.images?.find((image) => image.is_featured) || product.images?.sort((a, b) => (a.order || 0) - (b.order || 0))[0];
    const [imageToShow, setImageToShow] = useState<ProductImage | undefined>(featuredImage || product.images?.[0]);
    const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
    const { addItem } = useWishlist();
    const { addToCart, buyNow } = useCartContext();

    const initialSelections = useMemo(() => {
        const selections: Record<number, number> = {};
        product.options?.forEach((opt) => {
            selections[opt.id] = opt.values?.[0]?.id as number;
        });
        return selections;
    }, [product.options]);
    const [selectedOptions, setSelectedOptions] = useState<Record<number, number>>(initialSelections);
    const handleSelectOption = (optionId: number, valueId: number) => {
        setSelectedOptions((prev) => (prev[optionId] === valueId ? prev : { ...prev, [optionId]: valueId }));
    };

    const averageRating = useMemo(() => {
        if (reviews.length === 0) return 0;
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        return totalRating / reviews.length;
    }, [reviews]);

    return (
        <BaseLayout>
            <Head title={`${product.brand.name} ${product.name}`} />

            <div className="container mx-auto">
                {product.category && (
                    <nav className="mx-auto mb-5 max-w-7xl">
                        <ProductBreadcrumb
                            category={{ name: product.category.name, slug: product.category.slug }}
                            product={{ product: product.name, brand: product.brand.name }}
                        />
                    </nav>
                )}

                <div className="mx-auto mb-4 grid max-w-7xl gap-6 lg:grid-cols-2">
                    <div className="space-y-4">
                        <div className="relative aspect-square overflow-hidden rounded-md border bg-card">
                            <img
                                src={getStorageUrl(imageToShow?.url)}
                                alt={imageToShow?.alt_text || product.name}
                                className="size-full object-cover"
                            />
                            {product.isNew && (
                                <Badge className="absolute top-4 left-4 rounded-sm bg-orange-400/90 text-primary-foreground">Nouveau</Badge>
                            )}
                        </div>

                        <div className="grid grid-cols-4 gap-2">
                            {product.images?.map((image) => (
                                <div
                                    key={image.id}
                                    className="flex aspect-16/11 items-center justify-center overflow-hidden rounded-md border bg-card"
                                >
                                    <img
                                        src={getStorageUrl(image.url)}
                                        alt={image.alt_text}
                                        className="size-full object-cover"
                                        onClick={() => setImageToShow(image)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-muted-foreground">{product.brand.name}</p>
                            <h1 className="text-3xl font-bold text-foreground">{product.name}</h1>
                            {swell.review.enabled && (
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                className={`size-4 ${
                                                    averageRating === 0
                                                        ? 'fill-primary text-primary'
                                                        : averageRating >= star
                                                          ? 'fill-primary text-primary'
                                                          : 'text-primary'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-sm text-muted-foreground">({reviews.length} avis)</span>
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-start gap-2">
                                {product.discount_price ? (
                                    <>
                                        <span className="block text-3xl font-bold text-foreground">{product.discount_price.toFixed(2)} €</span>
                                        <span className="text-muted-foreground line-through">{product.price.toFixed(2)} €</span>
                                    </>
                                ) : (
                                    <span className="block text-3xl font-bold text-foreground">{product.price.toFixed(2)} €</span>
                                )}
                            </div>
                            <p className="text-sm text-muted-foreground">TVA incluse, frais de port calculés à la caisse</p>
                        </div>

                        <div className="flex items-center gap-2">
                            <div
                                className={cn(
                                    'h-2 w-2 rounded-full',
                                    product.stock === 0 ? 'bg-red-500' : product.stock < 11 ? 'bg-orange-500' : 'bg-green-500',
                                )}
                            ></div>
                            <span className="text-sm text-foreground">
                                {product.stock === 0 ? 'Indisponible' : product.stock < 11 ? `Reste ${product.stock}` : 'En stock'}
                            </span>
                        </div>

                        <div className="space-y-2">
                            <h3 className="font-semibold text-foreground">Description</h3>
                            <p className="leading-relaxed text-muted-foreground">{product.description}</p>
                        </div>

                        {product.collection && product.collection.products.length > 1 && (
                            <div className="space-y-4">
                                <h3 className="font-semibold text-foreground">Produits associés</h3>
                                <div className="grid max-h-120 gap-3 overflow-y-auto pr-2">
                                    {product.collection.products.map((relatedProduct) => (
                                        <RelatedProduct key={relatedProduct.id} product={relatedProduct} currentProductId={product.id} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {product.options && product.options.length > 0 && (
                            <div className="space-y-3">
                                <h3 className="font-semibold text-foreground">Variantes</h3>
                                <div className="space-y-4">
                                    {product.options.map((option) => (
                                        <div key={option.id} className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm text-muted-foreground">{option.name}</p>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {option.values?.length ? (
                                                    option.values.map((val) => {
                                                        const selected = selectedOptions[option.id] === val.id;
                                                        return (
                                                            <Button
                                                                key={val.id}
                                                                size="sm"
                                                                variant={selected ? 'default' : 'outline'}
                                                                className={cn('rounded-sm', !selected && 'border bg-background text-foreground')}
                                                                type="button"
                                                                onClick={() => handleSelectOption(option.id, val.id)}
                                                            >
                                                                {val.value}
                                                            </Button>
                                                        );
                                                    })
                                                ) : (
                                                    <span className="text-xs text-muted-foreground">Aucune valeur disponible</span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    Sélection:{' '}
                                    {product.options.map((o, idx) => {
                                        const valId = selectedOptions[o.id];
                                        const label = o.values?.find((v) => v.id === valId)?.value ?? '—';
                                        return (
                                            <span key={o.id}>
                                                {o.name}: {label}
                                                {idx < (product.options?.length ?? 0) - 1 ? ' · ' : ''}
                                            </span>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        <Separator />

                        <div className="space-y-4">
                            <div className="flex gap-3">
                                <Button
                                    size="lg"
                                    className="flex-1"
                                    onClick={() => addToCart(product, selectedOptions as unknown as Record<number, number>)}
                                >
                                    <ShoppingCart className="mr-2 h-4 w-4" />
                                    Ajouter au panier
                                </Button>
                                {swell.wishlist.enabled && (
                                    <Button
                                        size="lg"
                                        variant="outline"
                                        className="border bg-background text-foreground"
                                        onClick={() => addItem(product)}
                                    >
                                        <Heart className="size-4" />
                                    </Button>
                                )}
                            </div>

                            <Button
                                variant="outline"
                                size="lg"
                                className="w-full border bg-background text-foreground"
                                onClick={() => buyNow(product)}
                            >
                                Acheter maintenant
                            </Button>
                        </div>

                        <Separator />

                        <div className="space-y-4">
                            <div className="grid gap-3">
                                <div className="flex items-center gap-3 text-sm">
                                    <Truck className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-foreground">Livraison gratuite dès 50€</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <Shield className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-foreground">Garantie 2 ans</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <RotateCcw className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-foreground">Retour gratuit sous 30 jours</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {swell.review.enabled && (
                    <WhenVisible data="reviews" fallback={<ReviewSectionFallback />}>
                        <ReviewProvider productId={product.id} reviews={reviews}>
                            <ReviewSection />
                        </ReviewProvider>
                    </WhenVisible>
                )}

                {similarProducts.length > 0 && (
                    <WhenVisible data="similarProducts" fallback={<RelatedProductFallback />}>
                        <div className="mx-auto mt-12 mb-16 max-w-7xl">
                            <h2 className="mb-6 text-2xl font-bold">Produits similaires</h2>

                            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                                {similarProducts &&
                                    similarProducts.map((product) => (
                                        <ProductCard key={product.id} onQuickView={() => setQuickViewProduct(product)} product={product} />
                                    ))}
                            </div>
                        </div>
                    </WhenVisible>
                )}

                <ProductQuickViewDialog product={quickViewProduct} open={!!quickViewProduct} onClose={() => setQuickViewProduct(null)} />
            </div>
        </BaseLayout>
    );
}

function RelatedProduct({ product, currentProductId }: { product: Product; currentProductId: number }) {
    const current = product.id === currentProductId;

    return (
        <article className={cn('rounded-md border bg-card px-4 py-2', !current ? 'transition-colors hover:bg-secondary/10' : 'border-ring')}>
            <div className="flex items-center gap-4">
                <div className="relative h-16 w-16 overflow-hidden rounded-sm">
                    <img
                        src={getStorageUrl(product.featured_image?.url)}
                        alt={product.featured_image?.alt_text}
                        className="size-full bg-muted object-cover"
                    />{' '}
                </div>
                <div className="flex-1">
                    <div className="mb-1 flex items-center gap-2">
                        {current ? (
                            <h4 className="font-medium text-foreground">{product.name}</h4>
                        ) : (
                            <Link prefetch href={route('product.show', product.slug)} className="font-medium text-foreground hover:underline">
                                {product.name}
                            </Link>
                        )}
                        {current && (
                            <Badge variant="secondary" className="rounded-sm text-xs">
                                Actuel
                            </Badge>
                        )}
                    </div>
                    <p className="mb-2 text-sm text-muted-foreground">{product.short_description}</p>
                    <div className="flex items-center justify-between">
                        {product.discount_price != null ? (
                            <div className="flex items-baseline gap-2">
                                <span className="font-semibold text-foreground">{product.discount_price.toFixed(2)} €</span>
                                <span className="mb-auto text-sm text-muted-foreground line-through">{product.price.toFixed(2)} €</span>
                            </div>
                        ) : (
                            <span className="font-semibold text-foreground">{product.price.toFixed(2)} €</span>
                        )}

                        <Badge
                            className={cn('rounded-sm', product.stock === 0 ? 'bg-red-500' : product.stock < 11 ? 'bg-orange-500' : 'bg-green-500')}
                        >
                            {product.stock === 0 ? 'Indisponible' : product.stock < 11 ? `Reste ${product.stock}` : 'En stock'}
                        </Badge>
                    </div>
                </div>
            </div>
        </article>
    );
}

function RelatedProductFallback() {
    return (
        <div className="mx-auto my-16 max-w-7xl">
            <h2 className="mb-6 text-2xl font-bold">Produits similaires</h2>

            <div className="grid grid-cols-4 gap-3">
                <Skeleton className="h-95" />
                <Skeleton className="h-95" />
                <Skeleton className="h-95" />
                <Skeleton className="h-95" />
            </div>
        </div>
    );
}

function ReviewSectionFallback() {
    return (
        <div className="mx-auto my-16 max-w-7xl space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-bold text-foreground">Avis clients</h2>
                </div>
            </div>

            <Card className="max-sm:py-4">
                <CardContent className="px-6 max-sm:px-4">
                    <div className="grid gap-8 md:grid-cols-2">
                        <div className="flex flex-col items-center justify-center">
                            <div className="mb-2 text-4xl font-bold text-foreground">
                                <Loader2 className="animate-spin" />
                            </div>
                            <div className="mb-2 flex items-center justify-center gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star key={star} className="size-5 fill-primary text-primary" />
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            {[1, 2, 3, 4, 5].map((rating) => (
                                <div key={rating} className="flex items-center gap-3">
                                    <div className="flex w-12 items-center gap-1">
                                        <span className="text-sm text-foreground">{rating}</span>
                                        <Star className="h-3 w-3 fill-primary text-primary" />
                                    </div>
                                    <div className="h-2 flex-1 rounded-full bg-muted">
                                        <div className="h-2 w-full rounded-full bg-primary transition-all duration-300" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
