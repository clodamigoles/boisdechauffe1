import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

// Import des traductions
const resources = {
    en: {},
    fr: {},
    de: {},
    es: {}
}

i18n
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'en',
        lng: 'en',
        interpolation: {
            escapeValue: false
        },
        react: {
            useSuspense: false
        }
    })

export default i18n


