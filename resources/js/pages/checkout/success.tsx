import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SwellCard, SwellCardContent, SwellCardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Order } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowRight, CheckCircle, Home, Mail, Package, Receipt } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Success({ order }: { order: Order }) {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen bg-background">
            <Head title={t('checkout.title', { number: order.order_number })} />

            <div className="container mx-auto px-4 py-16">
                <div className="mx-auto max-w-2xl">
                    <div className="mb-8 text-center">
                        <div className="mb-6 flex justify-center">
                            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                                <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
                            </div>
                        </div>
                        <h1 className="mb-2 text-3xl font-bold text-foreground">{t('checkout.confirmed')}</h1>
                        <p className="text-lg text-muted-foreground">{t('checkout.thank_you')}</p>
                    </div>

                    <SwellCard className="mb-6">
                        <SwellCardHeader>
                            <h2 className="text-xl font-semibold text-foreground">{t('checkout.details')}</h2>
                            <Badge variant="secondary" className="rounded-sm bg-green-500 text-white dark:bg-green-900 dark:text-green-200">
                                {t('checkout.confirmed_badge')}
                            </Badge>
                        </SwellCardHeader>

                        <SwellCardContent>
                            <div className="space-y-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">{t('checkout.order_number')}</span>
                                    <span className="font-mono text-foreground">{order.order_number}</span>
                                </div>

                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">{t('checkout.confirmation_email')}</span>
                                    <span className="text-foreground">{order.billing_address.email}</span>
                                </div>

                                <Separator />

                                <div className="space-y-3">
                                    {order.items.map((item, index) => (
                                        <div key={index} className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium text-foreground">{item.name}</p>
                                                <p className="text-sm text-muted-foreground">{t('checkout.quantity', { count: item.quantity })}</p>
                                            </div>
                                            <span className="font-semibold text-foreground">&euro;{(item.price / 100).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>

                                <Separator />

                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">{t('checkout.subtotal')}</span>
                                    <span className="text-foreground">&euro;{(order.amount_subtotal / 100).toFixed(2)}</span>
                                </div>
                                {order.amount_discount > 0 && (
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">{t('checkout.discount')}</span>
                                        <span className="font-medium text-green-600 dark:text-green-400">
                                            -&euro;{(order.amount_discount / 100).toFixed(2)}
                                        </span>
                                    </div>
                                )}
                                <div className="mt-2 flex items-center justify-between text-lg font-bold">
                                    <span className="text-foreground">{t('checkout.total')}</span>
                                    <span className="text-foreground">&euro;{(order.amount_total / 100).toFixed(2)}</span>
                                </div>
                            </div>
                        </SwellCardContent>
                    </SwellCard>

                    <SwellCard className="mb-6">
                        <SwellCardHeader>
                            <h3 className="text-lg font-semibold text-foreground">{t('checkout.whats_next')}</h3>
                        </SwellCardHeader>

                        <SwellCardContent>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="mt-0.5 flex size-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                                        <Mail className="size-4 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-foreground">{t('checkout.email_confirmation')}</p>
                                        <p
                                            className="text-sm text-muted-foreground"
                                            dangerouslySetInnerHTML={{ __html: t('checkout.email_sent', { email: order.billing_address.email }) }}
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="mt-0.5 flex size-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                                        <Package className="size-4 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-foreground">{t('checkout.shipping')}</p>
                                        <p className="text-sm text-muted-foreground">{t('checkout.shipping_description')}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="mt-0.5 flex size-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                                        <Receipt className="size-4 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-foreground">{t('checkout.tracking')}</p>
                                        <p className="text-sm text-muted-foreground">{t('checkout.tracking_description')}</p>
                                    </div>
                                </div>
                            </div>
                        </SwellCardContent>
                    </SwellCard>

                    <div className="space-y-3">
                        <Button asChild size="lg" className="w-full">
                            <Link href="/orders">
                                {t('checkout.view_orders')}
                                <ArrowRight className="size-4" />
                            </Link>
                        </Button>

                        <Button asChild variant="outline" size="lg" className="w-full border bg-background text-foreground">
                            <Link prefetch="mount" href="/">
                                <Home className="size-4" />
                                {t('checkout.continue_shopping')}
                            </Link>
                        </Button>
                    </div>

                    <div className="mt-8 text-center">
                        <p className="mb-2 text-sm text-muted-foreground">{t('checkout.question')}</p>
                        <Button variant="link" className="p-0 text-primary hover:text-primary/80">
                            {t('checkout.contact_support')}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
