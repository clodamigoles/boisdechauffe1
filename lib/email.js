import nodemailer from "nodemailer"

// Configuration du transporteur email
const createTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number.parseInt(process.env.SMTP_PORT) || 587,
        secure: false, // true pour 465, false pour les autres ports
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    })
}

// Template HTML pour le devis
export const createQuoteEmailTemplate = (order, quoteData) => {
    return `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Devis - ${order.orderNumber}</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
                .payment-info { background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0; }
                .order-summary { background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0; }
                .item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
                .total { font-weight: bold; font-size: 1.2em; padding-top: 10px; border-top: 2px solid #333; }
                .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Devis pour votre commande</h1>
                    <p>Commande n° <strong>${order.orderNumber}</strong></p>
                </div>
                
                <p>Bonjour ${order.customer.firstName} ${order.customer.lastName},</p>
                
                <p>Nous vous remercions pour votre commande. Voici votre devis détaillé :</p>
                
                <div class="payment-info">
                    <h2>Informations de paiement</h2>
                    <p><strong>Montant à payer :</strong> ${quoteData.amount}€</p>
                    <p><strong>IBAN :</strong> ${quoteData.iban}</p>
                    <p><strong>BIC :</strong> ${quoteData.bic}</p>
                    <p><strong>Référence à mentionner :</strong> ${order.orderNumber}</p>
                </div>
                
                ${quoteData.notes
            ? `
                <div style="margin: 20px 0;">
                    <h3>Notes importantes :</h3>
                    <p>${quoteData.notes.replace(/\n/g, "<br>")}</p>
                </div>
                `
            : ""
        }
                
                <div class="order-summary">
                    <h3>Récapitulatif de votre commande</h3>
                    ${order.items
            .map(
                (item) => `
                        <div class="item">
                            <span>${item.productSnapshot.name} x${item.quantity}</span>
                            <span>${item.totalPrice}€</span>
                        </div>
                    `,
            )
            .join("")}
                    <div class="item">
                        <span>Frais de port</span>
                        <span>${order.shippingCost}€</span>
                    </div>
                    <div class="total">
                        <div class="item">
                            <span>Total</span>
                            <span>${order.total}€</span>
                        </div>
                    </div>
                </div>
                
                <p>Une fois le paiement effectué, nous procéderons à la préparation et à l'expédition de votre commande.</p>
                
                <p>Pour toute question, n'hésitez pas à nous contacter.</p>
                
                <div class="footer">
                    <p>Cordialement,<br>L'équipe</p>
                    <p><small>Cet email a été envoyé automatiquement, merci de ne pas y répondre directement.</small></p>
                </div>
            </div>
        </body>
        </html>
    `
}

// Fonction pour envoyer un email de devis
export const sendQuoteEmail = async (order, quoteData) => {
    try {
        const transporter = createTransporter()

        const mailOptions = {
            from: process.env.SMTP_FROM || process.env.SMTP_USER,
            to: order.customer.email,
            subject: `Devis pour votre commande ${order.orderNumber}`,
            html: createQuoteEmailTemplate(order, quoteData),
        }

        const result = await transporter.sendMail(mailOptions)

        return {
            success: true,
            messageId: result.messageId,
        }
    } catch (error) {
        console.error("Erreur envoi email:", error)
        return {
            success: false,
            error: error.message,
        }
    }
}

// Fonction pour tester la configuration email
export const testEmailConfig = async () => {
    try {
        const transporter = createTransporter()
        await transporter.verify()
        return { success: true, message: "Configuration email valide" }
    } catch (error) {
        console.error("Erreur configuration email:", error)
        return { success: false, error: error.message }
    }
}