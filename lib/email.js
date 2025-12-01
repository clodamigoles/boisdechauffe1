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

export const sendBankDetailsEmail = async (order) => {
    try {
        const transporter = createTransporter()

        // Import the template
        const { bankDetailsTemplate } = await import("./email-templates.js")

        const emailData = bankDetailsTemplate({
            orderNumber: order.orderNumber,
            customer: order.customer,
            bankDetails: order.bankDetails,
            total: order.total,
        })

        const mailOptions = {
            from: process.env.SMTP_FROM || process.env.SMTP_USER,
            to: order.customer.email,
            subject: emailData.subject,
            html: emailData.html,
            text: emailData.text,
        }

        const result = await transporter.sendMail(mailOptions)

        return {
            success: true,
            messageId: result.messageId,
        }
    } catch (error) {
        console.error("Erreur envoi email informations bancaires:", error)
        return {
            success: false,
            error: error.message,
        }
    }
}

// Fonction pour envoyer un email de confirmation de commande au client
export const sendOrderConfirmationEmail = async (order) => {
    try {
        const transporter = createTransporter()

        // Import the template
        const { orderConfirmationTemplate } = await import("./email-templates.js")

        const emailData = orderConfirmationTemplate({
            orderNumber: order.orderNumber,
            customer: order.customer,
            items: order.items,
            totals: {
                subtotal: order.subtotal,
                shipping: order.shippingCost,
                total: order.total,
            },
            bankDetails: order.bankDetails || {
                iban: "En attente",
                bic: "En attente",
                accountName: "En attente",
                reference: order.orderNumber,
            },
        })

        const mailOptions = {
            from: process.env.SMTP_FROM || process.env.SMTP_USER,
            to: order.customer.email,
            subject: emailData.subject,
            html: emailData.html,
            text: emailData.text,
        }

        const result = await transporter.sendMail(mailOptions)

        return {
            success: true,
            messageId: result.messageId,
        }
    } catch (error) {
        console.error("Erreur envoi email confirmation commande:", error)
        return {
            success: false,
            error: error.message,
        }
    }
}

// Fonction pour envoyer un email de notification à l'admin pour une nouvelle commande
export const sendAdminNewOrderNotification = async (order) => {
    try {
        const transporter = createTransporter()
        const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER

        const mailOptions = {
            from: process.env.SMTP_FROM || process.env.SMTP_USER,
            to: adminEmail,
            subject: `🆕 Nouvelle commande #${order.orderNumber}`,
            html: `
                <!DOCTYPE html>
                <html lang="fr">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Nouvelle commande</title>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: #4CAF50; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
                        .order-info { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
                        .items-list { margin: 20px 0; }
                        .item { padding: 10px; border-bottom: 1px solid #ddd; }
                        .total { font-weight: bold; font-size: 1.2em; padding-top: 10px; border-top: 2px solid #333; }
                        .button { display: inline-block; padding: 12px 24px; background: #4CAF50; color: white; text-decoration: none; border-radius: 4px; margin-top: 20px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>🆕 Nouvelle commande reçue</h1>
                            <p>Commande n° <strong>${order.orderNumber}</strong></p>
                        </div>
                        
                        <div class="order-info">
                            <h2>Informations client</h2>
                            <p><strong>Nom :</strong> ${order.customer.firstName} ${order.customer.lastName}</p>
                            <p><strong>Email :</strong> ${order.customer.email}</p>
                            <p><strong>Téléphone :</strong> ${order.customer.phone || "Non renseigné"}</p>
                            ${order.customer.company ? `<p><strong>Entreprise :</strong> ${order.customer.company}</p>` : ""}
                        </div>
                        
                        <div class="order-info">
                            <h2>Adresse de livraison</h2>
                            <p>${order.shippingAddress.street}</p>
                            <p>${order.shippingAddress.postalCode} ${order.shippingAddress.city}</p>
                            <p>${order.shippingAddress.country}</p>
                        </div>
                        
                        <div class="order-info">
                            <h2>Articles commandés</h2>
                            <div class="items-list">
                                ${order.items
                .map(
                    (item) => `
                                    <div class="item">
                                        <strong>${item.productSnapshot.name}</strong><br>
                                        Quantité: ${item.quantity} × ${item.unitPrice.toFixed(2)}€ = ${item.totalPrice.toFixed(2)}€
                                    </div>
                                `,
                )
                .join("")}
                            </div>
                            <div class="total">
                                <p>Sous-total: ${order.subtotal.toFixed(2)}€</p>
                                <p>Livraison: ${order.shippingCost === 0 ? "Gratuite" : order.shippingCost.toFixed(2) + "€"}</p>
                                <p>Total: ${order.total.toFixed(2)}€</p>
                            </div>
                        </div>
                        
                        ${order.notes ? `
                            <div class="order-info">
                                <h2>Notes</h2>
                                <p>${order.notes}</p>
                            </div>
                        ` : ""}
                        
                        <a href="${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/delta/orders" class="button">
                            Voir la commande dans l'admin
                        </a>
                    </div>
                </body>
                </html>
            `,
            text: `
                Nouvelle commande reçue
                
                Commande n° ${order.orderNumber}
                
                Informations client:
                Nom: ${order.customer.firstName} ${order.customer.lastName}
                Email: ${order.customer.email}
                Téléphone: ${order.customer.phone || "Non renseigné"}
                
                Adresse de livraison:
                ${order.shippingAddress.street}
                ${order.shippingAddress.postalCode} ${order.shippingAddress.city}
                ${order.shippingAddress.country}
                
                Articles commandés:
                ${order.items.map((item) => `- ${item.productSnapshot.name} x${item.quantity} = ${item.totalPrice.toFixed(2)}€`).join("\n")}
                
                Sous-total: ${order.subtotal.toFixed(2)}€
                Livraison: ${order.shippingCost === 0 ? "Gratuite" : order.shippingCost.toFixed(2) + "€"}
                Total: ${order.total.toFixed(2)}€
                
                ${order.notes ? `Notes: ${order.notes}` : ""}
            `,
        }

        const result = await transporter.sendMail(mailOptions)

        return {
            success: true,
            messageId: result.messageId,
        }
    } catch (error) {
        console.error("Erreur envoi email notification admin:", error)
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