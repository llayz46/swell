import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const loadTranslations = () => {
    const translations: Record<string, Record<string, string>> = {};

    const modules = import.meta.glob<Record<string, string>>('/lang/*.json', { eager: true });

    for (const path in modules) {
        const locale = path.match(/\/lang\/(\w+)\.json$/)?.[1];
        if (locale) {
            translations[locale] = modules[path];
        }
    }

    return translations;
};

const translations = loadTranslations();

export const initI18n = (locale: string = 'fr') => {
    if (i18n.isInitialized) {
        i18n.changeLanguage(locale);
        return i18n;
    }

    i18n.use(initReactI18next).init({
        resources: Object.fromEntries(
            Object.entries(translations).map(([lang, trans]) => [lang, { translation: trans }]),
        ),
        lng: locale,
        fallbackLng: 'fr',
        interpolation: {
            escapeValue: false,
        }
    });

    return i18n;
};

export default i18n;
