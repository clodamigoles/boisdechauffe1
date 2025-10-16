import { useEffect } from "react"
import useSettingsStore from "@/store/settingsStore"
import * as CONFIG from "@/constants/config"

/**
 * Hook personnalisé pour accéder aux paramètres du site
 * Charge automatiquement les paramètres depuis l'API au premier appel
 * Fournit des fallbacks depuis constants/config.js
 */
export function useSettings() {
    const { settings, loading, error, fetchSettings, getShippingZones, calculateShippingCost } = useSettingsStore()

    useEffect(() => {
        if (!settings && !loading && !error) {
            fetchSettings()
        }
    }, [settings, loading, error, fetchSettings])

    // Fournir les valeurs avec fallbacks
    return {
        // État de chargement
        loading,
        error,
        settings,

        // Informations de base
        siteName: settings?.siteName || CONFIG.APP_NAME,
        companyName: settings?.companyName || CONFIG.APP_NAME,
        siteDescription: settings?.siteDescription || "",
        siteKeywords: settings?.siteKeywords || "",

        // Contact
        contactEmail: settings?.contactEmail || CONFIG.EMAIL,
        contactPhone: settings?.contactPhone || CONFIG.PHONE,
        whatsappLink: settings?.whatsappLink || CONFIG.WA_LINK,

        // Adresse
        address: settings?.address || {
            street: "10 RUE DU MONUMENT",
            postalCode: "25750",
            city: "DESANDANS",
            country: "France",
        },
        fullAddress:
            settings?.address
                ? `${settings.address.street}, ${settings.address.postalCode} ${settings.address.city}, ${settings.address.country}`
                : CONFIG.ADDRESS,

        // Informations légales
        siren: settings?.siren || CONFIG.SIREN,
        siret: settings?.siret || CONFIG.SIRET,
        vatNumber: settings?.vatNumber || "",

        // Zones de livraison
        shippingZones: settings?.shippingZones || [],
        freeShippingThreshold: settings?.freeShippingThreshold || 500,

        // Réseaux sociaux
        socialMedia: settings?.socialMedia || {},

        // Configuration email
        emailSettings: settings?.emailSettings || {
            fromName: CONFIG.APP_NAME,
            fromEmail: CONFIG.EMAIL,
        },

        // Horaires d'ouverture
        businessHours: settings?.businessHours || {},

        // Fonctions utilitaires
        getShippingZones,
        calculateShippingCost,

        // Fonction pour rafraîchir les paramètres
        refresh: fetchSettings,
    }
}

export default useSettings
