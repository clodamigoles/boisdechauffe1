import connectDB, { handleDBErrors } from '@/lib/mongoose'
import rateLimit from 'express-rate-limit'
import cors from 'cors'

// Configuration CORS
const corsOptions = {
    origin: process.env.NODE_ENV === 'production'
        ? ['https://boisdechauffe1.vercel.app', 'monboisdechauffe.fr']
        : ['http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key'],
    credentials: true
}

// Configuration du rate limiting
const createRateLimiter = (windowMs = 15 * 60 * 1000, max = 100) =>
    rateLimit({
        windowMs,
        max,
        message: {
            success: false,
            message: 'Trop de requêtes, veuillez réessayer plus tard',
            type: 'RATE_LIMIT_EXCEEDED'
        },
        standardHeaders: true,
        legacyHeaders: false,
        skip: (req) => {
            // // Skip rate limiting en développement
            // if (process.env.NODE_ENV === 'development') return true
            // // Skip pour certaines routes d'administration
            // return req.headers['x-api-key'] === process.env.ADMIN_API_KEY
            return true
        }
    })

// Middleware de validation de l'API Key pour les routes admin
export const validateApiKey = (req, res, next) => {
    const apiKey = req.headers['x-api-key']

    if (!apiKey || apiKey !== process.env.ADMIN_API_KEY) {
        return res.status(401).json({
            success: false,
            message: 'Clé API manquante ou invalide',
            type: 'UNAUTHORIZED'
        })
    }

    next()
}

// Middleware de connexion à la base de données
export const withDB = (handler) => async (req, res) => {
    try {
        await connectDB()
        return handler(req, res)
    } catch (error) {
        console.error('Erreur de connexion DB:', error)
        const dbError = handleDBErrors(error)

        return res.status(500).json({
            success: false,
            message: 'Erreur de connexion à la base de données',
            type: dbError.type
        })
    }
}

// Middleware de gestion des erreurs globales
export const withErrorHandling = (handler) => async (req, res) => {
    try {
        return await handler(req, res)
    } catch (error) {
        console.error('Erreur API non gérée:', error)
        const dbError = handleDBErrors(error)

        return res.status(500).json({
            success: false,
            message: dbError.message,
            type: dbError.type,
            ...(process.env.NODE_ENV === 'development' && {
                error: error.message,
                stack: error.stack
            })
        })
    }
}

// Middleware de validation des méthodes HTTP
export const withMethods = (allowedMethods) => (handler) => (req, res) => {
    if (!allowedMethods.includes(req.method)) {
        res.setHeader('Allow', allowedMethods)
        return res.status(405).json({
            success: false,
            message: `Méthode ${req.method} non autorisée`,
            type: 'METHOD_NOT_ALLOWED',
            allowedMethods
        })
    }

    return handler(req, res)
}

// Middleware de validation du body JSON
export const withValidation = (schema) => (handler) => async (req, res) => {
    if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
        try {
            // Validation du JSON
            if (!req.body || typeof req.body !== 'object') {
                return res.status(400).json({
                    success: false,
                    message: 'Body JSON manquant ou invalide',
                    type: 'INVALID_JSON'
                })
            }

            // Validation avec un schéma (ex: Joi, Yup, etc.)
            if (schema && typeof schema.validate === 'function') {
                const { error, value } = schema.validate(req.body)
                if (error) {
                    return res.status(400).json({
                        success: false,
                        message: 'Données invalides',
                        type: 'VALIDATION_ERROR',
                        errors: error.details.map(detail => ({
                            field: detail.path.join('.'),
                            message: detail.message
                        }))
                    })
                }
                req.validatedBody = value
            }
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: 'Erreur de validation',
                type: 'VALIDATION_ERROR'
            })
        }
    }

    return handler(req, res)
}

// Middleware de cache et headers de sécurité
export const withSecurity = (cacheSeconds = 0) => (handler) => (req, res) => {
    // Headers de sécurité
    res.setHeader('X-Frame-Options', 'DENY')
    res.setHeader('X-Content-Type-Options', 'nosniff')
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
    res.setHeader('X-XSS-Protection', '1; mode=block')

    // Cache headers si spécifié
    if (cacheSeconds > 0 && req.method === 'GET') {
        res.setHeader('Cache-Control', `public, s-maxage=${cacheSeconds}, stale-while-revalidate=${cacheSeconds * 2}`)
    } else {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
    }

    return handler(req, res)
}

// Middleware composé pour les routes API publiques
export const withPublicAPI = (options = {}) => {
    const {
        methods = ['GET'],
        cacheSeconds = 300,
        rateLimitMax = 100
    } = options

    return (handler) =>
        withMethods(methods)(
            withDB(
                withSecurity(cacheSeconds)(
                    withErrorHandling(handler)
                )
            )
        )
}

// Middleware composé pour les routes API privées/admin
export const withPrivateAPI = (options = {}) => {
    const {
        methods = ['GET', 'POST', 'PUT', 'DELETE'],
        validationSchema = null,
        rateLimitMax = 50
    } = options

    return (handler) =>
        withMethods(methods)(
            validateApiKey(
                withDB(
                    withValidation(validationSchema)(
                        withSecurity(0)(
                            withErrorHandling(handler)
                        )
                    )
                )
            )
        )
}

// Utilitaire pour créer des réponses standardisées
export const createResponse = {
    success: (data, message = 'Succès', meta = {}) => ({
        success: true,
        message,
        data,
        ...meta
    }),

    error: (message, type = 'ERROR', errors = null) => ({
        success: false,
        message,
        type,
        ...(errors && { errors })
    })
}

// Export des rate limiters pré-configurés
export const rateLimiters = {
    strict: createRateLimiter(15 * 60 * 1000, 50), // 50 req/15min
    normal: createRateLimiter(15 * 60 * 1000, 100), // 100 req/15min
    relaxed: createRateLimiter(15 * 60 * 1000, 200), // 200 req/15min
    newsletter: createRateLimiter(60 * 60 * 1000, 5), // 5 req/hour pour newsletter
    search: createRateLimiter(1 * 60 * 1000, 30) // 30 req/min pour recherche
}

export default {
    withDB,
    withErrorHandling,
    withMethods,
    withValidation,
    withSecurity,
    withPublicAPI,
    withPrivateAPI,
    validateApiKey,
    rateLimiters,
    createResponse
}