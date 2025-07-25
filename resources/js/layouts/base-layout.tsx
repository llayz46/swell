import { CookieBanner } from '@/components/cookie-banner';
import { Header } from '@/components/header';
import { InfoBanner } from '@/components/info-banner';
import { NavCategories } from '@/components/nav-categories';
import { ReactNode } from 'react';
import { ToasterWrapper } from '@/components/toaster-wrapper';

export default function BaseLayout({ children }: { children: ReactNode }) {

    return (
        <>
            <InfoBanner />


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
