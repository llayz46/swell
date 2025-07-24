import { createContext, useContext, ReactNode } from 'react';
import { useWishlist } from '@/hooks/use-wishlist';
import type { Product, WishlistType } from '@/types';

type WishlistContextType = {
    addItem: (product: Product) => void;
    removeItem: (product: Product, [wishlist, setWishlist]: WishlistType) => void;
    removeItems: ([wishlist, setWishlist]: WishlistType) => void;
    addItems: (addToCart: (product: Product, quantity?: number) => void, wishlist: Product[]) => void;
};

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

type WishlistProviderProps = {
    children: ReactNode;
    enabled?: boolean;
};

export function WishlistProvider({ children, enabled }: WishlistProviderProps) {
    const wishlistHook = useWishlist();
    const {
        addItem,
        removeItem,
        removeItems,
        addItems
    } = enabled
        ? wishlistHook
        : {
            addItem: () => {},
            removeItem: () => {},
            removeItems: () => {},
            addItems: () => {}
        };

    return (
        <WishlistContext.Provider value={{
            addItem,
            removeItem,
            removeItems,
            addItems
        }}>
            {children}
        </WishlistContext.Provider>
    );
}

export const useWishlistContext = () => {
    const context = useContext(WishlistContext);

    if (!context) {
        throw new Error('useWishlistContext doit être utilisé dans un WishlistProvider');
    }

    return context;
};
