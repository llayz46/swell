import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { CardDescription, CardTitle, SwellCard, SwellCardContent, SwellCardHeader } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AdminLayout from '@/layouts/admin-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Award, TrendingUp, Users } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin',
        href: '/admin',
    },
    {
        title: 'Points de fidélité',
        href: '/admin/loyalty',
    },
];

interface Account {
    id: number;
    user: {
        id: number;
        name: string;
        email: string;
    };
    points: number;
    lifetime_points: number;
    transactions_count: number;
    created_at: string;
}

interface Stats {
    total_accounts: number;
    total_points: number;
    total_lifetime_points: number;
}

interface PaginatedAccounts {
    data: Account[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
}

interface Props {
    accounts: PaginatedAccounts;
    stats: Stats;
}

export default function Index({ accounts, stats }: Props) {
    const handleExpirePoints = () => {
        if (confirm('Êtes-vous sûr de vouloir expirer les points obsolètes ?')) {
            router.post(route('admin.loyalty.expire'));
        }
    };

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Points de fidélité" />

            <div className="flex h-full flex-1 flex-col gap-6 mt-4">
                <div className="grid gap-4 md:grid-cols-3">
                    <SwellCard>
                        <SwellCardHeader>
                            <CardTitle className="text-sm font-medium">Comptes actifs</CardTitle>
                            <Users className="size-4 text-muted-foreground" />
                        </SwellCardHeader>
                        <SwellCardContent>
                            <div className="text-2xl font-bold">{stats.total_accounts.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground">Utilisateurs avec des points</p>
                        </SwellCardContent>
                    </SwellCard>

                    <SwellCard>
                        <SwellCardHeader>
                            <CardTitle className="text-sm font-medium">Points totaux</CardTitle>
                            <Award className="size-4 text-muted-foreground" />
                        </SwellCardHeader>
                        <SwellCardContent>
                            <div className="text-2xl font-bold">{stats.total_points.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground">Points actuellement disponibles</p>
                        </SwellCardContent>
                    </SwellCard>

                    <SwellCard>
                        <SwellCardHeader>
                            <CardTitle className="text-sm font-medium">Points distribués</CardTitle>
                            <TrendingUp className="size-4 text-muted-foreground" />
                        </SwellCardHeader>
                        <SwellCardContent>
                            <div className="text-2xl font-bold">{stats.total_lifetime_points.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground">Total depuis le début</p>
                        </SwellCardContent>
                    </SwellCard>
                </div>

                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={handleExpirePoints}>
                        Expirer les points obsolètes
                    </Button>
                </div>

                <SwellCard>
                    <SwellCardHeader>
                        <CardTitle>Comptes de fidélité</CardTitle>
                        <CardDescription>
                            Liste de tous les comptes de points de fidélité
                        </CardDescription>
                    </SwellCardHeader>
                    <SwellCardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Utilisateur</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead className="text-right">Points</TableHead>
                                        <TableHead className="text-right">Points à vie</TableHead>
                                        <TableHead className="text-center">Transactions</TableHead>
                                        <TableHead>Créé le</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {accounts.data.map((account) => (
                                        <TableRow key={account.id}>
                                            <TableCell className="font-medium">{account.user.name}</TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {account.user.email}
                                            </TableCell>
                                            <TableCell className="text-right font-semibold">
                                                {account.points.toLocaleString()}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {account.lifetime_points.toLocaleString()}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge variant="secondary">{account.transactions_count}</Badge>
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {account.created_at}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Link className={buttonVariants({ variant: 'link', size: 'sm' })} href={route('admin.loyalty.show', account.id)}>
                                                    Voir détails
                                                </Link>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        {accounts.last_page > 1 && (
                            <div className="mt-4 flex items-center justify-center gap-2">
                                {accounts.links.map((link, index) => (
                                    <Button
                                        key={index}
                                        variant={link.active ? 'default' : 'outline'}
                                        size="sm"
                                        disabled={!link.url}
                                        onClick={() => link.url && router.visit(link.url)}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        )}
                    </SwellCardContent>
                </SwellCard>
            </div>
        </AdminLayout>
    );
}
