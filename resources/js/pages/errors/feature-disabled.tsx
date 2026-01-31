import HomeController from '@/actions/App/Http/Controllers/HomeController';
import AppLogoIcon from '@/components/app-logo-icon';
import { Head, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

export default function FeatureDisabled({ feature }: { feature: string }) {
    const { t } = useTranslation();

    return (
        <div className="container mx-auto flex h-screen flex-col items-center justify-center px-4">
            <Head title={t('error.feature.title')} />

            <Link href={HomeController.url()} className="mx-auto mb-12 flex w-fit items-center gap-1 font-medium">
                <div className="flex size-9 items-center justify-center">
                    <AppLogoIcon className="size-9 fill-current text-black dark:text-white" />
                </div>
                <div className="ml-1 grid hidden flex-1 text-left text-2xl lg:block">
                    <span className="mb-0.5 leading-tight font-semibold">Swell</span>
                </div>
            </Link>

            <h1 className="mb-4 text-3xl font-bold">{t('error.feature.title')}</h1>
            <p className="mb-4" dangerouslySetInnerHTML={{ __html: t('error.feature.description', { feature }) }} />
            <p className="mb-6 text-center">
                {t('error.feature.docs_info')}
            </p>
            <a href="https://swellkit.dev" target="_blank" className="text-blue-600 hover:underline">
                {t('error.feature.docs_link')}
            </a>

            <div className="mt-8">
                <Link href="/" className="hover:underline">
                    {t('error.feature.back_home')}
                </Link>
            </div>
        </div>
    );
}
