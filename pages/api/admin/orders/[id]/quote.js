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
        const { amount, iban, bic, accountName, notes } = req.body

        // Validation des données
        if (!amount || amount <= 0) {
            return res.status(400).json({
                success: false,
                message: "Le montant doit être supérieur à 0",
            })
        }

        if (!iban || iban.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: "L'IBAN est requis",
            })
        }

        if (!bic || bic.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: "Le BIC est requis",
            })
        }

        if (!accountName || accountName.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: "Le nom du bénéficiaire est requis",
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

        // Vérifier que la commande est en attente
        /*if (order.status !== "pending") {
            return res.status(400).json({
                success: false,
                message: "Cette commande ne peut plus recevoir de devis",
            })
        }*/

        // Mise à jour des informations bancaires de la commande
        order.bankDetails = {
            iban: iban.trim().toUpperCase(),
            bic: bic.trim().toUpperCase(),
            accountName: accountName.trim(),
            amountToPay: parseFloat(amount),
            updatedAt: new Date(),
        }

        // Mettre à jour le statut de la commande
        order.addStatusHistory("confirmed", `Devis envoyé - Montant: ${amount}€ - IBAN: ${iban.trim().slice(-4)}`)
        
        // Sauvegarder la commande avec les nouvelles informations bancaires
        await order.save()

        // Envoyer l'email de devis au client
        const emailResult = await sendQuoteEmail(order, { 
            amount: parseFloat(amount), 
            iban: iban.trim().toUpperCase(), 
            bic: bic.trim().toUpperCase(), 
            accountName: accountName.trim(),
            notes: notes || ""
        })

        if (!emailResult.success) {
            // Même si l'email échoue, les infos bancaires sont sauvegardées
            console.error("Erreur envoi email:", emailResult.error)
            return res.status(200).json({
                success: true,
                warning: "Devis enregistré mais l'email n'a pas pu être envoyé",
                message: "Les informations bancaires ont été mises à jour avec succès",
                data: {
                    orderNumber: order.orderNumber,
                    bankDetails: order.bankDetails,
                },
            })
        }

        return res.status(200).json({
            success: true,
            message: "Devis envoyé avec succès et informations bancaires mises à jour",
            data: {
                messageId: emailResult.messageId,
                orderNumber: order.orderNumber,
                bankDetails: order.bankDetails,
            },
        })
    } catch (error) {
        console.error("Erreur envoi devis:", error)
        const dbError = handleDBErrors(error)
        return res.status(500).json({
            success: false,
            message: dbError.message,
            error: process.env.NODE_ENV === "development" ? error.message : undefined,
        })
    }
}