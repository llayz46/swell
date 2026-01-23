import AppLogoIcon from '@/components/app-logo-icon';
import { BoxReveal } from '@/components/magicui/box-reveal';
import { TextAnimate } from '@/components/magicui/text-animate';
import { Button } from '@/components/ui/button';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Home, Search } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-4">
            <Head title="Page introuvable" />

            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="bg-primary/3 absolute -top-1/2 left-1/2 size-200 -translate-x-1/2 rounded-full blur-3xl" />
                <div className="bg-primary/5 absolute -bottom-1/4 -right-1/4 size-150 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 flex flex-col items-center text-center">
                <Link href="/" className="mb-12 flex items-center gap-2 transition-opacity hover:opacity-80">
                    <AppLogoIcon className="size-10 fill-current text-foreground" />
                    <span className="text-2xl font-semibold tracking-tight">Swell</span>
                </Link>

                <BoxReveal boxColor="hsl(var(--primary))" duration={0.5}>
                    <h1 className="text-[120px] leading-none font-bold tracking-tighter text-foreground sm:text-[180px]">404</h1>
                </BoxReveal>

                <div className="mt-4 mb-3">
                    <TextAnimate animation="blurInUp" by="word" className="text-2xl font-semibold text-foreground sm:text-3xl">
                        Page introuvable
                    </TextAnimate>
                </div>

                <TextAnimate animation="fadeIn" by="line" delay={0.3} className="mb-10 max-w-md text-muted-foreground">
                    La page que vous recherchez n'existe pas ou a été déplacée. Vérifiez l'URL ou retournez à l'accueil.
                </TextAnimate>

                <div className="flex flex-col gap-3 sm:flex-row">
                    <Button asChild size="lg" className="min-w-45 gap-2">
                        <Link href="/">
                            <Home className="size-4" />
                            Retour à l'accueil
                        </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="min-w-45 gap-2">
                        <Link href="/products">
                            <Search className="size-4" />
                            Voir les produits
                        </Link>
                    </Button>
                </div>

                <button
                    onClick={() => window.history.back()}
                    className="mt-8 flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                    <ArrowLeft className="size-4" />
                    Revenir en arrière
                </button>
            </div>

            <div className="absolute bottom-8 text-xs text-muted-foreground/60">Erreur 404 — Swell</div>
        </div>
    );
}
