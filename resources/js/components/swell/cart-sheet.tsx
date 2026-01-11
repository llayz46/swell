import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useCartContext } from '@/contexts/cart-context';
import { useConfirmContext } from '@/contexts/confirm-context';
import { CartItem } from '@/types';
import { useStorageUrl } from '@/utils/format-storage-url';
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';

export function CartSheet() {
    const { handleQuantity, clearCart, optimisticCart, removeItemOfCart, checkout } = useCartContext();
    const { confirm } = useConfirmContext();

    const handleClearCart = async () => {
        await confirm({
            title: 'Confirmation de la suppression du panier',
            description:
                'Êtes-vous sûr de vouloir vider votre panier ? Cette action est irréversible et supprimera tous les articles de votre panier.',
            confirmText: 'Vider le panier',
            cancelText: 'Annuler',
            variant: 'destructive',
            icon: <Trash2 className="size-4" />,
            onConfirm: clearCart,
        });
    };

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                    <ShoppingBag size={20} />
                </Button>
            </SheetTrigger>
            <SheetContent className="sm:max-w-md">
                <SheetHeader>
                    <SheetTitle>Mon panier</SheetTitle>
                    <SheetDescription>Gérer les articles dans votre panier, modifier les quantités ou supprimer des articles.</SheetDescription>
                </SheetHeader>

                {optimisticCart && optimisticCart.items?.length > 0 && (
                    <div className="flex items-center justify-between border-b px-4 pb-3">
                        <span className="text-sm text-muted-foreground">
                            {optimisticCart.items.length} {optimisticCart.items.length > 1 ? 'articles' : 'article'}
                        </span>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 gap-2 text-muted-foreground hover:text-destructive"
                            onClick={handleClearCart}
                        >
                            <Trash2 className="size-4" />
                            <span>Vider le panier</span>
                        </Button>
                    </div>
                )}

                <div className="grid flex-1 auto-rows-min gap-4 px-4">
                    {!optimisticCart?.items.length ? (
                        <div className="text-center text-muted-foreground">Votre panier est vide.</div>
                    ) : (
                        optimisticCart.items.map((item) => (
                            <CardItem key={item.id} item={item} removeItemOfCart={removeItemOfCart} handleQuantity={handleQuantity} />
                        ))
                    )}
                </div>

                <div className="flex justify-between border-t px-4 pt-4 font-medium">
                    <span>Total</span>
                    <span>{optimisticCart?.total.toFixed(2)} €</span>
                </div>

                <SheetFooter className="flex-row-reverse justify-between">
                    <Button type="submit" onClick={checkout}>
                        Passer à la caisse
                    </Button>
                    <SheetClose asChild>
                        <Button variant="outline">Fermer</Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}

function CardItem({
    item,
    removeItemOfCart,
    handleQuantity,
}: {
    item: CartItem;
    removeItemOfCart: (itemId: number) => void;
    handleQuantity: (type: 'inc' | 'dec', itemId: number) => void;
}) {
    const getStorageUrl = useStorageUrl();

    return (
        <Card className="relative overflow-hidden py-0">
            <CardContent className="p-3">
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-3 right-3 z-10 size-6 text-muted-foreground hover:text-destructive"
                    onClick={() => removeItemOfCart(item.id)}
                >
                    <Trash2 className="size-3" />
                </Button>

                <div className="relative flex items-start gap-4 pr-8">
                    <div className="relative size-18 shrink-0 overflow-hidden rounded-sm border border-slate-light-alpha bg-slate-light">
                        {item.product.image && (
                            <img src={getStorageUrl(item.product.image.url)} alt={item.product.image.alt_text} className="size-full object-cover" />
                        )}
                    </div>

                    <div className="flex h-18 min-w-0 flex-col">
                        <h3 className="line-clamp-2 leading-5 font-medium text-foreground">
                            {item.product.brand.name} {item.product.name}
                        </h3>
                        {item.options && item.options.length > 0 && (
                            <div className="my-1 text-xs text-muted-foreground">
                                {item.options.map((o, idx) => (
                                    <span key={`${o.option_id}-${o.option_value_id}`}>
                                        {o.option_name}: {o.option_value_name}
                                        {idx < item.options.length - 1 ? ' · ' : ''}
                                    </span>
                                ))}
                            </div>
                        )}
                        <p className="mt-auto text-sm font-semibold text-foreground">{item.product.price.toFixed(2)} €</p>
                    </div>

                    <div className="absolute right-0 bottom-0 flex items-center gap-1">
                        <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => handleQuantity('dec', item.id)}>
                            <Minus className="size-3" />
                        </Button>
                        <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                        <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => handleQuantity('inc', item.id)}>
                            <Plus className="size-3" />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
