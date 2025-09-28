import formidable from "formidable"
import { v2 as cloudinary } from "cloudinary"
import fs from "fs"
import connectDB from "@/lib/mongoose"
import { Order } from "@/models/index"

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

export const config = {
    api: {
        bodyParser: false,
    },
}

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ success: false, message: "Méthode non autorisée" })
    }

    try {
        console.log("[v0] Starting receipt upload process")
        await connectDB()
        console.log("[v0] Database connected successfully")

        const { orderNumber } = req.query
        console.log("[v0] Looking for order:", orderNumber)

        // Find the order
        const order = await Order.findOne({ orderNumber })
        if (!order) {
            console.log("[v0] Order not found:", orderNumber)
            return res.status(404).json({ success: false, message: "Commande introuvable" })
        }
        console.log("[v0] Order found:", order._id, "Current status:", order.status)

        // Parse the form data
        const form = formidable({
            maxFileSize: 10 * 1024 * 1024, // 10MB
            filter: ({ mimetype }) => {
                return mimetype && (mimetype.includes("image") || mimetype.includes("pdf"))
            },
        })

        const [fields, files] = await form.parse(req)
        const file = files.receipt?.[0]

        if (!file) {
            console.log("[v0] No file provided")
            return res.status(400).json({ success: false, message: "Aucun fichier fourni" })
        }
        console.log("[v0] File received:", file.originalFilename, "Size:", file.size)

        // Upload to Cloudinary
        console.log("[v0] Uploading to Cloudinary...")
        const uploadResult = await cloudinary.uploader.upload(file.filepath, {
            folder: `receipts/${orderNumber}`,
            resource_type: "auto",
            public_id: `receipt_${Date.now()}`,
        })
        console.log("[v0] Cloudinary upload successful:", uploadResult.secure_url)

        // Clean up temp file
        fs.unlinkSync(file.filepath)

        // Add receipt to order
        const receiptData = {
            url: uploadResult.secure_url,
            filename: file.originalFilename || "receipt",
            publicId: uploadResult.public_id,
            uploadedAt: new Date(),
        }

        console.log("[v0] Updating order with receipt data...")

        const updatedOrder = await Order.findOneAndUpdate(
            { orderNumber },
            {
                $push: { paymentReceipts: receiptData },
                $set: { updatedAt: new Date() },
            },
            {
                new: true,
                upsert: false,
                runValidators: true,
            },
        )

        if (!updatedOrder) {
            console.log("[v0] Failed to update order")
            return res.status(500).json({ success: false, message: "Erreur lors de la mise à jour de la commande" })
        }

        console.log("[v0] Order updated successfully, receipts count:", updatedOrder.paymentReceipts?.length)

        res.status(200).json({
            success: true,
            message: "Récépissé uploadé avec succès",
            data: receiptData,
        })
    } catch (error) {
        console.error("[v0] Erreur upload récépissé:", error)
        res.status(500).json({
            success: false,
            message: "Erreur lors de l'upload du récépissé",
        })
    }
}