// DEPRECATED: Ces constantes sont maintenant gérées dynamiquement via la base de données
// Pour des raisons de compatibilité, on garde ces valeurs par défaut
export const SHIPPING_REGIONS = {
    France: [
        { name: "Île-de-France", cost: 15 },
        { name: "Auvergne-Rhône-Alpes", cost: 20 },
        { name: "Provence-Alpes-Côte d'Azur", cost: 25 },
        { name: "Occitanie", cost: 25 },
        { name: "Nouvelle-Aquitaine", cost: 22 },
        { name: "Bretagne", cost: 20 },
        { name: "Pays de la Loire", cost: 18 },
        { name: "Centre-Val de Loire", cost: 18 },
        { name: "Normandie", cost: 18 },
        { name: "Hauts-de-France", cost: 18 },
        { name: "Grand Est", cost: 20 },
        { name: "Bourgogne-Franche-Comté", cost: 20 },
        { name: "Corse", cost: 35 },
    ],
    Belgique: [
        { name: "Bruxelles-Capitale", cost: 25 },
        { name: "Flandre", cost: 28 },
        { name: "Wallonie", cost: 28 },
    ],
    Suisse: [
        { name: "Genève", cost: 35 },
        { name: "Vaud", cost: 35 },
        { name: "Valais", cost: 38 },
        { name: "Berne", cost: 38 },
        { name: "Zurich", cost: 40 },
        { name: "Autres cantons", cost: 40 },
    ],
    Luxembourg: [{ name: "Luxembourg", cost: 30 }],
}

// Charger les paramètres depuis l'API
let cachedSettings = null
let cacheTime = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

async function getSettings() {
    const now = Date.now()

    // Utiliser le cache si disponible et valide
    if (cachedSettings && now - cacheTime < CACHE_DURATION) {
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

// Obtenir les zones de livraison dynamiques
export async function getDynamicShippingRegions() {
    const settings = await getSettings()

    if (!settings || !settings.shippingZones) {
        return SHIPPING_REGIONS
    }

    // Convertir le format de la base de données au format attendu
    const regions = {}
    settings.shippingZones.forEach((zone) => {
        regions[zone.country] = zone.regions
    })

    return regions
}

// Calculate shipping cost based on country, region, and subtotal
export async function calculateShippingCost(country, region, subtotal) {
    const settings = await getSettings()

    const freeThreshold = settings?.freeShippingThreshold || 500

    // Free shipping for orders over threshold
    if (subtotal >= freeThreshold) {
        return 0
    }

    // Get regions for the selected country
    let regions
    if (settings && settings.shippingZones) {
        const zone = settings.shippingZones.find((z) => z.country === country)
        regions = zone?.regions
    } else {
        regions = SHIPPING_REGIONS[country]
    }

    if (!regions) {
        return 15 // Default cost
    }

    // Find the selected region
    const selectedRegion = regions.find((r) => r.name === region)
    if (!selectedRegion) {
        return regions[0]?.cost || 15 // Default to first region cost
    }

    return selectedRegion.cost
}

// Get regions for a specific country
export async function getRegionsForCountry(country) {
    const settings = await getSettings()

    if (settings && settings.shippingZones) {
        const zone = settings.shippingZones.find((z) => z.country === country)
        return zone?.regions || []
    }

    return SHIPPING_REGIONS[country] || []
}

// Version synchrone pour la compatibilité (utilise les valeurs statiques)
export function getRegionsForCountrySync(country) {
    return SHIPPING_REGIONS[country] || []
}

export function calculateShippingCostSync(country, region, subtotal) {
    // Free shipping for orders over 500€
    if (subtotal >= 500) {
        return 0
    }

    const regions = SHIPPING_REGIONS[country]
    if (!regions) {
        return 15
    }

    const selectedRegion = regions.find((r) => r.name === region)
    if (!selectedRegion) {
        return regions[0]?.cost || 15
    }

    return selectedRegion.cost
}