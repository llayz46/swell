import { Product, WishlistType } from '@/types';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';
import { Heart, ShoppingCart } from 'lucide-react';

export function useWishlist() {
    const addItem = (product: Product) => {
        router.post(
            route('wishlist.add'),
            { product_id: product.id },
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Produit ajouté à la wishlist', {
                        description: `${product.brand.name} ${product.name} a été ajouté à votre liste de souhaits.`,
                        icon: <Heart className="size-4" />,
                    })
                },
                onError: () => {
                    toast.error('Erreur lors de l\'ajout à la wishlist', {
                        description: `Impossible d'ajouter ${product.brand.name} ${product.name} à votre liste de souhaits.`,
                        icon: <Heart className="size-4" />,
                    });
                },
            }
        );
    }

    const removeItem = (product: Product, [wishlist, setWishlist]: WishlistType) => {
        setWishlist((prev) => prev.filter((item) => item.id !== product.id));

        router.post(
            route('wishlist.remove'),
            {
                product_id: product.id,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Produit retiré de la wishlist', {
                        description: `${product.brand.name} ${product.name} a été retiré de votre liste de souhaits.`,
                        icon: <Heart className="size-4" />,
                    })
                },
                onError: () => {
                    setWishlist(wishlist);
                },
            }
        );
    }

    const removeItems = ([wishlist, setWishlist]: WishlistType) => {
        setWishlist([]);

        router.post(
            route('wishlist.clear'),
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Wishlist entièrement supprimé', {
                        description: 'Tous les produits de votre wishlist ont été retirés.',
                        icon: <Heart className="size-4" />,
                    })
                },
                onError: () => {
                    setWishlist(wishlist);
                },
            }
        );
    }

    const addItems = async (addToCart: (product: Product, quantity?: number) => void, wishlist: Product[]) => {
        if (!wishlist || wishlist.length === 0) {
            toast.error('Votre wishlist est vide', {
                description: 'Ajoutez des produits à votre wishlist avant de les ajouter au panier.',
                icon: <ShoppingCart className="size-4" />,
            });
            return;
        }

        for (const product of wishlist) {
            await addToCart(product);
        }

        toast.success('Tous les produits ont été ajoutés au panier', {
            description: 'Tous les produits de votre wishlist ont été ajoutés au panier.',
            icon: <ShoppingCart className="size-4" />,
        });
    }

    return {
        addItem,
        removeItem,
        removeItems,
        addItems,
    }
}
