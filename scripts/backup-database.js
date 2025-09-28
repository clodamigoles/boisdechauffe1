// Script de sauvegarde de la base de données
// Usage: node scripts/backup-database.js [filename]

import { DatabaseUtils, getDatabase } from '../lib/mongodb.js'
import fs from 'fs/promises'
import path from 'path'

async function backupDatabase(filename) {
    try {
        console.log('💾 Démarrage de la sauvegarde de la base de données...')

        const backupData = {
            timestamp: new Date().toISOString(),
            version: '1.0.0',
            collections: {}
        }

        const collections = ['categories', 'products', 'testimonials', 'newsletter_subscribers']

        for (const collectionName of collections) {
            console.log(`📦 Sauvegarde de la collection: ${collectionName}`)

            try {
                const data = await DatabaseUtils.findMany(collectionName, {})
                backupData.collections[collectionName] = data
                console.log(`   ✅ ${data.length} documents sauvegardés`)
            } catch (error) {
                console.log(`   ⚠️ Erreur lors de la sauvegarde de ${collectionName}:`, error.message)
                backupData.collections[collectionName] = []
            }
        }

        // Créer le dossier backups s'il n'existe pas
        const backupDir = path.join(process.cwd(), 'backups')
        try {
            await fs.access(backupDir)
        } catch {
            await fs.mkdir(backupDir, { recursive: true })
        }

        // Nom du fichier de sauvegarde
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0]
        const backupFilename = filename || `backup-${timestamp}.json`
        const backupPath = path.join(backupDir, backupFilename)

        // Écrire le fichier de sauvegarde
        await fs.writeFile(backupPath, JSON.stringify(backupData, null, 2), 'utf8')

        const stats = await fs.stat(backupPath)
        const fileSize = (stats.size / 1024 / 1024).toFixed(2)

        console.log('✅ Sauvegarde terminée avec succès!')
        console.log(`📄 Fichier: ${backupPath}`)
        console.log(`📊 Taille: ${fileSize} MB`)
        console.log(`📈 Résumé:`)

        Object.keys(backupData.collections).forEach(collection => {
            const count = backupData.collections[collection].length
            console.log(`   - ${collection}: ${count} documents`)
        })

    } catch (error) {
        console.error('❌ Erreur lors de la sauvegarde:', error)
        process.exit(1)
    }
}

// Fonction pour lister les sauvegardes disponibles
async function listBackups() {
    try {
        const backupDir = path.join(process.cwd(), 'backups')
        const files = await fs.readdir(backupDir)
        const backups = files.filter(file => file.endsWith('.json'))

        if (backups.length === 0) {
            console.log('📭 Aucune sauvegarde trouvée')
            return
        }

        console.log('📋 Sauvegardes disponibles:')

        for (const backup of backups) {
            const filePath = path.join(backupDir, backup)
            const stats = await fs.stat(filePath)
            const size = (stats.size / 1024 / 1024).toFixed(2)
            console.log(`   📄 ${backup} (${size} MB) - ${stats.mtime.toLocaleDateString()}`)
        }

    } catch (error) {
        console.error('❌ Erreur lors de la liste des sauvegardes:', error)
    }
}

// Fonction pour créer une sauvegarde automatique quotidienne
async function createDailyBackup() {
    const today = new Date().toISOString().split('T')[0]
    const filename = `daily-backup-${today}.json`
    await backupDatabase(filename)
}

// Exécuter le script
const command = process.argv[2]
const filename = process.argv[3]

switch (command) {
    case 'list':
        listBackups()
        break
    case 'daily':
        createDailyBackup()
        break
    default:
        backupDatabase(filename)
}

export { backupDatabase, listBackups, createDailyBackup }