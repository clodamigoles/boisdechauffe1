#!/usr/bin/env node

/**
 * Script de migration de base de données MongoDB
 * Copie toutes les collections et documents de bdc1 vers monboisdechauffecom
 * Usage: node scripts/migrate-database.js
 */

import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Charger les variables d'environnement
dotenv.config({ path: join(__dirname, '../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;
const SOURCE_DB = process.env.MONGODB_DB_NAME_OLD || 'bdc1';
const TARGET_DB = process.env.MONGODB_DB_NAME || 'monboisdechauffecom';

// Couleurs pour la console
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    red: '\x1b[31m',
    cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

async function migrateDatabase() {
    let client;
    const migrationStats = {
        totalCollections: 0,
        totalDocuments: 0,
        collections: {},
        errors: []
    };

    try {
        // Vérifier les variables d'environnement
        if (!MONGODB_URI) {
            throw new Error('MONGODB_URI n\'est pas défini dans .env.local');
        }

        log('\n🚀 Démarrage de la migration de base de données', 'bright');
        log(`📊 Source: ${SOURCE_DB}`, 'cyan');
        log(`🎯 Destination: ${TARGET_DB}`, 'cyan');
        log('━'.repeat(60), 'blue');

        // Connexion à MongoDB
        log('\n🔌 Connexion à MongoDB...', 'yellow');
        client = new MongoClient(MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });

        await client.connect();
        log('✅ Connexion établie', 'green');

        // Récupérer les bases de données
        const sourceDb = client.db(SOURCE_DB);
        const targetDb = client.db(TARGET_DB);

        // Lister toutes les collections de la base source
        log('\n📋 Récupération des collections...', 'yellow');
        const collections = await sourceDb.listCollections().toArray();
        const collectionNames = collections.map(c => c.name);

        if (collectionNames.length === 0) {
            log('⚠️  Aucune collection trouvée dans la base source', 'yellow');
            return;
        }

        log(`📦 ${collectionNames.length} collection(s) trouvée(s):`, 'cyan');
        collectionNames.forEach(name => log(`   • ${name}`, 'cyan'));

        log('\n━'.repeat(60), 'blue');
        log('🔄 Début de la migration...', 'bright');

        // Migrer chaque collection
        for (const collectionName of collectionNames) {
            try {
                log(`\n📦 Migration de: ${collectionName}`, 'yellow');

                const sourceCollection = sourceDb.collection(collectionName);
                const targetCollection = targetDb.collection(collectionName);

                // Compter les documents
                const count = await sourceCollection.countDocuments();

                if (count === 0) {
                    log(`   ⚠️  Collection vide, passage à la suivante`, 'yellow');
                    migrationStats.collections[collectionName] = { count: 0, success: true };
                    continue;
                }

                log(`   📊 ${count} document(s) à migrer`, 'cyan');

                // Récupérer tous les documents
                const documents = await sourceCollection.find({}).toArray();

                // Vider la collection cible si elle existe déjà
                const targetCount = await targetCollection.countDocuments();
                if (targetCount > 0) {
                    log(`   🗑️  Suppression de ${targetCount} document(s) existant(s)...`, 'yellow');
                    await targetCollection.deleteMany({});
                }

                // Insérer les documents par lots (pour éviter les problèmes de mémoire)
                const BATCH_SIZE = 1000;
                let inserted = 0;

                for (let i = 0; i < documents.length; i += BATCH_SIZE) {
                    const batch = documents.slice(i, i + BATCH_SIZE);
                    await targetCollection.insertMany(batch, { ordered: false });
                    inserted += batch.length;

                    if (documents.length > BATCH_SIZE) {
                        const progress = Math.round((inserted / documents.length) * 100);
                        log(`   📈 Progression: ${inserted}/${documents.length} (${progress}%)`, 'cyan');
                    }
                }

                // Copier les index
                const indexes = await sourceCollection.indexes();
                if (indexes.length > 1) { // Plus que juste l'index _id
                    log(`   🔍 Copie de ${indexes.length - 1} index...`, 'yellow');
                    for (const index of indexes) {
                        if (index.name !== '_id_') {
                            try {
                                const { key, ...options } = index;
                                delete options.v;
                                delete options.ns;
                                await targetCollection.createIndex(key, options);
                            } catch (indexError) {
                                log(`   ⚠️  Erreur lors de la création de l'index ${index.name}: ${indexError.message}`, 'yellow');
                            }
                        }
                    }
                }

                log(`   ✅ ${inserted} document(s) migrés avec succès`, 'green');

                migrationStats.totalCollections++;
                migrationStats.totalDocuments += inserted;
                migrationStats.collections[collectionName] = { count: inserted, success: true };

            } catch (error) {
                log(`   ❌ Erreur: ${error.message}`, 'red');
                migrationStats.errors.push({
                    collection: collectionName,
                    error: error.message
                });
                migrationStats.collections[collectionName] = { count: 0, success: false, error: error.message };
            }
        }

        // Afficher le résumé
        log('\n━'.repeat(60), 'blue');
        log('\n📊 RÉSUMÉ DE LA MIGRATION', 'bright');
        log('━'.repeat(60), 'blue');
        log(`✅ Collections migrées: ${migrationStats.totalCollections}/${collectionNames.length}`, 'green');
        log(`📄 Documents totaux: ${migrationStats.totalDocuments}`, 'green');

        if (migrationStats.errors.length > 0) {
            log(`\n⚠️  Erreurs rencontrées: ${migrationStats.errors.length}`, 'yellow');
            migrationStats.errors.forEach(err => {
                log(`   • ${err.collection}: ${err.error}`, 'red');
            });
        }

        log('\n📋 Détails par collection:', 'cyan');
        Object.keys(migrationStats.collections).forEach(name => {
            const stats = migrationStats.collections[name];
            const icon = stats.success ? '✅' : '❌';
            const count = stats.count || 0;
            log(`   ${icon} ${name}: ${count} document(s)`, stats.success ? 'green' : 'red');
        });

        log('\n━'.repeat(60), 'blue');
        log('✨ Migration terminée!', 'bright');
        log('━'.repeat(60), 'blue');

    } catch (error) {
        log(`\n❌ Erreur fatale: ${error.message}`, 'red');
        console.error(error);
        process.exit(1);
    } finally {
        if (client) {
            await client.close();
            log('\n🔌 Connexion fermée', 'cyan');
        }
    }
}

// Fonction pour vérifier avant de migrer
async function checkBeforeMigration() {
    let client;

    try {
        log('\n🔍 Vérification des bases de données...', 'yellow');

        client = new MongoClient(MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
        });

        await client.connect();

        const sourceDb = client.db(SOURCE_DB);
        const targetDb = client.db(TARGET_DB);

        // Vérifier la source
        const sourceCollections = await sourceDb.listCollections().toArray();
        log(`\n📊 Base source (${SOURCE_DB}):`, 'cyan');
        log(`   Collections: ${sourceCollections.length}`, 'cyan');

        // Vérifier la cible
        const targetCollections = await targetDb.listCollections().toArray();
        log(`\n🎯 Base cible (${TARGET_DB}):`, 'cyan');
        log(`   Collections: ${targetCollections.length}`, 'cyan');

        if (targetCollections.length > 0) {
            log('\n⚠️  ATTENTION: La base de données cible contient déjà des données!', 'yellow');
            log('   Les données existantes seront ÉCRASÉES!', 'red');
        }

        await client.close();
        return true;

    } catch (error) {
        log(`\n❌ Erreur lors de la vérification: ${error.message}`, 'red');
        if (client) await client.close();
        return false;
    }
}

// Point d'entrée principal
async function main() {
    const args = process.argv.slice(2);

    if (args.includes('--help') || args.includes('-h')) {
        log('\n📚 Script de migration de base de données MongoDB', 'bright');
        log('\nUsage:', 'cyan');
        log('  node scripts/migrate-database.js          # Migrer les données', 'cyan');
        log('  node scripts/migrate-database.js --check  # Vérifier avant de migrer', 'cyan');
        log('  node scripts/migrate-database.js --help   # Afficher cette aide', 'cyan');
        log('\nConfiguration:', 'cyan');
        log(`  Source: ${SOURCE_DB}`, 'cyan');
        log(`  Cible: ${TARGET_DB}`, 'cyan');
        log(`  URI: ${MONGODB_URI ? 'Défini' : 'Non défini'}`, 'cyan');
        log('');
        return;
    }

    if (args.includes('--check') || args.includes('-c')) {
        await checkBeforeMigration();
        return;
    }

    // Lancer la migration
    await migrateDatabase();
}

main();
