import path from 'path'
import fs from 'fs'

/**
 * Load translations for SSR/SSG
 * @param {string} locale - The locale to load
 * @param {string[]} namespaces - Array of namespaces to load
 * @returns {object} - Translations object
 */
export async function loadTranslations(locale, namespaces = ['common']) {
    const translations = {}

    for (const ns of namespaces) {
        try {
            const filePath = path.join(process.cwd(), 'public', 'locales', locale, `${ns}.json`)
            const fileContent = fs.readFileSync(filePath, 'utf8')
            translations[ns] = JSON.parse(fileContent)
        } catch (error) {
            console.warn(`Translation file not found: ${locale}/${ns}.json`)
            translations[ns] = {}
        }
    }

    return {
        translations,
        locale
    }
}

/**
 * Get serverSideTranslations for getStaticProps/getServerSideProps
 */
export async function serverSideTranslations(locale, namespaces) {
    return loadTranslations(locale, namespaces)
}


