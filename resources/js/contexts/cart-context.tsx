import { useCart } from '@/hooks/use-cart';
import { Cart, Product, OrderItems } from '@/types';
import { createContext, ReactNode, useContext } from 'react';

type CartContextType = {
    optimisticCart: Cart | null;
    loading: boolean;
    addToCart: (product: Product, selectedOptions?: Record<number, number>, quantity?: number) => void;
    removeItemOfCart: (itemId: number) => void;
    clearCart: () => void;
    handleQuantity: (type: 'inc' | 'dec', itemId: number) => void;
    checkout: () => void;
    buyNow: (products: Product | OrderItems[]) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

type CartProviderProps = {
    children: ReactNode;
    initialCart: Cart | null;
};

export function CartProvider({ children, initialCart }: CartProviderProps) {
    const { optimisticCart, loading, addToCart, removeItemOfCart, clearCart, handleQuantity, checkout, buyNow } = useCart({ initialCart });

    return (
        <CartContext.Provider
            value={{
                optimisticCart,
                loading,
                addToCart,
                removeItemOfCart,
                clearCart,
                handleQuantity,
                checkout,
                buyNow,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export const useCartContext = () => {
    const context = useContext(CartContext);

    if (!context) {
        throw new Error('useCartContext doit être utilisé dans un CartProvider');
    }

    return context;
};
