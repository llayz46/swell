import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from '@lang/en.json';
import fr from '@lang/fr.json';

const resources = {
    fr: { translation: fr },
    en: { translation: en },
};

export const initI18n = (locale: string = 'fr') => {
    if (i18n.isInitialized) {
        i18n.changeLanguage(locale);
        return i18n;
    }

    i18n.use(initReactI18next).init({
        resources,
        lng: locale,
        fallbackLng: 'fr',
        interpolation: {
            escapeValue: false,
        },
    });

    return i18n;
};

export default i18n;
