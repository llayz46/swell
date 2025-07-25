import { Head, Link } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';

export default function FeatureDisabled({ feature }: { feature: string }) {
    return (
        <div className="container h-screen flex items-center justify-center flex-col mx-auto px-4">
            <Head title="Fonctionnalité désactivée" />

            <Link href={route('home')} className="flex items-center mx-auto w-fit gap-1 font-medium mb-12">
                <div className="flex size-9 items-center justify-center">
                    <AppLogoIcon className="size-9 fill-current text-black dark:text-white" />
                </div>
                <div className="hidden lg:block ml-1 grid flex-1 text-left text-2xl">
                    <span className="mb-0.5 leading-tight font-semibold">Swell</span>
                </div>
            </Link>

            <h1 className="text-3xl font-bold mb-4">Fonctionnalité désactivée</h1>
            <p className="mb-4">
                La fonctionnalité <strong>{feature}</strong> est actuellement désactivée.
            </p>
            <p className="mb-6 text-center">
                Consultez la documentation pour plus d'informations <br/> sur cette fonctionnalité et comment l'activer.
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
    )
}
