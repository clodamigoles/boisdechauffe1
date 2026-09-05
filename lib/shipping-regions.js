/**
 * Repli des zones de livraison.
 *
 * Les tarifs qui font foi sont ceux de la base, modifiables depuis
 * l'administration ; ce tableau ne sert que si l'appel aux paramètres échoue —
 * un tunnel de commande qui ne sait plus chiffrer le transport vaut mieux
 * qu'un tunnel qui s'arrête.
 *
 * L'Allemagne vient en premier : c'est le marché du site, et le premier pays
 * de la liste est celui que le formulaire propose par défaut.
 *
 * ⚠ Les montants sont gradués par éloignement depuis le dépôt et n'ont pas
 * encore été confrontés à un tarif de transporteur. À revoir dans
 * /delta → Paramètres avant toute mise en ligne commerciale.
 */
export const SHIPPING_REGIONS = {
    Deutschland: [
        { name: "Baden-Württemberg", cost: 25 },
        { name: "Saarland", cost: 28 },
        { name: "Rheinland-Pfalz", cost: 30 },
        { name: "Bayern", cost: 32 },
        { name: "Hessen", cost: 32 },
        { name: "Nordrhein-Westfalen", cost: 35 },
        { name: "Thüringen", cost: 38 },
        { name: "Niedersachsen", cost: 40 },
        { name: "Sachsen", cost: 40 },
        { name: "Berlin", cost: 42 },
        { name: "Bremen", cost: 42 },
        { name: "Sachsen-Anhalt", cost: 42 },
        { name: "Brandenburg", cost: 45 },
        { name: "Hamburg", cost: 45 },
        { name: "Mecklenburg-Vorpommern", cost: 48 },
        { name: "Schleswig-Holstein", cost: 48 },
    ],
    "Österreich": [{ name: "Österreich", cost: 40 }],
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
    Luxembourg: [{ name: "Luxembourg", cost: 30 }],
    Suisse: [
        { name: "Genève", cost: 35 },
        { name: "Vaud", cost: 35 },
        { name: "Valais", cost: 38 },
        { name: "Berne", cost: 38 },
        { name: "Zurich", cost: 40 },
        { name: "Autres cantons", cost: 40 },
    ],
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

/**
 * Les pays livrables, dans l'ordre où ils sont proposés.
 *
 * Le tunnel de commande les listait en dur — quatre `<option>` figées, dont
 * l'Allemagne était absente alors que c'est le marché du site. Les tirer des
 * paramètres fait que déclarer une nouvelle zone dans l'administration suffit
 * à la rendre commandable.
 */
export async function getShippingCountries() {
    const settings = await getSettings()

    if (settings?.shippingZones?.length) {
        return settings.shippingZones.map((zone) => zone.country)
    }

    return Object.keys(SHIPPING_REGIONS)
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