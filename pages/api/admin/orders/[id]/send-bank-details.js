import connectDB, { handleDBErrors } from "@/lib/mongoose"
import { Order } from "@/models"
import { sendBankDetailsEmail } from "@/lib/email"

export default async function handler(req, res) {
    await connectDB()

    if (req.method !== "POST") {
        res.setHeader("Allow", ["POST"])
        return res.status(405).json({
            success: false,
            message: `Méthode ${req.method} non autorisée`,
        })
    }

    try {
        const { id } = req.query

        // Récupérer la commande
        const order = await Order.findById(id)
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Commande non trouvée",
            })
        }

        // Vérifier que les informations bancaires existent
        if (!order.hasBankDetails) {
            return res.status(400).json({
                success: false,
                message: "Les informations bancaires n'ont pas encore été ajoutées à cette commande",
            })
        }

        // Envoyer l'email
        const emailResult = await sendBankDetailsEmail(order)

        if (!emailResult.success) {
            return res.status(500).json({
                success: false,
                message: "Erreur lors de l'envoi de l'email",
                error: emailResult.error,
            })
        }

        // Ajouter une note dans l'historique
        order.addStatusHistory(order.status, "Informations bancaires envoyées par email")
        await order.save()

        return res.status(200).json({
            success: true,
            message: "Informations bancaires envoyées avec succès",
            data: {
                messageId: emailResult.messageId,
            },
        })
    } catch (error) {
        console.error("Erreur envoi informations bancaires:", error)
        const dbError = handleDBErrors(error)
        return res.status(500).json({
            success: false,
            message: dbError.message,
        })
    }
}