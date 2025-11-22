import AppLogoIcon from '@/components/app-logo-icon';
import { Head, Link } from '@inertiajs/react';

export default function FeatureDisabled({ feature }: { feature: string }) {
    return (
        <div className="container mx-auto flex h-screen flex-col items-center justify-center px-4">
            <Head title="Fonctionnalité désactivée" />

            <Link href={route('home')} className="mx-auto mb-12 flex w-fit items-center gap-1 font-medium">
                <div className="flex size-9 items-center justify-center">
                    <AppLogoIcon className="size-9 fill-current text-black dark:text-white" />
                </div>
                <div className="ml-1 grid hidden flex-1 text-left text-2xl lg:block">
                    <span className="mb-0.5 leading-tight font-semibold">Swell</span>
                </div>
            </Link>

            <h1 className="mb-4 text-3xl font-bold">Fonctionnalité désactivée</h1>
            <p className="mb-4">
                La fonctionnalité <strong>{feature}</strong> est actuellement désactivée.
            </p>
            <p className="mb-6 text-center">
                Consultez la documentation pour plus d'informations <br /> sur cette fonctionnalité et comment l'activer.
            </p>
            <a href="https://swellkit.dev" target="_blank" className="text-blue-600 hover:underline">
                Lien vers la documentation
            </a>

            <div className="mt-8">
                <Link href="/" className="hover:underline">
                    Retour à l'accueil
                </Link>
            </div>
        </div>
    );
}
