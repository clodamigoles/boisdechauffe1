import mongoose from 'mongoose'

// Configuration de la connexion
const MONGODB_URI = process.env.MONGODB_URI
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME

if (!MONGODB_URI) {
    throw new Error('Veuillez définir la variable MONGODB_URI dans .env.local')
}

// Cache de la connexion pour éviter les reconnexions en développement
let cached = global.mongoose

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null }
}

async function connectDB() {
    if (cached.conn) {
        return cached.conn
    }

    if (!cached.promise) {
        const options = {
            dbName: MONGODB_DB_NAME,
            bufferCommands: false, // Désactiver le buffer des commandes
            maxPoolSize: 10, // Maintenir jusqu'à 10 connexions socket
            serverSelectionTimeoutMS: 5000, // Garder un timeout de 5s pour la sélection du serveur
            socketTimeoutMS: 45000, // Fermer les sockets après 45s d'inactivité
            family: 4, // Utiliser IPv4, ignorer IPv6
        }

        cached.promise = mongoose.connect(MONGODB_URI, options).then((mongoose) => {
            console.log('✅ Connexion MongoDB établie avec Mongoose')
            return mongoose
        })
    }

    try {
        cached.conn = await cached.promise
    } catch (e) {
        cached.promise = null
        throw e
    }

    return cached.conn
}

// Middleware de gestion des erreurs
export const handleDBErrors = (error) => {
    console.error('Erreur base de données:', error)

    if (error.code === 11000) {
        // Erreur de duplication
        const field = Object.keys(error.keyPattern)[0]
        return {
            type: 'DUPLICATE_ERROR',
            message: `${field} existe déjà`,
            field
        }
    }

    if (error.name === 'ValidationError') {
        // Erreur de validation Mongoose
        const errors = Object.values(error.errors).map(err => ({
            field: err.path,
            message: err.message
        }))
        return {
            type: 'VALIDATION_ERROR',
            message: 'Données invalides',
            errors
        }
    }

    if (error.name === 'CastError') {
        return {
            type: 'CAST_ERROR',
            message: 'Format de données invalide',
            field: error.path
        }
    }

    return {
        type: 'DATABASE_ERROR',
        message: 'Erreur de base de données'
    }
}

// Utilitaire pour les transactions
export const withTransaction = async (callback) => {
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        const result = await callback(session)
        await session.commitTransaction()
        return result
    } catch (error) {
        await session.abortTransaction()
        throw error
    } finally {
        session.endSession()
    }
}

// Validation des variables d'environnement
export function validateEnvironment() {
    const requiredEnvVars = ['MONGODB_URI']
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName])

    if (missingVars.length > 0) {
        throw new Error(`Variables d'environnement manquantes: ${missingVars.join(', ')}`)
    }
}

export default connectDB