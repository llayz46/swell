import { useEffect, useState } from 'react';
import axios from 'axios';
import { Page } from '@inertiajs/core'
import { Cart, CartItem, Product, ProductOption, ProductOptionValue } from '@/types';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';
import { ShoppingCart } from 'lucide-react';

function optionsKey(options?: CartItem['options'] | undefined) {
    if (!options || options.length === 0) return '';
    const pairs = options.map(o => [o.option_id, o.option_value_id] as const).sort((a, b) => a[0] - b[0]);
    return pairs.map(([k, v]) => `${k}:${v}`).join('|');
}

function fillOptionLabels(items: CartItem[]): CartItem[] {
    return (items || []).map((item) => {
        if (!item.options || item.options.length === 0) return item;
        const productOptions: ProductOption[] = item.product.options || [];
        const enriched = item.options.map(o => {
            const opt = productOptions.find(po => po.id === o.option_id);
            const optName = opt?.name || o.option_name || '';
            const valName = opt?.values?.find((v: ProductOptionValue) => v.id === o.option_value_id)?.value || o.option_value_name || '';
            return { ...o, option_name: optName, option_value_name: valName };
        });
        return { ...item, options: enriched } as CartItem;
    });
}

export function useCart({ initialCart }: { initialCart?: Cart | null } = {}) {
    const [optimisticCart, setOptimisticCart] = useState<Cart | null>(initialCart || null);
    const [loading, setLoading] = useState(!initialCart);

    useEffect(() => {
        if (initialCart) {
            setOptimisticCart({ ...initialCart, items: fillOptionLabels(initialCart.items) });
        } else {
            fetchCart();
        }
    }, [initialCart]);

    const fetchCart = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get('/cart');
            setOptimisticCart({ ...data.cart, items: fillOptionLabels(data.cart.items) });
        } catch (error) {
            console.error('Erreur fetch cart:', error);
        } finally {
            setLoading(false);
        }
    };

    const addToCart = (product: Product, selectedOptions?: Record<number, number>, quantity: number = 1) => {
        if (!optimisticCart) return;

        const productHasOptions = (product.options?.length ?? 0) > 0;
        const options = Object.entries((selectedOptions ?? {}) as Record<string, number>).map(([optionId, optionValueId]) => ({
            option_id: Number(optionId),
            option_name: product.options?.find(opt => opt.id === Number(optionId))?.name || '',
            option_value_id: optionValueId,
            option_value_name: product.options?.find(opt => opt.id === Number(optionId))?.values?.find(val => val.id === optionValueId)?.value || '',
        }));

        if (productHasOptions) {
            const expected = product.options!.length;
            if (options.length !== expected) {
                toast.error('Veuillez sélectionner toutes les options du produit.');
                return;
            }
        }

        const incomingKey = optionsKey(options);
        const existingItem = optimisticCart.items?.find(item => item.product.id === product.id && optionsKey(item.options) === incomingKey);

        let updatedItems: CartItem[] = [];
        if (existingItem) {
            updatedItems = optimisticCart.items.map(item =>
                item.id === existingItem.id
                    ? { ...item, quantity: item.quantity + quantity }
                    : item
            );
        } else {
            const newItem: CartItem = {
                id: Date.now(),
                cart_id: optimisticCart.id,
                product_id: product.id,
                product,
                options,
                quantity,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            } as CartItem;
            updatedItems = [...(optimisticCart.items || []), newItem];
        }

        setOptimisticCart(prev => ({ ...prev!, items: updatedItems }));

        const payload: { product_id: number; quantity: number; options?: CartItem['options'] } = { product_id: product.id, quantity };
        if (options.length > 0) payload.options = options;

        router.post(
            route('cart.add'),
            payload,
            {
                preserveScroll: true,
                onSuccess: (page) => {
                    const serverCart = (page as Page<{ cart: Cart }>).props.cart;
                    setOptimisticCart({ ...serverCart, items: fillOptionLabels(serverCart.items) });

                    toast.success('Produit ajouté au panier', {
                        description: product.brand.name + ' ' + product.name + ' a été ajouté à votre panier.',
                        icon: <ShoppingCart className="size-4" />,
                    });
                },
                onError: (errors) => {
                    fetchCart();

                    const err = errors as Record<string, string | undefined>;
                    toast.error('Erreur lors de l\'ajout au panier', {
                        description: err.product_id,
                        icon: <ShoppingCart className="size-4" />,
                    });
                },
            }
        );
    };

    const removeItemOfCart = (itemId: number) => {
        if (!optimisticCart) return;

        const cart = optimisticCart;
        const target = optimisticCart.items.find(i => i.id === itemId);
        if (!target) return;

        const updatedItems = optimisticCart.items?.filter(item => item.id !== itemId)
        const total = updatedItems?.reduce((sum, item) => sum + (item.product.price * item.quantity), 0) || 0;

        setOptimisticCart(prev => ({ ...prev!, items: updatedItems, total }));

        router.post(
            route('cart.item.remove'),
            { item_id: itemId },
            {
                preserveScroll: true,
                onSuccess: (page) => {
                    const serverCart = (page as Page<{ cart: Cart }>).props.cart;
                    setOptimisticCart({ ...serverCart, items: fillOptionLabels(serverCart.items) });
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
                    const serverCart = (page as Page<{ cart: Cart }>).props.cart;
                    setOptimisticCart({ ...serverCart, items: fillOptionLabels(serverCart.items) });
                },
                onError: () => {
                    setOptimisticCart(cart);
                },
            }
        );
    };

    const handleQuantity = (type: "inc" | "dec", itemId: number) => {
        if (!optimisticCart) return;

        const cart = optimisticCart;
        const existingItem = optimisticCart.items?.find(item => item.id === itemId);
        if (!existingItem) return;

        if(type === "inc") {
            const updatedItems = optimisticCart.items?.map(item =>
                item.id === itemId
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            ) as CartItem[];

            setOptimisticCart(prev => ({ ...prev!, items: updatedItems, total: (updatedItems || []).reduce((sum, item) => sum + (item.product.price * item.quantity), 0) }));

            router.put(
                route('cart.item.update'),
                {
                    item_id: itemId,
                    action: "increase",
                },
                {
                    preserveScroll: true,
                    onSuccess: (page) => {
                        const serverCart = (page as Page<{ cart: Cart }>).props.cart;
                        setOptimisticCart({ ...serverCart, items: fillOptionLabels(serverCart.items) });
                    },
                    onError: () => {
                        setOptimisticCart(cart);
                    },
                }
            );
        } else if(type === "dec") {
            if (existingItem.quantity > 1) {
                const updatedItems = optimisticCart.items?.map(item =>
                    item.id === itemId
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                ) as CartItem[];

                setOptimisticCart(prev => ({ ...prev!, items: updatedItems, total: (updatedItems || []).reduce((sum, item) => sum + (item.product.price * item.quantity), 0) }));

                router.put(
                    route('cart.item.update'),
                    {
                        item_id: itemId,
                        action: "decrease",
                    },
                    {
                        preserveScroll: true,
                        onSuccess: (page) => {
                            const serverCart = (page as Page<{ cart: Cart }>).props.cart;
                            setOptimisticCart({ ...serverCart, items: fillOptionLabels(serverCart.items) });
                        },
                        onError: () => {
                            setOptimisticCart(cart);
                        },
                    }
                );
            } else {
                removeItemOfCart(existingItem.id);
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
