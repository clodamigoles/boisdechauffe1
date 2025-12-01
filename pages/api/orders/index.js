import { Order, Product } from "@/models/index"
import { SiteSettings } from "@/models/SiteSettings"
import connectDB from "@/lib/mongoose"
import { validateOrderData } from "@/lib/validation"
import { sendOrderConfirmationEmail, sendAdminNewOrderNotification } from "@/lib/email"

export default async function handler(req, res) {
    await connectDB()

    if (req.method === "POST") {
        try {
            console.log("[v0] Received order data:", JSON.stringify(req.body, null, 2))

            // Validation des données
            const { error, value } = validateOrderData(req.body)
            if (error) {
                console.log("[v0] Validation errors:", error.details)
                return res.status(400).json({
                    success: false,
                    message: "Données invalides",
                    errors: error.details.map((detail) => detail.message),
                })
            }

            console.log("[v0] Validated data:", JSON.stringify(value, null, 2))

            const { customer, shippingAddress, items, notes, shippingCost: providedShippingCost } = value

            // Vérification et récupération des produits
            const productIds = items.map((item) => item.productId)
            const products = await Product.find({ _id: { $in: productIds } })

            if (products.length !== items.length) {
                return res.status(400).json({
                    success: false,
                    message: "Certains produits sont introuvables",
                })
            }

            // Préparation des articles avec snapshot des produits
            const orderItems = []
            let subtotal = 0

            for (const item of items) {
                const product = products.find((p) => p._id.toString() === item.productId)

                if (!product) {
                    return res.status(400).json({
                        success: false,
                        message: `Produit ${item.productId} introuvable`,
                    })
                }

                if (product.stock < item.quantity) {
                    return res.status(400).json({
                        success: false,
                        message: `Stock insuffisant pour ${product.name}`,
                    })
                }

                const unitPrice =
                    product.compareAtPrice && product.compareAtPrice > product.price ? product.price : product.price
                const totalPrice = unitPrice * item.quantity

                orderItems.push({
                    product: product._id,
                    productSnapshot: {
                        name: product.name,
                        price: unitPrice,
                        image: product.images[0]?.url || "/placeholder.svg",
                        slug: product.slug,
                    },
                    quantity: item.quantity,
                    unitPrice,
                    totalPrice,
                })

                subtotal += totalPrice
            }

            // If not provided, fall back to default calculation
            const shippingCost = providedShippingCost !== undefined ? providedShippingCost : subtotal >= 500 ? 0 : 15
            const total = subtotal + shippingCost

            // Génération du numéro de commande
            const orderNumber = await Order.generateOrderNumber()

            // Récupération des coordonnées bancaires par défaut depuis les settings
            const siteSettings = await SiteSettings.getActiveSettings()
            const defaultBankDetails = siteSettings.bankDetails || {}

            // Création de la commande avec les coordonnées bancaires par défaut
            const order = new Order({
                orderNumber,
                customer,
                shippingAddress,
                items: orderItems,
                subtotal,
                shippingCost,
                total,
                notes,
                bankDetails: defaultBankDetails.iban && defaultBankDetails.bic && defaultBankDetails.accountName
                    ? {
                          iban: defaultBankDetails.iban,
                          bic: defaultBankDetails.bic,
                          accountName: defaultBankDetails.accountName,
                          amountToPay: total,
                          updatedAt: new Date(),
                      }
                    : null,
                statusHistory: [
                    {
                        status: "pending",
                        date: new Date(),
                        note: "Commande créée",
                    },
                ],
            })

            await order.save()

            // Mise à jour du stock des produits
            for (const item of items) {
                await Product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.quantity } })
            }

            // Envoi des emails (en arrière-plan, ne pas bloquer la réponse)
            Promise.all([
                sendOrderConfirmationEmail(order).catch((err) => {
                    console.error("Erreur envoi email confirmation client:", err)
                }),
                sendAdminNewOrderNotification(order).catch((err) => {
                    console.error("Erreur envoi email notification admin:", err)
                }),
            ]).catch((err) => {
                console.error("Erreur envoi emails:", err)
            })

            res.status(201).json({
                success: true,
                message: "Commande créée avec succès",
                data: {
                    orderNumber: order.orderNumber,
                    orderId: order._id,
                    total: order.total,
                    shippingCost: order.shippingCost,
                },
            })
        } catch (error) {
            console.error("Erreur création commande:", error)
            res.status(500).json({
                success: false,
                message: "Erreur lors de la création de la commande",
                error: process.env.NODE_ENV === "development" ? error.message : undefined,
            })
        }
    } else {
        res.setHeader("Allow", ["POST"])
        res.status(405).json({
            success: false,
            message: `Méthode ${req.method} non autorisée`,
        })
    }
}