import mongoose from 'mongoose'

// Configuration de la connexion MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/boischauffage-pro'

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local')
}

let cached = global.mongoose

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null }
}

export async function connectToDatabase() {
    if (cached.conn) {
        return cached.conn
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        }

        cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
            return mongoose
        })
    }

    try {
        cached.conn = await cached.promise
    } catch (e) {
        cached.promise = null
        throw e
    }

    return cached.conn
}

// Schéma pour les catégories
const categorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
}, {
    timestamps: true
})

// Schéma pour les produits
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    description: { type: String, required: true },
    shortDescription: { type: String },
    essence: { type: String, required: true },
    price: { type: Number, required: true },
    compareAtPrice: { type: Number },
    unit: { type: String, required: true, enum: ['m³', 'stère', 'palette', 'sac'] },
    stock: { type: Number, default: 0 },
    images: [{
        url: { type: String, required: true },
        alt: { type: String, required: true },
        isPrimary: { type: Boolean, default: false }
    }],
    specifications: [{
        name: { type: String, required: true },
        value: { type: String, required: true },
        unit: { type: String }
    }],
    humidity: { type: Number }, // Pourcentage d'humidité
    calorificValue: { type: Number }, // kWh/kg
    density: { type: Number }, // kg/m³
    packaging: { type: String, enum: ['vrac', 'palette', 'sac'] },
    certifications: [{
        name: { type: String, required: true },
        code: { type: String }
    }],
    badges: [{ type: String, enum: ['nouveau', 'populaire', 'premium', 'économique', 'local'] }],
    seoTitle: { type: String },
    seoDescription: { type: String },
    averageRating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
}, {
    timestamps: true
})

// Schéma pour les commandes
const orderSchema = new mongoose.Schema({
    orderNumber: { type: String, required: true, unique: true },

    items: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        productName: { type: String, required: true },
        productImage: { type: String },
        essence: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        unit: { type: String, required: true },
        subtotal: { type: Number, required: true }
    }],

    customer: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true }
    },

    billingAddress: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        zipCode: { type: String, required: true },
        country: { type: String, required: true, default: 'France' }
    },

    shippingAddress: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        zipCode: { type: String, required: true },
        country: { type: String, required: true, default: 'France' },
        isSameAsBilling: { type: Boolean, default: true }
    },

    subtotal: { type: Number, required: true },
    shippingCost: { type: Number, required: true },
    tax: { type: Number, required: true },
    total: { type: Number, required: true },

    status: {
        type: String,
        enum: ['pending', 'payment_pending', 'payment_uploaded', 'confirmed', 'shipped', 'delivered'],
        default: 'pending'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'uploaded', 'verified', 'confirmed'],
        default: 'pending'
    },

    paymentProofs: [{
        filename: { type: String, required: true },
        url: { type: String, required: true },
        cloudinaryId: { type: String, required: true },
        uploadedAt: { type: Date, default: Date.now }
    }],

    orderNotes: { type: String },
    deliveryInstructions: { type: String },

    paymentDueDate: { type: Date },
    estimatedDelivery: { type: Date },
    shippedAt: { type: Date },
    deliveredAt: { type: Date },
}, {
    timestamps: true
})

// Schéma pour les paramètres de l'application
const appSettingSchema = new mongoose.Schema({
    key: { type: String, required: true, unique: true },
    value: { type: mongoose.Schema.Types.Mixed, required: true },
    description: { type: String },
    type: { type: String, enum: ['string', 'number', 'boolean', 'object', 'array'], required: true },
    category: { type: String, enum: ['payment', 'shipping', 'general'], required: true },
    isActive: { type: Boolean, default: true },
}, {
    timestamps: true
})

// Middleware pour générer automatiquement le numéro de commande
orderSchema.pre('save', async function (next) {
    if (!this.orderNumber) {
        const year = new Date().getFullYear()
        const count = await mongoose.model('Order').countDocuments()
        this.orderNumber = `BC${year}-${String(count + 1).padStart(4, '0')}`
    }

    // Calculer la date de paiement (7 jours après création)
    if (!this.paymentDueDate) {
        this.paymentDueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    }

    next()
})

// Index pour optimiser les requêtes
categorySchema.index({ slug: 1 })
categorySchema.index({ isActive: 1, order: 1 })

productSchema.index({ slug: 1 })
productSchema.index({ categoryId: 1, isActive: 1 })
productSchema.index({ featured: 1, isActive: 1 })
productSchema.index({ essence: 1 })

orderSchema.index({ orderNumber: 1 })
orderSchema.index({ 'customer.email': 1 })
orderSchema.index({ status: 1 })
orderSchema.index({ createdAt: -1 })

appSettingSchema.index({ key: 1 })
appSettingSchema.index({ category: 1, isActive: 1 })

// Exporter les modèles
export const Category = mongoose.models.Category || mongoose.model('Category', categorySchema)
export const Product = mongoose.models.Product || mongoose.model('Product', productSchema)
export const Order = mongoose.models.Order || mongoose.model('Order', orderSchema)
export const AppSetting = mongoose.models.AppSetting || mongoose.model('AppSetting', appSettingSchema)