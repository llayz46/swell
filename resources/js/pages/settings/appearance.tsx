import { Head } from '@inertiajs/react';
import { dashboard } from '@/routes';
import { edit } from '@/routes/appearance';
import AppearanceTabs from '@/components/appearance-tabs';
import HeadingSmall from '@/components/heading-small';
import { type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Thème',
        href: edit().url,
    },
];

export default function Appearance() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Thème" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Thème" description="Personnalisez l'apparence visuelle de votre interface" />
                    <AppearanceTabs />
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
