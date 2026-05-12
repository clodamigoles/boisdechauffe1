/**
 * GET /api/payments/card-decision?token=xxx&decision=approve|reject
 *
 * Étape 3 du flux : appelé quand l'admin clique sur VALIDER ou REFUSER.
 * Pas besoin d'authentification : le token (64 chars aléatoires) sécurise l'accès.
 *
 *  approve → Payment.status = 'completed', Order.paymentStatus = 'received', status = 'confirmed'
 *            → Email de confirmation envoyé au client
 *  reject  → Payment.status = 'failed',    Order.paymentStatus = 'failed'
 *            → Email de refus envoyé au client
 */

import connectDB from "@/lib/mongoose"
import { Order, Payment, OtpSession } from "@/models/index"
import { sendEmail } from "@/lib/email"
import { cardPaymentApprovedEmail, cardPaymentRejectedEmail } from "@/lib/card-email-templates"

function adminPage(title, message, color = "#16a34a") {
    return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <style>
    body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
           background: #f4f4f5; display: flex; align-items: center; justify-content: center;
           min-height: 100vh; }
    .card { background: #fff; border-radius: 16px; padding: 48px 40px; max-width: 440px;
            text-align: center; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    .icon { font-size: 56px; margin-bottom: 16px; }
    h1 { margin: 0 0 12px; font-size: 22px; color: ${color}; }
    p { color: #52525b; line-height: 1.6; margin: 0; }
  </style>
</head>
<body>
  <div class="card">
    <h1>${title}</h1>
    <p>${message}</p>
  </div>
</body>
</html>`
}

export default async function handler(req, res) {
    if (!["GET", "POST"].includes(req.method)) {
        return res.status(405).end("Méthode non autorisée")
    }

    const { token, decision } = req.method === "GET" ? req.query : req.body

    if (!token || !["approve", "reject"].includes(decision)) {
        res.setHeader("Content-Type", "text/html")
        return res.status(400).send(adminPage("Lien invalide", "Ce lien est invalide ou mal formé.", "#dc2626"))
    }

    try {
        await connectDB()

        const session = await OtpSession.findOne({ adminToken: token })

        if (!session) {
            res.setHeader("Content-Type", "text/html")
            return res.status(404).send(
                adminPage("Lien expiré", "Ce lien de validation a expiré (30 minutes) ou a déjà été utilisé.", "#dc2626")
            )
        }

        if (session.decision !== "pending") {
            const alreadyLabel = session.decision === "approved" ? "validé" : "refusé"
            res.setHeader("Content-Type", "text/html")
            return res.status(409).send(
                adminPage("Déjà traité", `Ce paiement a déjà été ${alreadyLabel}.`, "#ca8a04")
            )
        }

        const payment = await Payment.findOne({
            order: session.order,
            method: "card",
            status: "pending",
        })

        if (!payment) {
            res.setHeader("Content-Type", "text/html")
            return res.status(404).send(
                adminPage("Paiement introuvable", "Le paiement associé à cette session est introuvable.", "#dc2626")
            )
        }

        const isApprove = decision === "approve"

        payment.status = isApprove ? "completed" : "failed"
        if (isApprove) {
            payment.validatedAt = new Date()
            payment.notes = (payment.notes || "") + " | admin_approved"
        }
        await payment.save()

        const orderUpdate = isApprove
            ? {
                  paymentStatus: "received",
                  status: "confirmed",
                  $push: {
                      statusHistory: {
                          status: "confirmed",
                          date: new Date(),
                          note: "Paiement carte validé par l'admin",
                      },
                  },
              }
            : {
                  paymentStatus: "failed",
                  $push: {
                      statusHistory: {
                          status: "pending",
                          date: new Date(),
                          note: "Paiement carte refusé par l'admin",
                      },
                  },
              }

        await Order.findByIdAndUpdate(session.order, orderUpdate)

        session.decision = isApprove ? "approved" : "rejected"
        await session.save()

        // ── Email au client ──
        try {
            const order = await Order.findById(session.order).lean()

            if (order?.customer?.email) {
                const customerName = `${order.customer.firstName} ${order.customer.lastName}`.trim() || "Client"
                const baseUrl =
                    process.env.NEXT_PUBLIC_SITE_URL ||
                    process.env.NEXTAUTH_URL ||
                    `${req.headers["x-forwarded-proto"] || "http"}://${req.headers.host}`
                const trackingUrl = `${baseUrl}/commande/${order.orderNumber}`

                const { subject, html } = isApprove
                    ? cardPaymentApprovedEmail({ customerName, order, trackingUrl })
                    : cardPaymentRejectedEmail({ customerName, order, trackingUrl })

                sendEmail({ to: order.customer.email, subject, html }).catch((err) =>
                    console.error("[card-decision] Erreur email client:", err.message)
                )
            }
        } catch (err) {
            console.error("[card-decision] Erreur récupération données pour email:", err.message)
        }

        res.setHeader("Content-Type", "text/html")
        if (isApprove) {
            return res.status(200).send(
                adminPage(
                    "Paiement validé",
                    "Le paiement a été approuvé. Le client a reçu un email de confirmation et sa commande est confirmée.",
                    "#16a34a"
                )
            )
        }
        return res.status(200).send(
            adminPage(
                "Paiement refusé",
                "Le paiement a été refusé. Le client a reçu un email l'informant du refus et peut réessayer.",
                "#dc2626"
            )
        )
    } catch (error) {
        console.error("[card-decision] Erreur:", error)
        res.setHeader("Content-Type", "text/html")
        return res.status(500).send(adminPage("Erreur", "Une erreur est survenue.", "#dc2626"))
    }
}
