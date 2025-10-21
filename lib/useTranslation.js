import { useRouter } from 'next/router'
import { useMemo, useEffect, useState } from 'react'

/**
 * Custom useTranslation hook for client-side translations
 * @param {string} namespace - The namespace to use
 * @returns {object} - { t, locale }
 */
export function useTranslation(namespace = 'common') {
    const router = useRouter()
    const { locale = 'en' } = router
    const [translations, setTranslations] = useState({})

    // Update translations when they change in window
    useEffect(() => {
        if (typeof window !== 'undefined' && window.__TRANSLATIONS__) {
            setTranslations(window.__TRANSLATIONS__[namespace] || {})
        }
    }, [namespace, locale])

    const t = useMemo(() => {
        return (key, params = {}) => {
            let message = key.split('.').reduce((obj, k) => obj?.[k], translations) || key
            
            // Gestion du pluriel avec _one et _other
            if (params.count !== undefined) {
                const pluralKey = params.count === 1 ? `${key}_one` : `${key}_other`
                const pluralMessage = pluralKey.split('.').reduce((obj, k) => obj?.[k], translations)
                if (pluralMessage && pluralMessage !== pluralKey) {
                    message = pluralMessage
                }
            }
            
            // Interpolation des paramètres
            Object.keys(params).forEach(param => {
                message = message.replace(new RegExp(`{{${param}}}`, 'g'), params[param])
            })
            
            return message
        }
    }, [translations])

    return { t, locale }
}

