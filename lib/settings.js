// Helper pour récupérer et utiliser les paramètres du site

// Cache des paramètres côté client
let cachedSettings = null
let cacheTime = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

/**
 * Récupérer les paramètres du site depuis l'API
 * @param {boolean} forceRefresh - Forcer le rechargement depuis l'API
 * @returns {Promise<object|null>}
 */
export async function getSettings(forceRefresh = false) {
    const now = Date.now()

    // Utiliser le cache si disponible et valide
    if (!forceRefresh && cachedSettings && now - cacheTime < CACHE_DURATION) {
        return cachedSettings
    }

    try {
        const res = await fetch("/api/settings")
        const data = await res.json()

        if (data.success) {
            cachedSettings = data.data
            cacheTime = now
            return data.data
        }
    } catch (error) {
        console.error("Erreur lors du chargement des paramètres:", error)
    }

    return null
}

/**
 * Obtenir une valeur spécifique des paramètres
 * @param {string} path - Chemin vers la valeur (ex: "address.street")
 * @param {any} defaultValue - Valeur par défaut si non trouvée
 * @returns {Promise<any>}
 */
export async function getSetting(path, defaultValue = null) {
    const settings = await getSettings()

    if (!settings) return defaultValue

    // Naviguer dans l'objet en utilisant le chemin
    const keys = path.split(".")
    let value = settings

    for (const key of keys) {
        if (value && typeof value === "object" && key in value) {
            value = value[key]
        } else {
            return defaultValue
        }
    }

    return value
}

/**
 * Obtenir l'adresse complète formatée
 * @returns {Promise<string>}
 */
export async function getFullAddress() {
    const settings = await getSettings()

    if (!settings || !settings.address) {
        return "10 RUE DU MONUMENT, 25750 DESANDANS"
    }

    const { street, postalCode, city, country } = settings.address
    return `${street}, ${postalCode} ${city}, ${country}`
}

/**
 * Obtenir les informations de contact
 * @returns {Promise<object>}
 */
export async function getContactInfo() {
    const settings = await getSettings()

    return {
        siteName: settings?.siteName || "Mon bois de chauffe",
        email: settings?.contactEmail || "support@monboisdechauffe.fr",
        phone: settings?.contactPhone || "+33 6 44 65 18 73",
        whatsapp: settings?.whatsappLink || "https://wa.me/33644651873",
        address: await getFullAddress(),
    }
}

/**
 * Réinitialiser le cache
 */
export function clearSettingsCache() {
    cachedSettings = null
    cacheTime = 0
}
