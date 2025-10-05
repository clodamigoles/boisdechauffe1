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

// Calculate shipping cost based on country, region, and subtotal
export function calculateShippingCost(country, region, subtotal) {
    // Free shipping for orders over 500€
    if (subtotal >= 500) {
        return 0
    }

    // Get regions for the selected country
    const regions = SHIPPING_REGIONS[country]
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
export function getRegionsForCountry(country) {
    return SHIPPING_REGIONS[country] || []
}