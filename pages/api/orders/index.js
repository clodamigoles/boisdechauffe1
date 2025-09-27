import { connectToDatabase, Order, Product, AppSetting } from '@/lib/models'
import nodemailer from 'nodemailer'

// Configuration email
const transporter = nodemailer.createTransporter({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
})

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' })
    }

    try {
        await connectToDatabase()

        const {
            items,
            customer,
            billingAddress,
            shippingAddress,
            subtotal,
            shippingCost,
            tax,
            total,
            orderNotes,
            deliveryInstructions
        } = req.body

        // Validation des données obligatoires
        if (!items || !customer || !billingAddress || !shippingAddress) {
            return res.status(400).json({
                message: 'Données manquantes',
                error: 'Items, customer, billingAddress et shippingAddress sont requis'
            })
        }

        // Vérifier le stock des produits
        for (const item of items) {
            const product = await Product.findById(item.productId)
            if (!product) {
                return res.status(400).json({
                    message: `Produit ${item.productName} introuvable`
                })
            }
            if (product.stock < item.quantity) {
                return res.status(400).json({
                    message: `Stock insuffisant pour ${item.productName}. Stock disponible: ${product.stock}`
                })
            }
        }

        // Récupérer les paramètres
        const settings = await AppSetting.find({ isActive: true }).lean()
        const settingsMap = settings.reduce((acc, setting) => {
            acc[setting.key] = setting.value
            return acc
        }, {})

        const paymentDueDays = settingsMap.payment_due_days || 7
        const companyInfo = settingsMap.company_info || {
            name: 'BoisChauffage Pro',
            email: 'contact@boischauffagepro.fr'
        }

        // Créer la commande
        const order = new Order({
            items,
            customer,
            billingAddress,
            shippingAddress,
            subtotal,
            shippingCost,
            tax,
            total,
            orderNotes,
            deliveryInstructions,
            status: 'pending',
            paymentStatus: 'pending',
            paymentDueDate: new Date(Date.now() + paymentDueDays * 24 * 60 * 60 * 1000),
            estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 jours
        })

        await order.save()

        // Mettre à jour le stock des produits
        for (const item of items) {
            await Product.findByIdAndUpdate(
                item.productId,
                { $inc: { stock: -item.quantity } },
                { new: true }
            )
        }

        // Envoyer l'email de confirmation
        try {
            await sendOrderConfirmationEmail(order, settingsMap)
        } catch (emailError) {
            console.error('Erreur envoi email:', emailError)
            // On continue même si l'email échoue
        }

        res.status(201).json({
            success: true,
            message: 'Commande créée avec succès',
            data: {
                _id: order._id,
                orderNumber: order.orderNumber,
                total: order.total,
                paymentDueDate: order.paymentDueDate,
                estimatedDelivery: order.estimatedDelivery
            }
        })

    } catch (error) {
        console.error('Erreur création commande:', error)
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la création de la commande',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Erreur interne'
        })
    }
}

async function sendOrderConfirmationEmail(order, settings) {
    const bankInfo = {
        name: settings.bank_name || 'Banque',
        iban: settings.bank_iban || 'IBAN',
        bic: settings.bank_bic || 'BIC',
        accountName: settings.bank_account_name || 'Titulaire'
    }

    const companyInfo = settings.company_info || {
        name: 'BoisChauffage Pro',
        email: 'contact@boischauffagepro.fr',
        phone: '01 23 45 67 89'
    }

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Confirmation de commande</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #f59e0b; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .order-details { background: white; padding: 15px; margin: 15px 0; border-radius: 5px; }
        .bank-info { background: #e7f3ff; padding: 15px; margin: 15px 0; border-radius: 5px; border-left: 4px solid #2196F3; }
        .footer { text-align: center; padding: 20px; font-size: 0.9em; color: #666; }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
        .total { font-weight: bold; font-size: 1.1em; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🪵 ${companyInfo.name}</h1>
            <h2>Confirmation de commande</h2>
        </div>
        
        <div class="content">
            <p>Bonjour ${order.customer.firstName} ${order.customer.lastName},</p>
            
            <p>Votre commande <strong>#${order.orderNumber}</strong> a été confirmée avec succès !</p>
            
            <div class="order-details">
                <h3>Détails de la commande</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Produit</th>
                            <th>Quantité</th>
                            <th>Prix unitaire</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${order.items.map(item => `
                            <tr>
                                <td>${item.productName}<br><small>${item.essence}</small></td>
                                <td>${item.quantity} ${item.unit}</td>
                                <td>${item.price.toFixed(2)}€</td>
                                <td>${item.subtotal.toFixed(2)}€</td>
                            </tr>
                        `).join('')}
                        <tr>
                            <td colspan="3"><strong>Sous-total</strong></td>
                            <td><strong>${order.subtotal.toFixed(2)}€</strong></td>
                        </tr>
                        <tr>
                            <td colspan="3">Livraison</td>
                            <td>${order.shippingCost === 0 ? 'Gratuite' : order.shippingCost.toFixed(2) + '€'}</td>
                        </tr>
                        <tr>
                            <td colspan="3">TVA (20%)</td>
                            <td>${order.tax.toFixed(2)}€</td>
                        </tr>
                        <tr class="total">
                            <td colspan="3"><strong>TOTAL</strong></td>
                            <td><strong>${order.total.toFixed(2)}€</strong></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
            <div class="bank-info">
                <h3>💳 Informations pour le virement bancaire</h3>
                <p><strong>Banque :</strong> ${bankInfo.name}</p>
                <p><strong>Titulaire :</strong> ${bankInfo.accountName}</p>
                <p><strong>IBAN :</strong> ${bankInfo.iban}</p>
                <p><strong>BIC :</strong> ${bankInfo.bic}</p>
                <p><strong>Montant exact :</strong> ${order.total.toFixed(2)}€</p>
                <p><strong>Référence obligatoire :</strong> ${order.orderNumber}</p>
                <p><strong>Date limite de paiement :</strong> ${order.paymentDueDate.toLocaleDateString('fr-FR')}</p>
            </div>
            
            <div class="order-details">
                <h3>📦 Adresse de livraison</h3>
                <p>
                    ${order.shippingAddress.street}<br>
                    ${order.shippingAddress.zipCode} ${order.shippingAddress.city}<br>
                    ${order.shippingAddress.country}
                </p>
                ${order.deliveryInstructions ? `<p><strong>Instructions :</strong> ${order.deliveryInstructions}</p>` : ''}
            </div>
            
            <p><strong>Prochaines étapes :</strong></p>
            <ol>
                <li>Effectuez le virement bancaire avec les informations ci-dessus</li>
                <li>Uploadez votre justificatif de paiement via le lien de suivi</li>
                <li>Nous traiterons votre commande dès réception du paiement</li>
                <li>Livraison estimée : ${order.estimatedDelivery.toLocaleDateString('fr-FR')}</li>
            </ol>
            
            <p>
                <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/suivi/${order.orderNumber}" 
                   style="background: #f59e0b; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
                    Suivre ma commande
                </a>
            </p>
        </div>
        
        <div class="footer">
            <p>Merci de votre confiance !</p>
            <p>
                ${companyInfo.name}<br>
                📞 ${companyInfo.phone}<br>
                ✉️ ${companyInfo.email}
            </p>
        </div>
    </div>
</body>
</html>
  `

    const mailOptions = {
        from: process.env.EMAIL_FROM || companyInfo.email,
        to: order.customer.email,
        subject: `Confirmation de commande #${order.orderNumber} - ${companyInfo.name}`,
        html: emailHtml
    }

    await transporter.sendMail(mailOptions)
}