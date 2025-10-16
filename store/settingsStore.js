import { create } from "zustand"

const useSettingsStore = create((set, get) => ({
    settings: null,
    loading: false,
    error: null,

    // Charger les paramètres depuis l'API
    fetchSettings: async () => {
        // Éviter de charger plusieurs fois simultanément
        if (get().loading) return

        set({ loading: true, error: null })

        try {
            const res = await fetch("/api/settings")
            const data = await res.json()

            if (data.success) {
                set({ settings: data.data, loading: false })
                return data.data
            } else {
                throw new Error(data.message || "Erreur lors du chargement des paramètres")
            }
        } catch (error) {
            console.error("Erreur lors du chargement des paramètres:", error)
            set({ error: error.message, loading: false })
            return null
        }
    },

    // Obtenir les paramètres (charge si nécessaire)
    getSettings: async () => {
        const state = get()
        if (state.settings) {
            return state.settings
        }
        return await state.fetchSettings()
    },

    // Obtenir les zones de livraison pour un pays
    getShippingZones: (country) => {
        const state = get()
        if (!state.settings || !state.settings.shippingZones) {
            return []
        }

        const zone = state.settings.shippingZones.find((z) => z.country === country)
        return zone ? zone.regions : []
    },

    // Calculer les frais de livraison
    calculateShippingCost: (country, region, subtotal) => {
        const state = get()
        if (!state.settings) {
            return 15 // Coût par défaut
        }

        // Livraison gratuite si le sous-total dépasse le seuil
        if (subtotal >= state.settings.freeShippingThreshold) {
            return 0
        }

        const zones = state.getShippingZones(country)
        if (!zones.length) {
            return 15
        }

        const selectedRegion = zones.find((r) => r.name === region)
        if (!selectedRegion) {
            return zones[0]?.cost || 15
        }

        return selectedRegion.cost
    },

    // Réinitialiser les paramètres
    reset: () => set({ settings: null, loading: false, error: null }),
}))

export default useSettingsStore
