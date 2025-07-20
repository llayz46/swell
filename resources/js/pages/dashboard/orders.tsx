import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Order } from '@/types';
import { RotateCcw, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { getStorageUrl } from '@/utils/format-storage-url';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Commandes',
        href: '/orders',
    },
];

export default function Orders({ orders }: { orders: Order[] }) {
    const [searchTerm, setSearchTerm] = useState<string>('');

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("fr-FR", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
    }

    const filteredOrders = orders.filter(order => {
        if (!searchTerm) return true;

        return order.order_number.toLowerCase().includes(searchTerm.toLowerCase())
    })

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Mes commandes" />

            <div className="flex h-full flex-1 flex-col gap-2 sm:gap-4 overflow-x-auto rounded-xl p-4">
                <div className="mb-4">
                    <h1 className="text-2xl font-bold">Mes commandes</h1>
                    <p className="text-muted-foreground">Consultez l'historique de vos commandes et leur statut</p>
                </div>

                <Card className="border bg-card mb-2 sm:mb-4 py-3 sm:py-4">
                    <CardContent className="px-3 sm:px-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                            <Input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Rechercher par numéro de commande..." className="pl-10 bg-background border" />
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-4">
                    {filteredOrders.map(order => (
                        <Card key={order.id} className="max-sm:py-4 border bg-card">
                            <CardHeader className="max-sm:px-4">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div>
                                        <CardTitle className="text-lg font-semibold text-foreground">Commande {order.order_number}</CardTitle>
                                        <p className="text-sm text-muted-foreground mt-1">Passée le {formatDate(order.created_at)}</p>
                                    </div>
                                    <span className="text-lg font-semibold text-foreground">€{(order.amount_total / 100).toFixed(2)}</span>
                                </div>
                            </CardHeader>

                            <CardContent className="pt-0 max-sm:px-4">
                                <div className="space-y-3 mb-4">
                                    {order.items.map(item => (
                                        <div key={item.id} className="flex items-center gap-4">
                                            <div className="w-16 h-16 rounded-md overflow-hidden bg-muted flex-shrink-0">
                                                {item.product?.featured_image ? (
                                                    <img
                                                        src={getStorageUrl(item.product.featured_image.image_url)}
                                                        alt={item.product.featured_image.alt_text}
                                                        className="size-full object-cover"
                                                    />
                                                ) : (
                                                    <span className="block size-full bg-muted flex items-center justify-center text-muted-foreground">
                                                        Image indisponible
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <Link href={route('product.show', item.product?.slug)} className="font-medium text-foreground truncate hover:underline">
                                                    {item.name}
                                                </Link>
                                                <p className="text-sm text-muted-foreground">Quantité: {item.quantity}</p>
                                                <p className="block sm:hidden font-semibold text-foreground">€{(item.price / 100).toFixed(2)}</p>
                                            </div>
                                            <div className="hidden sm:block text-right">
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
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </AppLayout>
    )
}
