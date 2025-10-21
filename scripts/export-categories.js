#!/usr/bin/env node

/**
 * Script pour exporter les catégories de la BDD et générer un fichier de traduction
 * 
 * Usage: node scripts/export-categories.js
 */

require('dotenv').config({ path: '.env.local' })
const mongoose = require('mongoose')
const fs = require('fs')
const path = require('path')

// Connexion à MongoDB
async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log('✅ Connecté à MongoDB')
    } catch (error) {
        console.error('❌ Erreur de connexion à MongoDB:', error)
        process.exit(1)
    }
}

// Schéma Category (simplifié)
const categorySchema = new mongoose.Schema({
    name: String,
    slug: String,
    description: String,
    shortDescription: String,
    image: String,
    featured: Boolean,
    trending: Boolean,
    isActive: Boolean,
    order: Number,
    productCount: Number
}, { timestamps: true })

const Category = mongoose.models.Category || mongoose.model('Category', categorySchema)

async function exportCategories() {
    await connectDB()

    console.log('\n📊 Récupération des catégories...\n')

    // Récupérer toutes les catégories actives
    const categories = await Category.find({ isActive: true })
        .sort({ order: 1, name: 1 })
        .lean()

    if (categories.length === 0) {
        console.log('⚠️  Aucune catégorie trouvée dans la base de données')
        await mongoose.disconnect()
        return
    }

    console.log(`✅ ${categories.length} catégories trouvées\n`)

    // Préparer les données pour l'export
    const exportData = {
        _info: {
            exportDate: new Date().toISOString(),
            totalCategories: categories.length,
            usage: "Ce fichier contient les catégories de la BDD à traduire. Copiez les valeurs dans public/locales/{lang}/categories.json"
        },
        categories: {}
    }

    // Afficher et préparer les catégories
    console.log('┌─────────────────────────────────────────────────────────────────────────┐')
    console.log('│                    CATÉGORIES À TRADUIRE                                │')
    console.log('├─────────────────────────────────────────────────────────────────────────┤')

    categories.forEach((cat, index) => {
        console.log(`\n${index + 1}. Slug: ${cat.slug}`)
        console.log(`   Nom: ${cat.name}`)
        console.log(`   Description courte: ${cat.shortDescription || 'N/A'}`)
        console.log(`   Description: ${cat.description ? cat.description.substring(0, 80) + '...' : 'N/A'}`)
        console.log(`   Featured: ${cat.featured ? '⭐' : '❌'}`)
        console.log(`   Trending: ${cat.trending ? '🔥' : '❌'}`)

        // Ajouter au fichier d'export
        exportData.categories[cat.slug] = {
            name: cat.name,
            shortDescription: cat.shortDescription || '',
            description: cat.description || '',
            _metadata: {
                featured: cat.featured,
                trending: cat.trending,
                order: cat.order
            }
        }
    })

    console.log('\n└─────────────────────────────────────────────────────────────────────────┘\n')

    // Créer le dossier scripts/exports s'il n'existe pas
    const exportsDir = path.join(__dirname, 'exports')
    if (!fs.existsSync(exportsDir)) {
        fs.mkdirSync(exportsDir, { recursive: true })
    }

    // Sauvegarder dans un fichier JSON
    const outputPath = path.join(exportsDir, 'categories-to-translate.json')
    fs.writeFileSync(outputPath, JSON.stringify(exportData, null, 2), 'utf-8')

    console.log(`💾 Fichier exporté: ${outputPath}`)

    // Générer un template de traduction
    const templatePath = path.join(exportsDir, 'categories-translation-template.json')
    const template = {}

    categories.forEach(cat => {
        template[cat.slug] = {
            name: `[À TRADUIRE] ${cat.name}`,
            shortDescription: `[À TRADUIRE] ${cat.shortDescription || ''}`,
            description: `[À TRADUIRE] ${cat.description || ''}`
        }
    })

    fs.writeFileSync(templatePath, JSON.stringify(template, null, 2), 'utf-8')
    console.log(`📝 Template de traduction: ${templatePath}`)

    console.log('\n✅ Export terminé avec succès!')
    console.log('\n📋 Prochaines étapes:')
    console.log('   1. Ouvrez scripts/exports/categories-to-translate.json')
    console.log('   2. Copiez les slugs des catégories')
    console.log('   3. Traduisez-les dans public/locales/{en,de,es}/categories.json')
    console.log('   4. Le système détectera automatiquement les traductions au chargement\n')

    await mongoose.disconnect()
}

// Exécution du script
exportCategories().catch(error => {
    console.error('❌ Erreur:', error)
    process.exit(1)
})

