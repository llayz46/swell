import { useEffect, useState } from 'react';
import axios from 'axios';
import { Page } from '@inertiajs/core'
import { Cart, CartItem, Product } from '@/types';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';
import { ShoppingCart } from 'lucide-react';

export function useCart({ initialCart }: { initialCart?: Cart | null } = {}) {
    const [optimisticCart, setOptimisticCart] = useState<Cart | null>(initialCart || null);
    const [loading, setLoading] = useState(!initialCart);

    useEffect(() => {
        if (initialCart) {
            setOptimisticCart(initialCart);
        } else {
            fetchCart();
        }
    }, []);

    const fetchCart = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get('/cart');
            setOptimisticCart(data.cart);
        } catch (error) {
            console.error('Erreur fetch cart:', error);
        } finally {
            setLoading(false);
        }
    };

    const addToCart = (product: Product, quantity: number = 1) => {
        if (!optimisticCart) return;

        const cart = optimisticCart;

        const existingItem = optimisticCart.items?.find(item => item.product.id === product.id);
        let updatedItems: CartItem[] = [];

        if (existingItem) {
            updatedItems = optimisticCart.items.map(item =>
                item.product.id === product.id
                    ? { ...item, quantity: item.quantity + quantity }
                    : item
            );
        } else {
            const newItem: CartItem = {
                id: Date.now(),
                cart_id: optimisticCart.id,
                product_id: product.id,
                product,
                quantity,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            };
            updatedItems = [...(optimisticCart.items || []), newItem];
        }

        setOptimisticCart(prev => ({ ...prev!, items: updatedItems }));

        router.post(
            route('cart.add'),
            { product_id: product.id, quantity },
            {
                preserveScroll: true,
                onSuccess: (page) => {
                    const cart = (page as Page<{ cart: Cart }>).props.cart;
                    setOptimisticCart(cart);

                    toast.success('Produit ajouté au panier', {
                        description: product.brand.name + ' ' + product.name + ' a été ajouté à votre panier.',
                        icon: <ShoppingCart className="size-4" />,
                    });
                },
                onError: (errors) => {
                    setOptimisticCart(cart);

                    toast.error('Erreur lors de l\'ajout au panier', {
                        description: errors.product_id,
                        icon: <ShoppingCart className="size-4" />,
                    });
                },
            }
        );
    };

    const removeItemOfCart = (productId: number) => {
        if (!optimisticCart) return;

        const cart = optimisticCart;

        const updatedItems = optimisticCart.items?.filter(item => item.product.id !== productId)
        const total = updatedItems?.reduce((sum, item) => sum + (item.product.price * item.quantity), 0) || 0;

        setOptimisticCart(prev => ({ ...prev!, items: updatedItems, total }));

        router.post(
            route('cart.remove'),
            { product_id: productId },
            {
                preserveScroll: true,
                onSuccess: (page) => {
                    const cart = (page as Page<{ cart: Cart }>).props.cart;
                    setOptimisticCart(cart);
                },
                onError: () => {
                    setOptimisticCart(cart);
                },
            }
        )
    };

    const clearCart = () => {
        if (!optimisticCart) return;

        const cart = optimisticCart;

        setOptimisticCart({ ...cart, items: [], total: 0 });

        router.post(
            route('cart.clear', optimisticCart.id),
            {},
            {
                preserveScroll: true,
                onSuccess: (page) => {
                    const cart = (page as Page<{ cart: Cart }>).props.cart;
                    setOptimisticCart(cart);
                },
                onError: () => {
                    setOptimisticCart(cart);
                },
            }
        );
    };

    const handleQuantity = (type: "inc" | "dec", productId: number) => {
        if (!optimisticCart) return;

        const cart = optimisticCart;

        const existingItem = optimisticCart.items?.find(item => item.product.id === productId);

        if (!existingItem) return;

        if(type === "inc") {
            const updatedItems = optimisticCart.items?.map(item =>
                item.product.id === productId
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            );

            setOptimisticCart(prev => ({ ...prev!, items: updatedItems, total: (updatedItems || []).reduce((sum, item) => sum + (item.product.price * item.quantity), 0) }));

            router.put(
                route('cart.update'),
                {
                    product_id: productId,
                    action: "increase",
                },
                {
                    preserveScroll: true,
                    onSuccess: (page) => {
                        const cart = (page as Page<{ cart: Cart }>).props.cart;
                        setOptimisticCart(cart);
                    },
                    onError: () => {
                        setOptimisticCart(cart);
                    },
                }
            );
        } else if(type === "dec") {
            if (existingItem.quantity > 1) {
                const updatedItems = optimisticCart.items?.map(item =>
                    item.product.id === productId
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                );

                setOptimisticCart(prev => ({ ...prev!, items: updatedItems, total: (updatedItems || []).reduce((sum, item) => sum + (item.product.price * item.quantity), 0) }));

                router.put(
                    route('cart.update'),
                    {
                        product_id: productId,
                        action: "decrease",
                    },
                    {
                        preserveScroll: true,
                        onSuccess: (page) => {
                            const cart = (page as Page<{ cart: Cart }>).props.cart;
                            setOptimisticCart(cart);
                        },
                        onError: () => {
                            setOptimisticCart(cart);
                        },
                    }
                );
            } else {
                removeItemOfCart(existingItem.product.id);
            }
        }
    }

    const checkout = () => {
        router.get(
            route('cart.checkout'),
            {},
            {
                preserveScroll: true,
            }
        )
    }

    const buyNow = (product: Product) => {
        router.get(
            route('cart.buy', product.id),
            {},
            {
                preserveScroll: true,
            }
        )
    }

    return {
        optimisticCart,
        loading,
        addToCart,
        removeItemOfCart,
        clearCart,
        handleQuantity,
        checkout,
        buyNow
    };
}
