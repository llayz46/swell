import { GithubLight } from '@/components/ui/svgs/githubLight';
import { GithubDark } from '@/components/ui/svgs/githubDark';
import AppLogoIcon from '@/components/app-logo-icon';
import { BoxReveal } from '@/components/magicui/box-reveal';
import { TextAnimate } from '@/components/magicui/text-animate';
import { ProductCard } from '@/components/swell/product/product-card';
import { ProductQuickViewDialog } from '@/components/swell/product/product-quick-view-dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { useInitials } from '@/hooks/use-initials';
import { useAppearance } from '@/hooks/use-appearance';
import BaseLayout from '@/layouts/base-layout';
import { cn } from '@/lib/utils';
import type { Product, SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight, BookOpenText, Monitor, Package, Puzzle, ShoppingCartIcon, Star, BookOpen } from 'lucide-react';
import { ReactNode, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useTranslation } from 'react-i18next';

export default function Home({ products }: { products: Product[] }) {
    const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
    const getInitials = useInitials();
    const props = usePage<SharedData>().props;
    const { appearance } = useAppearance();
    const { t } = useTranslation();
    
    const BENEFITS = [
        {
            icon: Monitor,
            title: t('home.benefits.ui.title'),
            description: t('home.benefits.ui.description'),
        },
        {
            icon: ShoppingCartIcon,
            title: t('home.benefits.cart.title'),
            description: t('home.benefits.cart.description'),
        },
        {
            icon: Package,
            title: t('home.benefits.performance.title'),
            description: t('home.benefits.performance.description'),
        },
        {
            icon: Puzzle,
            title: t('home.benefits.modular.title'),
            description: t('home.benefits.modular.description'),
        },
    ];
    
    const CATEGORIES = [
        {
            title: t('home.categories.auth.title'),
            description: t('home.categories.auth.description'),
            items: [
                { name: t('home.categories.auth.item1') },
                { name: t('home.categories.auth.item2') },
                { name: t('home.categories.auth.item3'), className: 'text-violet-400' },
                { name: t('home.categories.auth.item4') },
            ],
        },
        {
            title: t('home.categories.models.title'),
            description: t('home.categories.models.description'),
            items: [
                { name: t('home.categories.models.item1') },
                { name: t('home.categories.models.item1') },
                { name: t('home.categories.models.item1') },
                { name: t('home.categories.models.item1'), className: 'text-green-400' },
            ],
        },
        {
            title: t('home.categories.ui.title'),
            description: t('home.categories.ui.description'),
            items: [
                { name: t('home.categories.ui.item1'), className: 'text-blue-400' },
                { name: t('home.categories.ui.item1') },
                { name: t('home.categories.ui.item1') },
                { name: t('home.categories.ui.item1') },
            ],
        },
        {
            title: t('home.categories.dev.title'),
            description: t('home.categories.dev.description'),
            items: [
                { name: t('home.categories.dev.item1'), className: 'text-[#F05340]' },
                { name: t('home.categories.dev.item1') },
                { name: t('home.categories.dev.item1') },
                { name: t('home.categories.dev.item1') },
            ],
        },
    ];
    
    const REVIEWS = [
        {
            id: 1,
            user: {
                name: 'Alice Dupont',
                avatar: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Alice',
            },
            product: {
                name: 'Produit A',
            },
            comment: "J'adore ce produit ! Il a vraiment changé ma façon de travailler.",
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
            comment: "Très bon produit, mais j'aurais aimé plus de documentation.",
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
            comment: "Le support client est excellent, ils m'ont aidé rapidement.",
            rating: 5,
        },
    ];
    
    const FAQ = [
        {
            question: t('home.faq.q1'),
            answer: t('home.faq.a1'),
        },
        {
            question: t('home.faq.q2'),
            answer: t('home.faq.a2'),
        },
        {
            question: t('home.faq.q3'),
            answer: t('home.faq.a3'),
        },
        {
            question: t('home.faq.q4'),
            answer: t('home.faq.a4'),
        },
        {
            question: t('home.faq.q5'),
            answer: t('home.faq.a5'),
        },
        {
            question: t('home.faq.q6'),
            answer: t('home.faq.a6'),
        },
    ];

    return (
        <BaseLayout>
            <Head title={t('home.title')} />

            <div className="absolute top-30 right-0 left-0 -z-10 h-250 w-full bg-[radial-gradient(#e5e7eb_1px,#ffffff_1px)] mask-[radial-gradient(ellipse_100%_50%_at_50%_100%,#000_100%,transparent_220%)] bg-size-[20px_20px] after:absolute after:bottom-0 after:h-72 after:w-full after:bg-linear-to-t after:from-background after:to-transparent dark:bg-[radial-gradient(#262626FF_1px,#0A0A0AFF_1px)]"></div>

            {/* Hero Section */}
            <section className="pt-10 sm:pt-20">
                <div className="relative w-full rounded-xl py-8 sm:px-8 sm:py-12">
                    <div className="container mx-auto pt-8 sm:pt-16">
                        <div className="mx-auto max-w-7xl text-center">
                            <h1 className="sm:leading-tighter mb-4 text-4xl leading-tight font-semibold tracking-tight text-black sm:mb-6 sm:text-5xl md:text-7xl dark:text-white">
                                <BoxReveal boxColor="#3b82f6" duration={0.5}>
                                    <span className="text-center">{t('home.hero.title_line1')}</span>
                                </BoxReveal>
                                <BoxReveal boxColor="#3b82f6" duration={0.5}>
                                    <span className="text-primary italic">
                                        {t('home.hero.title_line2')}{' '}
                                        <span className="relative">
                                            {t('home.hero.title_highlight')}
                                            <span className="absolute bottom-1 left-0 h-0.5 w-full bg-primary" />
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
                                {t('home.hero.subtitle')}
                            </TextAnimate>
                            <div className="mt-6 flex flex-col items-center justify-center gap-3 px-4 sm:mt-8 sm:flex-row sm:px-0">
                                <PrimaryButton href="/products">{t('home.hero.cta')}</PrimaryButton>
                                <a
                                    href="https://swellkit.dev"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex w-full items-center justify-center rounded-md border border-foreground/10 px-5 py-3 text-sm font-medium transition-colors hover:bg-foreground/5 sm:w-auto"
                                >
                                    <BookOpenText className="mr-1.5 size-3.5" /> {t('common.documentation')}
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
                                    {t('home.benefits.title')}
                                </TextAnimate>

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
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
            <section className="container mx-auto">
                <div className="rounded-xl bg-muted/90 dark:bg-muted/40 py-4 sm:py-24 sm:mx-4">
                    <div className="mx-4 sm:mx-auto mb-8 sm:mb-16 max-w-2xl text-center">
                        <h2 className="mb-3 text-lg sm:text-2xl font-semibold tracking-tighter text-foreground md:text-4xl">
                            {t('home.join.title')} <span className="text-primary">{t('home.join.title_highlight')}</span> {t('home.join.title_suffix')}{' '}
                            <span className="font-bold italic underline">{props.name}</span>
                        </h2>
                        <p className="text-sm tracking-tighter text-foreground/70 md:text-base">
                            {t('home.join.description_line1')} <span className="font-bold text-primary">{t('home.join.description_line2')}</span> {t('home.join.description_line3')}
                            <span className="text-xl sm:text-3xl font-bold text-primary italic"> {t('home.join.description_highlight')}</span>
                        </p>
                    </div>
    
                    <div className="max-w-5xl xl:mx-auto grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-2 mx-4">
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
                                        <li key={itemIndex} className="group rounded-md px-3 py-2 transition-all hover:bg-muted/50">
                                            <span className={cn('text-sm font-medium tracking-tighter text-foreground', item.className)}>
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
            <section className="pt-12 sm:pt-16 md:pt-24">
                <div className="container mx-auto sm:px-4">
                    <div className="mx-auto mt-3 mb-8 max-w-2xl text-center md:mb-12">
                        <h2 className="mb-2 text-2xl font-semibold tracking-tighter text-foreground md:text-4xl">{t('home.products.title')}</h2>
                        <p className="text-sm tracking-tighter text-foreground/70 md:text-base">
                            {t('home.products.description_line1')} <span className="font-bold text-primary">{t('home.products.description_highlight')}</span> {t('home.products.description_line2')}
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
            <section className="pt-12 sm:pt-16 md:pt-24">
                <div className="container mx-auto px-4">
                    <div className="mx-auto mb-8 max-w-2xl text-center md:mb-12">
                        <h2 className="mb-2 text-2xl font-semibold tracking-tighter text-foreground md:text-4xl">{t('home.reviews.title')}</h2>
                        <p className="text-sm tracking-tighter text-foreground/70 md:text-base">{t('home.reviews.description')}</p>
                    </div>

                    <Carousel className="relative mx-auto w-[calc(100%-48px)] max-w-3xl sm:w-full">
                        <CarouselContent>
                            {REVIEWS.map((review) => (
                                <CarouselItem key={review.id}>
                                    <div className="flex flex-col items-center gap-4">
                                        <p className="px-4 text-center text-xl italic">{review.comment}</p>
                                        <div className="mb-2 flex items-center justify-center gap-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star
                                                    key={star}
                                                    className={`size-5 ${
                                                        star <= review.rating ? 'fill-primary text-primary' : 'text-muted-foreground'
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Avatar className="size-8 overflow-hidden rounded-full">
                                                <AvatarImage src={review.user?.avatar} alt={review.user?.name} />
                                                <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                                                    {getInitials(review.user ? review.user.name : 'Anonyme')}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="grid flex-1 text-left text-sm leading-tight">
                                                <span className="truncate font-medium">{review.user?.name}</span>
                                                <span className="truncate text-xs text-muted-foreground">{review.product?.name}</span>
                                            </div>
                                        </div>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="max-[900px]:-bottom-12 max-[900px]:translate-y-0 max-[900px]:top-auto max-[900px]:left-2" />
                        <CarouselNext className="max-[900px]:-bottom-12 max-[900px]:translate-y-0 max-[900px]:top-auto max-[900px]:right-2" />
                    </Carousel>
                </div>
            </section>

            {/* CTA Section */}
            <section className="container mx-auto pt-24">
                <div className="rounded-xl bg-muted/90 max-sm:p-4 sm:py-10 sm:mx-4 md:py-20 dark:bg-muted/40">
                    <div className="mx-auto mb-8 max-w-2xl text-center">
                        <h2 className="mb-2 text-2xl font-semibold tracking-tighter text-foreground md:text-4xl">
                            {t('home.cta.title')}
                        </h2>
                        <p className="text-sm tracking-tighter text-foreground/70 md:text-base">
                            {t('home.cta.description')}
                        </p>
                    </div>
                    <div className="flex justify-center">
                        <PrimaryButton href="https://swellkit.dev">{t('home.cta.button')}</PrimaryButton>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="mx-auto max-w-6xl pt-12 sm:pt-16 md:pt-24 sm:px-4">
                <div className="mx-auto mb-8 max-w-2xl text-center md:mb-16">
                    <h2 className="mb-2 text-2xl font-semibold tracking-tighter text-foreground md:text-4xl">{t('home.faq.title')}</h2>
                    <p className="text-sm tracking-tighter text-foreground/70 md:text-base">{t('home.faq.description')}</p>
                </div>
                <Accordion type="single" collapsible className="w-full space-y-3" defaultValue="item-1">
                    {FAQ.map((item, index) => (
                        <AccordionItem value={index.toString()} key={`item-${index.toString()}`} className="group">
                            <div className="cursor-pointer rounded-xl transition-all duration-200 group-data-[state=open]:bg-muted/30 group-data-[state=open]:ring-1 group-data-[state=open]:ring-border hover:bg-muted/30 hover:ring-1 hover:ring-border dark:group-data-[state=open]:bg-muted/10 dark:hover:bg-muted/10">
                                <AccordionTrigger>{item.question}</AccordionTrigger>
                                <AccordionContent className="flex flex-col gap-4 px-6 pb-6 text-balance">
                                    <div className="space-y-4 text-[16px] leading-relaxed tracking-tight text-foreground/70">
                                        <p>{item.answer}</p>
                                    </div>
                                </AccordionContent>
                            </div>
                        </AccordionItem>
                    ))}
                </Accordion>
            </section>

            {/* Footer Section */}
            <section className="container mx-auto pt-12 sm:pt-16 md:pt-24 mb-8 sm:px-4">
                <footer className="bg-slate-light p-1.5 shadow-inner rounded-4xl">
                    <div className="shadow-xs-with-border bg-muted/90 dark:bg-muted/40 rounded-3xl">
                        <div className="p-5 md:p-12 grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-4">
                            <div className="flex flex-col gap-4 col-span-1 md:col-span-8">
                                <Link href="/" className="flex items-center gap-1 text-lg font-bold">
                                    <AppLogoIcon className="size-5 fill-current dark:text-white" />
                                    {props.name}
                                </Link>
                                <p className="max-w-xs text-sm text-muted-foreground">
                                    {t('home.footer.description')}
                                </p>
                                <div className="flex items-center gap-2">
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button size="icon" variant="outline" className="bg-transparent hover:bg-muted/20" asChild>
                                                <a
                                                    href="https://github.com/llayz46/swell"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    {appearance === 'dark' || appearance === 'system' ? (
                                                        <GithubDark className="size-5" />
                                                    ): (
                                                        <GithubLight className="size-5" />
                                                    )}
                                                </a>
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Swell GitHub</p>
                                        </TooltipContent>
                                    </Tooltip>
                                    
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button size="icon" variant="outline" className="bg-transparent hover:bg-muted/20" asChild>
                                                <a
                                                    href="https://github.com/llayz46/swell"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <BookOpen className="size-5" />
                                                </a>
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Swell Documentation</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </div>
                            </div>
                            
                            <div className="md:hidden flex justify-between">
                                <div className="w-1/2 col-span-1 flex flex-col items-start">
                                    <h3 className="mb-3 font-medium">{t('home.footer.shop')}</h3>
                                    <ul className="w-full space-y-2 md:text-right">
                                        <li>
                                            <Button variant="link" size="sm" className="text-muted-foreground p-0" asChild>
                                                <Link
                                                    className="text-muted-foreground"
                                                    href="/promotions"
                                                >
                                                    Promotions
                                                </Link>
                                            </Button>
                                        </li>
                                        <li>
                                            <Button variant="link" size="sm" className="text-muted-foreground p-0" asChild>
                                                <Link
                                                    className="text-muted-foreground"
                                                    href="/brands"
                                                >
                                                    Marques
                                                </Link>
                                            </Button>
                                        </li>
                                        <li>
                                            <Button variant="link" size="sm" className="text-muted-foreground p-0" asChild>
                                                <Link
                                                    className="text-muted-foreground"
                                                    href="/products?sort=news"
                                                >
                                                    Nouveautés
                                                </Link>
                                            </Button>
                                        </li>
                                    </ul>
                                </div>
                                
                                <div className="w-1/2 col-span-1 flex flex-col items-start">
                                    <h3 className="mb-3 font-medium">{t('home.footer.resources')}</h3>
                                    <ul className="w-full space-y-2 md:text-right">
                                        <li>
                                            <Button variant="link" size="sm" className="text-muted-foreground p-0" asChild>
                                                <a
                                                    className="text-muted-foreground"
                                                    href="https://swellkit.dev"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    Documentation
                                                </a>
                                            </Button>
                                        </li>
                                        <li>
                                            <Button variant="link" size="sm" className="text-muted-foreground p-0" asChild>
                                                <a
                                                    className="text-muted-foreground"
                                                    href="https://github.com/llayz46/swell"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    Discussion
                                                </a>
                                            </Button>
                                        </li>
                                        <li>
                                            <Button variant="link" size="sm" className="text-muted-foreground p-0" asChild>
                                                <a
                                                    className="text-muted-foreground"
                                                    href="https://github.com/llayz46/swell"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    Roadmap
                                                </a>
                                            </Button>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            
                            <div className="hidden col-span-1 md:flex flex-col items-start md:col-span-2 md:items-end">
                                <h3 className="mb-3 font-medium">{t('home.footer.shop')}</h3>
                                <ul className="w-full space-y-2 md:text-right">
                                    <li>
                                        <Button variant="link" size="sm" className="text-muted-foreground p-0" asChild>
                                            <Link
                                                className="text-muted-foreground"
                                                href="/promotions"
                                            >
                                                Promotions
                                            </Link>
                                        </Button>
                                    </li>
                                    <li>
                                        <Button variant="link" size="sm" className="text-muted-foreground p-0" asChild>
                                            <Link
                                                className="text-muted-foreground"
                                                href="/brands"
                                            >
                                                Marques
                                            </Link>
                                        </Button>
                                    </li>
                                    <li>
                                        <Button variant="link" size="sm" className="text-muted-foreground p-0" asChild>
                                            <Link
                                                className="text-muted-foreground"
                                                href="/products?sort=news"
                                            >
                                                Nouveautés
                                            </Link>
                                        </Button>
                                    </li>
                                </ul>
                            </div>
                            <div className="hidden col-span-1 md:flex flex-col items-start md:col-span-2 md:items-end">
                                <h3 className="mb-3 font-medium">{t('home.footer.resources')}</h3>
                                <ul className="w-full space-y-2 md:text-right">
                                    <li>
                                        <Button variant="link" size="sm" className="text-muted-foreground p-0" asChild>
                                            <a
                                                className="text-muted-foreground"
                                                href="https://swellkit.dev"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                Documentation
                                            </a>
                                        </Button>
                                    </li>
                                    <li>
                                        <Button variant="link" size="sm" className="text-muted-foreground p-0" asChild>
                                            <a
                                                className="text-muted-foreground"
                                                href="https://github.com/llayz46/swell"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                {t('home.footer.discussion')}
                                            </a>
                                        </Button>
                                    </li>
                                    <li>
                                        <Button variant="link" size="sm" className="text-muted-foreground p-0" asChild>
                                            <a
                                                className="text-muted-foreground"
                                                href="https://github.com/llayz46/swell"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                {t('home.footer.roadmap')}
                                            </a>
                                        </Button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="flex max-md:flex-col max-md:text-center items-center justify-between mx-2 md:mx-12 my-3 md:my-5 text-sm text-muted-foreground">
                        <p>
                            {t('home.footer.copyright', { year: new Date().getFullYear() })}
                        </p>
                        
                        <div className="flex items-center gap-4">
                            <Button variant="link" size="sm" className="text-muted-foreground p-0" asChild>
                                <a
                                    className="text-muted-foreground"
                                    href="https://github.com/llayz46/swell"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {t('home.footer.star_on_github')}
                                </a>
                            </Button>
                            
                            |
                            
                            <Button variant="link" size="sm" className="text-muted-foreground p-0" asChild>
                                <a
                                    className="text-muted-foreground"
                                    href="https://github.com/llayz46/swell"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {t('common.contribute')}
                                </a>
                            </Button>
                        </div>
                    </div>
                </footer>
            </section>
        </BaseLayout>
    );
}

const PrimaryButton = (props: { href: string; children: ReactNode }) => {
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
