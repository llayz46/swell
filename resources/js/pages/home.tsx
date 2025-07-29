import { Head, Link, usePage } from '@inertiajs/react';
import BaseLayout from '@/layouts/base-layout';
import {
    ArrowRight,
    BookOpenText,
    Star,
    ShoppingCartIcon,
    Monitor,
    Package,
    Puzzle
} from 'lucide-react';
import type { Product, SharedData } from '@/types';
import { cn } from '@/lib/utils';
import { ProductCard } from '@/components/swell/product/product-card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getStorageUrl } from '@/utils/format-storage-url';
import { useInitials } from '@/hooks/use-initials';
import { ReactNode, useEffect, useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ProductQuickViewDialog } from '@/components/swell/product/product-quick-view-dialog';
import { toast } from 'sonner';
import { BoxReveal } from '@/components/magicui/box-reveal';
import { TextAnimate } from '@/components/magicui/text-animate';

const BENEFITS = [
    {
        icon: Monitor,
        title: 'UI Simple et intuitive',
        description: 'Des composants faciles à utiliser et à personnaliser'
    },
    {
        icon: ShoppingCartIcon,
        title: 'Panier, paiement...',
        description: 'Logique clé en main pour une UX fluide',
    },
    {
        icon: Package,
        title: 'Performances optimisées',
        description: 'Un code léger, optimisé et rapide à charger',
    },
    {
        icon: Puzzle,
        title: 'Structure modulaire',
        description: 'Architecture claire : contrôleurs légers, isolation.',
    }
];

const CATEGORIES = [
    {
        title: 'Authentification',
        description: 'Sécurisez l’accès des utilisateurs avec des outils modernes.',
        items: [
            { name: 'Laravel Built-in' },
            { name: 'Auth 2FA' },
            { name: 'Profil personnalisable', className: 'text-violet-400' },
            { name: 'Vérification d\'email' },
        ]
    },
    {
        title: 'Modélisation',
        description: 'Des modèles Eloquent pour une gestion efficace des données.',
        items: [
            { name: 'Produits : groupes, images' },
            { name: 'Catégories et Marques' },
            { name: 'Panier et Commandes' },
            { name: 'Entièrement personnalisble', className: 'text-green-400' },
        ]
    },
    {
        title: 'Interface Utilisateur',
        description: 'Grâce à Tailwind CSS et Shadcn UI.',
        items: [
            { name: 'Composants UI', className: 'text-blue-400' },
            { name: 'Personnalisation facile' },
            { name: 'Dark mode' },
            { name: 'Responsive et accessible' }
        ]
    },
    {
        title: 'Développement',
        description: 'Un code propre, modulaire et facile à maintenir.',
        items: [
            { name: 'Laravel 12', className: 'text-[#F05340]' },
            { name: 'Tests unitaires inclus' },
            { name: 'Documentation complète' },
            { name: 'Contribution' },
        ]
    }
];

const COMMENTS = [
    {
        id: 1,
        user: {
            name: 'Alice Dupont',
            avatar: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Alice',
        },
        product: {
            name: 'Produit A',
        },
        comment: 'J\'adore ce produit ! Il a vraiment changé ma façon de travailler.',
        rating: 5,
    },
    {
        id: 2,
        user: {
            name: 'Bob Martin',
            avatar: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Bob',
        },
        product: {
            name: 'Produit B',
        },
        comment: 'Très bon produit, mais j\'aurais aimé plus de documentation.',
        rating: 4,
    },
    {
        id: 3,
        user: {
            name: 'Claire Dubois',
            avatar: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Claire',
        },
        product: {
            name: 'Produit C',
        },
        comment: 'Le support client est excellent, ils m\'ont aidé rapidement.',
        rating: 5,
    },
]

const FAQ = [
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

export default function Home({ products }: { products: Product[] }) {
    const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
    const { errors } = usePage<SharedData>().props;
    const getInitials = useInitials();

    useEffect(() => {
        const errorMessage = Object.values(errors).flat().join(' ');

        if (errorMessage) toast.error('Une erreur est survenue', {
            description: errorMessage,
        });
    }, [errors])

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
                                        Le starter-kit
                                    </span>
                                </BoxReveal>
                                <BoxReveal boxColor="#3b82f6" duration={0.5}>
                                    <span className="text-primary italic">
                                        — pour{' '}
                                        <span className="relative">
                                            vous lancer
                                            <span
                                                className="absolute w-full bottom-1 left-0 h-0.5 bg-primary"
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
                                Pensé pour les développeurs : flexible, performant, scalable et prêt à l'emploi.
                            </TextAnimate>
                            <div
                                className="mt-6 flex flex-col items-center justify-center gap-3 px-4 sm:mt-8 sm:flex-row sm:px-0">
                                <PrimaryButton href="/products">Voir nos produits</PrimaryButton>
                                <a
                                    href="https://swellkit.dev"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex w-full items-center justify-center rounded-md border border-foreground/10 px-5 py-3 text-sm font-medium transition-colors hover:bg-foreground/5 sm:w-auto"
                                >
                                    <BookOpenText className="mr-1.5 size-3.5" /> Documentation
                                </a>
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
                                    Une base technique solide, prête à utiliser pour vos projets.
                                </TextAnimate>

                                <div
                                    className="grid grid-cols-1 gap-4 md:gap-8 md:grid-cols-2 lg:grid-cols-4"
                                >
                                    {BENEFITS.map((benefit, index) => (
                                        <div
                                            key={index}
                                            className="space-y-2 rounded-md border border-border/40 bg-background/50 p-4 backdrop-blur-sm"
                                        >
                                            <h3 className="mb-2 flex items-center gap-2 text-sm font-medium tracking-tighter">
                                                <benefit.icon className="inline-block size-4" />
                                                {benefit.title}
                                            </h3>
                                            <p className="text-sm tracking-tighter text-foreground/70">{benefit.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Join Section */}
            <section className="sm:mx-4 md:mx-6 rounded-xl bg-muted/90 py-24 dark:bg-muted/40">
                <div className="container mx-auto max-w-5xl px-4">
                    <div className="mx-auto mb-16 max-w-2xl text-center">
                        <h2 className="mb-3 text-2xl font-semibold tracking-tighter text-foreground md:text-4xl">
                            Conçevez des projets <span className="text-primary">ambitieux</span> avec <span
                            className="font-bold italic underline">Swell</span>
                        </h2>
                        <p className="text-sm tracking-tighter text-foreground/70 md:text-base">
                            Un <span className="font-bold text-primary">starter-kit e-commerce</span> complet et évolutif,
                            pensé pour accélérer vos projets et
                            <span className="text-3xl font-bold text-primary italic"> intégrer facilement vos produits.</span>
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-2">
                        {CATEGORIES.map((category, index) => (
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
                                            className="group rounded-md px-3 py-2 transition-all hover:bg-muted/50"
                                        >
                                            <span
                                                className={cn('text-sm font-medium tracking-tighter text-foreground', item.className)}>
                                                {item.name}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Top Products Section */}
            <section className="py-24">
                <div className="container mx-auto px-4">
                    <div className="mx-auto mt-3 mb-8 md:mb-12 max-w-2xl text-center">
                        <h2 className="mb-2 text-2xl font-semibold tracking-tighter text-foreground md:text-4xl">
                            Exemples de produits
                        </h2>
                        <p className="text-sm tracking-tighter text-foreground/70 md:text-base">
                            Découvrez une sélection de produits <span
                            className="font-bold text-primary">populaires</span> pour vous inspirer dans vos projets.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} onQuickView={() => setQuickViewProduct(product)} />
                        ))}
                    </div>
                </div>

                <ProductQuickViewDialog product={quickViewProduct} open={!!quickViewProduct} onClose={() => setQuickViewProduct(null)} />
            </section>

            {/* Last Review Section */}
            <section className="pt-24 pb-36">
                <div className="container mx-auto px-4">
                    <div className="mx-auto mb-8 md:mb-12 max-w-2xl text-center">
                        <h2 className="mb-2 text-2xl font-semibold tracking-tighter text-foreground md:text-4xl">Ce que
                            nos clients disent</h2>
                        <p className="text-sm tracking-tighter text-foreground/70 md:text-base">Des avis authentiques de
                            joueurs satisfaits.</p>
                    </div>

                    <Carousel className="mx-auto w-[calc(100%-48px)] sm:w-full max-w-3xl">
                        <CarouselContent>
                            {COMMENTS.map((comment) => (
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
            </section>

            {/* CTA Section */}
            <section className="relative md:mx-4 rounded-xl bg-muted/90 dark:bg-muted/40 py-10 md:py-20">
                <div className="container mx-auto px-4">
                    <div className="mx-auto mb-8 max-w-2xl text-center">
                        <h2 className="mb-2 text-2xl font-semibold tracking-tighter text-foreground md:text-4xl">
                            Prêt à lancer votre projet grâce à Swell ?
                        </h2>
                        <p className="text-sm tracking-tighter text-foreground/70 md:text-base">
                            Lancez vous rapidement avec Swell, conçu pour simplifier le développement et vous permettre de vous concentrer sur l'essentiel.
                        </p>
                    </div>
                    <div className="flex justify-center">
                        <PrimaryButton href="https://swellkit.dev">Voir la documentation</PrimaryButton>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="sm:px-4 mt-12 py-24 max-w-6xl mx-auto">
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
                    {FAQ.map((item, index) => (
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
            </section>

            {/* Footer Section */}
            <section className="sm:px-4 pb-8 max-w-6xl mx-auto mt-12">
                <footer className="relative w-full overflow-hidden bg-black dark:bg-white rounded-2xl tracking-tighter">
                    <div className="max-w-7xl mx-auto px-6 py-8 md:py-12">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-4">
                            <div className="col-span-1 md:col-span-8">
                                <Link href="/" className="text-lg font-bold text-secondary">
                                    Swell
                                </Link>
                                <p className="text-sm text-muted-foreground mb-6 max-w-xs">
                                    Un starter-kit simple et flexible pour démarrer vos projets e-commerce.
                                </p>
                                <span className="text-sm text-muted-foreground">
                                    Free to contribute.
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
                                    <li><a className="text-sm text-secondary/70 hover:text-secondary transition-colors duration-200" href="https://swellkit.dev" target="_blank" rel="noopener noreferrer">Documentation</a></li>
                                    <li><a className="text-sm text-secondary/70 hover:text-secondary transition-colors duration-200" href="https://github.com/llayz46/swell" target="_blank" rel="noopener noreferrer">Discussion</a></li>
                                    <li><Link className="text-sm text-secondary/70 hover:text-secondary transition-colors duration-200" href="/">Roadmap</Link></li>
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
    const externalLink = props.href && props.href.startsWith('http');

    if (externalLink) {
        return (
            <a
                href={props.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex w-full items-center justify-center rounded-md bg-blue-600 px-6 py-3 text-sm font-medium tracking-tight text-white transition-colors hover:bg-blue-700 sm:w-auto dark:bg-blue-500 dark:hover:bg-blue-600"
            >
                {props.children}
                <ArrowRight className="ml-1.5 size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
        );
    }

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
