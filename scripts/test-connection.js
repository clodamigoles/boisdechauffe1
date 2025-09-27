require('dotenv').config({ path: '.env.local' })

const mongoose = require('mongoose')

// URI MongoDB (à adapter selon votre configuration)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/boischauffage-pro'

async function testConnection() {
    try {
        console.log('🔌 Test de connexion à MongoDB...')
        console.log('URI:', MONGODB_URI)

        await mongoose.connect(MONGODB_URI)
        console.log('✅ Connexion MongoDB réussie !')

        // Test d'une opération simple
        const collections = await mongoose.connection.db.listCollections().toArray()
        console.log('📊 Collections existantes:', collections.map(c => c.name))

    } catch (error) {
        console.error('❌ Erreur de connexion:', error.message)
        console.log('\n🔧 Solutions possibles:')
        console.log('1. Installer MongoDB localement')
        console.log('2. Utiliser MongoDB Atlas (cloud)')
        console.log('3. Lancer MongoDB avec Docker')
        console.log('4. Vérifier votre variable MONGODB_URI dans .env.local')
    } finally {
        await mongoose.disconnect()
        console.log('👋 Connexion fermée')
    }
}

testConnection()