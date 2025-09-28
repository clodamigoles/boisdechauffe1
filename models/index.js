import mongoose from "mongoose"

import { Contact } from './Contact'

// Schéma Catégorie
const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Le nom de la catégorie est requis"],
            trim: true,
            maxlength: [100, "Le nom ne peut dépasser 100 caractères"],
        },
        slug: {
            type: String,
            required: [true, "Le slug est requis"],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^[a-z0-9-]+$/, "Le slug ne peut contenir que des lettres minuscules, chiffres et tirets"],
        },
        shortDescription: {
            type: String,
            maxlength: [200, "La description courte ne peut dépasser 200 caractères"],
        },
        description: {
            type: String,
            maxlength: [1000, "La description ne peut dépasser 1000 caractères"],
        },
        image: {
            type: String,
            validate: {
                validator: (v) => !v || /^(https?:\/\/)|(\/images\/)/.test(v),
                message: "URL d'image invalide",
            },
        },
        featured: {
            type: Boolean,
            default: false,
        },
        trending: {
            type: Boolean,
            default: false,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        order: {
            type: Number,
            default: 0,
        },
        seoTitle: String,
        seoDescription: String,
        metadata: {
            color: String,
            icon: String,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    },
)

// Virtual pour compter les produits
categorySchema.virtual("productCount", {
    ref: "Product",
    localField: "_id",
    foreignField: "categoryId",
    count: true,
    match: { isActive: true },
})

/* Index pour les performances
categorySchema.index({ slug: 1 })
categorySchema.index({ featured: 1, isActive: 1 })
categorySchema.index({ order: 1 }) */

// Schéma Produit
const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Le nom du produit est requis"],
            trim: true,
            maxlength: [150, "Le nom ne peut dépasser 150 caractères"],
        },
        slug: {
            type: String,
            required: [true, "Le slug est requis"],
            unique: true,
            lowercase: true,
            trim: true,
        },
        shortDescription: {
            type: String,
            required: [true, "La description courte est requise"],
            maxlength: [5300, "La description courte ne peut dépasser 5300 caractères"],
        },
        description: {
            type: String,
            maxlength: [2000, "La description ne peut dépasser 2000 caractères"],
        },
        categoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: [true, "La catégorie est requise"],
        },
        essence: {
            type: String,
            required: [true, "L'essence est requise"],
            enum: {
                values: ["chêne", "hêtre", "charme", "mix", "granulés", "compressé", "allume-feu"],
                message: "Essence non valide",
            },
        },
        price: {
            type: Number,
            required: [true, "Le prix est requis"],
            min: [0, "Le prix ne peut être négatif"],
        },
        compareAtPrice: {
            type: Number,
            min: [0, "Le prix de comparaison ne peut être négatif"],
            validate: {
                validator: function (v) {
                    return !v || v > this.price
                },
                message: "Le prix de comparaison doit être supérieur au prix de vente",
            },
        },
        unit: {
            type: String,
            required: [true, "L'unité est requise"],
            enum: ["stère", "tonne", "pack", "kg", "sac"],
        },
        stock: {
            type: Number,
            required: [true, "Le stock est requis"],
            min: [0, "Le stock ne peut être négatif"],
            default: 0,
        },
        images: [
            {
                url: {
                    type: String,
                    required: true,
                },
                alt: String,
                isPrimary: {
                    type: Boolean,
                    default: false,
                },
            },
        ],
        specifications: [
            {
                name: {
                    type: String,
                    required: true,
                },
                value: {
                    type: String,
                    required: true,
                },
                unit: String,
            },
        ],
        badges: [
            {
                type: String,
                enum: ["premium", "bestseller", "nouveau", "populaire", "offre", "écologique", "innovation"],
            },
        ],
        featured: {
            type: Boolean,
            default: false,
        },
        bestseller: {
            type: Boolean,
            default: false,
        },
        trending: {
            type: Boolean,
            default: false,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        averageRating: {
            type: Number,
            min: 0,
            max: 5,
            default: 0,
        },
        reviewCount: {
            type: Number,
            min: 0,
            default: 0,
        },
        salesCount: {
            type: Number,
            min: 0,
            default: 0,
        },
        viewCount: {
            type: Number,
            min: 0,
            default: 0,
        },
        seoTitle: String,
        seoDescription: String,
        metadata: mongoose.Schema.Types.Mixed,
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    },
)

// Virtual pour calculer le pourcentage de réduction
productSchema.virtual("discountPercentage").get(function () {
    if (this.compareAtPrice && this.compareAtPrice > this.price) {
        return Math.round(((this.compareAtPrice - this.price) / this.compareAtPrice) * 100)
    }
    return 0
})

// Virtual pour vérifier si en stock
productSchema.virtual("inStock").get(function () {
    return this.stock > 0
})

// Middleware pre-save pour générer le slug
productSchema.pre("save", function (next) {
    if (this.isModified("name") && !this.slug) {
        this.slug = this.name
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "-")
            .replace(/-+/g, "-")
            .replace(/^-|-$/g, "")
    }
    next()
})

/* Index pour les performances
productSchema.index({ slug: 1 })
productSchema.index({ categoryId: 1, isActive: 1 })
productSchema.index({ featured: 1, isActive: 1 })
productSchema.index({ bestseller: 1, isActive: 1 })
productSchema.index({ essence: 1, isActive: 1 })
productSchema.index({ price: 1 })
productSchema.index({ averageRating: -1 })
productSchema.index({ salesCount: -1 })
productSchema.index({ name: "text", shortDescription: "text" }) */

// Schéma Newsletter
const newsletterSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, "L'email est requis"],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Email invalide"],
        },
        firstName: {
            type: String,
            trim: true,
            maxlength: [50, "Le prénom ne peut dépasser 50 caractères"],
        },
        interests: [
            {
                type: String,
                enum: ["promotions", "nouveautes", "conseils", "saisons"],
            },
        ],
        source: {
            type: String,
            default: "unknown",
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        confirmedAt: Date,
        subscribedAt: {
            type: Date,
            default: Date.now,
        },
        unsubscribedAt: Date,
        metadata: {
            ipAddress: String,
            userAgent: String,
            referer: String,
        },
    },
    {
        timestamps: true,
    },
)

/* Index pour les performances
newsletterSchema.index({ email: 1 })
newsletterSchema.index({ isActive: 1 })
newsletterSchema.index({ subscribedAt: -1 }) */

// Schéma Témoignage
const testimonialSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Le nom est requis"],
            trim: true,
            maxlength: [100, "Le nom ne peut dépasser 100 caractères"],
        },
        location: {
            type: String,
            required: [true, "La localisation est requise"],
            trim: true,
        },
        avatar: {
            type: String,
            validate: {
                validator: (v) => !v || /^(https?:\/\/)|(\/images\/)/.test(v),
                message: "URL d'avatar invalide",
            },
        },
        rating: {
            type: Number,
            required: [true, "La note est requise"],
            min: [1, "La note minimum est 1"],
            max: [5, "La note maximum est 5"],
        },
        comment: {
            type: String,
            required: [true, "Le commentaire est requis"],
            maxlength: [1000, "Le commentaire ne peut dépasser 1000 caractères"],
        },
        shortComment: {
            type: String,
            maxlength: [200, "Le commentaire court ne peut dépasser 200 caractères"],
        },
        productPurchased: String,
        verified: {
            type: Boolean,
            default: false,
        },
        featured: {
            type: Boolean,
            default: false,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        order: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    },
)

/* Index pour les performances
testimonialSchema.index({ featured: 1, isActive: 1 })
testimonialSchema.index({ verified: 1, isActive: 1 })
testimonialSchema.index({ rating: -1 })
testimonialSchema.index({ order: 1 }) */

// Schéma Commande
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

        // Informations de paiement
        paymentMethod: {
            type: String,
            enum: {
                values: ["bank_transfer"],
                message: "Méthode de paiement invalide",
            },
            default: "bank_transfer",
        },

        paymentReceipts: [
            {
                url: {
                    type: String,
                    required: true,
                },
                filename: {
                    type: String,
                    required: true,
                },
                uploadedAt: {
                    type: Date,
                    default: Date.now,
                },
                publicId: {
                    type: String,
                    required: true,
                },
            },
        ],

        // Notes et commentaires
        notes: {
            type: String,
            trim: true,
            maxlength: [500, "Les notes ne peuvent pas dépasser 500 caractères"],
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
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    },
)

/* Index pour les recherches
orderSchema.index({ "customer.email": 1 })
orderSchema.index({ status: 1 })
orderSchema.index({ createdAt: -1 }) */

// Virtuals
orderSchema.virtual("customerFullName").get(function () {
    return `${this.customer.firstName} ${this.customer.lastName}`
})

orderSchema.virtual("isShippingFree").get(function () {
    return this.subtotal >= 500
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

// Méthode pour ajouter un statut à l'historique
orderSchema.methods.addStatusHistory = function (status, note = "") {
    this.statusHistory.push({
        status,
        note,
        date: new Date(),
    })
    this.status = status
}

// Schéma Devis
const quoteSchema = new mongoose.Schema(
    {
        orderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            required: [true, "L'ID de commande est requis"],
        },
        amount: {
            type: Number,
            required: [true, "Le montant est requis"],
            min: [0, "Le montant ne peut pas être négatif"],
        },
        iban: {
            type: String,
            required: [true, "L'IBAN est requis"],
            trim: true,
            match: [/^[A-Z]{2}[0-9]{2}[A-Z0-9]{4}[0-9]{7}([A-Z0-9]?){0,16}$/, "IBAN invalide"],
        },
        bic: {
            type: String,
            required: [true, "Le BIC est requis"],
            trim: true,
            match: [/^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/, "BIC invalide"],
        },
        notes: {
            type: String,
            trim: true,
            maxlength: [1000, "Les notes ne peuvent pas dépasser 1000 caractères"],
        },
        sentAt: {
            type: Date,
            default: Date.now,
        },
        emailMessageId: {
            type: String,
            trim: true,
        },
        status: {
            type: String,
            enum: {
                values: ["sent", "viewed", "paid"],
                message: "Statut de devis invalide",
            },
            default: "sent",
        },
    },
    {
        timestamps: true,
    },
)

/* Index pour les performances
quoteSchema.index({ orderId: 1 })
quoteSchema.index({ status: 1 })
quoteSchema.index({ sentAt: -1 }) */

// Export des modèles
export const Category = mongoose.models.Category || mongoose.model("Category", categorySchema)
export const Product = mongoose.models.Product || mongoose.model("Product", productSchema)
export const Newsletter = mongoose.models.Newsletter || mongoose.model("Newsletter", newsletterSchema)
export const Testimonial = mongoose.models.Testimonial || mongoose.model("Testimonial", testimonialSchema)
export const Order = mongoose.models.Order || mongoose.model("Order", orderSchema)
export const Quote = mongoose.models.Quote || mongoose.model("Quote", quoteSchema)

// Export par défaut pour faciliter l'import
export default {
    Category,
    Product,
    Newsletter,
    Testimonial,
    Order,
    Quote,
    Contact
}