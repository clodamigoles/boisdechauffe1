// Script de restauration de la base de données
// Usage: node scripts/restore-database.js <backup-file>

import { DatabaseUtils } from '../lib/mongodb.js'
import fs from 'fs/promises'
import path from 'path'

async function restoreDatabase(backupFile) {
    try {
        console.log('🔄 Démarrage de la restauration de la base de données...')

        // Vérifier que le fichier existe
        const backupPath = path.isAbsolute(backupFile)
            ? backupFile
            : path.join(process.cwd(), 'backups', backupFile)

        try {
            await fs.access(backupPath)
        } catch {
            console.error(`❌ Fichier de sauvegarde non trouvé: ${backupPath}`)
            process.exit(1)
        }

        // Lire le fichier de sauvegarde
        console.log(`📖 Lecture du fichier: ${backupPath}`)
        const backupContent = await fs.readFile(backupPath, 'utf8')
        const backupData = JSON.parse(backupContent)

        console.log(`📅 Sauvegarde créée le: ${backupData.timestamp}`)
        console.log(`📦 Version: ${backupData.version}`)

        // Demander confirmation (en mode interactif)
        if (process.stdout.isTTY) {
            console.log('⚠️  ATTENTION: Cette opération va remplacer toutes les données existantes!')
            console.log('   Appuyez sur Ctrl+C pour annuler, ou sur Entrée pour continuer...')

            // Attendre l'entrée utilisateur
            process.stdin.setRawMode(true)
            process.stdin.resume()
            await new Promise((resolve) => {
                process.stdin.once('data', () => {
                    process.stdin.setRawMode(false)
                    process.stdin.pause()
                    resolve()
                })
            })
        }

        console.log('🧹 Nettoyage des collections existantes...')

        // Nettoyer les collections existantes
        const collections = Object.keys(backupData.collections)
        for (const collectionName of collections) {
            try {
                await DatabaseUtils.deleteMany(collectionName, {})
                console.log(`   ✅ Collection ${collectionName} nettoyée`)
            } catch (error) {
                console.log(`   ⚠️ Erreur lors du nettoyage de ${collectionName}:`, error.message)
            }
        }

        console.log('📥 Restauration des données...')

        // Restaurer chaque collection
        for (const [collectionName, data] of Object.entries(backupData.collections)) {
            if (!Array.isArray(data) || data.length === 0) {
                console.log(`   ⏭️ Collection ${collectionName} vide, ignorée`)
                continue
            }

            try {
                // Nettoyer les données (supprimer les champs auto-générés)
                const cleanData = data.map(doc => {
                    const { _id, ...cleanDoc } = doc
                    return cleanDoc
                })

                const result = await DatabaseUtils.insertMany(collectionName, cleanData)
                console.log(`   ✅ Collection ${collectionName}: ${result.insertedCount} documents restaurés`)
            } catch (error) {
                console.log(`   ❌ Erreur lors de la restauration de ${collectionName}:`, error.message)
            }
        }

        console.log('🔧 Mise à jour des compteurs...')

        // Mettre à jour les compteurs de produits dans les catégories
        try {
            const categories = await DatabaseUtils.findMany('categories', {})
            for (const category of categories) {
                const productCount = await DatabaseUtils.count('products', {
                    categoryId: category._id,
                    isActive: true
                })

                await DatabaseUtils.updateOne(
                    'categories',
                    { _id: category._id },
                    { $set: { productCount } }
                )
            }
            console.log('   ✅ Compteurs de produits mis à jour')
        } catch (error) {
            console.log('   ⚠️ Erreur lors de la mise à jour des compteurs:', error.message)
        }

        console.log('✅ Restauration terminée avec succès!')

        // Afficher un résumé
        console.log('📊 Résumé de la restauration:')
        for (const [collectionName, data] of Object.entries(backupData.collections)) {
            const count = Array.isArray(data) ? data.length : 0
            console.log(`   - ${collectionName}: ${count} documents`)
        }

    } catch (error) {
        console.error('❌ Erreur lors de la restauration:', error)
        process.exit(1)
    }
}

// Fonction pour valider un fichier de sauvegarde
async function validateBackup(backupFile) {
    try {
        console.log('🔍 Validation du fichier de sauvegarde...')

        const backupPath = path.isAbsolute(backupFile)
            ? backupFile
            : path.join(process.cwd(), 'backups', backupFile)

        const backupContent = await fs.readFile(backupPath, 'utf8')
        const backupData = JSON.parse(backupContent)

        // Vérifications de base
        const requiredFields = ['timestamp', 'version', 'collections']
        for (const field of requiredFields) {
            if (!(field in backupData)) {
                console.log(`❌ Champ manquant: ${field}`)
                return false
            }
        }

        console.log(`✅ Fichier valide`)
        console.log(`   📅 Date: ${backupData.timestamp}`)
        console.log(`   📦 Version: ${backupData.version}`)
        console.log(`   📋 Collections:`)

        for (const [collection, data] of Object.entries(backupData.collections)) {
            const count = Array.isArray(data) ? data.length : 0
            console.log(`      - ${collection}: ${count} documents`)
        }

        return true

    } catch (error) {
        console.error('❌ Fichier de sauvegarde invalide:', error.message)
        return false
    }
}

// Fonction pour créer une sauvegarde avant restauration
async function createBackupBeforeRestore() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const filename = `pre-restore-backup-${timestamp}.json`

    console.log('💾 Création d\'une sauvegarde de sécurité...')

    const { backupDatabase } = await import('./backup-database.js')
    await backupDatabase(filename)

    console.log(`✅ Sauvegarde de sécurité créée: ${filename}`)
}

// Exécuter le script
const command = process.argv[2]
const backupFile = process.argv[3]

if (!backupFile && command !== 'help') {
    console.log('❌ Fichier de sauvegarde requis')
    console.log('Usage: node scripts/restore-database.js <backup-file>')
    console.log('       node scripts/restore-database.js validate <backup-file>')
    console.log('       node scripts/restore-database.js help')
    process.exit(1)
}

switch (command) {
    case 'validate':
        validateBackup(backupFile)
        break
    case 'help':
        console.log('🔄 Script de restauration de base de données')
        console.log('')
        console.log('Usage:')
        console.log('  node scripts/restore-database.js <backup-file>     # Restaurer depuis un fichier')
        console.log('  node scripts/restore-database.js validate <file>   # Valider un fichier de sauvegarde')
        console.log('  node scripts/restore-database.js help              # Afficher cette aide')
        console.log('')
        console.log('Exemples:')
        console.log('  node scripts/restore-database.js backup-2024-01-15.json')
        console.log('  node scripts/restore-database.js validate daily-backup-2024-01-15.json')
        break
    default:
        // Par défaut, considérer le premier argument comme le fichier à restaurer
        const fileToRestore = command

        if (process.stdout.isTTY) {
            await createBackupBeforeRestore()
        }

        await restoreDatabase(fileToRestore)
}

export { restoreDatabase, validateBackup, createBackupBeforeRestore }