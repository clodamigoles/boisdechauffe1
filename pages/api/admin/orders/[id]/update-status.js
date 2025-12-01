import connectDB, { handleDBErrors } from "@/lib/mongoose"
import { Order } from "@/models"

export default async function handler(req, res) {
    await connectDB()

    if (req.method !== "PUT") {
        res.setHeader("Allow", ["PUT"])
        return res.status(405).json({
            success: false,
            message: `Méthode ${req.method} non autorisée`,
        })
    }

    try {
        const { id } = req.query
        const { status, paymentStatus, note } = req.body

        // Récupérer la commande
        const order = await Order.findById(id)
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Commande non trouvée",
            })
        }

        const updates = {}
        const historyNotes = []

        // Mise à jour du statut
        if (status && status !== order.status) {
            const validStatuses = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"]
            if (!validStatuses.includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: "Statut invalide",
                })
            }
            order.addStatusHistory(status, note || `Statut mis à jour vers ${status}`)
            updates.status = status
        }

        // Mise à jour du statut de paiement
        if (paymentStatus && paymentStatus !== order.paymentStatus) {
            const validPaymentStatuses = ["pending", "received", "failed"]
            if (!validPaymentStatuses.includes(paymentStatus)) {
                return res.status(400).json({
                    success: false,
                    message: "Statut de paiement invalide",
                })
            }
            order.paymentStatus = paymentStatus
            updates.paymentStatus = paymentStatus

            // Si le paiement est reçu, mettre à jour le statut de la commande
            if (paymentStatus === "received" && order.status === "pending") {
                order.addStatusHistory("confirmed", note || "Paiement reçu")
                order.status = "confirmed"
                updates.status = "confirmed"

                // Envoyer un email de confirmation de paiement au client
                try {
                    const { paymentReceivedTemplate } = await import("@/lib/email-templates.js")
                    const emailData = paymentReceivedTemplate({
                        orderNumber: order.orderNumber,
                        customer: order.customer,
                    })

                    const nodemailer = (await import("nodemailer")).default
                    const transporter = nodemailer.createTransport({
                        host: process.env.SMTP_HOST,
                        port: Number.parseInt(process.env.SMTP_PORT) || 587,
                        secure: false,
                        auth: {
                            user: process.env.SMTP_USER,
                            pass: process.env.SMTP_PASS,
                        },
                    })

                    await transporter.sendMail({
                        from: process.env.SMTP_FROM || process.env.SMTP_USER,
                        to: order.customer.email,
                        subject: emailData.subject,
                        html: emailData.html,
                        text: emailData.text,
                    })
                } catch (emailError) {
                    console.error("Erreur envoi email confirmation paiement:", emailError)
                    // Ne pas bloquer la mise à jour si l'email échoue
                }
            }
        }

        await order.save()

        return res.status(200).json({
            success: true,
            message: "Commande mise à jour avec succès",
            data: {
                order: {
                    _id: order._id,
                    orderNumber: order.orderNumber,
                    status: order.status,
                    paymentStatus: order.paymentStatus,
                    statusHistory: order.statusHistory,
                },
            },
        })
    } catch (error) {
        console.error("Erreur mise à jour statut commande:", error)
        const dbError = handleDBErrors(error)
        return res.status(500).json({
            success: false,
            message: dbError.message,
        })
    }
}

