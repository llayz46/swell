import type { Product, ProductImage, ProductComment } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Heart, RotateCcw, Shield, ShoppingCart, Star, Truck } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Head, Link, WhenVisible } from '@inertiajs/react';
import BaseLayout from '@/layouts/base-layout';
import { useMemo, useState } from 'react';
import { useWishlist } from '@/hooks/use-wishlist';
import { show } from "@/actions/App/Http/Controllers/ProductController";
import { cn } from '@/lib/utils';
import { useCartContext } from '@/contexts/cart-context';
import { ProductCard } from '@/components/product-card';
import { ProductQuickViewDialog } from '@/components/product-quick-view-dialog';
import { ProductBreadcrumb } from '@/components/product-breadcrumb';
import { Skeleton } from '@/components/ui/skeleton';
import { getStorageUrl } from '@/utils/format-storage-url';
import { ProductCommentSection } from '@/components/product-comment-section';
import { ProductCommentProvider } from '@/contexts/product-comment-context';

interface ShowProductProps {
    product: Product;
    similarProducts: Product[];
    comments: ProductComment[];
}

export default function Show({ product, similarProducts, comments }: ShowProductProps) {
    const featuredImage: ProductImage | undefined = product.images?.find(image => image.is_featured) || product.images?.sort((a, b) => (a.order || 0) - (b.order || 0))[0];
    const [imageToShow, setImageToShow] = useState<ProductImage | undefined>(featuredImage || product.images?.[0]);
    const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
    const { addItem } = useWishlist();
    const { addToCart, buyNow } = useCartContext();

    const { url: baseUrl } = show(product.slug);

    const averageRating = useMemo(() => {
        if (comments.length === 0) return 0;
        const totalRating = comments.reduce((sum, comment) => sum + comment.rating, 0);
        return totalRating / comments.length;
    }, [comments]);

    return (
        <BaseLayout>
            <Head title={`${product.brand.name} ${product.name}`} />

            <div className="container mx-auto">
                {product.categories && (
                    <nav className="max-w-7xl mx-auto mb-5">
                        <ProductBreadcrumb category={{name: product.categories[0].name, slug: product.categories[0].slug }} product={{ product: product.name, brand: product.brand.name }} />
                    </nav>
                )}

                <WhenVisible data="product" always fallback={<ProductFallback />}>
                    <div className="grid lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
                        <div className="space-y-4">
                            <div className="border bg-card rounded-md overflow-hidden relative aspect-square">
                                <img
                                    src={getStorageUrl(imageToShow?.image_url)}
                                    alt={imageToShow?.alt_text || product.name}
                                    className="object-cover size-full"
                                />
                                {product.isNew && (
                                    <Badge className="rounded-sm absolute top-4 left-4 bg-orange-400/90 text-primary-foreground">Nouveau</Badge>
                                )}
                            </div>

                            <div className="grid grid-cols-4 gap-2">
                                {product.images?.map(image => (
                                    <div key={image.id} className="border bg-card rounded-md overflow-hidden aspect-[16/11] flex items-center justify-center">
                                        <img
                                            src={getStorageUrl(image.image_url)}
                                            alt={image.alt_text}
                                            className="object-cover size-full"
                                            onClick={() => setImageToShow(image)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <p className="text-sm text-muted-foreground font-medium">{product.brand.name}</p>
                                <h1 className="text-3xl font-bold text-foreground">{product.name}</h1>
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                className={`size-4 ${
                                                    averageRating === 0 ? 'fill-primary text-primary' : averageRating >= star ? 'fill-primary text-primary' : 'text-primary'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-sm text-muted-foreground">({comments.length} avis)</span>
                                </div>
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
                                <div className={cn("w-2 h-2 rounded-full", product.stock === 0 ? 'bg-red-500' : product.stock < 11 ? 'bg-orange-500' : 'bg-green-500')}></div>
                                <span className="text-sm text-foreground">
                                    {product.stock === 0 ? 'Indisponible' : product.stock < 11 ? `Reste ${product.stock}` : 'En stock'}
                                </span>
                            </div>

                            <div className="space-y-2">
                                <h3 className="font-semibold text-foreground">Description</h3>
                                <p className="text-muted-foreground leading-relaxed">{product.description}</p>
                            </div>

                            {(product.group && product.group.products.length > 1) && (
                                <div className="space-y-4">
                                    <h3 className="font-semibold text-foreground">Produits associés</h3>
                                    <div className="grid gap-3 max-h-120 overflow-y-auto pr-2">
                                        {product.group.products.map(relatedProduct => (
                                            <RelatedProduct key={relatedProduct.id} product={relatedProduct} current={baseUrl} />
                                        ))}
                                    </div>
                                </div>
                            )}

                            <Separator />

                            <div className="space-y-4">
                                <div className="flex gap-3">
                                    <Button size="lg" className="flex-1" onClick={() => addToCart(product)}>
                                        <ShoppingCart className="w-4 h-4 mr-2" />
                                        Ajouter au panier
                                    </Button>
                                    <Button size="lg" variant="outline" className="bg-background text-foreground border" onClick={() => addItem(product)}>
                                        <Heart className="size-4" />
                                    </Button>
                                </div>

                                <Button variant="outline" size="lg" className="w-full bg-background text-foreground border" onClick={() => buyNow(product)}>
                                    Acheter maintenant
                                </Button>
                            </div>

                            <Separator />

                            <div className="space-y-4">
                                <div className="grid gap-3">
                                    <div className="flex items-center gap-3 text-sm">
                                        <Truck className="w-4 h-4 text-muted-foreground" />
                                        <span className="text-foreground">Livraison gratuite dès 50€</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <Shield className="w-4 h-4 text-muted-foreground" />
                                        <span className="text-foreground">Garantie 2 ans</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <RotateCcw className="w-4 h-4 text-muted-foreground" />
                                        <span className="text-foreground">Retour gratuit sous 30 jours</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </WhenVisible>

                <ProductCommentProvider productId={product.id} comments={comments}>
                    <ProductCommentSection />
                </ProductCommentProvider>

                <WhenVisible data="similarProducts" fallback={<RelatedProductFallback />}>
                    <div className="my-16 max-w-7xl mx-auto">
                        <h2 className="text-2xl font-bold mb-6">Produits similaires</h2>

                        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                            {similarProducts.map(product => (
                                <ProductCard key={product.id} onQuickView={() => setQuickViewProduct(product)} product={product} />
                            ))}
                        </div>
                    </div>
                </WhenVisible>

                <ProductQuickViewDialog
                    product={quickViewProduct}
                    open={!!quickViewProduct}
                    onClose={() => setQuickViewProduct(null)}
                />
            </div>
        </BaseLayout>
    )
}

function RelatedProduct({ product, current }: { product: Product, current: string }) {
    const { url } = show(product.slug);

    return (
        <article className={cn("px-4 py-2 border bg-card rounded-md", url !== current ? 'hover:bg-secondary/10 transition-colors' : 'border-ring')}>
            <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-sm overflow-hidden">
                <img src={getStorageUrl(product.featured_image?.image_url)} alt={product.featured_image?.alt_text} className="size-full bg-muted object-cover" />                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        {url === current ? (
                            <h4 className="font-medium text-foreground">{product.name}</h4>
                        ) : (
                            <Link prefetch href={show(product.slug).url} className="hover:underline font-medium text-foreground">{product.name}</Link>
                        )}
                        {url === current && (
                            <Badge variant="secondary" className="rounded-sm text-xs">
                                Actuel
                            </Badge>
                        )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{product.short_description}</p>
                    <div className="flex items-center justify-between">
                        <span className="font-semibold text-foreground">{product.discount_price?.toFixed(2) ?? product.price.toFixed(2)} €</span>
                        <Badge className={cn('rounded-sm', product.stock === 0 ? 'bg-red-500' : product.stock < 11 ? 'bg-orange-500' : 'bg-green-500')}>
                            {product.stock === 0 ? 'Indisponible' : product.stock < 11 ? `Reste ${product.stock}` : 'En stock'}
                        </Badge>
                    </div>
                </div>
            </div>
        </article>
    )
}

function RelatedProductFallback() {
    return (
        <div className="my-16 max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Produits similaires</h2>

            <div className="grid grid-cols-4 gap-3">
                <Skeleton className="h-95" />
                <Skeleton className="h-95" />
                <Skeleton className="h-95" />
                <Skeleton className="h-95" />
            </div>
        </div>
    )
}

function ProductFallback() {
    return (
        <div className="grid lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
            <div className="space-y-4">
                <div className="border bg-card rounded-md overflow-hidden aspect-square">
                    <Skeleton className="size-full" />
                </div>

                <div className="grid grid-cols-4 gap-2">
                    <Skeleton className="h-28 w-full" />
                    <Skeleton className="h-28 w-full" />
                    <Skeleton className="h-28 w-full" />
                    <Skeleton className="h-28 w-full" />
                </div>
            </div>

            <div className="space-y-6">
                <div className="space-y-2">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-7 w-52" />
                    <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="w-4 h-4 fill-primary text-primary" />
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <Skeleton className="h-7 w-24" />
                    <p className="text-sm text-muted-foreground">TVA incluse, frais de port calculés à la caisse</p>
                </div>

                <div className="flex items-center gap-2 h-4">
                </div>

                <div className="space-y-2">
                    <h3 className="font-semibold text-foreground">Description</h3>
                    <div className="text-muted-foreground leading-relaxed space-y-2">
                        <Skeleton className="h-3" />
                        <Skeleton className="h-3 w-5/6" />
                        <Skeleton className="h-3 w-11/12" />
                        <Skeleton className="h-3 w-9/10" />
                        <Skeleton className="h-3 w-10/11" />
                        <Skeleton className="h-3 w-7/9" />
                    </div>
                </div>

                <Separator />

                <div className="space-y-4">
                    <div className="flex gap-3">
                        <Button size="lg" className="flex-1">
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            Ajouter au panier
                        </Button>
                        <Button size="lg" variant="outline" className="bg-background text-foreground border">
                            <Heart className="w-4 h-4" />
                        </Button>
                    </div>

                    <Button variant="outline" size="lg" className="w-full bg-background text-foreground border">
                        Acheter maintenant
                    </Button>
                </div>

                <Separator />

                <div className="space-y-4">
                    <div className="grid gap-3">
                        <div className="flex items-center gap-3 text-sm">
                            <Truck className="w-4 h-4 text-muted-foreground" />
                            <span className="text-foreground">Livraison gratuite dès 50€</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                            <Shield className="w-4 h-4 text-muted-foreground" />
                            <span className="text-foreground">Garantie 2 ans</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                            <RotateCcw className="w-4 h-4 text-muted-foreground" />
                            <span className="text-foreground">Retour gratuit sous 30 jours</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
