import mongoose from "mongoose"

const shippingZoneSchema = new mongoose.Schema({
    country: {
        type: String,
        required: true,
        trim: true,
    },
    regions: [
        {
            name: {
                type: String,
                required: true,
                trim: true,
            },
            cost: {
                type: Number,
                required: true,
                min: 0,
            },
        },
    ],
})

const siteSettingsSchema = new mongoose.Schema(
    {
        // Informations de base du site
        siteName: {
            type: String,
            required: [true, "Le nom du site est requis"],
            trim: true,
            default: "Mon bois de chauffe",
        },
        siteDescription: {
            type: String,
            trim: true,
            maxlength: [500, "La description ne peut pas dépasser 500 caractères"],
        },
        siteKeywords: {
            type: String,
            trim: true,
        },

        // Informations de contact
        contactEmail: {
            type: String,
            required: [true, "L'email de contact est requis"],
            trim: true,
            lowercase: true,
            match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Email invalide"],
            default: "support@monboisdechauffe.fr",
        },
        contactPhone: {
            type: String,
            required: [true, "Le téléphone est requis"],
            trim: true,
            default: "+33 6 44 65 18 73",
        },
        whatsappLink: {
            type: String,
            trim: true,
            default: "https://wa.me/33644651873",
        },

        // Adresse de l'entreprise
        address: {
            street: {
                type: String,
                required: [true, "L'adresse est requise"],
                trim: true,
                default: "10 RUE DU MONUMENT",
            },
            postalCode: {
                type: String,
                required: [true, "Le code postal est requis"],
                trim: true,
                default: "25750",
            },
            city: {
                type: String,
                required: [true, "La ville est requise"],
                trim: true,
                default: "DESANDANS",
            },
            country: {
                type: String,
                required: [true, "Le pays est requis"],
                trim: true,
                default: "France",
            },
        },

        // Informations légales
        companyName: {
            type: String,
            trim: true,
        },
        siren: {
            type: String,
            trim: true,
            default: "941350159",
        },
        siret: {
            type: String,
            trim: true,
            default: "94135015900013",
        },
        vatNumber: {
            type: String,
            trim: true,
        },

        // Zones de livraison
        shippingZones: {
            type: [shippingZoneSchema],
            default: [
                {
                    country: "France",
                    regions: [
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
                },
                {
                    country: "Belgique",
                    regions: [
                        { name: "Bruxelles-Capitale", cost: 25 },
                        { name: "Flandre", cost: 28 },
                        { name: "Wallonie", cost: 28 },
                    ],
                },
                {
                    country: "Suisse",
                    regions: [
                        { name: "Genève", cost: 35 },
                        { name: "Vaud", cost: 35 },
                        { name: "Valais", cost: 38 },
                        { name: "Berne", cost: 38 },
                        { name: "Zurich", cost: 40 },
                        { name: "Autres cantons", cost: 40 },
                    ],
                },
                {
                    country: "Luxembourg",
                    regions: [{ name: "Luxembourg", cost: 30 }],
                },
            ],
        },

        // Paramètres de livraison
        freeShippingThreshold: {
            type: Number,
            required: true,
            min: 0,
            default: 500,
        },

        // Réseaux sociaux
        socialMedia: {
            facebook: String,
            instagram: String,
            twitter: String,
            linkedin: String,
            youtube: String,
        },

        // Configuration email
        emailSettings: {
            fromName: {
                type: String,
                default: "Mon bois de chauffe",
            },
            fromEmail: {
                type: String,
                default: "support@monboisdechauffe.fr",
            },
        },

        // Horaires d'ouverture
        businessHours: {
            monday: { open: String, close: String, closed: Boolean },
            tuesday: { open: String, close: String, closed: Boolean },
            wednesday: { open: String, close: String, closed: Boolean },
            thursday: { open: String, close: String, closed: Boolean },
            friday: { open: String, close: String, closed: Boolean },
            saturday: { open: String, close: String, closed: Boolean },
            sunday: { open: String, close: String, closed: Boolean },
        },

        // Contenus légaux
        legalContent: {
            mentionsLegales: {
                type: String,
                default: "",
            },
            politiqueConfidentialite: {
                type: String,
                default: "",
            },
            cgv: {
                type: String,
                default: "",
            },
            cookies: {
                type: String,
                default: "",
            },
        },

        // Options supplémentaires
        metadata: {
            type: mongoose.Schema.Types.Mixed,
            default: {},
        },

        // Indicateur de configuration active
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    },
)

// Méthode pour obtenir les paramètres actifs
siteSettingsSchema.statics.getActiveSettings = async function () {
    let settings = await this.findOne({ isActive: true })

    // Si aucun paramètre n'existe, créer les paramètres par défaut
    if (!settings) {
        settings = await this.create({ isActive: true })
    }

    return settings
}

// Méthode pour obtenir les zones de livraison par pays
siteSettingsSchema.methods.getShippingZonesForCountry = function (country) {
    const zone = this.shippingZones.find((z) => z.country === country)
    return zone ? zone.regions : []
}

// Méthode pour calculer les frais de livraison
siteSettingsSchema.methods.calculateShippingCost = function (country, region, subtotal) {
    // Livraison gratuite si le sous-total dépasse le seuil
    if (subtotal >= this.freeShippingThreshold) {
        return 0
    }

    const zones = this.getShippingZonesForCountry(country)
    if (!zones.length) {
        return 15 // Coût par défaut
    }

    const selectedRegion = zones.find((r) => r.name === region)
    if (!selectedRegion) {
        return zones[0]?.cost || 15
    }

    return selectedRegion.cost
}

// Méthode pour obtenir l'adresse complète formatée
siteSettingsSchema.virtual("fullAddress").get(function () {
    return `${this.address.street}, ${this.address.postalCode} ${this.address.city}, ${this.address.country}`
})

// Export du modèle
export const SiteSettings =
    mongoose.models.SiteSettings || mongoose.model("SiteSettings", siteSettingsSchema)

export default SiteSettings
