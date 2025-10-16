import connectDB from "@/lib/mongoose"
import { SiteSettings } from "@/models/SiteSettings"

export default async function handler(req, res) {
    try {
        await connectDB()

        if (req.method === "GET") {
            // Récupérer les paramètres du site
            const settings = await SiteSettings.getActiveSettings()

            return res.status(200).json({
                success: true,
                data: settings,
            })
        }

        if (req.method === "PUT" || req.method === "PATCH") {
            // Mettre à jour les paramètres du site
            const updates = req.body

            // Récupérer les paramètres actifs
            let settings = await SiteSettings.findOne({ isActive: true })

            if (!settings) {
                // Créer les paramètres s'ils n'existent pas
                settings = await SiteSettings.create({
                    ...updates,
                    isActive: true,
                })
            } else {
                // Mettre à jour les paramètres existants
                Object.keys(updates).forEach((key) => {
                    if (key !== "_id" && key !== "isActive") {
                        settings[key] = updates[key]
                    }
                })
                await settings.save()
            }

            return res.status(200).json({
                success: true,
                data: settings,
                message: "Paramètres mis à jour avec succès",
            })
        }

        if (req.method === "POST") {
            // Créer de nouveaux paramètres (désactiver les anciens)
            await SiteSettings.updateMany({}, { isActive: false })

            const newSettings = await SiteSettings.create({
                ...req.body,
                isActive: true,
            })

            return res.status(201).json({
                success: true,
                data: newSettings,
                message: "Paramètres créés avec succès",
            })
        }

        return res.status(405).json({
            success: false,
            message: "Méthode non autorisée",
        })
    } catch (error) {
        console.error("Erreur API /api/admin/settings:", error)

        // Gérer les erreurs de validation
        if (error.name === "ValidationError") {
            return res.status(400).json({
                success: false,
                message: "Données invalides",
                errors: Object.values(error.errors).map((err) => ({
                    field: err.path,
                    message: err.message,
                })),
            })
        }

        return res.status(500).json({
            success: false,
            message: "Erreur serveur",
            error: error.message,
        })
    }
}
