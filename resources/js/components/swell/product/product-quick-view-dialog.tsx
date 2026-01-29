import { show } from '@/actions/App/Http/Controllers/ProductController';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PlaceholderImage } from '@/components/ui/placeholder-image';
import { useCartContext } from '@/contexts/cart-context';
import { useWishlist } from '@/hooks/use-wishlist';
import { Product, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function ProductQuickViewDialog({ product, open, onClose }: { product: Product | null; open: boolean; onClose: () => void }) {
    const { t } = useTranslation();
    const { swell } = usePage<SharedData>().props;
    const { addToCart } = useCartContext();
    const { addItem } = useWishlist();

    if (!product) return null;

    return (
        <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="shadow-dialog flex gap-5 rounded-2xl border-transparent p-5 max-sm:flex-col md:max-w-3xl">
                {product.featured_image?.url ? (
                    <img
                        className="block aspect-square h-72 rounded-md border border-slate-light-alpha object-cover"
                        src={product.featured_image.url}
                        alt={product.featured_image.alt_text}
                    />
                ) : (
                    <PlaceholderImage className="block aspect-square h-72 rounded-md border border-slate-light-alpha" />
                )}

                <DialogHeader className="gap-2 sm:gap-4">
                    <DialogTitle className="mr-4 hover:underline max-sm:text-left">
                        <Link href={show.url(product.slug)}>
                            {product.brand.name} {product.name}
                        </Link>
                    </DialogTitle>

                    {product.discount_price != null ? (
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-primary max-sm:text-left">{product.discount_price.toFixed(2)} €</span>
                            <span className="mb-auto text-base text-muted-foreground line-through max-sm:text-left">
                                {product.price.toFixed(2)} €
                            </span>
                        </div>
                    ) : (
                        <span className="text-2xl font-bold text-primary max-sm:text-left">{product.price.toFixed(2)} €</span>
                    )}

                    <DialogDescription className="max-sm:text-left">{product.short_description}</DialogDescription>

                    {swell.wishlist.enabled ? (
                        <div className="mt-auto flex items-center justify-between gap-2">
                            <Button className="w-full rounded-md max-sm:h-9" size="lg" onClick={() => addToCart(product)}>
                                {t('product.add_to_cart')}
                            </Button>

                            <Button className="h-10 max-sm:h-9" variant="outline" onClick={() => addItem(product)}>
                                <Heart />
                            </Button>
                        </div>
                    ) : (
                        <Button className="mt-auto w-full rounded-md max-sm:h-9" size="lg" onClick={() => addToCart(product)}>
                            Ajouter au panier
                        </Button>
                    )}
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}
