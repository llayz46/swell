import { createContext, useContext, ReactNode } from 'react';
import { useWishlist } from '@/hooks/use-wishlist';
import { Product, WishlistType } from '@/types';

type WishlistContextType = {
    addItem: (product: Product) => void;
    removeItem: (product: Product, [wishlist, setWishlist]: WishlistType) => void;
    removeItems: ([wishlist, setWishlist]: WishlistType) => void;
    addItems: (addToCart: (product: Product, quantity?: number) => void, wishlist: Product[]) => void;
};

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

type WishlistProviderProps = {
    children: ReactNode;
};

export function WishlistProvider({ children }: WishlistProviderProps) {
    const {
        addItem,
        removeItem,
        removeItems,
        addItems
    } = useWishlist();

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
