import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, SwellCard, SwellCardContent, SwellCardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import AdminLayout from '@/layouts/admin-layout';
import { cn } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Award, Clock, Gift, TrendingUp } from 'lucide-react';

interface Account {
    id: number;
    user: {
        id: number;
        name: string;
        email: string;
    };
    points: number;
    lifetime_points: number;
    available_points: number;
    expiring_points: number;
}

interface Transaction {
    id: number;
    type: string;
    type_label: string;
    points: number;
    balance_after: number;
    description: string;
    order_number?: string;
    expires_at?: string;
    created_at: string;
}

interface Props {
    account: Account;
    transactions: Transaction[];
}

export default function AdminLoyaltyShow({ account, transactions }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Admin',
            href: '/admin',
        },
        {
            title: 'Points de fidélité',
            href: '/admin/loyalty',
        },
        {
            title: account.user.name,
            href: route('admin.loyalty.show', account.id),
        },
    ];

    const { data, setData, post, processing, errors, reset } = useForm({
        points: 0,
        reason: '',
    });

    const handleAdjust = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.loyalty.adjust', account.user.id), {
            onSuccess: () => {
                reset();
            },
        });
    };

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title={`Points de fidélité - ${account.user.name}`} />

            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <SwellCard>
                    <SwellCardHeader>
                        <CardTitle>{account.user.name}</CardTitle>
                        <CardDescription>{account.user.email}</CardDescription>
                    </SwellCardHeader>
                </SwellCard>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <SwellCard>
                        <SwellCardHeader>
                            <CardTitle className="text-sm font-medium">Points actuels</CardTitle>
                            <Award className="size-4 text-muted-foreground" />
                        </SwellCardHeader>
                        <SwellCardContent>
                            <div className="text-2xl font-bold">{account.points.toLocaleString()}</div>
                        </SwellCardContent>
                    </SwellCard>

                    <SwellCard>
                        <SwellCardHeader>
                            <CardTitle className="text-sm font-medium">Points à vie</CardTitle>
                            <TrendingUp className="size-4 text-muted-foreground" />
                        </SwellCardHeader>
                        <SwellCardContent>
                            <div className="text-2xl font-bold">{account.lifetime_points.toLocaleString()}</div>
                        </SwellCardContent>
                    </SwellCard>

                    <SwellCard>
                        <SwellCardHeader>
                            <CardTitle className="text-sm font-medium">Points disponibles</CardTitle>
                            <Gift className="size-4 text-muted-foreground" />
                        </SwellCardHeader>
                        <SwellCardContent>
                            <div className="text-2xl font-bold">{account.available_points.toLocaleString()}</div>
                        </SwellCardContent>
                    </SwellCard>

                    <SwellCard>
                        <SwellCardHeader>
                            <CardTitle className="text-sm font-medium">Expirant bientôt</CardTitle>
                            <Clock className="size-4 text-muted-foreground" />
                        </SwellCardHeader>
                        <SwellCardContent>
                            <div className="text-2xl font-bold">{account.expiring_points.toLocaleString()}</div>
                        </SwellCardContent>
                    </SwellCard>
                </div>

                <SwellCard>
                    <SwellCardHeader>
                        <CardTitle>Ajuster les points</CardTitle>
                        <CardDescription>
                            Ajouter ou retirer des points manuellement (utilisez des nombres négatifs pour retirer)
                        </CardDescription>
                    </SwellCardHeader>
                    <SwellCardContent>
                        <form onSubmit={handleAdjust} className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="points">Points</Label>
                                    <Input
                                        id="points"
                                        type="number"
                                        value={data.points}
                                        onChange={(e) => setData('points', parseInt(e.target.value) || 0)}
                                        placeholder="Ex: 100 ou -50"
                                        required
                                    />
                                    {errors.points && (
                                        <p className="text-sm text-destructive">{errors.points}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="reason">Raison</Label>
                                    <Textarea
                                        id="reason"
                                        value={data.reason}
                                        onChange={(e) => setData('reason', e.target.value)}
                                        placeholder="Ex: Compensation pour erreur"
                                        required
                                    />
                                    {errors.reason && (
                                        <p className="text-sm text-destructive">{errors.reason}</p>
                                    )}
                                </div>
                            </div>

                            <Button type="submit" disabled={processing}>
                                {processing ? 'Traitement...' : 'Ajuster les points'}
                            </Button>
                        </form>
                    </SwellCardContent>
                </SwellCard>

                <SwellCard>
                    <SwellCardHeader>
                        <CardTitle>Historique des transactions</CardTitle>
                        <CardDescription>Toutes les transactions de ce compte</CardDescription>
                    </SwellCardHeader>
                    <SwellCardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead className="text-right">Points</TableHead>
                                        <TableHead className="text-right">Solde après</TableHead>
                                        <TableHead>Expiration</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {transactions.map((transaction) => (
                                        <TableRow key={transaction.id}>
                                            <TableCell className="font-medium">
                                                {transaction.created_at}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        transaction.type === 'earned'
                                                            ? 'default'
                                                            : transaction.type === 'spent'
                                                              ? 'secondary'
                                                              : 'destructive'
                                                    }
                                                >
                                                    {transaction.type_label}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {transaction.description}
                                                {transaction.order_number && (
                                                    <span className="ml-2 text-xs text-muted-foreground">
                                                        ({transaction.order_number})
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell
                                                className={cn(
                                                    'text-right font-semibold',
                                                    transaction.points > 0
                                                        ? 'text-green-600 dark:text-green-400'
                                                        : 'text-red-600 dark:text-red-400',
                                                )}
                                            >
                                                {transaction.points > 0 ? '+' : ''}
                                                {transaction.points.toLocaleString()}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {transaction.balance_after.toLocaleString()}
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {transaction.expires_at || '—'}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </SwellCardContent>
                </SwellCard>
            </div>
        </AdminLayout>
    );
}
