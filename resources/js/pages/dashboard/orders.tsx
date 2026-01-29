import { ProductQuickViewDialog } from '@/components/swell/product/product-quick-view-dialog';
import SearchInput from '@/components/swell/search-input';
import { Button } from '@/components/ui/button';
import { CardTitle, SwellCard, SwellCardContent, SwellCardHeader } from '@/components/ui/card';
import { PlaceholderImage } from '@/components/ui/placeholder-image';
import { Separator } from '@/components/ui/separator';
import { useCartContext } from '@/contexts/cart-context';
import { useConfirmContext } from '@/contexts/confirm-context';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Order, Product } from '@/types';
import { Head } from '@inertiajs/react';
import { RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function Orders({ orders }: { orders: Order[] }) {
    const { t } = useTranslation();
    const { confirm } = useConfirmContext();
    const { buyNow } = useCartContext();
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('nav.dashboard'),
            href: '/dashboard',
        },
        {
            title: t('nav.orders'),
            href: '/orders',
        },
    ];

    const filteredOrders = orders.filter((order) => {
        if (!searchTerm) return true;

        return order.order_number.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const handleReOrder = async (order: Order) => {
        const itemCount = order.items.reduce((total, item) => total + item.quantity, 0);
        const totalAmount = (order.amount_total / 100).toFixed(2);

        const confirmed = await confirm({
            title: t('orders.reorder_title', { number: order.order_number }),
            description: t('orders.reorder_description', { count: itemCount, amount: totalAmount }),
            confirmText: t('orders.reorder_confirm'),
            cancelText: t('common.cancel'),
            variant: 'default',
            icon: <RotateCcw className="size-4" />,
        });

        if (confirmed) {
            const itemsOrProduct = order.items.length > 1 ? order.items : order.items[0].product;
            if (itemsOrProduct) buyNow(itemsOrProduct);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('orders.title')} />

            <div className="flex h-full flex-1 flex-col gap-2 overflow-x-auto rounded-xl p-4 sm:gap-4">
                <div className="mb-4">
                    <h1 className="text-2xl font-bold">{t('orders.title')}</h1>
                    <p className="text-muted-foreground">{t('orders.description')}</p>
                </div>

                <SearchInput value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder={t('orders.search_placeholder')} />

                <div className="space-y-4">
                    {filteredOrders.map((order) => (
                        <SwellCard key={order.id}>
                            <SwellCardHeader>
                                <div>
                                    <CardTitle className="text-lg font-semibold text-foreground">
                                        {t('orders.order_number', { number: order.order_number })}
                                    </CardTitle>
                                    <p className="mt-1 text-sm text-muted-foreground">{t('orders.placed_on', { date: order.created_at })}</p>
                                </div>
                                <span className="text-lg font-semibold text-foreground">€{(order.amount_total / 100).toFixed(2)}</span>
                            </SwellCardHeader>

                            <SwellCardContent>
                                <div className="mb-4 space-y-3">
                                    {order.items.map((item) => (
                                        <div key={item.id} className="flex items-center gap-4">
                                            <div className="size-16 shrink-0 overflow-hidden rounded-md border border-slate-light-alpha bg-slate-light">
                                                {item.product?.featured_image?.url ? (
                                                    <img
                                                        src={item.product.featured_image.url}
                                                        alt={item.product.featured_image.alt_text}
                                                        className="size-full object-cover"
                                                    />
                                                ) : (
                                                    <PlaceholderImage className="size-full" />
                                                )}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <h3
                                                    className="w-fit cursor-pointer truncate font-medium text-foreground hover:underline"
                                                    onClick={() => item.product && setQuickViewProduct(item.product)}
                                                >
                                                    {item.name}
                                                </h3>
                                                <p className="text-sm text-muted-foreground">{t('common.quantity', { count: item.quantity })}</p>
                                                <p className="block font-semibold text-foreground sm:hidden">€{(item.price / 100).toFixed(2)}</p>
                                            </div>
                                            <div className="hidden text-right sm:block">
                                                <p className="font-semibold text-foreground">€{(item.price / 100).toFixed(2)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <Separator className="my-4" />

                                <div className="flex flex-wrap gap-2">
                                    <Button variant="outline" size="sm" onClick={() => handleReOrder(order)}>
                                        <RotateCcw /> {t('orders.reorder')}
                                    </Button>
                                </div>
                            </SwellCardContent>
                        </SwellCard>
                    ))}
                </div>
            </div>

            <ProductQuickViewDialog product={quickViewProduct} open={!!quickViewProduct} onClose={() => setQuickViewProduct(null)} />
        </AppLayout>
    );
}
