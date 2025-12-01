import { Order } from "@/models/index"
import connectDB from "@/lib/mongoose"
import nodemailer from "nodemailer"
import { paymentReminderTemplate } from "@/lib/email-templates"

// Configuration du transporteur email
const createTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number.parseInt(process.env.SMTP_PORT) || 587,
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    })
}

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({
            success: false,
            message: "Méthode non autorisée",
        })
    }

    try {
        await connectDB()

        const { id } = req.query

        // Récupérer la commande
        const order = await Order.findById(id)

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Commande introuvable",
            })
        }

        // Vérifier que la commande est en attente de paiement
        if (order.paymentStatus !== "pending") {
            return res.status(400).json({
                success: false,
                message: "Cette commande n'est pas en attente de paiement",
            })
        }

        // Incrémenter le compteur de rappels
        const newReminderCount = (order.reminderCount || 0) + 1

        // Générer l'email
        const emailData = paymentReminderTemplate({
            orderNumber: order.orderNumber,
            customer: order.customer,
            bankDetails: order.bankDetails,
            total: order.total,
            reminderCount: newReminderCount,
        })

        // Envoyer l'email
        const transporter = createTransporter()

        const mailOptions = {
            from: process.env.SMTP_FROM || process.env.SMTP_USER,
            to: order.customer.email,
            subject: emailData.subject,
            html: emailData.html,
            text: emailData.text,
        }

        await transporter.sendMail(mailOptions)

        // Mettre à jour la commande avec le nouveau compteur et l'historique
        order.reminderCount = newReminderCount
        order.reminderHistory = order.reminderHistory || []
        order.reminderHistory.push({
            sentAt: new Date(),
            sentBy: "admin",
        })

        await order.save()

        return res.status(200).json({
            success: true,
            message: `Rappel n°${newReminderCount} envoyé avec succès`,
            data: {
                reminderCount: newReminderCount,
                reminderHistory: order.reminderHistory,
            },
        })
    } catch (error) {
        console.error("Erreur envoi rappel:", error)
        return res.status(500).json({
            success: false,
            message: "Erreur lors de l'envoi du rappel",
            error: process.env.NODE_ENV === "development" ? error.message : undefined,
        })
    }
}

