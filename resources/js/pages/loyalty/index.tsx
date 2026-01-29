import { Badge } from '@/components/ui/badge';
import { CardDescription, CardTitle, SwellCard, SwellCardContent, SwellCardHeader } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import type { BreadcrumbItem, LoyaltyTransaction } from '@/types';
import { Head } from '@inertiajs/react';
import { Award, Clock, TrendingUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Account {
    points: number;
    lifetime_points: number;
    expiring_points: number;
}

interface Config {
    points_per_euro: number;
    minimum_redeem_points: number;
    max_discount_percentage: number;
}

interface Props {
    account: Account;
    transactions: LoyaltyTransaction[];
    config: Config;
}

export default function Index({ account, transactions, config }: Props) {
    const { t } = useTranslation();

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('nav.dashboard'),
            href: '/dashboard',
        },
        {
            title: t('loyalty.title'),
            href: '/loyalty',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('loyalty.title')} />

            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div className="grid gap-4 md:grid-cols-3">
                    <SwellCard>
                        <SwellCardHeader>
                            <CardTitle className="text-sm font-medium">{t('loyalty.current_balance')}</CardTitle>
                            <Award className="size-4 text-muted-foreground" />
                        </SwellCardHeader>
                        <SwellCardContent>
                            <div className="text-2xl font-bold">{account.points.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground">≈ {(account.points / config.points_per_euro).toFixed(2)} €</p>
                        </SwellCardContent>
                    </SwellCard>

                    <SwellCard>
                        <SwellCardHeader>
                            <CardTitle className="text-sm font-medium">{t('loyalty.accumulated')}</CardTitle>
                            <TrendingUp className="size-4 text-muted-foreground" />
                        </SwellCardHeader>
                        <SwellCardContent>
                            <div className="text-2xl font-bold">{account.lifetime_points.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground">{t('loyalty.accumulated_description')}</p>
                        </SwellCardContent>
                    </SwellCard>

                    <SwellCard>
                        <SwellCardHeader>
                            <CardTitle className="text-sm font-medium">{t('loyalty.expiring_soon')}</CardTitle>
                            <Clock className="size-4 text-muted-foreground" />
                        </SwellCardHeader>
                        <SwellCardContent>
                            <div className="text-2xl font-bold">{account.expiring_points.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground">{t('loyalty.expiring_soon_description')}</p>
                        </SwellCardContent>
                    </SwellCard>
                </div>

                <SwellCard>
                    <SwellCardHeader className="max-sm:flex-col max-sm:gap-2 max-sm:text-center">
                        <CardTitle>{t('loyalty.how_it_works')}</CardTitle>
                        <CardDescription>{t('loyalty.how_it_works_description')}</CardDescription>
                    </SwellCardHeader>
                    <SwellCardContent className="space-y-2">
                        <div className="flex items-center gap-2">
                            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                                <span className="text-sm font-semibold text-primary">1</span>
                            </div>
                            <p
                                className="text-sm"
                                dangerouslySetInnerHTML={{
                                    __html: t('loyalty.earn_points', { points: config.points_per_euro }),
                                }}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                                <span className="text-sm font-semibold text-primary">2</span>
                            </div>
                            <p
                                className="text-sm"
                                dangerouslySetInnerHTML={{
                                    __html: t('loyalty.min_redeem', { points: config.minimum_redeem_points }),
                                }}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                                <span className="text-sm font-semibold text-primary">3</span>
                            </div>
                            <p
                                className="text-sm"
                                dangerouslySetInnerHTML={{
                                    __html: t('loyalty.max_discount', { percentage: config.max_discount_percentage }),
                                }}
                            />
                        </div>
                    </SwellCardContent>
                </SwellCard>

                <SwellCard>
                    <SwellCardHeader>
                        <CardTitle>{t('loyalty.history')}</CardTitle>
                        <CardDescription className="max-sm:text-right">{t('loyalty.history_description')}</CardDescription>
                    </SwellCardHeader>
                    <SwellCardContent>
                        {transactions.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <Award className="mb-4 size-12 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">{t('loyalty.no_transactions')}</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>{t('loyalty.table_date')}</TableHead>
                                            <TableHead>{t('loyalty.table_type')}</TableHead>
                                            <TableHead>{t('loyalty.table_description')}</TableHead>
                                            <TableHead className="text-right">{t('loyalty.table_points')}</TableHead>
                                            <TableHead className="text-right">{t('loyalty.table_balance')}</TableHead>
                                            <TableHead>{t('loyalty.table_expiration')}</TableHead>
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
