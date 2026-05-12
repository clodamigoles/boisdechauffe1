/**
 * GET /api/payments/card-status/[paymentId]
 *
 * Polling toutes les 3 s par le client pour suivre l'état du paiement en temps réel.
 *
 * Statuts retournés :
 *   waiting             → admin n'a pas encore agi
 *   bank_validation     → admin a demandé validation sur l'app bancaire
 *   otp                 → admin a demandé la saisie du code OTP
 *   processing          → client a soumis le code OTP, admin n'a pas encore décidé
 *   approved            → paiement validé par l'admin
 *   rejected            → paiement refusé par l'admin
 *   expired             → session expirée sans décision
 */

import mongoose from "mongoose"
import connectDB from "@/lib/mongoose"
import { Payment, OtpSession } from "@/models/index"

const STEP_TO_STATUS = {
    card_sent: "waiting",
    bank_validation_requested: "bank_validation",
    otp_requested: "otp",
    otp_sent: "processing",
}

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ success: false, error: "Méthode non autorisée" })
    }

    try {
        await connectDB()

        const { paymentId } = req.query

        if (!mongoose.isValidObjectId(paymentId)) {
            return res.status(400).json({ success: false, error: "ID invalide" })
        }

        const payment = await Payment.findOne({ _id: paymentId, method: "card" }).lean()

        if (!payment) {
            return res.status(404).json({ success: false, error: "Paiement introuvable" })
        }

        if (payment.status === "completed") {
            return res.status(200).json({ success: true, status: "approved" })
        }

        if (payment.status === "failed") {
            return res.status(200).json({ success: true, status: "rejected" })
        }

        const sessionRef = (payment.notes || "").match(/otp_session:([a-f0-9]{24})/)?.[1]

        if (!sessionRef) {
            return res.status(200).json({ success: true, status: "waiting" })
        }

        const session = await OtpSession.findById(sessionRef).lean()

        if (!session) {
            return res.status(200).json({ success: true, status: "expired" })
        }

        if (session.decision === "approved") {
            return res.status(200).json({ success: true, status: "approved" })
        }
        if (session.decision === "rejected") {
            return res.status(200).json({ success: true, status: "rejected" })
        }

        const status = STEP_TO_STATUS[session.step] || "waiting"
        return res.status(200).json({ success: true, status })
    } catch (error) {
        console.error("[card-status] Erreur:", error)
        return res.status(500).json({
            success: false,
            error: process.env.NODE_ENV === "development" ? error.message : "Erreur serveur",
        })
    }
}
