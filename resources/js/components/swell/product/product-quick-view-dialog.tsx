import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useCartContext } from '@/contexts/cart-context';
import { Product } from '@/types';
import { getStorageUrl } from '@/utils/format-storage-url';

export function ProductQuickViewDialog({ product, open, onClose }: { product: Product | null; open: boolean; onClose: () => void }) {
    const { addToCart } = useCartContext();

    if (!product) return null;

    return (
        <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="shadow-dialog flex !max-w-3xl gap-5 rounded-2xl border-transparent p-5">
                {product.featured_image ? (
                    <img
                        className="block aspect-square h-72 rounded-md border border-slate-light-alpha object-cover"
                        src={getStorageUrl(product.featured_image.url)}
                        alt={product.featured_image.alt_text}
                    />
                ) : (
                    <span className="block aspect-square h-72 rounded-md border border-slate-light-alpha bg-slate-light"></span>
                )}

                <DialogHeader className="gap-4">
                    <DialogTitle className="mr-4">
                        {product.brand.name} {product.name}
                    </DialogTitle>

                    {product.discount_price != null ? (
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-primary">{product.discount_price.toFixed(2)} €</span>
                            <span className="mb-auto text-base text-muted-foreground line-through">{product.price.toFixed(2)} €</span>
                        </div>
                    ) : (
                        <span className="text-2xl font-bold text-primary">{product.price.toFixed(2)} €</span>
                    )}

                    <DialogDescription>{product.short_description}</DialogDescription>

                    <Button className="mt-auto w-full rounded-md" size="lg" onClick={() => addToCart(product)}>
                        Ajouter au panier
                    </Button>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}
