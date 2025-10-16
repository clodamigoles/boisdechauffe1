#!/usr/bin/env node

/**
 * Script d'initialisation des paramètres du site
 * Crée les paramètres par défaut dans la base de données
 * Usage: node scripts/init-settings.js
 */

import { fileURLToPath } from "url"
import { dirname, join } from "path"
import dotenv from "dotenv"
import connectDB from "../lib/mongoose.js"
import { SiteSettings } from "../models/SiteSettings.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Charger les variables d'environnement
dotenv.config({ path: join(__dirname, "../.env.local") })

const colors = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    red: "\x1b[31m",
    cyan: "\x1b[36m",
}

function log(message, color = "reset") {
    console.log(`${colors[color]}${message}${colors.reset}`)
}

async function initSettings() {
    try {
        log("\n🚀 Initialisation des paramètres du site", "bright")
        log("━".repeat(60), "blue")

        // Connexion à la base de données
        log("\n🔌 Connexion à MongoDB...", "yellow")
        await connectDB()
        log("✅ Connexion établie", "green")

        // Vérifier si des paramètres existent déjà
        const existingSettings = await SiteSettings.findOne({ isActive: true })

        if (existingSettings) {
            log("\n⚠️  Des paramètres existent déjà !", "yellow")
            log(`   ID: ${existingSettings._id}`, "cyan")
            log(`   Nom du site: ${existingSettings.siteName}`, "cyan")
            log(`   Email: ${existingSettings.contactEmail}`, "cyan")

            log("\n💡 Pour créer de nouveaux paramètres, supprimez d'abord les existants", "yellow")
            process.exit(0)
        }

        // Créer les paramètres par défaut
        log("\n📝 Création des paramètres par défaut...", "yellow")

        const defaultSettings = {
            // Informations de base
            siteName: "Mon bois de chauffe",
            siteDescription:
                "Découvrez notre sélection premium de bois de chauffage : chêne, hêtre, charme séchés < 18% d'humidité. Qualité garantie, livraison 24-48h partout en France.",
            siteKeywords: "bois de chauffage, chêne, hêtre, charme, granulés, livraison rapide, premium, qualité, sec, france",

            // Contact
            contactEmail: "support@monboisdechauffe.fr",
            contactPhone: "+33 6 44 65 18 73",
            whatsappLink: "https://wa.me/33644651873",

            // Adresse
            address: {
                street: "10 RUE DU MONUMENT",
                postalCode: "25750",
                city: "DESANDANS",
                country: "France",
            },

            // Informations légales
            companyName: "Mon bois de chauffe",
            siren: "941350159",
            siret: "94135015900013",

            // Livraison
            freeShippingThreshold: 500,

            // Zones de livraison
            shippingZones: [
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

            // Email
            emailSettings: {
                fromName: "Mon bois de chauffe",
                fromEmail: "support@monboisdechauffe.fr",
            },

            isActive: true,
        }

        const settings = await SiteSettings.create(defaultSettings)

        log("✅ Paramètres créés avec succès !", "green")

        log("\n━".repeat(60), "blue")
        log("📊 RÉSUMÉ", "bright")
        log("━".repeat(60), "blue")
        log(`✅ ID: ${settings._id}`, "green")
        log(`✅ Nom du site: ${settings.siteName}`, "green")
        log(`✅ Email: ${settings.contactEmail}`, "green")
        log(`✅ Téléphone: ${settings.contactPhone}`, "green")
        log(`✅ Adresse: ${settings.address.street}, ${settings.address.postalCode} ${settings.address.city}`, "green")
        log(`✅ Zones de livraison: ${settings.shippingZones.length} pays`, "green")
        log(`✅ Seuil livraison gratuite: ${settings.freeShippingThreshold}€`, "green")

        log("\n━".repeat(60), "blue")
        log("✨ Initialisation terminée !", "bright")
        log("💡 Vous pouvez maintenant gérer les paramètres depuis /delta/settings", "cyan")
        log("━".repeat(60), "blue")

        process.exit(0)
    } catch (error) {
        log(`\n❌ Erreur: ${error.message}`, "red")
        console.error(error)
        process.exit(1)
    }
}

// Lancer le script
initSettings()
