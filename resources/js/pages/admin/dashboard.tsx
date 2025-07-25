import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin/layout';
import type { BreadcrumbItem, Order, Product } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, ArrowRight, CreditCard, DollarSign, Users } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface DashboardProps {
    clients: number;
    products: number;
    orders: number;
    lastProducts: Product[];
    lastOrders: Order[];
}

export default function Dashboard({ clients, products, orders, lastProducts, lastOrders }: DashboardProps) {
    console.log(lastOrders);
    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard Administrateur" />

            <div className="flex flex-col gap-6 mt-12">
                <h1 className="text-3xl font-bold tracking-tight">Dashboard Administrateur</h1>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Chiffre d'affaires</CardTitle>
                            <DollarSign className="size-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">€45,231.89</div>
                            <p className="text-xs text-muted-foreground">+20.1% par rapport au mois dernier</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Commandes</CardTitle>
                            <CreditCard className="size-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">+{orders}</div>
                            <p className="text-xs text-muted-foreground">+10.1% par rapport au mois dernier</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Clients</CardTitle>
                            <Users className="size-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">+{clients}</div>
                            <p className="text-xs text-muted-foreground">+19.5% par rapport au mois dernier</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Produits actifs</CardTitle>
                            <Activity className="size-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{products}</div>
                            <p className="text-xs text-muted-foreground">+7 nouveaux produits cette semaine</p>
                        </CardContent>
                    </Card>
                </div>

                <Tabs defaultValue="overview" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
                        <TabsTrigger value="orders">Commandes</TabsTrigger>
                        <TabsTrigger value="products">Produits</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                            {/* Graphique du chiffre d'affaires - 4 colonnes */}
                            <Card className="lg:col-span-4">
                                <CardHeader>
                                    <CardTitle>Vue d'ensemble</CardTitle>
                                    <CardDescription>Chiffre d'affaires mensuel</CardDescription>
                                </CardHeader>
                                <CardContent className="pl-2">
                                    <div className="h-[200px] w-full bg-muted/20 flex items-center justify-center rounded">
                                        <p className="text-muted-foreground">Graphique de chiffre d'affaires</p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Produits les plus vendus - 3 colonnes */}
                            <Card className="lg:col-span-3">
                                <CardHeader>
                                    <CardTitle>Produits les plus vendus</CardTitle>
                                    <CardDescription>Top 5 des produits ce mois-ci</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <div className="flex items-center">
                                            <span className="font-medium">1. Clavier Gaming RGB Pro</span>
                                            <span className="ml-auto">142 vendus</span>
                                        </div>
                                        <div className="flex items-center">
                                            <span className="font-medium">2. Souris Gaming sans fil</span>
                                            <span className="ml-auto">98 vendus</span>
                                        </div>
                                        <div className="flex items-center">
                                            <span className="font-medium">3. Casque Gaming 7.1</span>
                                            <span className="ml-auto">87 vendus</span>
                                        </div>
                                        <div className="flex items-center">
                                            <span className="font-medium">4. Tapis de souris XXL</span>
                                            <span className="ml-auto">64 vendus</span>
                                        </div>
                                        <div className="flex items-center">
                                            <span className="font-medium">5. Moniteur 27" 144Hz</span>
                                            <span className="ml-auto">53 vendus</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="orders" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Dernières commandes</CardTitle>
                                <CardDescription>Liste des 5 dernières commandes passées</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>ID</TableHead>
                                            <TableHead>Client</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead className="text-right">Montant</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {lastOrders.map((order) => (
                                            <TableRow key={order.id}>
                                                <TableCell className="font-medium">#{order.id}</TableCell>
                                                <TableCell>{order.user?.name}</TableCell>
                                                <TableCell>{order.created_at}</TableCell>
                                                <TableCell className="text-right">{(order.amount_total / 100).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                <div className="mt-4 flex justify-end">
                                    <Link className="flex gap-1 items-center text-sm font-medium text-primary hover:underline" href="/admin">
                                        Voir toutes les commandes
                                        <ArrowRight size={16} />
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="products" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Derniers produits ajoutés</CardTitle>
                                <CardDescription>Les 5 derniers produits ajoutés à votre catalogue</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>ID</TableHead>
                                            <TableHead>Nom</TableHead>
                                            <TableHead>Stock</TableHead>
                                            <TableHead>Catégorie</TableHead>
                                            <TableHead className="text-right">Prix</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {lastProducts.map((product) => (
                                            <TableRow key={product.id}>
                                                <TableCell className="font-medium">{product.id}</TableCell>
                                                <TableCell>{product.brand?.name} {product.name}</TableCell>
                                                <TableCell>
                                                    <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                                                        product.stock > 30
                                                            ? 'bg-green-100 text-green-800'
                                                            : product.stock > product.reorder_level
                                                            ? 'bg-yellow-100 text-yellow-800'
                                                            : 'bg-red-100 text-red-800'
                                                    }`}>
                                                        {product.stock}
                                                    </span>
                                                </TableCell>
                                                <TableCell>{product.categories && product.categories[0].name}</TableCell>
                                                <TableCell className="text-right">{product.discount_price?.toFixed(2) ?? product.price.toFixed(2)} €</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                <div className="mt-4 flex justify-end">
                                    <Link className="flex gap-1 items-center text-sm font-medium text-primary hover:underline" href={route('admin.products.index')}>
                                        Voir tous les produits
                                        <ArrowRight size={16} />
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </AdminLayout>
    )
}
