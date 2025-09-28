// Script d'initialisation simple pour BoisChauffage Pro
// Usage: node scripts/simple-init.js

import { MongoClient, ObjectId } from 'mongodb'

// Configuration MongoDB simple
const MONGODB_URI = 'mongodb+srv://superroot:AQWZSXedcrfv123456@bs.stqbtdx.mongodb.net'
const DB_NAME = 'bdc1'

let client
let db

// Connexion à MongoDB
async function connectDB() {
    if (!client) {
        client = new MongoClient(MONGODB_URI)
        await client.connect()
        db = client.db(DB_NAME)
        console.log('✅ Connecté à MongoDB')
    }
    return db
}

// Nettoyer les collections
async function cleanDatabase() {
    console.log('🧹 Nettoyage des données existantes...')
    const database = await connectDB()

    const collections = ['categories', 'products', 'testimonials', 'newsletter_subscribers']

    for (const collectionName of collections) {
        try {
            await database.collection(collectionName).deleteMany({})
            console.log(`   ✅ ${collectionName} nettoyée`)
        } catch (error) {
            console.log(`   ⚠️ Erreur ${collectionName}:`, error.message)
        }
    }
}

// Initialiser les catégories
async function initCategories() {
    console.log('📁 Création des catégories...')
    const database = await connectDB()

    const categories = [
        {
            name: 'Bois Feuillus Premium',
            slug: 'bois-feuillus-premium',
            description: 'Sélection premium de bois feuillus : chêne, hêtre, charme.',
            shortDescription: 'Chêne, hêtre, charme - Excellence garantie',
            image: '/images/categories/feuillus.jpg',
            productCount: 0,
            featured: true,
            order: 1,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            name: 'Bois Résineux Sec',
            slug: 'bois-resineux-sec',
            description: 'Bois résineux parfaitement séchés : pin, épicéa, sapin.',
            shortDescription: 'Pin, épicéa, sapin - Allumage facile',
            image: '/images/categories/resineux.jpg',
            productCount: 0,
            featured: true,
            order: 2,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            name: 'Granulés Premium',
            slug: 'granules-premium',
            description: 'Granulés de bois haute performance 100% résineux.',
            shortDescription: 'Pellets haute performance - Rendement optimal',
            image: '/images/categories/granules.jpg',
            productCount: 0,
            featured: true,
            order: 3,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            name: 'Allume-Feu Naturel',
            slug: 'allume-feu-naturel',
            description: 'Allume-feu écologiques en fibres de bois et cire naturelle.',
            shortDescription: 'Écologique et efficace - Démarrage garanti',
            image: '/images/categories/allume-feu.jpg',
            productCount: 0,
            featured: true,
            order: 4,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        }
    ]

    const result = await database.collection('categories').insertMany(categories)
    console.log(`   ✅ ${result.insertedCount} catégories créées`)

    return categories.map((cat, index) => ({
        ...cat,
        _id: result.insertedIds[index]
    }))
}

// Initialiser les produits
async function initProducts(categories) {
    console.log('📦 Création des produits...')
    const database = await connectDB()

    // Map des catégories par slug
    const catMap = {}
    categories.forEach(cat => {
        catMap[cat.slug] = cat._id
    })

    const products = [
        {
            name: 'Chêne Premium Séché',
            slug: 'chene-premium-seche',
            categoryId: catMap['bois-feuillus-premium'],
            description: 'Bois de chêne premium séché < 18% d\'humidité.',
            shortDescription: 'Bois de chêne séché < 18% d\'humidité',
            essence: 'chene',
            price: 95,
            compareAtPrice: 110,
            unit: 'stère',
            stock: 150,
            images: [
                { url: '/images/products/chene-premium.jpg', alt: 'Chêne Premium', isPrimary: true, order: 1 }
            ],
            specifications: [
                { name: 'Humidité', value: '< 18', unit: '%' },
                { name: 'Pouvoir calorifique', value: '4.2', unit: 'kWh/kg' }
            ],
            humidity: 16,
            calorificValue: 4.2,
            badges: ['premium', 'bestseller'],
            featured: true,
            bestseller: true,
            averageRating: 4.8,
            reviewCount: 156,
            salesCount: 1240,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            name: 'Hêtre Traditionnel',
            slug: 'hetre-traditionnel',
            categoryId: catMap['bois-feuillus-premium'],
            description: 'Bois de hêtre traditionnel parfait pour un chauffage continu.',
            shortDescription: 'Bois de hêtre pour chauffage continu',
            essence: 'hetre',
            price: 89,
            unit: 'stère',
            stock: 200,
            images: [
                { url: '/images/products/hetre-traditionnel.jpg', alt: 'Hêtre Traditionnel', isPrimary: true, order: 1 }
            ],
            specifications: [
                { name: 'Humidité', value: '< 20', unit: '%' },
                { name: 'Pouvoir calorifique', value: '4.0', unit: 'kWh/kg' }
            ],
            humidity: 17,
            calorificValue: 4.0,
            badges: ['populaire'],
            featured: true,
            averageRating: 4.6,
            reviewCount: 89,
            salesCount: 890,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            name: 'Granulés ENplus A1',
            slug: 'granules-enplus-a1',
            categoryId: catMap['granules-premium'],
            description: 'Granulés de bois 100% résineux certifiés ENplus A1.',
            shortDescription: 'Pellets 100% résineux certifiés',
            essence: 'granules',
            price: 320,
            unit: 'tonne',
            stock: 50,
            images: [
                { url: '/images/products/granules-premium.jpg', alt: 'Granulés Premium', isPrimary: true, order: 1 }
            ],
            specifications: [
                { name: 'Humidité', value: '< 10', unit: '%' },
                { name: 'Pouvoir calorifique', value: '4.8', unit: 'kWh/kg' }
            ],
            humidity: 8,
            calorificValue: 4.8,
            badges: ['premium', 'bestseller'],
            featured: true,
            bestseller: true,
            averageRating: 4.9,
            reviewCount: 178,
            salesCount: 834,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            name: 'Allume-Feu Fibres de Bois',
            slug: 'allume-feu-fibres-bois',
            categoryId: catMap['allume-feu-naturel'],
            description: 'Allume-feu naturels en fibres de bois et cire végétale.',
            shortDescription: 'Allume-feu fibres de bois naturel',
            essence: 'allume-feu',
            price: 12,
            unit: 'pack de 50',
            stock: 500,
            images: [
                { url: '/images/products/allume-feu.jpg', alt: 'Allume-feu', isPrimary: true, order: 1 }
            ],
            specifications: [
                { name: 'Quantité', value: '50', unit: 'pièces' },
                { name: 'Durée', value: '8-10', unit: 'min' }
            ],
            badges: ['écologique', 'bestseller'],
            featured: true,
            bestseller: true,
            averageRating: 4.6,
            reviewCount: 234,
            salesCount: 1890,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            name: 'Pack Découverte',
            slug: 'pack-decouverte',
            categoryId: catMap['bois-feuillus-premium'],
            description: 'Assortiment de nos meilleures essences.',
            shortDescription: 'Assortiment de nos meilleures essences',
            essence: 'pack',
            price: 165,
            compareAtPrice: 185,
            unit: '2 stères',
            stock: 25,
            images: [
                { url: '/images/products/pack-decouverte.jpg', alt: 'Pack Découverte', isPrimary: true, order: 1 }
            ],
            specifications: [
                { name: 'Contenu', value: '2', unit: 'stères' },
                { name: 'Essences', value: '3', unit: 'types' }
            ],
            badges: ['offre', 'bestseller'],
            featured: true,
            bestseller: true,
            averageRating: 4.8,
            reviewCount: 98,
            salesCount: 456,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            name: 'Pin Sylvestre Sec',
            slug: 'pin-sylvestre-sec',
            categoryId: catMap['bois-resineux-sec'],
            description: 'Pin sylvestre parfaitement séché, idéal pour l\'allumage.',
            shortDescription: 'Pin sylvestre pour allumage',
            essence: 'pin',
            price: 65,
            unit: 'stère',
            stock: 100,
            images: [
                { url: '/images/products/pin-sylvestre.jpg', alt: 'Pin Sylvestre', isPrimary: true, order: 1 }
            ],
            specifications: [
                { name: 'Humidité', value: '< 20', unit: '%' },
                { name: 'Pouvoir calorifique', value: '3.5', unit: 'kWh/kg' }
            ],
            humidity: 18,
            calorificValue: 3.5,
            badges: ['populaire'],
            featured: true,
            averageRating: 4.2,
            reviewCount: 78,
            salesCount: 567,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            name: 'Charme Excellence',
            slug: 'charme-excellence',
            categoryId: catMap['bois-feuillus-premium'],
            description: 'Bois de charme d\'exception reconnu pour sa qualité supérieure.',
            shortDescription: 'Bois de charme haute qualité',
            essence: 'charme',
            price: 92,
            unit: 'stère',
            stock: 120,
            images: [
                { url: '/images/products/charme-excellence.jpg', alt: 'Charme Excellence', isPrimary: true, order: 1 }
            ],
            specifications: [
                { name: 'Humidité', value: '< 18', unit: '%' },
                { name: 'Pouvoir calorifique', value: '4.1', unit: 'kWh/kg' }
            ],
            humidity: 15,
            calorificValue: 4.1,
            badges: ['premium'],
            featured: true,
            averageRating: 4.7,
            reviewCount: 67,
            salesCount: 456,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            name: 'Mix Feuillus Premium',
            slug: 'mix-feuillus-premium',
            categoryId: catMap['bois-feuillus-premium'],
            description: 'Mélange équilibré de chêne, hêtre et charme.',
            shortDescription: 'Mélange chêne, hêtre, charme',
            essence: 'mix',
            price: 88,
            unit: 'stère',
            stock: 180,
            images: [
                { url: '/images/products/mix-feuillus.jpg', alt: 'Mix Feuillus', isPrimary: true, order: 1 }
            ],
            specifications: [
                { name: 'Humidité', value: '< 20', unit: '%' },
                { name: 'Composition', value: '3', unit: 'essences' }
            ],
            humidity: 18,
            calorificValue: 4.0,
            badges: ['bestseller'],
            featured: true,
            bestseller: true,
            averageRating: 4.5,
            reviewCount: 134,
            salesCount: 1890,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        }
    ]

    const result = await database.collection('products').insertMany(products)
    console.log(`   ✅ ${result.insertedCount} produits créés`)

    // Mettre à jour les compteurs de produits dans les catégories
    for (const category of categories) {
        const count = products.filter(p => p.categoryId.toString() === category._id.toString()).length
        await database.collection('categories').updateOne(
            { _id: category._id },
            { $set: { productCount: count, updatedAt: new Date() } }
        )
    }

    console.log('   ✅ Compteurs de catégories mis à jour')
    return products
}

// Initialiser les témoignages
async function initTestimonials() {
    console.log('💬 Création des témoignages...')
    const database = await connectDB()

    const testimonials = [
        {
            name: 'Marie Dubois',
            location: 'Lyon, France',
            avatar: '/images/avatars/marie.jpg',
            rating: 5,
            comment: 'Excellent service ! Le bois de chêne livré était parfaitement sec et de qualité exceptionnelle.',
            shortComment: 'Qualité exceptionnelle, livraison rapide !',
            productPurchased: 'Chêne Premium Séché',
            verified: true,
            featured: true,
            order: 1,
            isActive: true,
            createdAt: new Date()
        },
        {
            name: 'Pierre Martin',
            location: 'Toulouse, France',
            avatar: '/images/avatars/pierre.jpg',
            rating: 5,
            comment: 'Commande passée le lundi, livrée le mercredi ! Le bois brûle parfaitement.',
            shortComment: 'Service impeccable, très satisfait !',
            productPurchased: 'Mix Feuillus Premium',
            verified: true,
            featured: true,
            order: 2,
            isActive: true,
            createdAt: new Date()
        },
        {
            name: 'Sophie Laurent',
            location: 'Marseille, France',
            avatar: '/images/avatars/sophie.jpg',
            rating: 5,
            comment: 'Troisième commande cette année. La qualité est constante, les prix corrects.',
            shortComment: 'Mon fournisseur de confiance depuis 3 ans',
            productPurchased: 'Hêtre Traditionnel',
            verified: true,
            featured: true,
            order: 3,
            isActive: true,
            createdAt: new Date()
        },
        {
            name: 'Jean-Claude Moreau',
            location: 'Bordeaux, France',
            avatar: '/images/avatars/jean-claude.jpg',
            rating: 5,
            comment: 'Ancien bûcheron, je sais reconnaître la qualité. Ce bois est parfaitement calibré.',
            shortComment: 'Qualité professionnelle reconnue',
            productPurchased: 'Charme Excellence',
            verified: true,
            featured: true,
            order: 4,
            isActive: true,
            createdAt: new Date()
        },
        {
            name: 'Michel Rousseau',
            location: 'Strasbourg, France',
            avatar: '/images/avatars/michel.jpg',
            rating: 5,
            comment: 'Les granulés sont de qualité exceptionnelle. Mon poêle n\'a jamais aussi bien fonctionné.',
            shortComment: 'Granulés de qualité exceptionnelle',
            productPurchased: 'Granulés ENplus A1',
            verified: true,
            featured: true,
            order: 5,
            isActive: true,
            createdAt: new Date()
        },
        {
            name: 'Isabelle Durand',
            location: 'Nantes, France',
            avatar: '/images/avatars/isabelle.jpg',
            rating: 5,
            comment: 'Livraison impeccable même dans mon village isolé. Service 5 étoiles !',
            shortComment: 'Service 5 étoiles, même en zone isolée',
            productPurchased: 'Pack Découverte',
            verified: true,
            featured: true,
            order: 6,
            isActive: true,
            createdAt: new Date()
        }
    ]

    const result = await database.collection('testimonials').insertMany(testimonials)
    console.log(`   ✅ ${result.insertedCount} témoignages créés`)

    return testimonials
}

// Script principal
async function initializeDatabase() {
    try {
        console.log('🚀 Initialisation de la base de données BoisChauffage Pro...')

        await cleanDatabase()
        const categories = await initCategories()
        await initProducts(categories)
        await initTestimonials()

        console.log('')
        console.log('✅ Initialisation terminée avec succès !')
        console.log('🎯 Vous pouvez maintenant lancer: npm run dev')

    } catch (error) {
        console.error('❌ Erreur:', error.message)
    } finally {
        if (client) {
            await client.close()
            console.log('🔌 Connexion MongoDB fermée')
        }
        process.exit(0)
    }
}

// Lancer le script
initializeDatabase()