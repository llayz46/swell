import { destroy as logout } from '@/actions/Laravel/Fortify/Http/Controllers/AuthenticatedSessionController';
import { store as verificationSend } from '@/actions/Laravel/Fortify/Http/Controllers/EmailVerificationNotificationController';
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';
import { useTranslation } from 'react-i18next';

import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import AuthLayout from '@/layouts/auth-layout';

export default function VerifyEmail({ status }: { status?: string }) {
    const { t } = useTranslation();
    const { post, processing } = useForm({});

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(verificationSend.url());
    };

    return (
        <AuthLayout
            title={t('auth.verify.heading')}
            description={t('auth.verify.description')}
        >
            <Head title={t('auth.verify.title')} />

            {status === 'verification-link-sent' && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    {t('auth.verify.link_sent')}
                </div>
            )}

            <form onSubmit={submit} className="space-y-6 text-center">
                <Button disabled={processing} variant="secondary">
                    {processing && <LoaderCircle className="size-4 animate-spin" />}
                    {t('auth.verify.resend')}
                </Button>

                <TextLink href={logout.url()} method="post" className="mx-auto block text-sm">
                    {t('auth.verify.logout')}
                </TextLink>
            </form>
        </AuthLayout>
    );
}
