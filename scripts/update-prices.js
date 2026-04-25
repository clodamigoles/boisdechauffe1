#!/usr/bin/env node

/**
 * Script de mise à jour des prix produits
 * Usage: node scripts/update-prices.js [--percent=25] [--dry-run]
 *
 * Options:
 *   --percent=N   Pourcentage d'augmentation (défaut : 25)
 *   --dry-run     Simule sans modifier la base de données
 */

import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config({ path: join(__dirname, '../.env.local') })

const MONGODB_URI = process.env.MONGODB_URI
const DB_NAME = process.env.MONGODB_DB_NAME || 'monboisdechauffecom'

const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    red: '\x1b[31m',
    cyan: '\x1b[36m',
}

const log = (msg, color = 'reset') => console.log(`${colors[color]}${msg}${colors.reset}`)

// Lecture des arguments CLI
const args = process.argv.slice(2)
const percentArg = args.find(a => a.startsWith('--percent='))
const PERCENT = percentArg ? parseFloat(percentArg.split('=')[1]) : 25
const DRY_RUN = args.includes('--dry-run')

if (isNaN(PERCENT) || PERCENT <= 0) {
    log('❌ Pourcentage invalide. Exemple : node scripts/update-prices.js --percent=25', 'red')
    process.exit(1)
}

const MULTIPLIER = 1 + PERCENT / 100
const round2 = (n) => Math.round(n * 100) / 100

async function run() {
    if (!MONGODB_URI) {
        log('❌ MONGODB_URI absent dans .env.local', 'red')
        process.exit(1)
    }

    log('\n🪵  Script de mise à jour des prix', 'bright')
    log(`📈 Augmentation : +${PERCENT}% (×${MULTIPLIER})`, 'cyan')
    log(`🗄️  Base : ${DB_NAME}`, 'cyan')
    if (DRY_RUN) log('👁️  Mode DRY-RUN — aucune modification en base', 'yellow')
    log('━'.repeat(55), 'blue')

    const client = new MongoClient(MONGODB_URI)

    try {
        await client.connect()
        log('\n✅ Connecté à MongoDB', 'green')

        const db = client.db(DB_NAME)
        const collection = db.collection('products')

        const products = await collection.find({ isActive: true }).toArray()

        if (products.length === 0) {
            log('⚠️  Aucun produit actif trouvé.', 'yellow')
            return
        }

        log(`\n📦 ${products.length} produit(s) trouvé(s)\n`, 'bright')

        let updated = 0

        for (const product of products) {
            const oldPrice = product.price
            const newPrice = round2(oldPrice * MULTIPLIER)
            const oldCompare = product.compareAtPrice || null
            const newCompare = oldCompare ? round2(oldCompare * MULTIPLIER) : null

            log(
                `  ${product.name.padEnd(35)} ${String(oldPrice).padStart(8)} € → ${String(newPrice).padStart(8)} €` +
                (oldCompare ? `  (barré: ${oldCompare} → ${newCompare})` : ''),
                'reset'
            )

            if (!DRY_RUN) {
                const update = { $set: { price: newPrice } }
                if (newCompare !== null) update.$set.compareAtPrice = newCompare

                await collection.updateOne({ _id: product._id }, update)
            }

            updated++
        }

        log('\n' + '━'.repeat(55), 'blue')

        if (DRY_RUN) {
            log(`\n👁️  DRY-RUN terminé — ${updated} produit(s) auraient été mis à jour.`, 'yellow')
        } else {
            log(`\n✅ ${updated} produit(s) mis à jour avec succès (+${PERCENT}%).`, 'green')
        }

    } catch (err) {
        log(`\n❌ Erreur : ${err.message}`, 'red')
        console.error(err)
        process.exit(1)
    } finally {
        await client.close()
        log('🔌 Connexion fermée.\n', 'cyan')
    }
}

run()
