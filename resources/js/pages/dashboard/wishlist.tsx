import { index, show } from '@/actions/App/Http/Controllers/ProductController';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { PlaceholderImage } from '@/components/ui/placeholder-image';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { useCartContext } from '@/contexts/cart-context';
import { useWishlistContext } from '@/contexts/wishlist-context';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Product } from '@/types';
import { Deferred, Head, Link } from '@inertiajs/react';
import { LoaderCircle, Plus, ShoppingCart, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function Wishlist({ items }: { items: Product[] }) {
    const { t } = useTranslation();
    const { addToCart } = useCartContext();
    const { removeItem, removeItems, addItems } = useWishlistContext();
    const [optimisticWishlist, setOptimisticWishlist] = useState<Product[]>([]);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('nav.dashboard'), href: '/dashboard' },
        { title: t('nav.wishlist'), href: '/wishlist' },
    ];

    useEffect(() => {
        if (items && items.length > 0) {
            setOptimisticWishlist(items);
        }
    }, [items]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('nav.wishlist')} />

            <Deferred data="items" fallback={<WishlistFallback />}>
                <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                    <div className="mb-2 flex items-center justify-between">
                        <h1 className="text-2xl font-bold">{t('wishlist.title')}</h1>
                        {optimisticWishlist && optimisticWishlist.length > 0 && (
                            <div className="flex items-center justify-center gap-2">
                                <Button variant="outline" onClick={() => addItems(addToCart, optimisticWishlist)}>
                                    <ShoppingCart className="size-4" />
                                    {t('wishlist.add_all_to_cart')}
                                </Button>

                                <Button variant="destructive" size="icon" onClick={() => removeItems([optimisticWishlist, setOptimisticWishlist])}>
                                    <Trash2 size={16} />
                                </Button>
                            </div>
                        )}
                    </div>

                    {optimisticWishlist && optimisticWishlist.length > 0 ? (
                        <div className="space-y-4">
                            {optimisticWishlist.map((product) => (
                                <WishlistItem
                                    key={product.id}
                                    product={product}
                                    onRemove={() => removeItem(product, [optimisticWishlist, setOptimisticWishlist])}
                                    onAddToCart={() => addToCart(product)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="relative min-h-[50vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border md:min-h-min">
                            <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-100/20" />
                            <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
                                <h3 className="mb-2 text-xl font-semibold">{t('wishlist.empty')}</h3>
                                <p className="mb-4 text-muted-foreground">{t('wishlist.empty_description')}</p>
                                <Link href={index.url()} className={buttonVariants()}>
                                    {t('common.discover_products')}
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </Deferred>
        </AppLayout>
    );
}

function WishlistItem({ product, onRemove, onAddToCart }: { product: Product; onRemove: () => void; onAddToCart: () => void }) {
    const { t } = useTranslation();

    return (
        <div className="flex items-center gap-4 rounded-md border p-3">
            <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-sm bg-neutral-700">
                {product.featured_image?.url ? (
                    <img
                        src={product.featured_image.url}
                        alt={product.featured_image.alt_text}
                        className="size-full object-cover"
                    />
                ) : (
                    <PlaceholderImage className="size-full" />
                )}
            </div>

            <div className="flex-grow">
                <div className="flex items-start justify-between">
                    <div>
                        <Link href={show.url(product.slug)} className="font-medium hover:underline">
                            {product.brand.name} {product.name}
                        </Link>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{product.short_description}</p>
                    </div>
                    <div className="flex min-w-32 flex-col items-end">
                        {product.discount_price ? (
                            <div className="flex items-center gap-2 *:text-nowrap">
                                <span className="text-sm text-gray-400 line-through">{product.price.toFixed(2)} €</span>
                                <span className="font-bold">{product.discount_price.toFixed(2)} €</span>
                            </div>
                        ) : (
                            <span className="font-bold">{product.price.toFixed(2)} €</span>
                        )}

                        <div className="mt-1 flex items-center">
                            <span
                                className={`mr-2 inline-block size-2 rounded-full ${product.stock === 0 ? 'bg-red-500' : product.stock < 11 ? 'bg-orange-500' : 'bg-green-500'}`}
                            />
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                {product.stock === 0 ? t('product.out_of_stock') : product.stock < 11 ? t('product.low_stock', { count: product.stock }) : t('product.in_stock')}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="mt-3 flex items-center justify-between">
                    {product.isNew && (
                        <Badge variant="secondary" className="rounded-sm bg-yellow-500 text-xs text-white dark:bg-yellow-700">
                            {t('product.new')}
                        </Badge>
                    )}
                    <div className="ml-auto flex items-center gap-2">
                        <Button variant="outline" size="sm" disabled={product.stock === 0} onClick={onAddToCart}>
                            <Plus className="size-3.5" /> {t('nav.cart')}
                        </Button>
                        <Button variant="destructive" size="icon" className="size-8" onClick={onRemove}>
                            <Trash2 className="size-3.5" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function WishlistFallback() {
    const { t } = useTranslation();

    return (
        <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
            <div className="mb-4 flex items-center justify-between">
                <h1 className="text-2xl font-bold">{t('wishlist.title')}</h1>

                <div className="flex items-center justify-center gap-2">
                    <Button variant="outline">
                        <ShoppingCart className="size-4" />
                        {t('wishlist.add_all_to_cart')}
                    </Button>

                    <Button variant="destructive" size="icon">
                        <Trash2 size={16} />
                    </Button>
                </div>
            </div>

            <LoaderCircle className="mx-auto animate-spin" size={48} />
        </div>
    );
}
