import i18n from '@/i18n';
import { usePage } from '@inertiajs/react';
import { useCallback, useSyncExternalStore } from 'react';

const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

const subscribe = (callback: () => void) => {
    i18n.on('languageChanged', callback);
    return () => i18n.off('languageChanged', callback);
};

const getSnapshot = () => i18n.language;

/**
 * Hook pour gérer la locale.
 * Retourne la langue i18n actuelle (synchronisée avec React).
 */
export function useLocale() {
    const { availableLocales } = usePage<{
        availableLocales: string[];
    }>().props;

    const locale = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

    const setLocale = useCallback((newLocale: string) => {
        if (!availableLocales.includes(newLocale)) {
            console.warn(`Locale "${newLocale}" is not available`);
            return;
        }

        i18n.changeLanguage(newLocale);

        document.cookie = `locale=${newLocale};path=/;max-age=${COOKIE_MAX_AGE};SameSite=Lax`;
    }, [availableLocales]);

    return {
        locale,
        availableLocales,
        setLocale,
    };
}
