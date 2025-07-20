import { Head, Link, usePage } from '@inertiajs/react';
import BaseLayout from '@/layouts/base-layout';
import { ArrowRight, Award, Headphones, Shield, Sparkles, Star, Truck } from 'lucide-react';
import { Product, ProductComment, SharedData } from '@/types';
import { cn } from '@/lib/utils';
import { ProductCard } from '@/components/product-card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getStorageUrl } from '@/utils/format-storage-url';
import { useInitials } from '@/hooks/use-initials';
import { ReactNode, useEffect, useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ProductQuickViewDialog } from '@/components/product-quick-view-dialog';
import { toast } from 'sonner';
import { BoxReveal } from '@/components/magicui/box-reveal';
import { TextAnimate } from '@/components/magicui/text-animate';
import { motion } from 'motion/react';

const benefits = [
    {
        icon: Truck,
        title: 'Livraison offerte',
        description: 'À partir de 50€ d’achat en France métropolitaine'
    },
    {
        icon: Shield,
        title: 'Paiement sécurisé',
        description: 'Transactions cryptées et 100% sécurisées'
    },
    {
        icon: Headphones,
        title: 'Support réactif',
        description: 'Une équipe à votre écoute 7j/7'
    },
    {
        icon: Award,
        title: 'Satisfait ou remboursé',
        description: '30 jours pour changer d’avis'
    }
];

const categoriesList = [
    {
        title: 'Périphériques',
        description: 'Périphériques haut de gamme utilisé par les pros.',
        items: [
            { name: 'Souris', count: 42 },
            { name: 'Claviers', count: 30 },
            { name: 'Tapis de Souris', count: 64, className: 'text-violet-400' },
            { name: 'Casques', count: 15 }
        ]
    },
    {
        title: 'Sièges & Bureaux',
        description: 'Confort et ergonomie pour vos sessions de jeu',
        items: [
            { name: 'Sièges Gamers', count: 24, className: 'text-teal-400' },
            { name: 'Bureaux', count: 8 },
            { name: 'Sièges Ergonomiques', count: 20 },
            { name: 'Bureaux Assis Debout', count: 6 }
        ]
    },
    {
        title: 'PC & Écrans',
        description: 'Des machines puissantes pour les gamers exigeants',
        items: [
            { name: 'Écrans Gamers', count: 36, className: 'text-sky-400' },
            { name: 'PC Gaming', count: 15 },
            { name: 'PC Portables', count: 20 },
            { name: 'Composants PC', count: 50 }
        ]
    },
    {
        title: 'Accessoires',
        description: 'Tout le nécessaire pour optimiser votre setup',
        items: [
            { name: 'Câbles & Adaptateurs', count: 100 },
            { name: 'Supports & Racks', count: 25 },
            { name: 'Éclairage LED', count: 18 },
            { name: 'Autres Accessoires', count: 40, className: 'text-orange-400' }
        ]
    }
];

const faqItems = [
    {
        question: 'Quand vais-je recevoir ma commande ?',
        answer: 'Les commandes sont généralement expédiées sous 24 à 48h. Une fois expédiée, la livraison prend entre 2 et 5 jours ouvrés selon votre lieu de résidence.'
    },
    {
        question: 'Comment puis-je suivre ma commande ?',
        answer: 'Vous recevrez un email avec un lien de suivi dès que votre commande sera expédiée. Vous pouvez également suivre votre commande depuis votre compte client.'
    },
    {
        question: 'Quels modes de paiement acceptez-vous ?',
        answer: 'Nous utilisons Stripe pour sécuriser vos paiements. Vous pouvez payer par carte bancaire, virement bancaire et autres.'
    },
    {
        question: 'Les produits sont-ils garantis ?',
        answer: ' Oui, tous nos produits sont couverts par une garantie constructeur. La durée varie selon les marques.'
    },
    {
        question: 'Puis-je retourner un produit ?',
        answer: 'Oui, vous disposez de 30 jours pour retourner un produit qui ne vous convient pas. Il doit être dans son état d’origine et non utilisé.'
    },
    {
        question: 'Un produit est en rupture, quand sera-t-il de retour ?',
        answer: ' Nous faisons notre maximum pour réapprovisionner rapidement. Vous pouvez activer une alerte sur la fiche produit pour être informé dès son retour en stock.'
    }
]

export default function Home({ products, comments }: { products: Product[], comments: ProductComment[] }) {
    const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
    const { name, errors } = usePage<SharedData>().props;
    const getInitials = useInitials();

    useEffect(() => {
        const errorMessage = Object.values(errors).flat().join(' ');

        if (errorMessage) toast.error('Une erreur est survenue', {
            description: errorMessage,
        });
    }, [errors])

    const containerVariants = {
        animate: {
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.4,
            },
        },
    };

    const itemVariants = {
        initial: { scale: 0.97 },
        animate: { scale: [0.97, 1.03, 1], transition: { duration: 0.5 } },
    };

    return (
        <BaseLayout>
            <Head title="Accueil" />

            <div className="absolute top-30 right-0 left-0 -z-10 h-250 w-full bg-[radial-gradient(#e5e7eb_1px,#ffffff_1px)] dark:bg-[radial-gradient(#262626FF_1px,#0A0A0AFF_1px)] bg-[size:20px_20px] [mask-image:radial-gradient(ellipse_100%_50%_at_50%_100%,#000_100%,transparent_220%)] after:absolute after:bottom-0 after:h-72 after:w-full after:bg-linear-to-t after:from-background after:to-transparent"></div>

            {/* Hero Section */}
            <section className="pt-10 sm:pt-20">
                <div className="relative w-full rounded-xl px-4 py-8 sm:px-8 sm:py-12">
                    <div className="container mx-auto pt-8 sm:pt-16">
                        <div className="mx-auto max-w-7xl text-center">
                            <h1 className="sm:leading-tighter mb-4 text-4xl leading-tight font-semibold tracking-tight text-black sm:mb-6 sm:text-5xl md:text-7xl dark:text-white">
                                <BoxReveal boxColor="#3b82f6" duration={0.5}>
                                    <span className="text-center">
                                        Votre boutique
                                    </span>
                                </BoxReveal>
                                <BoxReveal boxColor="#3b82f6" duration={0.5}>
                                    <span className="text-primary italic">
                                        — gaming{' '}
                                        <span className="relative pb-2">
                                            de référence
                                            <motion.span
                                                className="absolute bottom-3 left-0 h-0.5 bg-primary"
                                                initial={{ width: 0 }}
                                                animate={{ width: "100%" }}
                                                transition={{ duration: 0.5, ease: "easeOut", delay: 0.7 }}
                                            />
                                        </span>
                                        .
                                    </span>
                                </BoxReveal>
                            </h1>
                            <TextAnimate
                                animation="slideUp"
                                by="word"
                                className="mx-auto mb-6 max-w-3xl px-4 text-base tracking-tight text-black sm:mb-8 sm:px-0 sm:text-lg md:text-xl dark:text-white"
                                delay={0.3}
                                once
                            >
                                Des produits de qualité, sélectionnés pour les joueurs exigeants.
                            </TextAnimate>
                            <div
                                className="mt-6 flex flex-col items-center justify-center gap-3 px-4 sm:mt-8 sm:flex-row sm:px-0">
                                <PrimaryButton href="/products">Découvrir la boutique</PrimaryButton>
                                <Link
                                    href="/news"
                                    className="inline-flex w-full items-center justify-center rounded-md border border-foreground/10 px-5 py-3 text-sm font-medium transition-colors hover:bg-foreground/5 sm:w-auto"
                                >
                                    <Sparkles className="mr-1.5 size-3.5" /> Nouveautés
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 sm:mt-12">
                    <div className="w-full py-6 sm:py-12">
                        <div className="container mx-auto sm:px-4">
                            <div className="flex flex-col gap-6 sm:gap-10">
                                <TextAnimate
                                    animation="blurInUp"
                                    by="character"
                                    className="text-left text-xl font-semibold tracking-tighter sm:text-3xl md:text-4xl lg:text-5xl"
                                    as="h2"
                                    delay={0.4}
                                    once
                                >
                                    Des avantages qui font la différence.
                                </TextAnimate>

                                <motion.div
                                    className="grid grid-cols-1 gap-4 md:gap-8 md:grid-cols-2 lg:grid-cols-4"
                                    variants={containerVariants}
                                    initial="initial"
                                    whileInView="animate"
                                    viewport={{ once: true, amount: 0.2 }}
                                >
                                    {benefits.map((benefit, index) => (
                                        <motion.div
                                            key={index}
                                            variants={itemVariants}
                                            className="space-y-2 rounded-md border border-border/40 bg-background/50 p-4 backdrop-blur-sm"
                                        >
                                            <h3 className="mb-2 flex items-center gap-2 text-sm font-medium tracking-tighter">
                                                <benefit.icon className="inline-block size-4" />
                                                {benefit.title}
                                            </h3>
                                            <p className="text-sm tracking-tighter text-foreground/70">{benefit.description}</p>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Join Section */}
            <section className="relative sm:mx-4 md:mx-6 rounded-xl bg-muted/90 py-24 dark:bg-muted/40">
                <div
                    className="absolute top-0 left-1/2 h-24 w-px -translate-x-1/2 bg-gradient-to-b from-transparent to-border/40"></div>
                <div className="container mx-auto max-w-5xl px-4">
                    <div className="mx-auto mb-16 max-w-2xl text-center">
                        <h2 className="mb-3 text-2xl font-semibold tracking-tighter text-foreground md:text-4xl">
                            Rejoignez l'<span className="text-primary">élite</span> avec <span
                            className="font-bold italic underline">{name}</span>
                        </h2>
                        <p className="text-sm tracking-tighter text-foreground/70 md:text-base">
                            Plus de <span className="font-bold text-primary">1000 produits</span> gaming de qualité
                            professionnelle pour vous aider à
                            <span className="text-3xl font-bold text-primary italic"> dominez la partie.</span>
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-2">
                        {categoriesList.map((category, index) => (
                            <div
                                key={index}
                                className="rounded-lg border border-border/40 bg-background/40 p-4 backdrop-blur-sm transition-all duration-500 hover:border-border/80"
                            >
                                <div className="mb-3 flex items-center gap-2">
                                    <h3 className="text-lg font-semibold tracking-tighter text-foreground">{category.title}</h3>
                                    <div className="h-px flex-1 bg-border/40"></div>
                                </div>
                                <p className="mb-4 text-sm tracking-tighter text-foreground/70">{category.description}</p>
                                <ul className="grid grid-cols-1 gap-1.5 md:grid-cols-2">
                                    {category.items.map((item, itemIndex) => (
                                        <li
                                            key={itemIndex}
                                            className="group flex items-center justify-between rounded-md px-3 py-2 transition-all hover:bg-muted/50"
                                        >
                                            <span
                                                className={cn('text-sm font-medium tracking-tighter text-foreground', item.className)}>
                                                {item.name}
                                            </span>
                                            <span
                                                className="text-xs tracking-tighter text-foreground/70 tabular-nums">{item.count}+</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    <div className="relative mt-24">
                        <div
                            className="absolute bottom-0 left-1/2 h-24 w-px -translate-x-1/2 bg-gradient-to-t from-transparent to-border/40"></div>
                    </div>
                </div>
            </section>

            {/* Top Products Section */}
            <section className="relative py-24">
                <div
                    className="absolute top-0 left-1/2 h-24 w-px -translate-x-1/2 bg-gradient-to-b from-transparent to-border/40"></div>
                <div className="container mx-auto px-4">
                    <div className="mx-auto mt-3 mb-8 md:mb-12 max-w-2xl text-center">
                        <h2 className="mb-2 text-2xl font-semibold tracking-tighter text-foreground md:text-4xl">Nos
                            produits les plus populaires</h2>
                        <p className="text-sm tracking-tighter text-foreground/70 md:text-base">
                            Découvrez les produits qui font le <span
                            className="font-bold text-primary">buzz</span> parmi nos clients.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} onQuickView={() => setQuickViewProduct(product)} />
                        ))}
                    </div>
                </div>
                <div className="relative mt-26">
                    <div
                        className="absolute bottom-0 left-1/2 h-24 w-px -translate-x-1/2 bg-gradient-to-t from-transparent to-border/40"></div>
                </div>
                <ProductQuickViewDialog product={quickViewProduct} open={!!quickViewProduct} onClose={() => setQuickViewProduct(null)} />
            </section>

            {/* Last Review Section */}
            <section className="relative py-24">
                <div
                    className="absolute top-0 left-1/2 h-24 w-px -translate-x-1/2 bg-gradient-to-b from-transparent to-border/40"></div>
                <div className="container mx-auto px-4">
                    <div className="mx-auto mb-8 md:mb-12 max-w-2xl text-center">
                        <h2 className="mb-2 text-2xl font-semibold tracking-tighter text-foreground md:text-4xl">Ce que
                            nos clients disent</h2>
                        <p className="text-sm tracking-tighter text-foreground/70 md:text-base">Des avis authentiques de
                            joueurs satisfaits.</p>
                    </div>

                    <Carousel className="mx-auto w-[calc(100%-48px)] sm:w-full max-w-3xl">
                        <CarouselContent>
                            {comments.map((comment) => (
                                <CarouselItem key={comment.id}>
                                    <div className="flex flex-col items-center gap-4">
                                        <p className="px-4 text-center text-xl italic">{comment.comment}</p>
                                        <div className="mb-2 flex items-center justify-center gap-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star
                                                    key={star}
                                                    className={`size-5 ${
                                                        star <= comment.rating ? 'fill-primary text-primary' : 'text-muted-foreground'
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Avatar className="size-8 overflow-hidden rounded-full">
                                                <AvatarImage src={getStorageUrl(comment.user?.avatar)}
                                                             alt={comment.user?.name} />
                                                <AvatarFallback
                                                    className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                                                    {getInitials(comment.user ? comment.user.name : 'Anonyme')}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="grid flex-1 text-left text-sm leading-tight">
                                                <span className="truncate font-medium">{comment.user?.name}</span>
                                                <span
                                                    className="truncate text-xs text-muted-foreground">{comment.product?.name}</span>
                                            </div>
                                        </div>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                    </Carousel>
                </div>
                <div className="relative mt-28">
                    <div
                        className="absolute bottom-0 left-1/2 h-24 w-px -translate-x-1/2 bg-gradient-to-t from-transparent to-border/40"></div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative md:mx-4 rounded-xl bg-muted/90 dark:bg-muted/40 py-10 md:py-20">
                <div className="container mx-auto px-4">
                    <div className="mx-auto mb-8 max-w-2xl text-center">
                        <h2 className="mb-2 text-2xl font-semibold tracking-tighter text-foreground md:text-4xl">Prêt à
                            passer au niveau supérieur ?</h2>
                        <p className="text-sm tracking-tighter text-foreground/70 md:text-base">
                            Rejoignez notre communauté de gamers passionnés et découvrez des produits qui feront la
                            différence.
                        </p>
                    </div>
                    <div className="flex justify-center">
                        <PrimaryButton href="/products">Explorer la boutique</PrimaryButton>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="relative sm:px-4 mt-12 py-24 max-w-6xl mx-auto">
                <div className="absolute top-0 left-1/2 h-24 w-px -translate-x-1/2 bg-gradient-to-b from-transparent to-border/40"></div>
                <div className="mx-auto mb-8 md:mb-16 max-w-2xl text-center">
                    <h2 className="mb-2 text-2xl font-semibold tracking-tighter text-foreground md:text-4xl">
                        Questions Fréquemment Posées
                    </h2>
                    <p className="text-sm tracking-tighter text-foreground/70 md:text-base">
                        Vous avez des questions ? Nous avons les réponses.
                    </p>
                </div>
                <Accordion
                    type="single"
                    collapsible
                    className="w-full space-y-3"
                    defaultValue="item-1"
                >
                    {faqItems.map((item, index) => (
                        <AccordionItem value={index.toString()} key={`item-${index.toString()}`} className="group">
                            <div className="rounded-xl transition-all duration-200 cursor-pointer hover:bg-muted/30 dark:hover:bg-muted/10 hover:ring-1 hover:ring-border group-data-[state=open]:ring-border group-data-[state=open]:ring-1 dark:group-data-[state=open]:bg-muted/10 group-data-[state=open]:bg-muted/30">
                                <AccordionTrigger>{item.question}</AccordionTrigger>
                                <AccordionContent className="flex flex-col gap-4 text-balance px-6 pb-6">
                                    <div className="text-[16px] text-foreground/70 tracking-tight leading-relaxed space-y-4">
                                        <p>
                                            {item.answer}
                                        </p>
                                    </div>
                                </AccordionContent>
                            </div>
                        </AccordionItem>
                    ))}
                </Accordion>
                <div className="relative mt-28">
                    <div className="absolute bottom-0 left-1/2 h-24 w-px -translate-x-1/2 bg-gradient-to-t from-transparent to-border/40"></div>
                </div>
            </section>

            {/* Footer Section */}
            <section className="sm:px-4 pb-8 max-w-6xl mx-auto mt-12">
                <footer className="relative w-full overflow-hidden bg-black dark:bg-white rounded-2xl tracking-tighter">
                    <div className="max-w-7xl mx-auto px-6 py-8 md:py-12">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-4">
                            <div className="col-span-1 md:col-span-5">
                                <Link href="/" className="text-lg font-bold text-secondary">
                                    {name}
                                </Link>
                                <p className="text-sm text-muted-foreground mb-6 max-w-xs">
                                    La référence pour les gamers : produits de qualité, conseils et communauté passionnée.
                                </p>
                                <span className="text-sm text-muted-foreground">
                                    © 2025 {name}. Tous droits réservés.
                                </span>
                            </div>
                            <div className="flex flex-col col-span-1 md:col-span-2 items-start md:items-end">
                                <h3 className="font-medium text-white dark:text-black mb-3">Boutique</h3>
                                <ul className="space-y-2 w-full md:text-right">
                                    <li><Link className="text-sm text-secondary/70 hover:text-secondary transition-colors duration-200" href="/promotions">Promotions</Link></li>
                                    <li><Link className="text-sm text-secondary/70 hover:text-secondary transition-colors duration-200" href="/brands">Marques</Link></li>
                                    <li><Link className="text-sm text-secondary/70 hover:text-secondary transition-colors duration-200" href="/news">Nouveautés</Link></li>
                                </ul>
                            </div>
                            <div className="flex flex-col col-span-1 md:col-span-2 items-start md:items-end">
                                <h3 className="font-medium text-white dark:text-black mb-3">Ressources</h3>
                                <ul className="space-y-2 w-full md:text-right">
                                    <li><Link className="text-sm text-secondary/70 hover:text-secondary transition-colors duration-200" href="/">Guide d'achat</Link></li>
                                    <li><Link className="text-sm text-secondary/70 hover:text-secondary transition-colors duration-200" href="/">Blog</Link></li>
                                    <li><Link className="text-sm text-secondary/70 hover:text-secondary transition-colors duration-200" href="/">Avis clients</Link></li>
                                    <li><Link className="text-sm text-secondary/70 hover:text-secondary transition-colors duration-200" href="/">Support</Link></li>
                                </ul>
                            </div>
                            <div className="flex flex-col col-span-1 md:col-span-2 items-start md:items-end">
                                <h3 className="font-medium text-white dark:text-black mb-3">Entreprise</h3>
                                <ul className="space-y-2 w-full md:text-right">
                                    <li><Link className="text-sm text-secondary/70 hover:text-secondary transition-colors duration-200" href="/">À propos</Link></li>
                                    <li><Link className="text-sm text-secondary/70 hover:text-secondary transition-colors duration-200" href="/">Contact</Link></li>
                                    <li><Link className="text-sm text-secondary/70 hover:text-secondary transition-colors duration-200" href="/">Confidentialité</Link></li>
                                    <li><Link className="text-sm text-secondary/70 hover:text-secondary transition-colors duration-200" href="/">Conditions</Link></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </footer>
            </section>
        </BaseLayout>
    );
}

const PrimaryButton = (props: { href: string, children: ReactNode }) => {
    return (
        <Link
            href={props.href}
            className="group inline-flex w-full items-center justify-center rounded-md bg-blue-600 px-6 py-3 text-sm font-medium tracking-tight text-white transition-colors hover:bg-blue-700 sm:w-auto dark:bg-blue-500 dark:hover:bg-blue-600"
        >
            {props.children}
            <ArrowRight className="ml-1.5 size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
    );
};
