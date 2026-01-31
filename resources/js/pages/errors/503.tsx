import AppLogoIcon from '@/components/app-logo-icon';
import { BoxReveal } from '@/components/magicui/box-reveal';
import { TextAnimate } from '@/components/magicui/text-animate';
import { Button } from '@/components/ui/button';
import { Head } from '@inertiajs/react';
import { RefreshCw, Wrench } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function ServiceUnavailable() {
    const { t } = useTranslation();

    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-4">
            <Head title={t('error.503.title')} />

            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -top-1/2 left-1/2 size-200 -translate-x-1/2 rounded-full bg-blue-500/5 blur-3xl" />
                <div className="absolute -bottom-1/4 -right-1/4 size-150 rounded-full bg-blue-500/3 blur-3xl" />
            </div>

            <div className="relative z-10 flex flex-col items-center text-center">
                <div className="mb-12 flex items-center gap-2">
                    <AppLogoIcon className="size-10 fill-current text-foreground" />
                    <span className="text-2xl font-semibold tracking-tight">Swell</span>
                </div>

                <BoxReveal boxColor="hsl(217 91% 60%)" duration={0.5}>
                    <h1 className="px-2 text-[120px] leading-none font-bold tracking-tighter text-foreground sm:text-[180px]">503</h1>
                </BoxReveal>

                <div className="mt-4 mb-3">
                    <TextAnimate animation="blurInUp" by="word" className="text-2xl font-semibold text-foreground sm:text-3xl">
                        {t('error.503.title')}
                    </TextAnimate>
                </div>

                <TextAnimate animation="fadeIn" by="line" delay={0.3} className="mb-10 max-w-md text-muted-foreground">
                    {t('error.503.description')}
                </TextAnimate>

                <div className="flex flex-col gap-3 sm:flex-row">
                    <Button size="lg" className="min-w-45 gap-2" onClick={() => window.location.reload()}>
                        <RefreshCw className="size-4" />
                        {t('error.503.refresh')}
                    </Button>
                    <Button size="lg" variant="outline" className="min-w-45 gap-2" disabled>
                        <Wrench className="size-4" />
                        {t('error.503.maintenance')}
                    </Button>
                </div>

                <p className="mt-8 text-sm text-muted-foreground">{t('error.503.patience')}</p>
            </div>

            <div className="absolute bottom-8 text-xs text-muted-foreground/60">Erreur 503 — Swell</div>
        </div>
    );
}
