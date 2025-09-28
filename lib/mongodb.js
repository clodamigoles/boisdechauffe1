import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI
const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
}

let client
let clientPromise

if (!process.env.MONGODB_URI) {
    throw new Error('Please add your Mongo URI to .env.local')
}

if (process.env.NODE_ENV === 'development') {
    // En développement, utilise une variable globale pour préserver la valeur
    // à travers les rechargements de module causés par HMR (Hot Module Replacement).
    if (!global._mongoClientPromise) {
        client = new MongoClient(uri, options)
        global._mongoClientPromise = client.connect()
    }
    clientPromise = global._mongoClientPromise
} else {
    // En production, il est préférable de ne pas utiliser une variable globale.
    client = new MongoClient(uri, options)
    clientPromise = client.connect()
}

// Export d'une promise MongoClient. Par défaut, tu peux commencer à utiliser
// cette promise tout de suite sans attendre qu'elle se résolve.
export default clientPromise

// Utilitaires pour les collections
export async function getDatabase() {
    const client = await clientPromise
    return client.db(process.env.MONGODB_DB_NAME || 'boischauffagepro')
}

export async function getCollection(collectionName) {
    const db = await getDatabase()
    return db.collection(collectionName)
}

// Utilitaires pour les opérations CRUD
export class DatabaseUtils {
    static async findOne(collectionName, filter, options = {}) {
        try {
            const collection = await getCollection(collectionName)
            return await collection.findOne(filter, options)
        } catch (error) {
            console.error(`Erreur findOne sur ${collectionName}:`, error)
            throw error
        }
    }

    static async findMany(collectionName, filter = {}, options = {}) {
        try {
            const collection = await getCollection(collectionName)
            const cursor = collection.find(filter, options)

            if (options.sort) cursor.sort(options.sort)
            if (options.limit) cursor.limit(options.limit)
            if (options.skip) cursor.skip(options.skip)

            return await cursor.toArray()
        } catch (error) {
            console.error(`Erreur findMany sur ${collectionName}:`, error)
            throw error
        }
    }

    static async insertOne(collectionName, document) {
        try {
            const collection = await getCollection(collectionName)
            const now = new Date()

            const documentWithTimestamps = {
                ...document,
                createdAt: now,
                updatedAt: now
            }

            const result = await collection.insertOne(documentWithTimestamps)
            return {
                ...documentWithTimestamps,
                _id: result.insertedId
            }
        } catch (error) {
            console.error(`Erreur insertOne sur ${collectionName}:`, error)
            throw error
        }
    }

    static async insertMany(collectionName, documents) {
        try {
            const collection = await getCollection(collectionName)
            const now = new Date()

            const documentsWithTimestamps = documents.map(doc => ({
                ...doc,
                createdAt: now,
                updatedAt: now
            }))

            const result = await collection.insertMany(documentsWithTimestamps)
            return result
        } catch (error) {
            console.error(`Erreur insertMany sur ${collectionName}:`, error)
            throw error
        }
    }

    static async updateOne(collectionName, filter, update, options = {}) {
        try {
            const collection = await getCollection(collectionName)

            const updateWithTimestamp = {
                ...update,
                $set: {
                    ...update.$set,
                    updatedAt: new Date()
                }
            }

            return await collection.updateOne(filter, updateWithTimestamp, options)
        } catch (error) {
            console.error(`Erreur updateOne sur ${collectionName}:`, error)
            throw error
        }
    }

    static async updateMany(collectionName, filter, update, options = {}) {
        try {
            const collection = await getCollection(collectionName)

            const updateWithTimestamp = {
                ...update,
                $set: {
                    ...update.$set,
                    updatedAt: new Date()
                }
            }

            return await collection.updateMany(filter, updateWithTimestamp, options)
        } catch (error) {
            console.error(`Erreur updateMany sur ${collectionName}:`, error)
            throw error
        }
    }

    static async deleteOne(collectionName, filter) {
        try {
            const collection = await getCollection(collectionName)
            return await collection.deleteOne(filter)
        } catch (error) {
            console.error(`Erreur deleteOne sur ${collectionName}:`, error)
            throw error
        }
    }

    static async deleteMany(collectionName, filter) {
        try {
            const collection = await getCollection(collectionName)
            return await collection.deleteMany(filter)
        } catch (error) {
            console.error(`Erreur deleteMany sur ${collectionName}:`, error)
            throw error
        }
    }

    static async count(collectionName, filter = {}) {
        try {
            const collection = await getCollection(collectionName)
            return await collection.countDocuments(filter)
        } catch (error) {
            console.error(`Erreur count sur ${collectionName}:`, error)
            throw error
        }
    }

    static async aggregate(collectionName, pipeline, options = {}) {
        try {
            const collection = await getCollection(collectionName)
            return await collection.aggregate(pipeline, options).toArray()
        } catch (error) {
            console.error(`Erreur aggregate sur ${collectionName}:`, error)
            throw error
        }
    }
}

// Validation des variables d'environnement au démarrage
export function validateEnvironment() {
    const requiredEnvVars = ['MONGODB_URI']
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName])

    if (missingVars.length > 0) {
        throw new Error(`Variables d'environnement manquantes: ${missingVars.join(', ')}`)
    }
}

// Initialisation des index pour optimiser les performances
export async function createIndexes() {
    try {
        const db = await getDatabase()

        // Index pour les produits
        await db.collection('products').createIndexes([
            { key: { slug: 1 }, unique: true },
            { key: { categoryId: 1 } },
            { key: { featured: 1 } },
            { key: { trending: 1 } },
            { key: { bestseller: 1 } },
            { key: { isActive: 1 } },
            { key: { createdAt: -1 } },
            { key: { name: 'text', description: 'text' } }
        ])

        // Index pour les catégories
        await db.collection('categories').createIndexes([
            { key: { slug: 1 }, unique: true },
            { key: { featured: 1 } },
            { key: { order: 1 } },
            { key: { isActive: 1 } }
        ])

        // Index pour la newsletter
        await db.collection('newsletter_subscribers').createIndexes([
            { key: { email: 1 }, unique: true },
            { key: { isActive: 1 } },
            { key: { subscribedAt: -1 } }
        ])

        // Index pour les témoignages
        await db.collection('testimonials').createIndexes([
            { key: { featured: 1 } },
            { key: { verified: 1 } },
            { key: { isActive: 1 } },
            { key: { order: 1 } },
            { key: { createdAt: -1 } }
        ])

        console.log('Index MongoDB créés avec succès')
    } catch (error) {
        console.error('Erreur lors de la création des index:', error)
    }
}