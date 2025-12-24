import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SwellCard, SwellCardContent, SwellCardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Order } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowRight, CheckCircle, Home, Mail, Package, Receipt } from 'lucide-react';

export default function Success({ order }: { order: Order }) {
    return (
        <div className="min-h-screen bg-background">
            <Head title={`Confirmation de commande ${order.order_number}`} />

            <div className="container mx-auto px-4 py-16">
                <div className="mx-auto max-w-2xl">
                    <div className="mb-8 text-center">
                        <div className="mb-6 flex justify-center">
                            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                                <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
                            </div>
                        </div>
                        <h1 className="mb-2 text-3xl font-bold text-foreground">Commande confirmée !</h1>
                        <p className="text-lg text-muted-foreground">Merci pour votre achat. Votre commande a été traitée avec succès.</p>
                    </div>

                    <SwellCard className="mb-6">
                        <SwellCardHeader>
                            <h2 className="text-xl font-semibold text-foreground">Détails de la commande</h2>
                            <Badge variant="secondary" className="rounded-sm bg-green-500 text-white dark:bg-green-900 dark:text-green-200">
                                Confirmée
                            </Badge>
                        </SwellCardHeader>

                        <SwellCardContent>
                            <div className="space-y-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Numéro de commande:</span>
                                    <span className="font-mono text-foreground">{order.order_number}</span>
                                </div>

                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Email de confirmation:</span>
                                    <span className="text-foreground">{order.billing_address.email}</span>
                                </div>

                                <Separator />

                                <div className="space-y-3">
                                    {order.items.map((item, index) => (
                                        <div key={index} className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium text-foreground">{item.name}</p>
                                                <p className="text-sm text-muted-foreground">Quantité: {item.quantity}</p>
                                            </div>
                                            <span className="font-semibold text-foreground">€{(item.price / 100).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>

                                <Separator />

                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Sous-total:</span>
                                    <span className="text-foreground">€{(order.amount_subtotal / 100).toFixed(2)}</span>
                                </div>
                                {order.amount_discount > 0 && (
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Réductions:</span>
                                        <span className="font-medium text-green-600 dark:text-green-400">
                                            -€{(order.amount_discount / 100).toFixed(2)}
                                        </span>
                                    </div>
                                )}
                                <div className="mt-2 flex items-center justify-between text-lg font-bold">
                                    <span className="text-foreground">Total:</span>
                                    <span className="text-foreground">€{(order.amount_total / 100).toFixed(2)}</span>
                                </div>
                            </div>
                        </SwellCardContent>
                    </SwellCard>

                    <SwellCard className="mb-6">
                        <SwellCardHeader>
                            <h3 className="text-lg font-semibold text-foreground">Et maintenant ?</h3>
                        </SwellCardHeader>

                        <SwellCardContent>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                                        <Mail className="size-4 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-foreground">Confirmation par email</p>
                                        <p className="text-sm text-muted-foreground">
                                            Un email de confirmation a été envoyé à <b>{order.billing_address.email}</b>
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                                        <Package className="size-4 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-foreground">Préparation et expédition</p>
                                        <p className="text-sm text-muted-foreground">Votre commande sera expédiée sous 3-5 jours ouvrés</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                                        <Receipt className="size-4 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-foreground">Suivi de commande</p>
                                        <p className="text-sm text-muted-foreground">Vous recevrez un numéro de suivi dès l'expédition</p>
                                    </div>
                                </div>
                            </div>
                        </SwellCardContent>
                    </SwellCard>

                    <div className="space-y-3">
                        <Button asChild size="lg" className="w-full">
                            <Link href="/orders">
                                Voir mes commandes
                                <ArrowRight className="size-4" />
                            </Link>
                        </Button>

                        <Button asChild variant="outline" size="lg" className="w-full border bg-background text-foreground">
                            <Link prefetch="mount" href="/">
                                <Home className="size-4" />
                                Continuer mes achats
                            </Link>
                        </Button>
                    </div>

                    <div className="mt-8 text-center">
                        <p className="mb-2 text-sm text-muted-foreground">Une question sur votre commande ?</p>
                        <Button variant="link" className="p-0 text-primary hover:text-primary/80">
                            Contactez notre support client
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
