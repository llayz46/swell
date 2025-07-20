import { CookieBanner } from '@/components/cookie-banner';
import { Header } from '@/components/header';
import { InfoBanner } from '@/components/info-banner';
import { NavCategories } from '@/components/nav-categories';
import { ReactNode } from 'react';
import { Toaster } from 'sonner';
import { useAppearance } from '@/hooks/use-appearance';

export default function BaseLayout({ children }: { children: ReactNode }) {
    const { appearance } = useAppearance();

    return (
        <>
            <InfoBanner />


            <div className="mx-4">
                <Header />

                <NavCategories />

                {children}
            </div>

            <Toaster
                theme={appearance}
                toastOptions={{
                    classNames: {
                        toast: '!bg-background !border !border-border !text-sm !font-medium !font-sans',
                        description: '!text-sm !text-muted-foreground !font-sans',
                    },
                }}
            />

            <CookieBanner />
        </>
    );
}
