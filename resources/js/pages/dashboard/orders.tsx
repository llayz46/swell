import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle, SwellCard, SwellCardContent, SwellCardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Order } from '@/types';
import { getStorageUrl } from '@/utils/format-storage-url';
import { Head, Link } from '@inertiajs/react';
import { RotateCcw, Search } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Commandes',
        href: '/orders',
    },
];

export default function Orders({ orders }: { orders: Order[] }) {
    const [searchTerm, setSearchTerm] = useState<string>('');

    const filteredOrders = orders.filter((order) => {
        if (!searchTerm) return true;

        return order.order_number.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Mes commandes" />

            <div className="flex h-full flex-1 flex-col gap-2 overflow-x-auto rounded-xl p-4 sm:gap-4">
                <div className="mb-4">
                    <h1 className="text-2xl font-bold">Mes commandes</h1>
                    <p className="text-muted-foreground">Consultez l'historique de vos commandes et leur statut</p>
                </div>

                <Card className="border bg-card py-3 sm:py-4">
                    <CardContent className="px-3 sm:px-4">
                        <div className="relative">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                            <Input
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Rechercher par numéro de commande..."
                                className="border bg-background pl-10"
                            />
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-4">
                    {filteredOrders.map((order) => (
                        <SwellCard key={order.id}>
                            <SwellCardHeader>
                                <div>
                                    <CardTitle className="text-lg font-semibold text-foreground">Commande {order.order_number}</CardTitle>
                                    <p className="mt-1 text-sm text-muted-foreground">Passée le {order.created_at}</p>
                                </div>
                                <span className="text-lg font-semibold text-foreground">€{(order.amount_total / 100).toFixed(2)}</span>
                            </SwellCardHeader>

                            <SwellCardContent>
                                <div className="mb-4 space-y-3">
                                    {order.items.map((item) => (
                                        <div key={item.id} className="flex items-center gap-4">
                                            <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                                                {item.product?.featured_image ? (
                                                    <img
                                                        src={getStorageUrl(item.product.featured_image.url)}
                                                        alt={item.product.featured_image.alt_text}
                                                        className="size-full object-cover"
                                                    />
                                                ) : (
                                                    <span className="block flex size-full items-center justify-center bg-muted text-muted-foreground">
                                                        Image indisponible
                                                    </span>
                                                )}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <Link
                                                    href={route('product.show', item.product?.slug)}
                                                    className="truncate font-medium text-foreground hover:underline"
                                                >
                                                    {item.name}
                                                </Link>
                                                <p className="text-sm text-muted-foreground">Quantité: {item.quantity}</p>
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
                                    <Button variant="outline" size="sm">
                                        <RotateCcw /> Commander à nouveau
                                    </Button>
                                </div>
                            </SwellCardContent>
                        </SwellCard>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
