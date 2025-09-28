#!/usr/bin/env node

/**
 * Script de seed pour peupler la base de données avec des données de test
 * Usage: npm run db:seed
 */

require('dotenv').config({ path: '.env.local' })
const mongoose = require('mongoose')
const { Category, Product, Newsletter, Testimonial } = require('../models')

// Données de seed pour les catégories
const categoriesData = [
    {
        name: 'Bois Feuillus Premium',
        slug: 'bois-feuillus-premium',
        shortDescription: 'Chêne, hêtre, charme - Excellence garantie',
        description: 'Notre sélection premium de bois feuillus, séchés naturellement sous abri pendant plus de 2 ans. Humidité garantie inférieure à 18%. Idéal pour un chauffage de qualité avec un excellent rendement calorifique.',
        image: '/images/categories/feuillus.jpg',
        featured: true,
        trending: true,
        isActive: true,
        order: 1,
        seoTitle: 'Bois Feuillus Premium - Chêne, Hêtre, Charme | BoisChauffage Pro',
        seoDescription: 'Découvrez notre sélection premium de bois feuillus. Chêne, hêtre, charme séchés < 18% humidité. Livraison rapide.',
        metadata: {
            color: '#8B4513',
            icon: 'TreePine'
        }
    },
    {
        name: 'Bois Résineux Sec',
        slug: 'bois-resineux-sec',
        shortDescription: 'Pin, épicéa, sapin - Allumage facile',
        description: 'Bois résineux parfait pour l\'allumage et la montée en température rapide. Séché naturellement, faible taux d\'humidité. Idéal en complément des feuillus.',
        image: '/images/categories/resineux.jpg',
        featured: true,
        trending: false,
        isActive: true,
        order: 2,
        metadata: {
            color: '#228B22',
            icon: 'TreePine'
        }
    },
    {
        name: 'Granulés Premium',
        slug: 'granules-premium',
        shortDescription: 'Pellets haute performance - Rendement optimal',
        description: 'Granulés de bois 100% résineux, certifiés DIN+. Pouvoir calorifique élevé, faible taux de cendres, combustion propre et efficace.',
        image: '/images/categories/granules.jpg',
        featured: true,
        trending: true,
        isActive: true,
        order: 3,
        metadata: {
            color: '#DAA520',
            icon: 'Package'
        }
    },
    {
        name: 'Allume-Feu Naturel',
        slug: 'allume-feu-naturel',
        shortDescription: 'Écologique et efficace - Démarrage garanti',
        description: 'Allume-feu 100% naturel en fibres de bois et cire végétale. Sans produits chimiques, allumage facile et durable.',
        image: '/images/categories/allume-feu.jpg',
        featured: false,
        trending: false,
        isActive: true,
        order: 4,
        metadata: {
            color: '#FF6347',
            icon: 'Flame'
        }
    }
]

// Données de seed pour les produits
const productsData = [
    {
        name: 'Chêne Premium Séché',
        slug: 'chene-premium-seche',
        shortDescription: 'Bois de chêne séché < 18% d\'humidité, qualité exceptionnelle',
        description: 'Notre chêne premium est soigneusement sélectionné et séché naturellement pendant plus de 24 mois. Avec un taux d\'humidité inférieur à 18%, il garantit une combustion optimale et un excellent rendement calorifique. Idéal pour un chauffage principal de qualité.',
        essence: 'chêne',
        price: 95,
        compareAtPrice: 110,
        unit: 'stère',
        stock: 50,
        images: [
            {
                url: '/images/products/chene-premium.jpg',
                alt: 'Chêne Premium Séché - Stères de qualité',
                isPrimary: true
            },
            {
                url: '/images/products/chene-premium-2.jpg',
                alt: 'Détail texture bois de chêne',
                isPrimary: false
            }
        ],
        specifications: [
            { name: 'Humidité', value: '16', unit: '%' },
            { name: 'Pouvoir calorifique', value: '4.2', unit: 'kWh/kg' },
            { name: 'Densité', value: '650', unit: 'kg/m³' },
            { name: 'Longueur', value: '33', unit: 'cm' },
            { name: 'Séchage', value: '24', unit: 'mois' }
        ],
        badges: ['premium', 'bestseller'],
        featured: true,
        bestseller: true,
        trending: true,
        isActive: true,
        averageRating: 4.8,
        reviewCount: 156,
        salesCount: 890,
        viewCount: 3420,
        seoTitle: 'Chêne Premium Séché - Bois de Chauffage Qualité | BoisChauffage Pro',
        seoDescription: 'Chêne premium séché < 18% humidité. Excellent rendement calorifique. Livraison 24-48h.',
        metadata: {
            origin: 'France',
            certification: 'PEFC',
            processingTime: '24-48h'
        }
    },
    {
        name: 'Hêtre Traditionnel',
        slug: 'hetre-traditionnel',
        shortDescription: 'Bois de hêtre pour chauffage continu, excellent rapport qualité-prix',
        description: 'Le hêtre est reconnu pour sa combustion régulière et sa bonne tenue de feu. Parfait pour maintenir une température constante pendant de longues heures.',
        essence: 'hêtre',
        price: 89,
        unit: 'stère',
        stock: 35,
        images: [
            {
                url: '/images/products/hetre-traditionnel.jpg',
                alt: 'Hêtre Traditionnel - Stères de bois',
                isPrimary: true
            }
        ],
        specifications: [
            { name: 'Humidité', value: '18', unit: '%' },
            { name: 'Pouvoir calorifique', value: '4.0', unit: 'kWh/kg' },
            { name: 'Densité', value: '620', unit: 'kg/m³' }
        ],
        badges: ['populaire'],
        featured: true,
        bestseller: false,
        trending: false,
        isActive: true,
        averageRating: 4.6,
        reviewCount: 89,
        salesCount: 567,
        viewCount: 2180
    },
    {
        name: 'Granulés Haute Performance',
        slug: 'granules-haute-performance',
        shortDescription: 'Pellets 100% résineux premium, certification DIN+',
        description: 'Granulés de bois 100% résineux, fabriqués sans additif chimique. Certification DIN+ garantissant la qualité. Pouvoir calorifique élevé et faible taux de cendres.',
        essence: 'granulés',
        price: 320,
        unit: 'tonne',
        stock: 20,
        images: [
            {
                url: '/images/products/granules-premium.jpg',
                alt: 'Granulés Haute Performance',
                isPrimary: true
            }
        ],
        specifications: [
            { name: 'Humidité', value: '8', unit: '%' },
            { name: 'Pouvoir calorifique', value: '4.8', unit: 'kWh/kg' },
            { name: 'Taux de cendres', value: '0.3', unit: '%' },
            { name: 'Certification', value: 'DIN+', unit: '' }
        ],
        badges: ['nouveau', 'premium'],
        featured: true,
        bestseller: false,
        trending: true,
        isActive: true,
        averageRating: 4.9,
        reviewCount: 78,
        salesCount: 234,
        viewCount: 1890
    }
]

// Données de seed pour les témoignages
const testimonialsData = [
    {
        name: 'Marie Dubois',
        location: 'Lyon, France',
        avatar: '/images/avatars/marie.jpg',
        rating: 5,
        comment: 'Excellent service ! Le bois de chêne livré était parfaitement sec et de qualité exceptionnelle. La livraison a été rapide et l\'équipe très professionnelle. Je recommande vivement BoisChauffage Pro.',
        shortComment: 'Qualité exceptionnelle, livraison rapide !',
        productPurchased: 'Chêne Premium Séché',
        verified: true,
        featured: true,
        isActive: true,
        order: 1
    },
    {
        name: 'Pierre Martin',
        location: 'Toulouse, France',
        avatar: '/images/avatars/pierre.jpg',
        rating: 5,
        comment: 'Commande passée le lundi, livrée le mercredi ! Le bois brûle parfaitement, très peu de cendres. Un service impeccable du début à la fin.',
        shortComment: 'Service impeccable, très satisfait !',
        productPurchased: 'Mix Feuillus Premium',
        verified: true,
        featured: true,
        isActive: true,
        order: 2
    },
    {
        name: 'Sophie Laurent',
        location: 'Marseille, France',
        avatar: '/images/avatars/sophie.jpg',
        rating: 5,
        comment: 'Troisième commande cette année. La qualité est constante, les prix corrects et le service client au top. Mon fournisseur de confiance !',
        shortComment: 'Mon fournisseur de confiance depuis 3 ans',
        productPurchased: 'Hêtre Traditionnel',
        verified: true,
        featured: true,
        isActive: true,
        order: 3
    }
]

// Fonction principale de seed
async function seedDatabase() {
    try {
        console.log('🌱 Démarrage du seed de la base de données...')

        // Connexion à MongoDB
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: process.env.MONGODB_DB_NAME || 'boischauffagepro'
        })
        console.log('✅ Connexion à MongoDB établie')

        // Nettoyer les collections existantes
        console.log('🧹 Nettoyage des collections existantes...')
        await Promise.all([
            Category.deleteMany({}),
            Product.deleteMany({}),
            Testimonial.deleteMany({}),
            Newsletter.deleteMany({})
        ])
        console.log('✅ Collections nettoyées')

        // Créer les catégories
        console.log('📁 Création des catégories...')
        const categories = await Category.create(categoriesData)
        console.log(`✅ ${categories.length} catégories créées`)

        // Associer les produits aux catégories et les créer
        console.log('📦 Création des produits...')
        const productsWithCategories = productsData.map(product => {
            // Trouver la catégorie correspondante
            let categoryId
            if (product.essence === 'chêne' || product.essence === 'hêtre') {
                categoryId = categories.find(cat => cat.slug === 'bois-feuillus-premium')?._id
            } else if (product.essence === 'granulés') {
                categoryId = categories.find(cat => cat.slug === 'granules-premium')?._id
            } else {
                categoryId = categories[0]._id // Fallback
            }

            return {
                ...product,
                categoryId
            }
        })

        const products = await Product.create(productsWithCategories)
        console.log(`✅ ${products.length} produits créés`)

        // Créer les témoignages
        console.log('💬 Création des témoignages...')
        const testimonials = await Testimonial.create(testimonialsData)
        console.log(`✅ ${testimonials.length} témoignages créés`)

        // Créer quelques abonnés newsletter de test
        console.log('📧 Création d\'abonnés newsletter de test...')
        const newsletterData = [
            {
                email: 'test1@example.com',
                firstName: 'Jean',
                interests: ['promotions', 'conseils'],
                source: 'seed',
                isActive: true,
                confirmedAt: new Date()
            },
            {
                email: 'test2@example.com',
                firstName: 'Marie',
                interests: ['nouveautes'],
                source: 'seed',
                isActive: true,
                confirmedAt: new Date()
            }
        ]
        const newsletters = await Newsletter.create(newsletterData)
        console.log(`✅ ${newsletters.length} abonnés newsletter créés`)

        // Afficher un résumé
        console.log('\n🎉 Seed terminé avec succès !')
        console.log('═'.repeat(50))
        console.log(`📁 Catégories: ${categories.length}`)
        console.log(`📦 Produits: ${products.length}`)
        console.log(`💬 Témoignages: ${testimonials.length}`)
        console.log(`📧 Newsletter: ${newsletters.length}`)
        console.log('═'.repeat(50))

        // Afficher les URLs d'accès
        console.log('\n🔗 Liens utiles:')
        console.log(`🏠 Site web: ${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}`)
        console.log(`🛒 Boutique: ${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/shop`)
        console.log(`📋 API Categories: ${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/categories`)
        console.log(`📋 API Produits: ${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/products/search`)

    } catch (error) {
        console.error('❌ Erreur lors du seed:', error)
        process.exit(1)
    } finally {
        // Fermer la connexion
        await mongoose.connection.close()
        console.log('🔌 Connexion MongoDB fermée')
        process.exit(0)
    }
}

// Fonction pour nettoyer complètement la DB
async function cleanDatabase() {
    try {
        console.log('🗑️  Nettoyage complet de la base de données...')

        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: process.env.MONGODB_DB_NAME || 'boischauffagepro'
        })

        await Promise.all([
            Category.deleteMany({}),
            Product.deleteMany({}),
            Testimonial.deleteMany({}),
            Newsletter.deleteMany({})
        ])

        console.log('✅ Base de données nettoyée')
    } catch (error) {
        console.error('❌ Erreur lors du nettoyage:', error)
    } finally {
        await mongoose.connection.close()
        process.exit(0)
    }
}

// Gestion des arguments de ligne de commande
const args = process.argv.slice(2)

if (args.includes('--clean')) {
    cleanDatabase()
} else if (args.includes('--help')) {
    console.log(`
Usage: npm run db:seed [options]

Options:
  --clean     Nettoyer complètement la base de données
  --help      Afficher cette aide

Exemples:
  npm run db:seed              # Seed complet
  npm run db:seed -- --clean   # Nettoyer seulement
    `)
} else {
    seedDatabase()
}