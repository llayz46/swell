import { CookieBanner } from '@/components/swell/cookie-banner';
import { Header } from '@/components/swell/header';
import { InfoBanner } from '@/components/swell/info-banner';
import { NavCategories } from '@/components/swell/nav-categories';
import { ReactNode } from 'react';
import { ToasterWrapper } from '@/components/swell/toaster-wrapper';
import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';

export default function BaseLayout({ children }: { children: ReactNode }) {
    const { swell } = usePage<SharedData>().props;

    return (
        <>
            {swell.banner.enabled && <InfoBanner />}

            <div className="mx-4">
                <Header />

                <NavCategories />

                {children}
            </div>

            <ToasterWrapper />

            <CookieBanner />
        </>
    );
}
