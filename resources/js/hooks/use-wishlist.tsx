import { destroy, store, update } from '@/actions/App/Modules/Wishlist/Http/Controllers/WishlistController';
import { Product, WishlistType } from '@/types';
import { router } from '@inertiajs/react';
import { sileo } from 'sileo';

export function useWishlist() {
    const addItem = (product: Product) => {
        router.post(
            store.url(),
            { product_id: product.id },
            {
                preserveScroll: true,
                onSuccess: () => {
                    sileo.success({ title: 'Produit ajouté à la wishlist', description: `${product.brand.name} ${product.name} a été ajouté à votre liste de souhaits.` });
                },
                onError: () => {
                    sileo.error({ title: "Erreur lors de l'ajout à la wishlist", description: `Impossible d'ajouter ${product.brand.name} ${product.name} à votre liste de souhaits.` });
                },
            },
        );
    };

    const removeItem = (product: Product, [wishlist, setWishlist]: WishlistType) => {
        setWishlist((prev) => prev.filter((item) => item.id !== product.id));

        router.post(
            update.url(),
            {
                product_id: product.id,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    sileo.success({ title: 'Produit retiré de la wishlist', description: `${product.brand.name} ${product.name} a été retiré de votre liste de souhaits.` });
                },
                onError: () => {
                    setWishlist(wishlist);
                },
            },
        );
    };

    const removeItems = ([wishlist, setWishlist]: WishlistType) => {
        setWishlist([]);

        router.post(
            destroy.url(),
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    sileo.success({ title: 'Wishlist entièrement supprimé', description: 'Tous les produits de votre wishlist ont été retirés.' });
                },
                onError: () => {
                    setWishlist(wishlist);
                },
            },
        );
    };

    const addItems = async (addToCart: (product: Product, quantity?: number) => void, wishlist: Product[]) => {
        if (!wishlist || wishlist.length === 0) {
            sileo.error({ title: 'Votre wishlist est vide', description: 'Ajoutez des produits à votre wishlist avant de les ajouter au panier.' });
            return;
        }

        for (const product of wishlist) {
            await addToCart(product);
        }

        sileo.success({ title: 'Tous les produits ont été ajoutés au panier', description: 'Tous les produits de votre wishlist ont été ajoutés au panier.' });
    };

    return {
        addItem,
        removeItem,
        removeItems,
        addItems,
    };
}
