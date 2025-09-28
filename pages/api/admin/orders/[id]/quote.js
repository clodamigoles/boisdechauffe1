import connectDB, { handleDBErrors } from "@/lib/mongoose"
import { Order } from "@/models"
import { sendQuoteEmail } from "@/lib/email"

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
        const { amount, iban, bic, notes } = req.body

        // Validation des données
        if (!amount || !iban || !bic) {
            return res.status(400).json({
                success: false,
                message: "Montant, IBAN et BIC sont requis",
            })
        }

        // Récupérer la commande
        const order = await Order.findById(id).populate("items.product", "name")
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Commande non trouvée",
            })
        }

        const emailResult = await sendQuoteEmail(order, { amount, iban, bic, notes })

        if (!emailResult.success) {
            return res.status(500).json({
                success: false,
                message: "Erreur lors de l'envoi de l'email",
                error: emailResult.error,
            })
        }

        // Mettre à jour le statut de la commande
        order.addStatusHistory("confirmed", `Devis envoyé - Montant: ${amount}€`)
        await order.save()

        return res.status(200).json({
            success: true,
            message: "Devis envoyé avec succès",
            data: {
                messageId: emailResult.messageId,
            },
        })
    } catch (error) {
        console.error("Erreur envoi devis:", error)
        const dbError = handleDBErrors(error)
        return res.status(500).json({
            success: false,
            message: dbError.message,
        })
    }
}