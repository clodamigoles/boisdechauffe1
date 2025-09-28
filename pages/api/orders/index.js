import { Order, Product } from "@/models/index"
import connectDB from "@/lib/mongoose"
import { validateOrderData } from "@/lib/validation"

export default async function handler(req, res) {
    await connectDB()

    if (req.method === "POST") {
        try {
            // Validation des données
            const { error, value } = validateOrderData(req.body)
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: "Données invalides",
                    errors: error.details.map((detail) => detail.message),
                })
            }

            const { customer, shippingAddress, items, notes } = value

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

            // Calcul des frais de port
            const shippingCost = subtotal >= 500 ? 0 : 15
            const total = subtotal + shippingCost

            // Génération du numéro de commande
            const orderNumber = await Order.generateOrderNumber()

            // Création de la commande
            const order = new Order({
                orderNumber,
                customer,
                shippingAddress,
                items: orderItems,
                subtotal,
                shippingCost,
                total,
                notes,
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