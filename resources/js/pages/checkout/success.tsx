import { Order } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { CheckCircle, Package, Mail, ArrowRight, Home, Receipt } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export default function Success({ order }: { order: Order }) {
    return (
        <div className="min-h-screen bg-background">
            <Head title={`Confirmation de commande ${order.order_number}`} />

            <div className="container mx-auto px-4 py-16">
                <div className="max-w-2xl mx-auto">
                    <div className="text-center mb-8">
                        <div className="flex justify-center mb-6">
                            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold text-foreground mb-2">Commande confirmée !</h1>
                        <p className="text-muted-foreground text-lg">
                            Merci pour votre achat. Votre commande a été traitée avec succès.
                        </p>
                    </div>

                    <Card className="border bg-card mb-6">
                        <CardContent>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold text-foreground">Détails de la commande</h2>
                                <Badge
                                    variant="secondary"
                                    className="bg-green-500 text-white dark:bg-green-900 dark:text-green-200 rounded-sm"
                                >
                                    Confirmée
                                </Badge>
                            </div>

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
                                        <div key={index} className="flex justify-between items-center">
                                            <div>
                                                <p className="font-medium text-foreground">{item.name}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    Quantité: {item.quantity}
                                                </p>
                                            </div>
                                            <span className="font-semibold text-foreground">€{(item.price / 100).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>

                                <Separator />

                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground">Sous-total:</span>
                                    <span className="text-foreground">€{(order.amount_subtotal / 100).toFixed(2)}</span>
                                </div>
                                {order.amount_discount > 0 && (
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-muted-foreground">Réductions:</span>
                                        <span className="text-green-600 dark:text-green-400 font-medium">-€{(order.amount_discount / 100).toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between items-center text-lg font-bold mt-2">
                                    <span className="text-foreground">Total:</span>
                                    <span className="text-foreground">€{(order.amount_total / 100).toFixed(2)}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border bg-card mb-6">
                        <CardContent>
                            <h3 className="text-lg font-semibold text-foreground mb-4">Et maintenant ?</h3>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <Mail className="w-4 h-4 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-foreground">Confirmation par email</p>
                                        <p className="text-sm text-muted-foreground">
                                            Un email de confirmation a été envoyé à {order.billing_address.email}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <Package className="w-4 h-4 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-foreground">Préparation et expédition</p>
                                        <p className="text-sm text-muted-foreground">
                                            Votre commande sera expédiée sous 3-5 jours ouvrés
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <Receipt className="w-4 h-4 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-foreground">Suivi de commande</p>
                                        <p className="text-sm text-muted-foreground">Vous recevrez un numéro de suivi dès l'expédition</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="space-y-3">
                        <Button asChild size="lg" className="w-full">
                            <Link href="/orders">
                                Voir mes commandes
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </Button>

                        <Button asChild variant="outline" size="lg" className="w-full bg-background text-foreground border">
                            <Link prefetch="mount" href="/">
                                <Home className="w-4 h-4" />
                                Continuer mes achats
                            </Link>
                        </Button>
                    </div>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-muted-foreground mb-2">Une question sur votre commande ?</p>
                        <Button variant="link" className="text-primary hover:text-primary/80 p-0">
                            Contactez notre support client
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
