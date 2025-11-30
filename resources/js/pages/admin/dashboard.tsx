import { CardDescription, CardTitle, SwellCard, SwellCardContent, SwellCardHeader } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminLayout from '@/layouts/admin-layout';
import type { BreadcrumbItem, Order, Product } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Activity, ArrowRight, CreditCard, DollarSign, Users } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface DashboardProps {
    totalUsers: number;
    newUsers: number;
    activeProducts: number;
    totalOrders: number;
    ordersPercentageChange: number;
    totalRevenue: number;
    revenuePercentageChange: number;
    lastProducts: Product[];
    lastOrders: Order[];
    monthlyRevenue: { month: string; revenue: number }[];
    topSellingProducts: Product[];
}

export default function Dashboard({
    totalUsers,
    newUsers,
    activeProducts,
    totalOrders,
    ordersPercentageChange,
    totalRevenue,
    revenuePercentageChange,
    lastProducts,
    lastOrders,
    monthlyRevenue,
    topSellingProducts,
}: DashboardProps) {
    const chartConfig = {
        desktop: {
            label: 'Revenues',
            color: 'var(--chart-1)',
            icon: Activity,
        },
    } satisfies ChartConfig;

    const chartData = monthlyRevenue.map((data) => ({
        month: data.month,
        Revenu: data.revenue,
    }));

    const stats = [
        {
            title: "Chiffre d'affaires",
            value: totalRevenue.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' }),
            percentage: revenuePercentageChange,
            icon: <DollarSign className="size-4 text-muted-foreground" />,
            description: (val: number) => (val > 0 ? `+${val}% par rapport au mois dernier` : `${val}% par rapport au mois dernier`),
        },
        {
            title: 'Commandes',
            value: totalOrders,
            percentage: ordersPercentageChange,
            icon: <CreditCard className="size-4 text-muted-foreground" />,
            description: (val: number) => (val > 0 ? `+${val}% par rapport au mois dernier` : `${val}% par rapport au mois dernier`),
        },
        {
            title: 'Utilisateurs',
            value: totalUsers,
            percentage: newUsers,
            icon: <Users className="size-4 text-muted-foreground" />,
            description: (val: number) => (val > 0 ? `+${val} nouveaux utilisateurs ce mois` : `${val} nouveaux utilisateurs ce mois`),
        },
        {
            title: 'Produits actifs',
            value: activeProducts,
            icon: <Activity className="size-4 text-muted-foreground" />,
            description: () => '+7 nouveaux produits cette semaine',
        },
    ];

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard Administrateur" />

            <div className="flex flex-col gap-6">
                <h1 className="text-3xl font-bold tracking-tight">Dashboard Administrateur</h1>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat, index) => (
                        <SwellCard key={index}>
                            <SwellCardHeader>
                                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                                {stat.icon}
                            </SwellCardHeader>

                            <SwellCardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                                {stat.percentage !== undefined ? (
                                    <p className="mt-1 text-xs text-muted-foreground">{stat.description(stat.percentage)}</p>
                                ) : (
                                    <p className="mt-1 text-xs text-muted-foreground">{stat.description()}</p>
                                )}
                            </SwellCardContent>
                        </SwellCard>
                    ))}
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
                            <SwellCard className="lg:col-span-4">
                                <SwellCardHeader variant="column">
                                    <CardTitle>Vue d'ensemble</CardTitle>
                                    <CardDescription>Chiffre d'affaires mensuel</CardDescription>
                                </SwellCardHeader>
                                <SwellCardContent>
                                    <ChartContainer config={chartConfig} className="max-h-64 w-full">
                                        <AreaChart
                                            accessibilityLayer
                                            data={chartData}
                                            margin={{
                                                left: 12,
                                                right: 12,
                                            }}
                                        >
                                            <CartesianGrid vertical={false} />
                                            <XAxis
                                                dataKey="month"
                                                tickLine={false}
                                                axisLine={false}
                                                tickMargin={8}
                                                tickFormatter={(value) => value.slice(0, 3)}
                                            />
                                            <ChartTooltip cursor={false} content={<ChartTooltipContent hideIndicator />} />
                                            <Area
                                                dataKey="Revenu"
                                                type="linear"
                                                fill="var(--color-desktop)"
                                                fillOpacity={0.4}
                                                stroke="var(--color-desktop)"
                                            />
                                        </AreaChart>
                                    </ChartContainer>
                                </SwellCardContent>
                            </SwellCard>

                            {/* Produits les plus vendus - 3 colonnes */}
                            <SwellCard className="lg:col-span-3">
                                <SwellCardHeader variant="column">
                                    <CardTitle>Produits les plus vendus</CardTitle>
                                    <CardDescription>Les 5 produits les plus vendus ce mois-ci</CardDescription>
                                </SwellCardHeader>
                                <SwellCardContent>
                                    <div className="space-y-2">
                                        {topSellingProducts.map((product, index) => (
                                            <div key={product.id} className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <span className="w-2 text-sm font-medium text-muted-foreground">{index + 1}.</span>
                                                    <Link href={route('product.show', product.slug)} className="font-medium hover:underline">
                                                        {product.brand?.name} {product.name}
                                                    </Link>
                                                </div>
                                                <span className="text-sm font-medium text-primary">{product.sales_count ?? 0} vendus</span>
                                            </div>
                                        ))}
                                    </div>
                                </SwellCardContent>
                            </SwellCard>
                        </div>
                    </TabsContent>

                    <TabsContent value="orders" className="space-y-4">
                        <SwellCard>
                            <SwellCardHeader variant="column">
                                <CardTitle>Dernières commandes</CardTitle>
                                <CardDescription>Liste des 5 dernières commandes passées</CardDescription>
                            </SwellCardHeader>
                            <SwellCardContent>
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
                                                <TableCell className="text-right">
                                                    {(order.amount_total / 100).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                <div className="mt-4 flex justify-end">
                                    <Link className="flex items-center gap-1 text-sm font-medium text-primary hover:underline" href="/admin">
                                        Voir toutes les commandes
                                        <ArrowRight size={16} />
                                    </Link>
                                </div>
                            </SwellCardContent>
                        </SwellCard>
                    </TabsContent>

                    <TabsContent value="products" className="space-y-4">
                        <SwellCard>
                            <SwellCardHeader variant="column">
                                <CardTitle>Derniers produits ajoutés</CardTitle>
                                <CardDescription>Les 5 derniers produits ajoutés à votre catalogue</CardDescription>
                            </SwellCardHeader>
                            <SwellCardContent>
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
                                                <TableCell className="font-medium">#{product.id}</TableCell>
                                                <TableCell>
                                                    {product.brand?.name} {product.name}
                                                </TableCell>
                                                <TableCell>
                                                    <span
                                                        className={`inline-block rounded-full px-2 py-1 text-xs ${
                                                            product.stock > 30
                                                                ? 'bg-green-100 text-green-800'
                                                                : product.stock > product.reorder_level
                                                                  ? 'bg-yellow-100 text-yellow-800'
                                                                  : 'bg-red-100 text-red-800'
                                                        }`}
                                                    >
                                                        {product.stock}
                                                    </span>
                                                </TableCell>
                                                <TableCell>{product.category?.name}</TableCell>
                                                <TableCell className="text-right">
                                                    {product.discount_price?.toFixed(2) ?? product.price.toFixed(2)} €
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                <div className="mt-4 flex justify-end">
                                    <Link
                                        className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                                        href={route('admin.products.index')}
                                    >
                                        Voir tous les produits
                                        <ArrowRight size={16} />
                                    </Link>
                                </div>
                            </SwellCardContent>
                        </SwellCard>
                    </TabsContent>
                </Tabs>
            </div>
        </AdminLayout>
    );
}
