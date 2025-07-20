import {
    Sheet, SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useCartContext } from '@/contexts/cart-context';
import { Card, CardContent } from '@/components/ui/card';
import { CartItem } from '@/types';
import { CartClearConfirmationDialog } from '@/components/cart-clear-confirmation-dialog';
import { useState } from 'react';
import { getStorageUrl } from '@/utils/format-storage-url';

export function CartSheet() {
    const { handleQuantity, clearCart, optimisticCart, removeItemOfCart, checkout } = useCartContext();
    const [clearConfirmationModal, setClearConfirmationModal] = useState<boolean>(false);

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

                <div className="grid flex-1 auto-rows-min gap-4 px-4">
                    {(optimisticCart && optimisticCart.items?.length > 0) && (
                        <Button variant="destructive" className="cursor-pointer" onClick={() => setClearConfirmationModal(true)}>
                            Vider le panier
                        </Button>
                    )}

                    {!optimisticCart?.items.length ? (
                        <div className="text-center text-muted-foreground">Votre panier est vide.</div>
                    ) : (
                        optimisticCart.items.map(item => (
                            <CardItem
                                key={item.id}
                                item={item}
                                removeItemOfCart={removeItemOfCart}
                                handleQuantity={handleQuantity}
                            />
                        ))
                    )}
                </div>

                <div className="px-4 flex justify-between font-medium">
                    <span>Total</span>
                    <span>{optimisticCart?.total.toFixed(2)} €</span>
                </div>

                <SheetFooter className="flex-row-reverse justify-between">
                    <Button type="submit" onClick={checkout}>Passer à la caisse</Button>
                    <SheetClose asChild>
                        <Button variant="outline">Fermer</Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>

            <CartClearConfirmationDialog
                open={clearConfirmationModal}
                onClose={() => setClearConfirmationModal(false)}
                clearCart={clearCart}
            />
        </Sheet>
    );
}

function CardItem ({ item, removeItemOfCart, handleQuantity }: { item: CartItem, removeItemOfCart: (productId: number) => void, handleQuantity: (type: "inc" | "dec", productId: number) => void }) {
    return (
        <Card className="relative overflow-hidden py-0">
            <CardContent className="p-3">
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-3 right-3 z-10 size-6 text-muted-foreground hover:text-destructive"
                    onClick={() => removeItemOfCart(item.product.id)}
                >
                    <Trash2 className="h-3 w-3" />
                </Button>

                <div className="relative flex items-start gap-4 pr-8">
                    <div className="relative size-18 flex-shrink-0 overflow-hidden rounded-sm bg-muted">
                        {item.product.image && (
                            <img src={getStorageUrl(item.product.image.image_url)} alt={item.product.image.alt_text} className="size-full object-cover" />
                        )}
                    </div>

                    <div className="flex h-18 min-w-0 flex-col">
                        <h3 className="line-clamp-2 leading-5 font-medium text-foreground">{item.product.brand.name} {item.product.name}</h3>
                        <p className="mt-auto text-sm font-semibold text-foreground">{item.product.price.toFixed(2)} €</p>
                    </div>

                    <div className="absolute right-0 bottom-0 flex items-center gap-1">
                        <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => handleQuantity("dec", item.product.id)}>
                            <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                        <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => handleQuantity("inc", item.product.id)}>
                            <Plus className="h-3 w-3" />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
