import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { useCartContext } from '@/contexts/cart-context';
import { getStorageUrl } from '@/utils/format-storage-url';

export function ProductQuickViewDialog({ product, open, onClose }: { product: Product | null, open: boolean, onClose: () => void }) {
    const { addToCart } = useCartContext();

    if (!product) return null;

    return (
        <Dialog open={open} onOpenChange={open => !open && onClose()}>
            <DialogContent className="flex gap-8 !max-w-3xl">
                {product.featured_image ? (
                    <img className="block h-72 object-cover aspect-square rounded-sm" src={getStorageUrl(product.featured_image.image_url)} alt={product.featured_image.alt_text} />
                ) : (
                    <span className="block h-72 aspect-square rounded-sm bg-muted"></span>
                )}

                <DialogHeader className="gap-4">
                    <DialogTitle className="mr-4">{product.brand.name} {product.name}</DialogTitle>

                    <span className="text-2xl font-bold text-primary">{product.discount_price ? product.discount_price.toFixed(2) : product.price.toFixed(2)} €</span>

                    <DialogDescription>
                        {product.short_description}
                    </DialogDescription>

                    <Button
                        className="mt-auto w-full rounded-sm"
                        size="lg"
                        onClick={() => addToCart(product)}
                    >
                        Ajouter au panier
                    </Button>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}
