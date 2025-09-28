import { Order } from "@/models/index"
import connectDB from "@/lib/mongoose"

export default async function handler(req, res) {
    await connectDB()

    const { orderNumber } = req.query

    if (req.method === "GET") {
        try {
            const order = await Order.findOne({ orderNumber }).populate("items.product", "name slug images").lean()

            if (!order) {
                return res.status(404).json({
                    success: false,
                    message: "Commande introuvable",
                })
            }

            // Formatage des données pour le frontend
            const formattedOrder = {
                ...order,
                statusHistory: order.statusHistory.sort((a, b) => new Date(b.date) - new Date(a.date)),
            }

            res.status(200).json({
                success: true,
                data: formattedOrder,
            })
        } catch (error) {
            console.error("Erreur récupération commande:", error)
            res.status(500).json({
                success: false,
                message: "Erreur lors de la récupération de la commande",
                error: process.env.NODE_ENV === "development" ? error.message : undefined,
            })
        }
    } else if (req.method === "PUT") {
        try {
            const { status, paymentStatus, notes } = req.body

            const order = await Order.findOne({ orderNumber })
            if (!order) {
                return res.status(404).json({
                    success: false,
                    message: "Commande introuvable",
                })
            }

            // Mise à jour des champs autorisés
            if (status && status !== order.status) {
                order.addStatusHistory(status, notes || `Statut mis à jour vers ${status}`)
            }

            if (paymentStatus) {
                order.paymentStatus = paymentStatus
                if (paymentStatus === "received") {
                    order.addStatusHistory("confirmed", "Paiement reçu")
                }
            }

            if (notes) {
                order.notes = notes
            }

            await order.save()

            res.status(200).json({
                success: true,
                message: "Commande mise à jour avec succès",
                data: order,
            })
        } catch (error) {
            console.error("Erreur mise à jour commande:", error)
            res.status(500).json({
                success: false,
                message: "Erreur lors de la mise à jour de la commande",
                error: process.env.NODE_ENV === "development" ? error.message : undefined,
            })
        }
    } else {
        res.setHeader("Allow", ["GET", "PUT"])
        res.status(405).json({
            success: false,
            message: `Méthode ${req.method} non autorisée`,
        })
    }
}