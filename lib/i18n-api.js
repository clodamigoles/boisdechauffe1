import path from 'path'
import fs from 'fs'

// Cache pour les traductions API
const translationCache = {}

/**
 * Load API translations
 */
function loadAPITranslations(locale) {
    if (translationCache[locale]) {
        return translationCache[locale]
    }

    try {
        const filePath = path.join(process.cwd(), 'public', 'locales', locale, 'api.json')
        const fileContent = fs.readFileSync(filePath, 'utf8')
        translationCache[locale] = JSON.parse(fileContent)
        return translationCache[locale]
    } catch (error) {
        console.warn(`API translation file not found: ${locale}/api.json`)
        return {}
    }
}

/**
 * Translate API message
 * @param {string} locale - The locale (en, fr, de, es)
 * @param {string} key - The translation key (e.g., "order.success")
 * @param {object} params - Interpolation params
 * @returns {string} - Translated message
 */
export function translateAPI(locale, key, params = {}) {
    const translations = loadAPITranslations(locale)
    
    let message = key.split('.').reduce((obj, k) => obj?.[k], translations) || key
    
    // Simple interpolation
    Object.keys(params).forEach(param => {
        message = message.replace(`{{${param}}}`, params[param])
    })
    
    return message
}

/**
 * Get locale from request
 */
export function getLocaleFromRequest(req) {
    // Try to get from query params
    if (req.query?.locale) {
        return req.query.locale
    }
    
    // Try to get from headers
    const acceptLanguage = req.headers['accept-language']
    if (acceptLanguage) {
        const locale = acceptLanguage.substring(0, 2)
        if (['en', 'fr', 'de', 'es'].includes(locale)) {
            return locale
        }
    }
    
    return 'en' // Default
}


