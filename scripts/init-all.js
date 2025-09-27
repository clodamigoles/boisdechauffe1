require('dotenv').config({ path: '.env.local' })

const mongoose = require('mongoose')
const slugify = require('slugify')

// Configuration MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/boischauffage-pro'

// Schémas (répliquer les modèles ici pour le script)
const categorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
}, { timestamps: true })

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    description: { type: String, required: true },
    shortDescription: { type: String },
    essence: { type: String, required: true },
    price: { type: Number, required: true },
    compareAtPrice: { type: Number },
    unit: { type: String, required: true },
    stock: { type: Number, default: 100 },
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
    humidity: { type: Number },
    calorificValue: { type: Number },
    density: { type: Number },
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
}, { timestamps: true })

const appSettingSchema = new mongoose.Schema({
    key: { type: String, required: true, unique: true },
    value: { type: mongoose.Schema.Types.Mixed, required: true },
    description: { type: String },
    type: { type: String, enum: ['string', 'number', 'boolean', 'object', 'array'], required: true },
    category: { type: String, enum: ['payment', 'shipping', 'general'], required: true },
    isActive: { type: Boolean, default: true },
}, { timestamps: true })

const Category = mongoose.models.Category || mongoose.model('Category', categorySchema)
const Product = mongoose.models.Product || mongoose.model('Product', productSchema)
const AppSetting = mongoose.models.AppSetting || mongoose.model('AppSetting', appSettingSchema)

// Données d'initialisation
const categories = [
    {
        name: "Bois Feuillus",
        slug: "bois-feuillus",
        description: "Chêne, hêtre, charme - Excellent pouvoir calorifique et combustion lente",
        image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop",
        order: 1
    },
    {
        name: "Bois Résineux",
        slug: "bois-resineux",
        description: "Pin, sapin, épicéa - Allumage facile et rapide, idéal pour démarrer le feu",
        image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop",
        order: 2
    },
    {
        name: "Palettes & Conditionnés",
        slug: "palettes-conditionnes",
        description: "Formats pratiques et prêts à l'emploi, livrés sur palette",
        image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop",
        order: 3
    },
    {
        name: "Mix Économiques",
        slug: "mix-economiques",
        description: "Mélanges qualité-prix pour usage quotidien et économique",
        image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop",
        order: 4
    }
]

const settings = [
    // Informations bancaires
    {
        key: "bank_name",
        value: "Crédit Agricole",
        description: "Nom de la banque",
        type: "string",
        category: "payment"
    },
    {
        key: "bank_iban",
        value: "FR76 1234 5678 9012 3456 7890 123",
        description: "IBAN pour les virements",
        type: "string",
        category: "payment"
    },
    {
        key: "bank_bic",
        value: "AGRIFRPP123",
        description: "Code BIC",
        type: "string",
        category: "payment"
    },
    {
        key: "bank_account_name",
        value: "BoisChauffage Pro SARL",
        description: "Nom du compte",
        type: "string",
        category: "payment"
    },

    // Livraison
    {
        key: "freeShippingThreshold",
        value: 500,
        description: "Montant pour livraison gratuite",
        type: "number",
        category: "shipping"
    },
    {
        key: "shippingCost",
        value: 50,
        description: "Coût de livraison standard",
        type: "number",
        category: "shipping"
    },
    {
        key: "shipping_zones",
        value: ["France"],
        description: "Zones de livraison",
        type: "array",
        category: "shipping"
    },

    // Général
    {
        key: "taxRate",
        value: 0.20,
        description: "Taux de TVA",
        type: "number",
        category: "general"
    },
    {
        key: "min_order_amount",
        value: 50,
        description: "Montant minimum de commande",
        type: "number",
        category: "general"
    },
    {
        key: "payment_due_days",
        value: 7,
        description: "Délai de paiement en jours",
        type: "number",
        category: "general"
    },
    {
        key: "company_info",
        value: {
            name: "BoisChauffage Pro",
            email: "contact@boischauffagepro.fr",
            phone: "01 23 45 67 89",
            address: "123 Route Forestière, 45000 Orléans",
            siret: "12345678901234"
        },
        description: "Informations de l'entreprise",
        type: "object",
        category: "general"
    }
]

async function initializeDatabase() {
    try {
        console.log('🔌 Connexion à MongoDB...')
        await mongoose.connect(MONGODB_URI)
        console.log('✅ Connecté à MongoDB')

        // Nettoyer les collections existantes
        console.log('🧹 Nettoyage des collections...')
        await Category.deleteMany({})
        await Product.deleteMany({})
        await AppSetting.deleteMany({})

        // Créer les catégories
        console.log('📁 Création des catégories...')
        const createdCategories = await Category.insertMany(categories)
        console.log(`✅ ${createdCategories.length} catégories créées`)

        // Créer les produits pour chaque catégorie
        console.log('📦 Création des produits...')
        const products = []

        for (const category of createdCategories) {
            const categoryProducts = generateProductsForCategory(category)
            products.push(...categoryProducts)
        }

        const createdProducts = await Product.insertMany(products)
        console.log(`✅ ${createdProducts.length} produits créés`)

        // Créer les paramètres
        console.log('⚙️  Création des paramètres...')
        const createdSettings = await AppSetting.insertMany(settings)
        console.log(`✅ ${createdSettings.length} paramètres créés`)

        console.log('\n🎉 Initialisation terminée avec succès !')
        console.log(`📊 Résumé :`)
        console.log(`   - ${createdCategories.length} catégories`)
        console.log(`   - ${createdProducts.length} produits`)
        console.log(`   - ${createdSettings.length} paramètres`)

    } catch (error) {
        console.error('❌ Erreur lors de l\'initialisation:', error)
    } finally {
        await mongoose.disconnect()
        console.log('👋 Connexion fermée')
    }
}

function generateProductsForCategory(category) {
    const baseProducts = {
        'bois-feuillus': [
            {
                name: "Bois de Chêne Premium",
                essence: "chêne",
                price: 95,
                compareAtPrice: 110,
                description: "Bois de chêne premium séché naturellement. Excellent pouvoir calorifique et combustion lente. Idéal pour le chauffage d'appoint et les longues soirées.",
                shortDescription: "Chêne premium séché, combustion lente",
                humidity: 18,
                calorificValue: 4.2,
                density: 670,
                packaging: "vrac",
                badges: ["premium", "populaire"],
                featured: true,
                averageRating: 4.8,
                reviewCount: 24
            },
            {
                name: "Bois de Hêtre Séché",
                essence: "hêtre",
                price: 85,
                description: "Hêtre français séché au four. Excellent rendement énergétique et flammes vives. Production locale certifiée PEFC.",
                shortDescription: "Hêtre français, production locale",
                humidity: 19,
                calorificValue: 4.0,
                density: 650,
                packaging: "vrac",
                badges: ["local"],
                featured: true,
                averageRating: 4.7,
                reviewCount: 18
            }
        ],
        'bois-resineux': [
            {
                name: "Pin Sylvestre Sec",
                essence: "pin",
                price: 70,
                description: "Pin sylvestre parfaitement sec, idéal pour l'allumage et le démarrage rapide. Flamme vive et parfum agréable.",
                shortDescription: "Pin sec, allumage rapide",
                humidity: 15,
                calorificValue: 3.8,
                density: 520,
                packaging: "vrac",
                badges: ["économique"],
                featured: false,
                averageRating: 4.5,
                reviewCount: 15
            }
        ],
        'palettes-conditionnes': [
            {
                name: "Palette Mix 1m³",
                essence: "mix",
                price: 95,
                unit: "palette",
                description: "Palette de 1m³ de bois mixte (70% feuillus, 30% résineux). Format pratique livré sur palette Europe.",
                shortDescription: "Mix feuillus/résineux sur palette",
                humidity: 18,
                calorificValue: 3.9,
                density: 600,
                packaging: "palette",
                badges: ["nouveau"],
                featured: true,
                averageRating: 4.6,
                reviewCount: 12
            }
        ],
        'mix-economiques': [
            {
                name: "Mix Économique 1m³",
                essence: "mix",
                price: 75,
                description: "Mélange économique de différentes essences. Rapport qualité-prix optimal pour usage quotidien.",
                shortDescription: "Mix économique, usage quotidien",
                humidity: 20,
                calorificValue: 3.5,
                density: 580,
                packaging: "vrac",
                badges: ["économique"],
                featured: false,
                averageRating: 4.3,
                reviewCount: 8
            }
        ]
    }

    const categoryProducts = baseProducts[category.slug] || []

    return categoryProducts.map(product => ({
        ...product,
        categoryId: category._id,
        slug: slugify(product.name, { lower: true, strict: true }),
        unit: product.unit || 'm³',
        stock: Math.floor(Math.random() * 50) + 20, // Stock entre 20 et 70
        images: [{
            url: `https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop&sig=${Math.random()}`,
            alt: product.name,
            isPrimary: true
        }],
        specifications: [
            { name: "Humidité", value: product.humidity?.toString() || "< 20", unit: "%" },
            { name: "Pouvoir calorifique", value: product.calorificValue?.toString() || "3.5", unit: "kWh/kg" },
            { name: "Densité", value: product.density?.toString() || "600", unit: "kg/m³" },
            { name: "Conditionnement", value: product.packaging || "vrac", unit: "" }
        ],
        certifications: [
            { name: "PEFC", code: "PEFC/10-31-95" },
            { name: "NF Bois de chauffage", code: "NF-444" }
        ],
        seoTitle: `${product.name} - Bois de chauffage premium | BoisChauffage Pro`,
        seoDescription: `${product.shortDescription}. Livraison rapide partout en France. Qualité garantie.`
    }))
}

// Lancer l'initialisation
if (require.main === module) {
    initializeDatabase()
}

module.exports = { initializeDatabase }