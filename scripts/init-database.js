// Script d'initialisation complète de la base de données
// Usage: node scripts/init-database.js

import { DatabaseUtils, validateEnvironment, createIndexes } from '../lib/mongodb.js'
import { ObjectId } from 'mongodb'

async function initializeDatabase() {
    try {
        console.log('🚀 Initialisation complète de la base de données...')

        // Valider l'environnement
        validateEnvironment()

        // Créer les index
        await createIndexes()

        // Nettoyer les collections existantes
        await cleanDatabase()

        // Initialiser les données dans l'ordre
        const categories = await initCategories()
        const products = await initProducts(categories)
        const testimonials = await initTestimonials()
        const newsletter = await initNewsletterData()

        console.log('✅ Initialisation complète terminée avec succès!')
        console.log(`📊 Résumé:`)
        console.log(`   - ${categories.length} catégories créées`)
        console.log(`   - ${products.length} produits créés`)
        console.log(`   - ${testimonials.length} témoignages créés`)
        console.log(`   - Données newsletter initialisées`)

        process.exit(0)

    } catch (error) {
        console.error('❌ Erreur lors de l\'initialisation:', error)
        process.exit(1)
    }
}

async function cleanDatabase() {
    console.log('🧹 Nettoyage des collections existantes...')

    const collections = ['categories', 'products', 'testimonials', 'newsletter_subscribers']

    for (const collection of collections) {
        try {
            await DatabaseUtils.deleteMany(collection, {})
            console.log(`   ✅ Collection ${collection} nettoyée`)
        } catch (error) {
            console.log(`   ⚠️ Erreur lors du nettoyage de ${collection}:`, error.message)
        }
    }
}

async function initCategories() {
    console.log('📁 Initialisation des catégories...')

    const categories = [
        {
            name: 'Bois Feuillus Premium',
            slug: 'bois-feuillus-premium',
            description: 'Sélection premium de bois feuillus : chêne, hêtre, charme. Parfaits pour un chauffage durable avec un excellent pouvoir calorifique et une combustion longue durée. Nos bois feuillus sont séchés en séchoir pour garantir un taux d\'humidité optimal.',
            shortDescription: 'Chêne, hêtre, charme - Excellence garantie',
            image: '/images/categories/feuillus-premium.jpg',
            icon: '🌳',
            color: '#D97706',
            gradient: 'from-amber-500 to-orange-600',
            productCount: 0,
            featured: true,
            order: 1,
            seoTitle: 'Bois Feuillus Premium - Chêne, Hêtre, Charme | BoisChauffage Pro',
            seoDescription: 'Découvrez notre sélection de bois feuillus premium. Chêne, hêtre, charme séchés < 18%. Livraison rapide partout en France.',
            isActive: true
        },
        {
            name: 'Bois Résineux Sec',
            slug: 'bois-resineux-sec',
            description: 'Bois résineux parfaitement séchés : pin, épicéa, sapin. Idéals pour l\'allumage et le chauffage d\'appoint. Combustion rapide et efficace, parfaits pour démarrer vos feux ou pour un chauffage complémentaire.',
            shortDescription: 'Pin, épicéa, sapin - Allumage facile',
            image: '/images/categories/resineux-sec.jpg',
            icon: '🌲',
            color: '#059669',
            gradient: 'from-emerald-500 to-teal-600',
            productCount: 0,
            featured: true,
            order: 2,
            seoTitle: 'Bois Résineux Sec - Pin, Épicéa, Sapin | BoisChauffage Pro',
            seoDescription: 'Bois résineux séchés pour allumage facile. Pin, épicéa, sapin de qualité premium. Commandez en ligne.',
            isActive: true
        },
        {
            name: 'Granulés Premium',
            slug: 'granules-premium',
            description: 'Granulés de bois haute performance 100% résineux. Faible taux de cendres, excellent rendement énergétique. Certifiés ENplus A1 pour une qualité optimale dans vos poêles et chaudières à granulés.',
            shortDescription: 'Pellets haute performance - Rendement optimal',
            image: '/images/categories/granules-premium.jpg',
            icon: '⚪',
            color: '#7C3AED',
            gradient: 'from-purple-500 to-indigo-600',
            productCount: 0,
            featured: true,
            order: 3,
            seoTitle: 'Granulés Premium ENplus A1 | BoisChauffage Pro',
            seoDescription: 'Granulés de bois premium certifiés ENplus A1. Faible taux de cendres, rendement optimal. Livraison en vrac ou sacs.',
            isActive: true
        },
        {
            name: 'Allume-Feu Naturel',
            slug: 'allume-feu-naturel',
            description: 'Allume-feu écologiques en fibres de bois et cire naturelle. Sans produits chimiques, allumage garanti même par temps humide. Solution respectueuse de l\'environnement pour démarrer vos feux facilement.',
            shortDescription: 'Écologique et efficace - Démarrage garanti',
            image: '/images/categories/allume-feu.jpg',
            icon: '🔥',
            color: '#DC2626',
            gradient: 'from-red-500 to-pink-600',
            productCount: 0,
            featured: true,
            order: 4,
            seoTitle: 'Allume-Feu Naturel Écologique | BoisChauffage Pro',
            seoDescription: 'Allume-feu naturels en fibres de bois. Écologiques, efficaces, sans produits chimiques. Allumage garanti.',
            isActive: true
        },
        {
            name: 'Bois Compressé',
            slug: 'bois-compresse',
            description: 'Bûches et bois compressés haute densité. Combustion très longue durée, facilité de stockage. Alternative moderne au bois traditionnel avec des performances énergétiques exceptionnelles.',
            shortDescription: 'Bûches densifiées - Longue durée',
            image: '/images/categories/bois-compresse.jpg',
            icon: '📦',
            color: '#7C2D12',
            gradient: 'from-orange-800 to-red-800',
            productCount: 0,
            featured: false,
            order: 5,
            seoTitle: 'Bois Compressé - Bûches Densifiées | BoisChauffage Pro',
            seoDescription: 'Bûches compressées haute performance. Combustion longue durée, stockage facile. Livraison rapide.',
            isActive: true
        }
    ]

    const insertedCategories = await DatabaseUtils.insertMany('categories', categories)
    console.log(`✅ ${insertedCategories.insertedCount} catégories créées`)

    return categories.map((cat, index) => ({
        ...cat,
        _id: insertedCategories.insertedIds[index]
    }))
}

async function initProducts(categories) {
    console.log('📦 Initialisation des produits...')

    // Créer un map des catégories par slug
    const categoryMap = {}
    categories.forEach(cat => {
        categoryMap[cat.slug] = cat._id
    })

    const products = [
        // BOIS FEUILLUS PREMIUM
        {
            name: 'Chêne Premium Séché',
            slug: 'chene-premium-seche',
            categoryId: categoryMap['bois-feuillus-premium'],
            description: 'Bois de chêne premium séché en séchoir < 18% d\'humidité. Excellent pouvoir calorifique (4.2 kWh/kg) et combustion longue durée. Parfait pour un chauffage principal efficace et économique. Livré en bûches de 33cm, fendues et prêtes à l\'emploi.',
            shortDescription: 'Bois de chêne séché < 18% d\'humidité',
            essence: 'chene',
            price: 95,
            compareAtPrice: 110,
            unit: 'stère',
            stock: 150,
            images: [
                { url: '/images/products/chene-premium-1.jpg', alt: 'Chêne Premium Séché', isPrimary: true, order: 1 },
                { url: '/images/products/chene-premium-2.jpg', alt: 'Détail Chêne Premium', isPrimary: false, order: 2 }
            ],
            specifications: [
                { name: 'Humidité', value: '< 18', unit: '%', icon: '💧' },
                { name: 'Pouvoir calorifique', value: '4.2', unit: 'kWh/kg', icon: '🔥' },
                { name: 'Densité', value: '650', unit: 'kg/m³', icon: '📏' },
                { name: 'Longueur', value: '33', unit: 'cm', icon: '📐' }
            ],
            humidity: 16,
            calorificValue: 4.2,
            density: 650,
            packaging: 'vrac',
            badges: ['premium', 'bestseller'],
            featured: true,
            trending: true,
            bestseller: true,
            seoTitle: 'Chêne Premium Séché < 18% | Bois de Chauffage Premium',
            seoDescription: 'Bois de chêne premium séché < 18%. Excellent pouvoir calorifique 4.2 kWh/kg. Livraison rapide.',
            averageRating: 4.8,
            reviewCount: 156,
            salesCount: 1240,
            viewCount: 3450,
            isActive: true
        },
        {
            name: 'Hêtre Traditionnel',
            slug: 'hetre-traditionnel',
            categoryId: categoryMap['bois-feuillus-premium'],
            description: 'Bois de hêtre traditionnel parfait pour un chauffage continu. Excellente tenue au feu et chaleur homogène. Idéal pour les longues soirées d\'hiver et les foyers ouverts. Séché naturellement pour préserver ses qualités.',
            shortDescription: 'Bois de hêtre pour chauffage continu',
            essence: 'hetre',
            price: 89,
            unit: 'stère',
            stock: 200,
            images: [
                { url: '/images/products/hetre-traditionnel-1.jpg', alt: 'Hêtre Traditionnel', isPrimary: true, order: 1 },
                { url: '/images/products/hetre-traditionnel-2.jpg', alt: 'Bûches de Hêtre', isPrimary: false, order: 2 }
            ],
            specifications: [
                { name: 'Humidité', value: '< 20', unit: '%', icon: '💧' },
                { name: 'Pouvoir calorifique', value: '4.0', unit: 'kWh/kg', icon: '🔥' },
                { name: 'Densité', value: '720', unit: 'kg/m³', icon: '📏' },
                { name: 'Longueur', value: '33', unit: 'cm', icon: '📐' }
            ],
            humidity: 17,
            calorificValue: 4.0,
            density: 720,
            packaging: 'vrac',
            badges: ['populaire'],
            featured: true,
            trending: false,
            bestseller: false,
            averageRating: 4.6,
            reviewCount: 89,
            salesCount: 890,
            viewCount: 2100,
            isActive: true
        },
        {
            name: 'Charme Excellence',
            slug: 'charme-excellence',
            categoryId: categoryMap['bois-feuillus-premium'],
            description: 'Bois de charme d\'exception reconnu pour sa qualité supérieure. Combustion lente et régulière, parfait pour maintenir une température constante. Très apprécié des connaisseurs pour sa flamme bleue caractéristique.',
            shortDescription: 'Bois de charme haute qualité',
            essence: 'charme',
            price: 92,
            unit: 'stère',
            stock: 120,
            images: [
                { url: '/images/products/charme-excellence-1.jpg', alt: 'Charme Excellence', isPrimary: true, order: 1 }
            ],
            specifications: [
                { name: 'Humidité', value: '< 18', unit: '%', icon: '💧' },
                { name: 'Pouvoir calorifique', value: '4.1', unit: 'kWh/kg', icon: '🔥' },
                { name: 'Densité', value: '680', unit: 'kg/m³', icon: '📏' },
                { name: 'Longueur', value: '33', unit: 'cm', icon: '📐' }
            ],
            humidity: 15,
            calorificValue: 4.1,
            density: 680,
            packaging: 'vrac',
            badges: ['premium'],
            featured: true,
            trending: false,
            bestseller: false,
            averageRating: 4.7,
            reviewCount: 67,
            salesCount: 456,
            viewCount: 1890,
            isActive: true
        },
        {
            name: 'Mix Feuillus Premium',
            slug: 'mix-feuillus-premium',
            categoryId: categoryMap['bois-feuillus-premium'],
            description: 'Mélange équilibré de chêne, hêtre et charme dans des proportions optimales. Combine les avantages de chaque essence pour un chauffage optimal et polyvalent. Idéal pour découvrir nos différentes essences.',
            shortDescription: 'Mélange chêne, hêtre, charme',
            essence: 'mix',
            price: 88,
            unit: 'stère',
            stock: 180,
            images: [
                { url: '/images/products/mix-feuillus-1.jpg', alt: 'Mix Feuillus Premium', isPrimary: true, order: 1 }
            ],
            specifications: [
                { name: 'Humidité', value: '< 20', unit: '%', icon: '💧' },
                { name: 'Pouvoir calorifique', value: '4.0', unit: 'kWh/kg', icon: '🔥' },
                { name: 'Composition', value: '3', unit: 'essences', icon: '🌳' },
                { name: 'Longueur', value: '33', unit: 'cm', icon: '📐' }
            ],
            humidity: 18,
            calorificValue: 4.0,
            density: 650,
            packaging: 'vrac',
            badges: ['bestseller'],
            featured: true,
            trending: true,
            bestseller: true,
            averageRating: 4.5,
            reviewCount: 134,
            salesCount: 1890,
            viewCount: 4200,
            isActive: true
        },
        {
            name: 'Frêne Qualité Pro',
            slug: 'frene-qualite-pro',
            categoryId: categoryMap['bois-feuillus-premium'],
            description: 'Bois de frêne de qualité professionnelle. Combustion rapide et intense, parfait pour un chauffage d\'appoint ou les moments où vous avez besoin de chaleur rapidement. Très apprécié des professionnels.',
            shortDescription: 'Bois de frêne combustion rapide',
            essence: 'frene',
            price: 86,
            unit: 'stère',
            stock: 80,
            images: [
                { url: '/images/products/frene-qualite-1.jpg', alt: 'Frêne Qualité Pro', isPrimary: true, order: 1 }
            ],
            specifications: [
                { name: 'Humidité', value: '< 20', unit: '%', icon: '💧' },
                { name: 'Pouvoir calorifique', value: '3.9', unit: 'kWh/kg', icon: '🔥' },
                { name: 'Densité', value: '600', unit: 'kg/m³', icon: '📏' }
            ],
            humidity: 19,
            calorificValue: 3.9,
            density: 600,
            packaging: 'vrac',
            badges: ['nouveau'],
            featured: false,
            trending: true,
            bestseller: false,
            averageRating: 4.4,
            reviewCount: 34,
            salesCount: 123,
            viewCount: 567,
            isActive: true
        },

        // BOIS RÉSINEUX SEC
        {
            name: 'Pin Sylvestre Sec',
            slug: 'pin-sylvestre-sec',
            categoryId: categoryMap['bois-resineux-sec'],
            description: 'Pin sylvestre parfaitement séché, idéal pour l\'allumage et le démarrage de vos feux. Combustion rapide avec une belle flamme. Parfait en complément des bois feuillus ou pour les foyers d\'appoint.',
            shortDescription: 'Pin sylvestre pour allumage',
            essence: 'pin',
            price: 65,
            unit: 'stère',
            stock: 100,
            images: [
                { url: '/images/products/pin-sylvestre-1.jpg', alt: 'Pin Sylvestre Sec', isPrimary: true, order: 1 }
            ],
            specifications: [
                { name: 'Humidité', value: '< 20', unit: '%', icon: '💧' },
                { name: 'Pouvoir calorifique', value: '3.5', unit: 'kWh/kg', icon: '🔥' },
                { name: 'Densité', value: '450', unit: 'kg/m³', icon: '📏' }
            ],
            humidity: 18,
            calorificValue: 3.5,
            density: 450,
            packaging: 'vrac',
            badges: ['populaire'],
            featured: true,
            trending: false,
            bestseller: false,
            averageRating: 4.2,
            reviewCount: 78,
            salesCount: 567,
            viewCount: 1234,
            isActive: true
        },
        {
            name: 'Épicéa Premium',
            slug: 'epicea-premium',
            categoryId: categoryMap['bois-resineux-sec'],
            description: 'Épicéa premium séché en séchoir. Excellent pour l\'allumage avec sa combustion vive et sa belle flamme crépitante. Bois très odorant qui parfume agréablement votre intérieur.',
            shortDescription: 'Épicéa séché, combustion vive',
            essence: 'epicea',
            price: 68,
            unit: 'stère',
            stock: 85,
            images: [
                { url: '/images/products/epicea-premium-1.jpg', alt: 'Épicéa Premium', isPrimary: true, order: 1 }
            ],
            specifications: [
                { name: 'Humidité', value: '< 18', unit: '%', icon: '💧' },
                { name: 'Pouvoir calorifique', value: '3.6', unit: 'kWh/kg', icon: '🔥' },
                { name: 'Densité', value: '420', unit: 'kg/m³', icon: '📏' }
            ],
            humidity: 16,
            calorificValue: 3.6,
            density: 420,
            packaging: 'vrac',
            badges: ['premium'],
            featured: false,
            trending: false,
            bestseller: false,
            averageRating: 4.3,
            reviewCount: 45,
            salesCount: 234,
            viewCount: 789,
            isActive: true
        },

        // GRANULÉS PREMIUM
        {
            name: 'Granulés ENplus A1',
            slug: 'granules-enplus-a1',
            categoryId: categoryMap['granules-premium'],
            description: 'Granulés de bois 100% résineux certifiés ENplus A1. Faible taux de cendres (< 0.7%), excellent rendement énergétique pour poêles et chaudières. Production française, qualité constante garantie.',
            shortDescription: 'Pellets 100% résineux certifiés',
            essence: 'granules',
            price: 320,
            unit: 'tonne',
            stock: 50,
            images: [
                { url: '/images/products/granules-enplus-1.jpg', alt: 'Granulés ENplus A1', isPrimary: true, order: 1 },
                { url: '/images/products/granules-enplus-2.jpg', alt: 'Sacs de Granulés', isPrimary: false, order: 2 }
            ],
            specifications: [
                { name: 'Humidité', value: '< 10', unit: '%', icon: '💧' },
                { name: 'Pouvoir calorifique', value: '4.8', unit: 'kWh/kg', icon: '🔥' },
                { name: 'Taux de cendres', value: '< 0.7', unit: '%', icon: '🔥' },
                { name: 'Certification', value: 'ENplus A1', unit: '', icon: '🏆' }
            ],
            humidity: 8,
            calorificValue: 4.8,
            density: 650,
            packaging: 'sacs 15kg',
            badges: ['premium', 'bestseller'],
            featured: true,
            trending: true,
            bestseller: true,
            averageRating: 4.9,
            reviewCount: 178,
            salesCount: 834,
            viewCount: 2560,
            isActive: true
        },
        {
            name: 'Granulés Vrac Premium',
            slug: 'granules-vrac-premium',
            categoryId: categoryMap['granules-premium'],
            description: 'Granulés premium livrés en vrac par camion souffleur. Solution économique pour les gros consommateurs. Même qualité que nos granulés ensachés avec un prix optimisé pour les volumes importants.',
            shortDescription: 'Granulés en vrac, livraison souffleur',
            essence: 'granules',
            price: 285,
            unit: 'tonne',
            stock: 200,
            images: [
                { url: '/images/products/granules-vrac-1.jpg', alt: 'Granulés Vrac Premium', isPrimary: true, order: 1 }
            ],
            specifications: [
                { name: 'Humidité', value: '< 10', unit: '%', icon: '💧' },
                { name: 'Pouvoir calorifique', value: '4.7', unit: 'kWh/kg', icon: '🔥' },
                { name: 'Livraison', value: 'Vrac', unit: '', icon: '🚚' },
                { name: 'Volume min', value: '3', unit: 'tonnes', icon: '📦' }
            ],
            humidity: 9,
            calorificValue: 4.7,
            density: 650,
            packaging: 'vrac',
            badges: ['économique'],
            featured: false,
            trending: false,
            bestseller: false,
            averageRating: 4.6,
            reviewCount: 67,
            salesCount: 345,
            viewCount: 1123,
            isActive: true
        },

        // BOIS COMPRESSÉ
        {
            name: 'Bûches Compressées Nuit',
            slug: 'buches-compressees-nuit',
            categoryId: categoryMap['bois-compresse'],
            description: 'Bûches densifiées spéciales pour la nuit. Combustion ultra longue durée (jusqu\'à 8h), très faible taux d\'humidité. Parfaites pour maintenir la chaleur toute la nuit sans rechargement.',
            shortDescription: 'Bûches nuit, combustion 8h',
            essence: 'compresse',
            price: 480,
            unit: 'tonne',
            stock: 30,
            images: [
                { url: '/images/products/buches-nuit-1.jpg', alt: 'Bûches Compressées Nuit', isPrimary: true, order: 1 }
            ],
            specifications: [
                { name: 'Humidité', value: '< 8', unit: '%', icon: '💧' },
                { name: 'Pouvoir calorifique', value: '4.9', unit: 'kWh/kg', icon: '🔥' },
                { name: 'Durée combustion', value: '6-8', unit: 'heures', icon: '⏰' },
                { name: 'Poids unitaire', value: '2.5', unit: 'kg', icon: '⚖️' }
            ],
            humidity: 7,
            calorificValue: 4.9,
            density: 950,
            packaging: 'palette',
            badges: ['innovation', 'premium'],
            featured: true,
            trending: true,
            bestseller: false,
            averageRating: 4.7,
            reviewCount: 89,
            salesCount: 234,
            viewCount: 1567,
            isActive: true
        },
        {
            name: 'Bûches Compressées Jour',
            slug: 'buches-compressees-jour',
            categoryId: categoryMap['bois-compresse'],
            description: 'Bûches densifiées pour usage jour. Combustion rapide et intense, parfaites pour un chauffage d\'appoint ou pour réchauffer rapidement une pièce. Très pratiques et propres.',
            shortDescription: 'Bûches jour, combustion rapide',
            essence: 'compresse',
            price: 420,
            unit: 'tonne',
            stock: 45,
            images: [
                { url: '/images/products/buches-jour-1.jpg', alt: 'Bûches Compressées Jour', isPrimary: true, order: 1 }
            ],
            specifications: [
                { name: 'Humidité', value: '< 10', unit: '%', icon: '💧' },
                { name: 'Pouvoir calorifique', value: '4.5', unit: 'kWh/kg', icon: '🔥' },
                { name: 'Durée combustion', value: '2-3', unit: 'heures', icon: '⏰' },
                { name: 'Poids unitaire', value: '2', unit: 'kg', icon: '⚖️' }
            ],
            humidity: 8,
            calorificValue: 4.5,
            density: 900,
            packaging: 'palette',
            badges: ['pratique'],
            featured: false,
            trending: false,
            bestseller: false,
            averageRating: 4.4,
            reviewCount: 45,
            salesCount: 167,
            viewCount: 890,
            isActive: true
        },

        // ALLUME-FEU NATUREL
        {
            name: 'Allume-Feu Fibres de Bois',
            slug: 'allume-feu-fibres-bois',
            categoryId: categoryMap['allume-feu-naturel'],
            description: 'Allume-feu naturels en fibres de bois et cire végétale. 100% écologiques, sans produits chimiques. Allumage garanti même par temps humide. Durée de combustion 8-10 minutes.',
            shortDescription: 'Allume-feu fibres de bois naturel',
            essence: 'allume-feu',
            price: 12,
            unit: 'pack de 50',
            stock: 500,
            images: [
                { url: '/images/products/allume-feu-fibres-1.jpg', alt: 'Allume-feu Fibres de Bois', isPrimary: true, order: 1 }
            ],
            specifications: [
                { name: 'Quantité', value: '50', unit: 'pièces', icon: '📦' },
                { name: 'Durée', value: '8-10', unit: 'min', icon: '⏰' },
                { name: 'Composition', value: '100%', unit: 'naturel', icon: '🌱' },
                { name: 'Résistance', value: 'Humidité', unit: '', icon: '💧' }
            ],
            packaging: 'carton',
            badges: ['écologique', 'bestseller'],
            featured: true,
            trending: false,
            bestseller: true,
            averageRating: 4.6,
            reviewCount: 234,
            salesCount: 1890,
            viewCount: 3450,
            isActive: true
        },
        {
            name: 'Allume-Feu Laine de Bois',
            slug: 'allume-feu-laine-bois',
            categoryId: categoryMap['allume-feu-naturel'],
            description: 'Allume-feu en laine de bois imprégnée de cire naturelle. Allumage très facile et rapide, parfait pour tous types de foyers. Format pratique et économique.',
            shortDescription: 'Laine de bois cirée, allumage facile',
            essence: 'allume-feu',
            price: 8,
            unit: 'pack de 32',
            stock: 300,
            images: [
                { url: '/images/products/allume-feu-laine-1.jpg', alt: 'Allume-feu Laine de Bois', isPrimary: true, order: 1 }
            ],
            specifications: [
                { name: 'Quantité', value: '32', unit: 'pièces', icon: '📦' },
                { name: 'Durée', value: '6-8', unit: 'min', icon: '⏰' },
                { name: 'Type', value: 'Laine', unit: 'de bois', icon: '🌿' }
            ],
            packaging: 'carton',
            badges: ['économique'],
            featured: false,
            trending: false,
            bestseller: false,
            averageRating: 4.3,
            reviewCount: 123,
            salesCount: 567,
            viewCount: 1234,
            isActive: true
        },

        // PRODUITS PACK ET OFFRES
        {
            name: 'Pack Découverte Feuillus',
            slug: 'pack-decouverte-feuillus',
            categoryId: categoryMap['bois-feuillus-premium'],
            description: 'Pack découverte de nos meilleures essences feuillues : 1 stère de chêne + 0.5 stère de hêtre + 0.5 stère de charme. Parfait pour tester nos produits et découvrir les différentes essences.',
            shortDescription: 'Assortiment chêne, hêtre, charme',
            essence: 'pack',
            price: 165,
            compareAtPrice: 185,
            unit: '2 stères',
            stock: 25,
            images: [
                { url: '/images/products/pack-decouverte-1.jpg', alt: 'Pack Découverte Feuillus', isPrimary: true, order: 1 }
            ],
            specifications: [
                { name: 'Contenu', value: '2', unit: 'stères', icon: '📦' },
                { name: 'Essences', value: '3', unit: 'types', icon: '🌳' },
                { name: 'Économie', value: '11%', unit: '', icon: '💰' }
            ],
            packaging: 'vrac',
            badges: ['offre', 'bestseller'],
            featured: true,
            trending: false,
            bestseller: true,
            averageRating: 4.8,
            reviewCount: 98,
            salesCount: 456,
            viewCount: 2100,
            isActive: true
        },
        {
            name: 'Pack Starter Complet',
            slug: 'pack-starter-complet',
            categoryId: categoryMap['bois-feuillus-premium'],
            description: 'Pack complet pour débutant : 1 stère de mix feuillus + 0.3 stère de résineux + 2 packs d\'allume-feu. Tout ce qu\'il faut pour commencer le chauffage au bois dans de bonnes conditions.',
            shortDescription: 'Pack complet débutant avec allume-feu',
            essence: 'pack',
            price: 98,
            compareAtPrice: 115,
            unit: 'pack complet',
            stock: 40,
            images: [
                { url: '/images/products/pack-starter-1.jpg', alt: 'Pack Starter Complet', isPrimary: true, order: 1 }
            ],
            specifications: [
                { name: 'Feuillus', value: '1', unit: 'stère', icon: '🌳' },
                { name: 'Résineux', value: '0.3', unit: 'stère', icon: '🌲' },
                { name: 'Allume-feu', value: '2', unit: 'packs', icon: '🔥' }
            ],
            packaging: 'mixte',
            badges: ['offre', 'débutant'],
            featured: false,
            trending: true,
            bestseller: false,
            averageRating: 4.5,
            reviewCount: 67,
            salesCount: 234,
            viewCount: 1345,
            isActive: true
        }
    ]

    // Insérer tous les produits
    const insertedProducts = await DatabaseUtils.insertMany('products', products)
    console.log(`✅ ${insertedProducts.insertedCount} produits créés`)

    // Mettre à jour le compteur de produits dans les catégories
    for (const category of categories) {
        const productCount = products.filter(p =>
            p.categoryId.toString() === category._id.toString()
        ).length

        await DatabaseUtils.updateOne(
            'categories',
            { _id: category._id },
            { $set: { productCount } }
        )
    }

    console.log('✅ Compteurs de produits par catégorie mis à jour')
    return products
}

async function initTestimonials() {
    console.log('💬 Initialisation des témoignages...')

    const testimonials = [
        {
            name: 'Marie Dubois',
            location: 'Lyon, Rhône-Alpes',
            avatar: '/images/avatars/marie-dubois.jpg',
            rating: 5,
            comment: 'Excellent service ! Le bois de chêne livré était parfaitement sec et de qualité exceptionnelle. Livraison rapide et équipe très professionnelle. Je recommande vivement BoisChauffage Pro pour leur sérieux et la qualité de leurs produits. Mon poêle n\'a jamais aussi bien fonctionné !',
            shortComment: 'Qualité exceptionnelle, livraison rapide !',
            productPurchased: 'Chêne Premium Séché',
            verified: true,
            featured: true,
            order: 1,
            isActive: true
        },
        {
            name: 'Pierre Martin',
            location: 'Toulouse, Occitanie',
            avatar: '/images/avatars/pierre-martin.jpg',
            rating: 5,
            comment: 'Commande passée le lundi, livrée le mercredi ! Le bois brûle parfaitement, très peu de cendres. La qualité est au rendez-vous et le service client est réactif. Pricing honnête pour une qualité premium. Je recommande vivement BoisChauffage Pro.',
            shortComment: 'Service impeccable, très satisfait !',
            productPurchased: 'Mix Feuillus Premium',
            verified: true,
            featured: true,
            order: 2,
            isActive: true
        },
        {
            name: 'Sophie Laurent',
            location: 'Marseille, PACA',
            avatar: '/images/avatars/sophie-laurent.jpg',
            rating: 5,
            comment: 'Troisième commande cette année et toujours aussi satisfaite ! La qualité est constante, les prix corrects et le service client au top. Mon fournisseur de confiance depuis maintenant 3 ans. L\'équipe de livraison est toujours ponctuelle et serviable.',
            shortComment: 'Mon fournisseur de confiance depuis 3 ans',
            productPurchased: 'Hêtre Traditionnel',
            verified: true,
            featured: true,
            order: 3,
            isActive: true
        },
        {
            name: 'Jean-Claude Moreau',
            location: 'Bordeaux, Nouvelle-Aquitaine',
            avatar: '/images/avatars/jean-claude-moreau.jpg',
            rating: 5,
            comment: 'Ancien bûcheron, je sais reconnaître la qualité quand je la vois. Ce bois est parfaitement calibré, sec et homogène. Le taux d\'humidité annoncé est respecté. Bravo pour le sérieux et la qualité ! Un vrai professionnel du bois de chauffage.',
            shortComment: 'Qualité professionnelle reconnue par un expert',
            productPurchased: 'Charme Excellence',
            verified: true,
            featured: true,
            order: 4,
            isActive: true
        },
        {
            name: 'Isabelle Durand',
            location: 'Nantes, Pays de la Loire',
            avatar: '/images/avatars/isabelle-durand.jpg',
            rating: 5,
            comment: 'Livraison impeccable même dans mon village isolé en pleine campagne. Le livreur était très sympa et a même pris le temps de ranger le bois proprement dans mon abri. Service 5 étoiles ! La qualité du bois est parfaite, il brûle très bien.',
            shortComment: 'Service 5 étoiles, même en zone isolée',
            productPurchased: 'Pack Découverte Feuillus',
            verified: true,
            featured: true,
            order: 5,
            isActive: true
        },
        {
            name: 'Michel Rousseau',
            location: 'Strasbourg, Grand Est',
            avatar: '/images/avatars/michel-rousseau.jpg',
            rating: 5,
            comment: 'Les granulés sont de qualité exceptionnelle. Mon poêle à pellets n\'a jamais aussi bien fonctionné. Très peu de résidus de combustion et excellent rendement énergétique. La certification ENplus A1 se ressent vraiment. Je recommande fortement !',
            shortComment: 'Granulés de qualité exceptionnelle',
            productPurchased: 'Granulés ENplus A1',
            verified: true,
            featured: true,
            order: 6,
            isActive: true
        },
        {
            name: 'Catherine Lemoine',
            location: 'Clermont-Ferrand, Auvergne',
            avatar: '/images/avatars/catherine-lemoine.jpg',
            rating: 5,
            comment: 'Première commande sur recommandation d\'un ami, et je ne suis pas déçue ! Les bûches compressées sont parfaites pour mes longues soirées d\'hiver. Elles tiennent vraiment toute la nuit comme annoncé. Service client très à l\'écoute.',
            shortComment: 'Bûches compressées parfaites pour la nuit',
            productPurchased: 'Bûches Compressées Nuit',
            verified: true,
            featured: false,
            order: 7,
            isActive: true
        },
        {
            name: 'Thomas Bertrand',
            location: 'Rennes, Bretagne',
            avatar: '/images/avatars/thomas-bertrand.jpg',
            rating: 4,
            comment: 'Très bon rapport qualité-prix sur le pack découverte. Cela m\'a permis de tester différentes essences avant de faire mon choix définitif. Livraison soignée et dans les temps. Je reviendrai commander pour l\'hiver prochain !',
            shortComment: 'Parfait pour découvrir les essences',
            productPurchased: 'Pack Starter Complet',
            verified: true,
            featured: false,
            order: 8,
            isActive: true
        },
        {
            name: 'Valérie Morvan',
            location: 'Dijon, Bourgogne',
            avatar: '/images/avatars/valerie-morvan.jpg',
            rating: 5,
            comment: 'Commande de granulés en vrac, livraison parfaite avec le camion souffleur. Le chauffeur était très professionnel et a pris soin de ne pas salir. Prix très compétitif pour cette qualité. Mon silo est plein pour l\'hiver !',
            shortComment: 'Livraison vrac parfaite, prix compétitif',
            productPurchased: 'Granulés Vrac Premium',
            verified: true,
            featured: false,
            order: 9,
            isActive: true
        },
        {
            name: 'Philippe Dufour',
            location: 'Annecy, Auvergne-Rhône-Alpes',
            avatar: '/images/avatars/philippe-dufour.jpg',
            rating: 5,
            comment: 'Les allume-feu naturels sont vraiment efficaces ! Même par temps humide, ils s\'allument sans problème et permettent de démarrer le feu rapidement. Plus besoin de papier journal, c\'est très pratique et écologique.',
            shortComment: 'Allume-feu naturels très efficaces',
            productPurchased: 'Allume-Feu Fibres de Bois',
            verified: true,
            featured: false,
            order: 10,
            isActive: true
        }
    ]

    const insertedTestimonials = await DatabaseUtils.insertMany('testimonials', testimonials)
    console.log(`✅ ${insertedTestimonials.insertedCount} témoignages créés`)

    return testimonials
}

async function initNewsletterData() {
    console.log('📧 Initialisation des données newsletter...')

    // Quelques abonnés exemple (optionnel pour les tests)
    const sampleSubscribers = [
        {
            email: 'marie.test@example.com',
            firstName: 'Marie',
            source: 'homepage',
            interests: ['promotions', 'nouveautés'],
            isActive: true,
            confirmedAt: new Date(),
            subscribedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Il y a 30 jours
            metadata: {
                ipAddress: '192.168.1.1',
                userAgent: 'Mozilla/5.0 Test Browser'
            }
        },
        {
            email: 'pierre.demo@example.com',
            firstName: 'Pierre',
            source: 'footer',
            interests: ['conseils', 'promotions'],
            isActive: true,
            confirmedAt: new Date(),
            subscribedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // Il y a 15 jours
            metadata: {
                ipAddress: '192.168.1.2',
                userAgent: 'Mozilla/5.0 Test Browser'
            }
        }
    ]

    await DatabaseUtils.insertMany('newsletter_subscribers', sampleSubscribers)
    console.log(`✅ ${sampleSubscribers.length} abonnés newsletter créés`)

    return sampleSubscribers
}

// Script utilitaire pour ajouter des produits supplémentaires
async function addMoreProducts(categorySlug, count = 5) {
    console.log(`➕ Ajout de ${count} produits supplémentaires pour ${categorySlug}...`)

    const category = await DatabaseUtils.findOne('categories', { slug: categorySlug })
    if (!category) {
        console.error(`❌ Catégorie ${categorySlug} non trouvée`)
        return
    }

    const productTemplates = {
        'bois-feuillus-premium': [
            { name: 'Chêne Écologique', essence: 'chene', price: 88, description: 'Chêne issu de forêts gérées durablement' },
            { name: 'Hêtre Extra Sec', essence: 'hetre', price: 92, description: 'Hêtre séché 24 mois, humidité < 15%' },
            { name: 'Charme Sélection', essence: 'charme', price: 94, description: 'Charme sélectionné pour sa qualité' }
        ],
        'granules-premium': [
            { name: 'Granulés Bio', essence: 'granules', price: 340, description: 'Granulés issus de l\'agriculture biologique' },
            { name: 'Granulés Régionaux', essence: 'granules', price: 315, description: 'Granulés produits localement' }
        ]
    }

    const templates = productTemplates[categorySlug] || []
    const products = []

    for (let i = 0; i < Math.min(count, templates.length); i++) {
        const template = templates[i]
        products.push({
            ...template,
            slug: template.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
            categoryId: category._id,
            shortDescription: `${template.essence} de qualité`,
            unit: 'stère',
            stock: Math.floor(Math.random() * 100) + 20,
            images: [{ url: `/images/products/${template.essence}-${i + 1}.jpg`, alt: template.name, isPrimary: true, order: 1 }],
            specifications: [
                { name: 'Humidité', value: '< 20', unit: '%', icon: '💧' },
                { name: 'Pouvoir calorifique', value: '4.0', unit: 'kWh/kg', icon: '🔥' }
            ],
            humidity: 18,
            calorificValue: 4.0,
            density: 650,
            packaging: 'vrac',
            badges: ['nouveau'],
            featured: false,
            trending: false,
            bestseller: false,
            averageRating: 4.0 + Math.random(),
            reviewCount: Math.floor(Math.random() * 50) + 10,
            salesCount: Math.floor(Math.random() * 200) + 50,
            viewCount: Math.floor(Math.random() * 1000) + 200,
            isActive: true
        })
    }

    if (products.length > 0) {
        await DatabaseUtils.insertMany('products', products)
        console.log(`✅ ${products.length} produits ajoutés`)
    }
}

// Script pour générer des données de test supplémentaires
async function generateTestData() {
    console.log('🎭 Génération de données de test supplémentaires...')

    // Ajouter plus de produits pour les tests de pagination
    await addMoreProducts('bois-feuillus-premium', 3)
    await addMoreProducts('granules-premium', 2)

    console.log('✅ Données de test générées')
}

// Exécuter le script si appelé directement
if (import.meta.url === `file://${process.argv[1]}`) {
    const command = process.argv[2]

    switch (command) {
        case 'test':
            generateTestData()
            break
        case 'clean':
            cleanDatabase()
            break
        case 'products':
            const categorySlug = process.argv[3]
            const count = parseInt(process.argv[4]) || 5
            if (categorySlug) {
                addMoreProducts(categorySlug, count)
            } else {
                console.log('Usage: node scripts/init-database.js products <category-slug> [count]')
            }
            break
        default:
            initializeDatabase()
    }
}

export {
    initializeDatabase,
    initCategories,
    initProducts,
    initTestimonials,
    initNewsletterData,
    addMoreProducts,
    generateTestData,
    cleanDatabase
}