import { Badge } from '@/components/ui/badge';
import { CardDescription, CardTitle, SwellCard, SwellCardContent, SwellCardHeader } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Award, Clock, Gift, TrendingUp } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Points de fidélité',
        href: '/loyalty',
    },
];

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

interface Account {
    points: number;
    lifetime_points: number;
    available_points: number;
    expiring_points: number;
}

interface Config {
    points_per_euro: number;
    minimum_redeem_points: number;
    max_discount_percentage: number;
}

interface Props {
    account: Account;
    transactions: Transaction[];
    config: Config;
}

export default function Index({ account, transactions, config }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Points de fidélité" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <SwellCard>
                        <SwellCardHeader>
                            <CardTitle className="text-sm font-medium">Solde actuel</CardTitle>
                            <Award className="size-4 text-muted-foreground" />
                        </SwellCardHeader>
                        <SwellCardContent>
                            <div className="text-2xl font-bold">{account.points.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground">≈ {(account.points / config.points_per_euro).toFixed(2)} €</p>
                        </SwellCardContent>
                    </SwellCard>

                    <SwellCard>
                        <SwellCardHeader>
                            <CardTitle className="text-sm font-medium">Points accumulés</CardTitle>
                            <TrendingUp className="size-4 text-muted-foreground" />
                        </SwellCardHeader>
                        <SwellCardContent>
                            <div className="text-2xl font-bold">{account.lifetime_points.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground">Total gagné depuis l'inscription</p>
                        </SwellCardContent>
                    </SwellCard>

                    <SwellCard>
                        <SwellCardHeader>
                            <CardTitle className="text-sm font-medium">Points disponibles</CardTitle>
                            <Gift className="size-4 text-muted-foreground" />
                        </SwellCardHeader>
                        <SwellCardContent>
                            <div className="text-2xl font-bold">{account.available_points.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground">Utilisables immédiatement</p>
                        </SwellCardContent>
                    </SwellCard>

                    <SwellCard>
                        <SwellCardHeader>
                            <CardTitle className="text-sm font-medium">Points expirant bientôt</CardTitle>
                            <Clock className="size-4 text-muted-foreground" />
                        </SwellCardHeader>
                        <SwellCardContent>
                            <div className="text-2xl font-bold">{account.expiring_points.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground">Dans les 30 prochains jours</p>
                        </SwellCardContent>
                    </SwellCard>
                </div>

                <SwellCard>
                    <SwellCardHeader className="max-sm:flex-col max-sm:gap-2 max-sm:text-center">
                        <CardTitle>Comment ça marche ?</CardTitle>
                        <CardDescription>Gagnez des points à chaque achat et utilisez-les pour obtenir des réductions</CardDescription>
                    </SwellCardHeader>
                    <SwellCardContent className="space-y-2">
                        <div className="flex items-center gap-2">
                            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                                <span className="text-sm font-semibold text-primary">1</span>
                            </div>
                            <p className="text-sm">
                                Gagnez <strong>{config.points_per_euro} points</strong> pour chaque euro dépensé
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                                <span className="text-sm font-semibold text-primary">2</span>
                            </div>
                            <p className="text-sm">
                                Utilisez vos points dès que vous avez au moins <strong>{config.minimum_redeem_points} points</strong>
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                                <span className="text-sm font-semibold text-primary">3</span>
                            </div>
                            <p className="text-sm">
                                Obtenez jusqu'à <strong>{config.max_discount_percentage}%</strong> de réduction sur vos achats
                            </p>
                        </div>
                    </SwellCardContent>
                </SwellCard>

                <SwellCard>
                    <SwellCardHeader>
                        <CardTitle>Historique des transactions</CardTitle>
                        <CardDescription className="max-sm:text-right">Suivez l'évolution de vos points de fidélité</CardDescription>
                    </SwellCardHeader>
                    <SwellCardContent>
                        {transactions.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <Award className="mb-4 size-12 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">Aucune transaction pour le moment</p>
                            </div>
                        ) : (
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
                                                <TableCell className="font-medium">{transaction.created_at}</TableCell>
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
                                                        <span className="ml-2 text-xs text-muted-foreground">({transaction.order_number})</span>
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
                                                <TableCell className="text-right">{transaction.balance_after.toLocaleString()}</TableCell>
                                                <TableCell className="text-sm text-muted-foreground">{transaction.expires_at || '—'}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </SwellCardContent>
                </SwellCard>
            </div>
        </AppLayout>
    );
}
