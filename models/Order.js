const mongoose = require("mongoose")

const orderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: [true, "Le produit est requis"],
    },
    productSnapshot: {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        image: { type: String, required: true },
        slug: { type: String, required: true },
    },
    quantity: {
        type: Number,
        required: [true, "La quantité est requise"],
        min: [1, "La quantité doit être au moins 1"],
    },
    unitPrice: {
        type: Number,
        required: [true, "Le prix unitaire est requis"],
        min: [0, "Le prix unitaire ne peut pas être négatif"],
    },
    totalPrice: {
        type: Number,
        required: [true, "Le prix total est requis"],
        min: [0, "Le prix total ne peut pas être négatif"],
    },
})

const orderSchema = new mongoose.Schema(
    {
        orderNumber: {
            type: String,
            required: [true, "Le numéro de commande est requis"],
            unique: true,
            index: true,
        },

        // Informations client
        customer: {
            firstName: {
                type: String,
                required: [true, "Le prénom est requis"],
                trim: true,
                maxlength: [50, "Le prénom ne peut pas dépasser 50 caractères"],
            },
            lastName: {
                type: String,
                required: [true, "Le nom est requis"],
                trim: true,
                maxlength: [50, "Le nom ne peut pas dépasser 50 caractères"],
            },
            email: {
                type: String,
                required: [true, "L'email est requis"],
                trim: true,
                lowercase: true,
                match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Email invalide"],
            },
            phone: {
                type: String,
                required: [true, "Le téléphone est requis"],
                trim: true,
                match: [/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/, "Numéro de téléphone invalide"],
            },
            company: {
                type: String,
                trim: true,
                maxlength: [100, "Le nom de l'entreprise ne peut pas dépasser 100 caractères"],
            },
        },

        // Adresse de livraison
        shippingAddress: {
            street: {
                type: String,
                required: [true, "L'adresse est requise"],
                trim: true,
                maxlength: [200, "L'adresse ne peut pas dépasser 200 caractères"],
            },
            city: {
                type: String,
                required: [true, "La ville est requise"],
                trim: true,
                maxlength: [100, "La ville ne peut pas dépasser 100 caractères"],
            },
            postalCode: {
                type: String,
                required: [true, "Le code postal est requis"],
                trim: true,
                match: [/^[0-9]{5}$/, "Code postal invalide (5 chiffres requis)"],
            },
            country: {
                type: String,
                required: [true, "Le pays est requis"],
                trim: true,
                default: "France",
            },
        },

        // Articles commandés
        items: [orderItemSchema],

        // Montants
        subtotal: {
            type: Number,
            required: [true, "Le sous-total est requis"],
            min: [0, "Le sous-total ne peut pas être négatif"],
        },
        shippingCost: {
            type: Number,
            required: [true, "Les frais de port sont requis"],
            min: [0, "Les frais de port ne peuvent pas être négatifs"],
            default: 0,
        },
        total: {
            type: Number,
            required: [true, "Le total est requis"],
            min: [0, "Le total ne peut pas être négatif"],
        },

        // Statut et suivi
        status: {
            type: String,
            enum: {
                values: ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"],
                message: "Statut invalide",
            },
            default: "pending",
        },

        paymentStatus: {
            type: String,
            enum: {
                values: ["pending", "received", "failed"],
                message: "Statut de paiement invalide",
            },
            default: "pending",
        },

        // Informations de paiement
        paymentMethod: {
            type: String,
            enum: {
                values: ["bank_transfer"],
                message: "Méthode de paiement invalide",
            },
            default: "bank_transfer",
        },

        // Notes et commentaires
        notes: {
            type: String,
            trim: true,
            maxlength: [500, "Les notes ne peuvent pas dépasser 500 caractères"],
        },

        // Historique des statuts
        statusHistory: [
            {
                status: {
                    type: String,
                    required: true,
                },
                date: {
                    type: Date,
                    default: Date.now,
                },
                note: {
                    type: String,
                    trim: true,
                },
            },
        ],

        // Dates
        createdAt: {
            type: Date,
            default: Date.now,
        },
        updatedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    },
)

// Index pour les recherches
orderSchema.index({ "customer.email": 1 })
orderSchema.index({ status: 1 })
orderSchema.index({ createdAt: -1 })

// Virtuals
orderSchema.virtual("customerFullName").get(function () {
    return `${this.customer.firstName} ${this.customer.lastName}`
})

orderSchema.virtual("isShippingFree").get(function () {
    return this.subtotal >= 500
})

// Middleware pour mettre à jour updatedAt
orderSchema.pre("save", function (next) {
    this.updatedAt = new Date()
    next()
})

// Méthode pour générer un numéro de commande unique
orderSchema.statics.generateOrderNumber = async function () {
    const date = new Date()
    const year = date.getFullYear().toString().slice(-2)
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const day = date.getDate().toString().padStart(2, "0")

    let orderNumber
    let exists = true
    let counter = 1

    while (exists) {
        const randomNum = Math.floor(Math.random() * 1000)
            .toString()
            .padStart(3, "0")
        orderNumber = `CMD${year}${month}${day}${randomNum}${counter.toString().padStart(2, "0")}`

        const existingOrder = await this.findOne({ orderNumber })
        if (!existingOrder) {
            exists = false
        } else {
            counter++
        }
    }

    return orderNumber
}

// Méthode pour calculer les frais de port
orderSchema.methods.calculateShipping = function () {
    return this.subtotal >= 500 ? 0 : 15
}

// Méthode pour ajouter un statut à l'historique
orderSchema.methods.addStatusHistory = function (status, note = "") {
    this.statusHistory.push({
        status,
        note,
        date: new Date(),
    })
    this.status = status
}

module.exports = mongoose.models.Order || mongoose.model("Order", orderSchema)