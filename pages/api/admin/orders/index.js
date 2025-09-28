import connectDB, { handleDBErrors } from "@/lib/mongoose"
import { Order } from "@/models"

export default async function handler(req, res) {
    await connectDB()

    if (req.method !== "GET") {
        res.setHeader("Allow", ["GET"])
        return res.status(405).json({
            success: false,
            message: `Méthode ${req.method} non autorisée`,
        })
    }

    try {
        const { page = 1, limit = 10, search, status, paymentStatus } = req.query

        const filter = {}
        if (search) {
            filter.$or = [
                { orderNumber: { $regex: search, $options: "i" } },
                { "customer.email": { $regex: search, $options: "i" } },
                { "customer.firstName": { $regex: search, $options: "i" } },
                { "customer.lastName": { $regex: search, $options: "i" } },
            ]
        }
        if (status) {
            filter.status = status
        }
        if (paymentStatus) {
            filter.paymentStatus = paymentStatus
        }

        const skip = (Number.parseInt(page) - 1) * Number.parseInt(limit)

        const [orders, total] = await Promise.all([
            Order.find(filter)
                .populate("items.product", "name slug")
                .select("+paymentReceipts")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(Number.parseInt(limit))
                .lean(),
            Order.countDocuments(filter),
        ])

        return res.status(200).json({
            success: true,
            data: orders,
            pagination: {
                page: Number.parseInt(page),
                limit: Number.parseInt(limit),
                total,
                pages: Math.ceil(total / Number.parseInt(limit)),
            },
        })
    } catch (error) {
        console.error("Erreur récupération commandes:", error)
        const dbError = handleDBErrors(error)
        return res.status(500).json({
            success: false,
            message: dbError.message,
        })
    }
}