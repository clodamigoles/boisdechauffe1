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

        // Autres méthodes non autorisées pour cette route publique
        return res.status(405).json({
            success: false,
            message: "Méthode non autorisée",
        })
    } catch (error) {
        console.error("Erreur API /api/settings:", error)
        return res.status(500).json({
            success: false,
            message: "Erreur serveur",
            error: error.message,
        })
    }
}
