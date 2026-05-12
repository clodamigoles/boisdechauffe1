import mongoose from "mongoose"

const PaymentSchema = new mongoose.Schema(
    {
        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            required: true,
        },
        // Montant en euros (cohérent avec Order.total)
        amount: {
            type: Number,
            required: true,
            min: 0,
        },
        method: {
            type: String,
            enum: ["bank_transfer", "card"],
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "completed", "failed", "refunded"],
            default: "pending",
        },
        // Validation admin
        validatedAt: Date,
        notes: String,
    },
    { timestamps: true }
)

PaymentSchema.index({ order: 1 })
PaymentSchema.index({ status: 1, method: 1 })

export default mongoose.models.Payment || mongoose.model("Payment", PaymentSchema)
